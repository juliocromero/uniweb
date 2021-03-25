import Cookies from 'js-cookie'
import cookie from 'cookie';
import axios from "../plugins/axios";

export const state = () => ({
  rolUser: null,
  Equipos: 'Equipos',
  infoModal:{
    dialog: false,
    msj:"",
    titulo:"",
    alertType: "",
  },
  dialogPassword: false,
  ots:[],
  auth: false,
  dialogLoading: false
});
export const getters = {
  doneTodos(state) {
    return state.rolUser
  }
}
export const mutations = {
  async GET_NAME_INSTRUMENTO(state, val){
    state.Equipos = val
  },
  async SET_AUTH(state, res) {
    console.log('set auth',res)
    state.auth = true;  
    state.rolUser = res.user.rol
    Cookies.set('token', res.token)
    this.$router.push('/')
  },
  async SET_AUTH_AUTOMATIC(state, res) {

    console.log('set auth automatic',res)
    state.rolUser = res.rol
    state.auth = true;
    this.$router.push('/')
  },
  async SET_DESLOGIN(state) {  
    state.auth = false;
    Cookies.remove('token');
    Cookies.remove('user');
    Cookies.remove('user_id');
    Cookies.remove('user_rol');
    Cookies.remove('user_name');
    this.$router.push('/login');
  },
  async setUser(state, payload){
    Cookies.set('user', payload.empresa);
    Cookies.set('user_id', payload.id);
    Cookies.set('user_rol', payload.rol);
    Cookies.set('user_name', payload.nombre);
  },
  toggleDialogPassword(state, payload){
    state.dialogPassword = payload
  },
  toggleInfoModal(state, payload){
    state.infoModal.dialog = true
    state.infoModal.msj = payload.msj
    state.infoModal.titulo = payload.titulo
    state.infoModal.alertType = payload.alertType
  },
  ocultarInfoModal(state, payload){
    state.infoModal.dialog = payload
  },
  toggleLoading(state, payload){
    state.dialogLoading = payload;
  }

};

export const actions = {
  
  async nuxtServerInit ({ commit , state }, { req }  ) { 
        
     if (req.headers.cookie) { 
         let { token } = cookie.parse(req.headers.cookie);
        
         await axios
           .get("/loginUsersAutomatico", {
             headers: { Authorization: `Bearer ${token}` }
           })
           .then(res => {
             this.commit('SET_AUTH_AUTOMATIC', res.data );                    
           }).catch(err => {               
           })                
     }
   },
 

};
