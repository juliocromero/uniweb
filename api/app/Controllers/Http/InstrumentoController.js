'use strict'
const Instrumento = use('App/Models/Instrumento');
const Equipo = use('App/Models/Equipo');
const Query = require("../../Utils/Query");
const { validate } = use('Validator');
const User = use('App/Models/User');
var moment = require('moment');
const EquipoController = require("./EquipoController");
const { builder } = require("../../Utils/Query");
const Database = use('Database')
class InstrumentoController {
 
  async index ({ request, response, auth }) {
    var user;

    try {
      user = await auth.getUser();
    } catch (error) {
      return response.status(401).json('Acceso no Autorizado')
    }
    try {

      var data = null, tableItems = {};

      var req = request.all();
      req.options = JSON.parse(req.options);
      
      //seteo valores por defectos
      var sortBy = req.options.sortBy || ['tag'];
      var sortDesc = req.options.sortDesc || ['DESC'];
      var page = req.options.page || 1;
      var itemsPerPage = req.options.itemsPerPage || 10;
      var isPatron = req.isPatron || false;

      var query = Instrumento.query()
      .select('instrumento.*', 'equipo.tag AS tag', 'instrumento_estado.nombre AS estado_name', 'unidad.nombre AS unidad', 'magnitud.nombre AS magnitud',
      'users.empresa AS empresa', 'instrumento_tipo.nombre AS tipo_name' )
      .leftJoin('equipo', 'instrumento.id', 'equipo.instrumento_id')
      .leftJoin('instrumento_estado', 'instrumento.estado', 'instrumento_estado.id')
      .leftJoin('instrumento_tipo', 'instrumento.tipo_id', 'instrumento_tipo.id')
      .leftJoin('unidad', 'instrumento.unidad_id', 'unidad.id')
      .leftJoin('magnitud', 'instrumento.magnitud_id', 'magnitud.id')
      .leftJoin('users', 'instrumento.encargado_calibracion', 'users.id')
      .where('is_patron', isPatron)

      if (user.rol == 2)
      {
        query.where('instrumento.encargado_calibracion', user.id);
      }

      if (req.buscar) {
        query.where(function () {
          this.where('tag', 'like', '%' + req.buscar + '%')
          .orWhere('serie', 'like', '%' + req.buscar + '%')
          .orWhere('marca', 'like', '%' + req.buscar + '%')
          .orWhere('modelo', 'like', '%' + req.buscar + '%')
          .orWhere('users.empresa', 'like', '%' + req.buscar + '%')
          .orWhere('instrumento_estado.nombre', 'like', '%' + req.buscar + '%')
          .orWhere('magnitud.nombre', 'like', '%' + req.buscar + '%')
          .orWhere('instrumento_tipo.nombre', 'like', '%' + req.buscar + '%')
        })        
      }      

      sortBy.forEach((it, i) => {
        query.orderBy(it, sortDesc[i] || false ? 'DESC' : 'ASC')
      });

      if (itemsPerPage == -1) {
        data = await query.fetch();
        data = data.toJSON()
        tableItems.data = data;
      }
      else
      {
        data = await query.paginate(page, itemsPerPage);
        data = data.toJSON()
        tableItems = data;
      }
      console.log(tableItems)
      return response.status(200).json({ message: 'Listado de Instrumentos', data: tableItems, total: tableItems.total })
      
    } catch (error) {
      console.log(error)
      return response.status(400).json({ menssage: 'Hubo un error al realizar la operación', error })
    }
  }

  async getInstrumentosList ({ params, request, response, auth }) {
    try {
      await auth.check();
    } catch (error) {
      return response.status(401).json('Acceso no Autorizado')
    }
    try {

      var { instrumento_id } = request.all();
      console.log(instrumento_id)
      var listInstrumentosOut = await Database.from('equipo').distinct('instrumento_id');

      var listExcluir = [];
      listInstrumentosOut.forEach(it => {
        listExcluir.push(it.instrumento_id)
      });

      var query = Instrumento.query()
      .with('tipo')
      .with('unidad')
      .with('magnitud')
      .with('encargado')
      .with('estado_rel')
      .where(function () {
        this.whereNot('estado', 3)
            .whereNotIn('id', listExcluir)
      });
      if (instrumento_id)
      {
        query.orWhere('id', instrumento_id);
      }
      
      query = await query.fetch();
      query = query.toJSON();

      var ArrayInstrumento = query.map(e =>{
        return {
          "id": e.id,
          "marca": e.marca,
          "modelo": e.modelo,
          "serie": e.serie,
          "tipo": e.tipo.nombre,
          "resolucion": e.resolucion,
          "tolerancia": e.tolerancia,
          "unidad": e.unidad.nombre,
          "magintud": e.magnitud.nombre,
          "rango_a": e.rango_a,
          "rango_de": e.rango_de,
          "rango_normal_a": e.rango_normal_a,
          "rango_normal_de": e.rango_normal_de
        }
      })

      let resp = await Promise.all(ArrayInstrumento)

      response.status(200).json({ message: 'Listado de Instrumentos', data: resp })
    } catch (error) {
      console.log(error)
      return response.status(400).json({ menssage: 'Hubo un error al realizar la operación', error })
    }
  }


  /**
   * Render a form to be used for creating a new instrumento.
   * GET instrumentos/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  async store ({ request, response ,auth}) {
    
    try {
      const user = await auth.getUser();
      let {   marca, modelo , serie , rango_de , rango_a , rango_normal_de , rango_normal_a , resolucion , tolerancia , tipo_id , unidad_id , magnitud_id , encargado_calibracion, is_patron} = request.all();

      const rules = {
        marca: 'required',
        modelo: 'required',
        serie: 'required',
        rango_de: 'required',
        rango_a: 'required',
        rango_normal_de: 'required',
        rango_normal_a: 'required',
        resolucion: 'required',
        tolerancia: 'required',
        tipo_id: 'required',
        unidad_id: 'required',
        magnitud_id: 'required',
        encargado_calibracion: 'required',
        is_patron: 'required'
      }
      let validation = await validate({ marca, modelo , serie , rango_de , rango_a , rango_normal_de , rango_normal_a , resolucion , tolerancia , tipo_id , unidad_id , magnitud_id , encargado_calibracion, is_patron }, rules);
      if (validation.fails()) {
        return response.status(404).json({ message: "Datos Insufiente" });
      }
      if(user.rol == 0 || (user.rol == 2 && is_patron && encargado_calibracion == user.id)){
        const instrumento = await Instrumento.create({
          estado: 1,
          marca,
          serie,
          modelo,
          rango_de,
          rango_a,
          rango_normal_de,
          rango_normal_a,
          resolucion,
          tolerancia,
          tipo_id,
          unidad_id,
          magnitud_id,
          creado_usuario: encargado_calibracion,
          encargado_calibracion,
          is_patron,
          created_at :  moment().format('YYYY-MM-DD HH:mm:ss'),
          updated_at:moment().format('YYYY-MM-DD HH:mm:ss'),
        })

        return response.status(200).json({ message: "Instrumento creado con exito!", data: instrumento})
      }else{
        return response.status(400).json({ menssage: "Usuario sin permiso suficiente para realizar esta operacion!" })
      }
    } catch (error) {
      console.log(error)
      response.status(404).json({ menssage: 'Hubo un error al realizar la operación', error });
    }
  }

  /**
   * Display a single instrumento.
   * GET instrumentos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params: {id}, request, response, auth }) {
    try {
      const user = await auth.getUser();
      const instrumento = await Instrumento.findOrFail(id);

      if (user.rol == 2 && instrumento.encargado_calibracion != user.id)
      {
        throw {name: 'InvalidJwtToken'};
      }

      return response.status(200).json({ menssage: 'Instrumento', data: instrumento });
    }catch(error){
      console.log(error.name)
      if(error.name == 'InvalidJwtToken'){
        return response.status(400).json({menssage: 'Usuario no Valido'})
       }
      return response.status(400).json({
        menssage: 'Instrumento no encontrado',
        id
      })
    }
  }

  /**
   * Render a form to update an existing instrumento.
   * GET instrumentos/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update instrumento details.
   * PUT or PATCH instrumentos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params: {id}, request, response, auth }) {
    try {
      const user = await auth.getUser()
      const data = request.only(["estado", "marca", "modelo", "serie", "rango_de", "rango_a", "rango_normal_de", "rango_normal_a", "resolucion", "tolerancia" , "tipo_id" , "unidad_id" , "magnitud_id", "encargado_calibracion" ])
      const inst = await Instrumento.find(id);

      if (user.rol == 0 || (user.rol == 2 && inst.is_patron && inst.encargado_calibracion == user.id)) {
        inst.estado = data.estado || inst.estado;
        inst.marca = data.marca || inst.marca;
        inst.modelo = data.modelo || inst.modelo;
        inst.serie = data.serie || inst.serie;
        inst.rango_de = data.rango_de || inst.rango_de; 
        inst.rango_a = data.rango_a || inst.rango_a; 
        inst.rango_normal_de = data.rango_normal_de || inst.rango_normal_de; 
        inst.rango_normal_a = data.rango_normal_a || inst.rango_normal_a; 
        inst.resolucion = data.resolucion || inst.resolucion; 
        inst.tolerancia = data.tolerancia || inst.tolerancia; 
        inst.tipo_id = data.tipo_id || inst.tipo_id;
        inst.unidad_id = data.unidad_id || inst.unidad_id;
        inst.magnitud_id = data.magnitud_id || inst.magnitud_id;
        inst.encargado_calibracion = data.encargado_calibracion || inst.encargado_calibracion;
        inst.updated_at = moment(); 
        await inst.save();
        response.status(200).json({ menssage: 'Instrumento modificado con Exito!', data: inst })
      }
      else {
        response.status(400).json({ menssage: "Usuario sin permisos para realizar la operacion" })
      }
    } catch (error) {
      console.log(error)
      if (error.name == 'InvalidJwtToken') {
        return response.status(400).json({ menssage: 'Usuario no Valido' })
      }
      response.status(400).json({
        menssage: "Hubo un error al realizar la operación",
      })
    }
  }

  /**
   * Delete a instrumento with id.
   * DELETE instrumentos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response , auth}) {
    const id = params.id
    try {
      const user = await auth.getUser();

       // return response.status(400).json({ menssage: 'No se puede eliminar el Instrumento ya pertenece a un equipo!' })
      
      if (user.rol == 0) {
        const inst = await Instrumento.findOrFail(id);
        await inst.delete();
        return response.status(200).json({ menssage: 'Instrumento eliminado con Exito!' })
      }
    } catch (error) {
      console.log(error)
      if (error.name == 'InvalidJwtToken') {
        return response.status(400).json({ menssage: 'Usuario no Valido' })
      }
      if(error.menssage = `The DELETE statement conflicted with the REFERENCE constraint "FK_calibracion_tarea_instrumento". The conflict occurred in database "CertificadosDB", table "dbo.calibracion_tarea", column 'instrumento_id'.`){
         return response.status(400).json({ menssage: 'No se puede eliminar el Instrumento ya pertenece a un equipo!' })
      }
      response.status(404).json({
        message: "Instrumento a eliminar no encontrado",
        id
      });
    } 
  }
}

module.exports = InstrumentoController
