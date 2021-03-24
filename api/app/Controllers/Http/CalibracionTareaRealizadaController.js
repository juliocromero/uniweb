'use strict'

const { validate } = use('Validator');
const User = use('App/Models/User');
const Equipo = use('App/Models/Equipo');
const CalibracionTarea = use('App/Models/CalibracionTarea');
const CalibracionTareaRealizada = use('App/Models/CalibracionTareaRealizada');
var moment = require('moment');
const Database = use('Database')
const Helpers = use('Helpers');
const Drive = use('Drive');
class CalibracionTareaRealizadaController {
  
  async index ({ request, response, view , auth}) {
     //Chequea token
     //var equipo;
     let {desde , hasta} = request.get();
     const {equipoID} = request.all();
     desde = desde || [];
     hasta = hasta || [];
     console.log(desde , hasta)
     /*try {
      const user = await auth.getUser();
 
      equipo = await Equipo.query().with('instrumento').where('id', equipoID).fetch();
      equipo = equipo.toJSON();
      
      if (equipo.length == 1)
      {
        if (user.rol == 2 && equipo[0].instrumento.encargado_calibracion != user.id) {
          throw 'error';
        }
      }
      else
      {
        return response.status(400).json('Equipo no encontrado.');
      }
    }
    catch (error)
    {
      return response.status(401).json('Acceso no autorizado.');
    }*/

    try {
      let TareaRealizada = await CalibracionTareaRealizada.query()
      .with('realizada')
      .with('tarea')
      .with('tarea.instrumento')
      .with('tarea.tipo')
      .orderBy('fecha', 'DESC').fetch();

      TareaRealizada = TareaRealizada.toJSON();

      var arrayTarea = TareaRealizada.map(e=>{
       return{
         "Num_tarea": e.tarea.id,
         "id": e.id,
         "intrumento": e.tarea.instrumento.serie,
         "fecha": e.fecha,
         "patron": e.patron,
         "realizo": e.realizada.empresa,
         "certificado": e.certificado 
       }
     })
     let resp = await Promise.all(arrayTarea)
      response.status(200).json({ menssage: 'Tarea Realizada', data: resp })
    } catch (error) {
      console.log(error)
      response.status(500).json({ menssage: 'Hubo un error al realizar la operación', error });
    }
  }

  async getCertificado ({ request, response, auth }) {
    // Validaciones
    var registroCert = [];
    try {
      const {certId} = request.all();

      const user = await auth.getUser();

      registroCert = await CalibracionTareaRealizada.query().with('tarea').where('id', certId).fetch();
      registroCert = registroCert.toJSON();
  
      if (registroCert.length == 0) {
        return response.status(500).json('Certificado no encontrado.')
      }
      else
      {
        if (registroCert[0].realizo != user.id && user.rol == 2) {
          return response.status(401).json('Acceso no autorizado.')
        }
      }
    } catch (error) {
      console.log(error)
      return response.status(401).json('Acceso no autorizado.');
    }

    // Devolvemos el archivo en cuestion
    try {

      const isExist = await Drive.exists(`archivos/certificados/${registroCert[0].tarea.instrumento_id}/${registroCert[0].certificado}`);
      
      if (isExist) {
          return response.download(Helpers.appRoot(`storage/archivos/certificados/${registroCert[0].tarea.instrumento_id}/${registroCert[0].certificado}`));
      }
      return response.status(500).json('El archivo no existe.');

    }
    catch(error)
    {
      return error
    }
  }

  /**
   * Create/save a new calibraciontarearealizada.
   * POST calibraciontarearealizadas
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth }) {

    // Request
    var {tareaFecha, tareaId, patronText, patronList} = request.all();
    //tarea=tarea['tarea']
    // Variables
    var user, tareaCalibracion, patron = null, patronListArray = [];

    // Validaciones
    try {
      user = await auth.getUser();

      tareaCalibracion = await CalibracionTarea.query().with('instrumento').with('instrumento.equipo').where('id', tareaId).fetch();
      tareaCalibracion = tareaCalibracion.toJSON();

      if (tareaCalibracion.length == 0) {
        return response.status(400).json('Tarea de calibración incorrecta.')
      }
      else
      {
        if (tareaCalibracion[0].instrumento.encargado_calibracion != user.id) {
          return response.status(400).json('Acceso no autorizado.')
        }
      }

      if (patronText) {
        if (patronText != '')
        {
          patron = patronText;
        }
      }

      if (patronList)
      {
        if(patronList != '' && patronList != '[]')
        {
          patron = patronList
          patronListArray = JSON.parse(patronList)

          var patronesInvalidos = await Database.select('instrumento.id', 'instrumento.serie').from('instrumento')
            .joinRaw(`INNER JOIN (
              SELECT t1.id AS idJoin, MAX(t3.fecha) AS fecha 
            FROM instrumento AS t1
            INNER JOIN calibracion_tarea AS t2 ON t1.id = t2.instrumento_id
            INNER JOIN calibracion_tarea_realizada AS t3 ON t2.id = t3.calibracion_tarea_id
            WHERE t1.is_patron = 1 AND t1.encargado_calibracion = ${user.id} AND t3.fecha < '${tareaFecha}' AND DATEADD(day,t2.frecuencia,t3.fecha) > '${tareaFecha}' 
            AND t1.id IN (${patronListArray})
            GROUP BY t1.id
            ) AS b ON instrumento.id = b.idJoin`)
            .orderBy('instrumento.serie', 'ASC')
     
            if (patronesInvalidos.length != patronListArray.length || patronListArray.length == 0)
            {
              return response.status(400).json('Instrumentos patrón no certificados o nulos.')
            }
        }
      }

      if (!patron)
      {
        return response.status(400).json('Debe ingresar los patrones utilizados.')
      }

    } catch (error) {
      console.log(error)
      return response.status(401).json('Acceso no autorizado.' + error);
    }

    // PDF
    const pdfSubido = request.file('certificado', {
      types: ['pdf'],
      size: '10mb'
    })

    // Carga de certificado
    try {

      await pdfSubido.move(Helpers.appRoot(`storage/archivos/certificados/${tareaCalibracion[0].instrumento.id}/`), {
        name: pdfSubido.clientName,
        overwrite: true
      })
    
      if (!pdfSubido.moved()) {
        throw "No se pudo guardar el archivo."
      }

      const newCertRegister = new CalibracionTareaRealizada();

      newCertRegister.calibracion_tarea_id = tareaId;
      newCertRegister.fecha = tareaFecha;
      newCertRegister.realizo = user.id;
      newCertRegister.certificado = pdfSubido.clientName;
      newCertRegister.patron = patron;
      newCertRegister.equipo_id = tareaCalibracion[0].instrumento.equipo.id;

      await newCertRegister.save();

      return response.status(200).json({ menssage: 'Certificado cargado con éxito.', newCertRegister});

    } catch (error) {
        console.log(error)
        response.status(500).json({ menssage: 'Hubo un error al realizar la operación', error });
    }
  }

  async getListInstrumentosPatron ({ auth, request, response }) {
    var user;
    try {

      user = await auth.getUser();

    } catch (error) {
      return response.status(401).json('Acceso no autorizado.');
    }

    try {
      var {fecha} = request.all();

      if (!fecha)
      {
        fecha = moment().format('YYYY-MM-DD');
      }
      
      var data = await Database.select('instrumento.id', 'instrumento.serie').from('instrumento')
      .joinRaw(`INNER JOIN (
        SELECT t1.id AS idJoin, MAX(t3.fecha) AS fecha 
      FROM instrumento AS t1
      INNER JOIN calibracion_tarea AS t2 ON t1.id = t2.instrumento_id
      INNER JOIN calibracion_tarea_realizada AS t3 ON t2.id = t3.calibracion_tarea_id
      WHERE t1.is_patron = 1 AND t1.encargado_calibracion = ${user.id} AND t3.fecha < '${fecha}' AND DATEADD(day,t2.frecuencia,t3.fecha) > '${fecha}'
      GROUP BY t1.id
      ) AS b ON instrumento.id = b.idJoin`)
      .orderBy('instrumento.serie', 'ASC')


      return response.status(200).json({listPatron: data})
    } catch (error) {
      response.status(500).json({ menssage: 'Hubo un error al realizar la operación', error });
    }
  }

  /**
   * Render a form to update an existing calibraciontarearealizada.
   * GET calibraciontarearealizadas/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update calibraciontarearealizada details.
   * PUT or PATCH calibraciontarearealizadas/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a calibraciontarearealizada with id.
   * DELETE calibraciontarearealizadas/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = CalibracionTareaRealizadaController
