'use strict'

const { validate } = use('Validator');
const User = use('App/Models/User');
const CalibracionTarea = use('App/Models/CalibracionTarea');
const CalibracionTareaRealizada = use('App/Models/CalibracionTareaRealizada');
var moment = require('moment');
const Database = use('Database')
const Helpers = use('Helpers');
const Drive = use('Drive');
class CalibracionTareaRealizadaController {
  
  async index ({ request, response, view , auth}) {
     //Chequea token
     try {
      await auth.check();
    }
    catch (error)
    {
      return response.status(401).json('Acceso no autorizado.');
    }

    try {
      const {equipoID} = request.all();
      
      let TareaRealizada = await CalibracionTareaRealizada.query().with('realizada').with('tarea').with('tarea.instrumento').with('tarea.tipo').
      where('equipo_id', equipoID).orderBy('fecha', 'DESC').fetch();

      TareaRealizada = TareaRealizada.toJSON();

      var arrayTarea = TareaRealizada.map(e=>{
       return{
         "Num_tarea": e.tarea.id,
         "id": e.id,
         "intrumento": e.tarea.instrumento.serie,
         "fecha": e.fecha,
         "realizo": e.realizada.empresa,
         "certificado": e.certificado 
       }
     })
     let resp = await Promise.all(arrayTarea)
      response.status(200).json({ menssage: 'Tarea Realizada', data: resp })
    } catch (error) {
      console.log(error)
      response.status(404).json({ menssage: 'Hubo un error al realizar la operación', error });
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
        if (registroCert[0].realizo != user.id && user.rol == 3) {
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
      return 'File does not exist';

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
    var {tareaFecha, tareaId} = request.all();
    //tarea=tarea['tarea']
    // Variables
    var user, tareaCalibracion;

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
    } catch (error) {
      console.log(error)
      return response.status(401).json('Acceso no autorizado.');
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

      newCertRegister.calibracion_tarea_id = tareaId,
      newCertRegister.fecha = tareaFecha,
      newCertRegister.realizo = user.id,
      newCertRegister.certificado = pdfSubido.clientName,
      newCertRegister.equipo_id = tareaCalibracion[0].instrumento.equipo.id

      await newCertRegister.save();

      return response.status(200).json({ menssage: 'Certificado cargado con éxito.', newCertRegister});

    } catch (error) {
        console.log(error)
        response.status(500).json({ menssage: 'Hubo un error al realizar la operación', error });
    }
  }

  /**
   * Display a single calibraciontarearealizada.
   * GET calibraciontarearealizadas/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
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
