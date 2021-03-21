'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('nombre', 80)
      table.string('apellido', 80)
      table.string('email', 254).notNullable().unique()
      table.string('empresa', 80).notNullable()
      table.integer('rol').notNullable()
      table.string('password', 60).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
