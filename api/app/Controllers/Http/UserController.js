'use strict'

const User = use('App/Models/User');
const Response = use('App/Models/Response');
var moment = require('moment');

class UserController {

  async setPass({ response, request }) {
    try {
      var user = await User.find(1);
      user.password = '1234'
      await user.save();

      return 1
    }
    catch(error)
    {
      return error
    }
  }

  async index({ auth, response, request }) {
    //Chequea token
    try {
      var user = await auth.getUser();

      if (user.rol != 0) {
        throw 'error'
      }
    }
    catch (error) {
      return response.status(401).json('Acceso no autorizado.');
    }

    try {
      var data = await User.all();
      data = data.toJSON()
      data.forEach(it => {
        switch (it.rol) {
          case 0:
            it.rol_name = 'Administrador'
            break;
        
          case 1:
            it.rol_name = 'Operador'
            break;

          case 2:
            it.rol_name = 'Contratista'
            break;

          default:
            it.rol_name = 'Indefinido'
            break;
        }
      });
      response.status(200).json({ menssage: 'Usuario', data: data })
    } catch (error) {
      console.log(error)
      response.status(404).json({ menssage: 'Hubo un error al realizar la operación', error });
    }
  }
  async show ({ params: {id}, request, response, auth }) {
    try {
      const user = await auth.getUser();
      const usuario = await User.findOrFail(id);
      return response.status(200).json({ menssage: 'Usuario', data: usuario });
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
  async login({ auth, request, response }) {
    try {
      const { email, password } = request.all()
      var datosResp = {}
      datosResp = await auth.attempt(email, password);
      datosResp.user = await User.findBy('email', email);

      return datosResp;

    } catch (error) {
      return Response.status(400).json( "Usuario o contraseña incorrecta.");
    }
  }

  async loginCheck({ auth, request, response }) {
    try {

      var respuesta = new Response(false, '', {});

      respuesta.datos = await auth.getUser();
      respuesta.feedback.estado = true;

      return respuesta;

    } catch (error) {
      return new Response(false, 'Error de autenticación', {});
    }
  }


  //metodo para crear usuarios
  async store({ auth, request, response }) {
    try {
      let { nombre, apellido, email, empresa, rol, password } = request.all();

      const user = await User.create({
        nombre,
        apellido,
        email,
        empresa,
        rol,
        password
      })
      return response.status(200).json({ message: 'Usuario creado con Exito!' })
    } catch (error) {
      return response.status(404).json(error)
    }
  }
  async loginToken({ auth, response }) {
    try {
      const user = await auth.getUser();
      if (user) {
        let data = { email: user.email, password: user.password }
        return response.status(200).json(data)
      }
    } catch (error) {
      console.log(error)
      response.status(400).json({ menssage: 'Hubo un error al realizar la operación' })
    }
  }
  async update({ auth, response, request , params:{id}}) {
    try {
      const user = await auth.getUser()
      const data = request.only(["nombre", "apellido", "email", "empresa", "rol","password", "updated_at"])
      if (user.rol == 0) {
        const usuarios = await User.find(id);
        usuarios.nombre = data.nombre || usuarios.nombre;
        usuarios.apellido = data.apellido || usuarios.apellido;
        usuarios.password = data.password || usuarios.password;
        usuarios.email = data.email || usuarios.email;
        usuarios.empresa = data.empresa || usuarios.empresa;
        usuarios.rol = data.rol || usuarios.rol;
        usuarios.updated_at = moment()
        await usuarios.save();
        response.status(200).json({ menssage: 'Usuario modificado con Exito!', data: usuarios })
      } else {
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
  async destroy({ auth, response, request , params}){
    try {
    const id = params.id
    const user = await auth.getUser();
    if(user.rol == 0){
      const users = await User.findOrFail(id);
      await users.delete();
      return response.status(200).json({ menssage: 'Usuario eliminado con Exito!' })
    }else{
      response.status(400).json({ menssage: "Usuario sin permisos para realizar la operacion" })
    }
    } catch (error) {
      console.log(error)
      if (error.name == 'InvalidJwtToken') {
        return response.status(400).json({ menssage: 'Usuario no Valido' })
      }
      response.status(404).json({
        message: "Usuario a eliminar no encontrado",
        id
      });
    }
  }

  async getListEmpresas({ auth, response, request}) {
    try {
      var user = await auth.getUser();

      if (user.rol == 0)
      {
        var data = await User.query().select('id', 'empresa').where('rol', 2).fetch();
        data = data.toJSON();

        return data;
      }
      return user.rol
    } catch (error) {
      return response.status(500).json({ menssage: error })
    }
  }
}

module.exports = UserController
