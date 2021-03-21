'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class EquipoAsignacion extends Model {

    static get table () {
        return 'equipo_asignacion'
    }
    static get createdAtColumn() {
        return null;
    }
        
    static get updatedAtColumn() {
        return null;
    }
    equipo () {
        return this.hasOne('App/Models/Equipo', 'equipo_id', 'id')
    }

    instrumento () {
        return this.hasOne('App/Models/Instrumento', 'instrumento_id', 'id')
    }

}

module.exports = EquipoAsignacion
