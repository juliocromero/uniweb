'use strict'

const { validate } = use('Validator');
const User = use('App/Models/User');
const EquipoAsignacion = use('App/Models/EquipoAsignacion');
var moment = require('moment');
const Database = use('Database')
class EquipoAsignacionController {
  
  async index ({ request, response, view , auth}) {
    try {
      await auth.check();
    } catch (error) {
      return response.status(401).json('Acceso no Autorizado')
    }
    try {
      var query = EquipoAsignacion.query();
      var {
        page,
        perPage,
      } = request.all();
      //seteo valores por defectos
      page = page || 1
      perPage = perPage || 10
      let res = await EquipoAsignacion.query()
      .with('equipo')
      .with('instrumento').paginate(page, perPage);
      res = res.toJSON();
      var ArrayEquipo = res.data.map(e =>{
        return {
          "equipo": e.equipo.tag,
          "instrumento": e.instrumento.serie,
          "desde": e.desde,
          "hasta": e.hasta || ''
        }
      })
      let resp = await Promise.all(ArrayEquipo)
      res.data = resp
      response.status(200).json({ message: 'Listado de Instrumentos', data: res })
    } catch (error) {
      console.log(error)
      return response.status(400).json({ menssage: 'Hubo un error al realizar la operación', error })
    }
  }

  /**
   * Render a form to be used for creating a new equipoasignacion.
   * GET equipoasignacions/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

 

  /**
   * Display a single equipoasignacion.
   * GET equipoasignacions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, auth }) {
    try {
      const user = await auth.getUser();
      var equipo_id = params.id
      let equipoAsignado = await EquipoAsignacion.query().with('equipo').with('instrumento').where('equipo_id' , equipo_id).fetch();
      equipoAsignado = equipoAsignado.toJSON();
      //console.log(equipoAsignado)
      var arrayEquipoASignado = equipoAsignado.map(e=>{
        return{
            "equipo": e.equipo.tag,
            "instrumento": e.instrumento.serie,
            "desde": e.desde , 
            "hasta": e.hasta
        }
      })
      let resp = await Promise.all(arrayEquipoASignado)
      return response.status(200).json({ menssage: 'Equipo Asignado', data: resp });
    } catch (error) {
      console.log(error)
      if (error.name == 'InvalidJwtToken') {
        return response.status(400).json({ menssage: 'Usuario no Valido' })
      }
      return response.status(400).json({
        menssage: 'Equipo Asignado no encontrado',
        equipo_id
      })
    }

  }

  /**
   * Render a form to update an existing equipoasignacion.
   * GET equipoasignacions/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update equipoasignacion details.
   * PUT or PATCH equipoasignacions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a equipoasignacion with id.
   * DELETE equipoasignacions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = EquipoAsignacionController
