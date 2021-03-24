<template>
  <v-row justify="start">
    <v-dialog v-model="dialogPass" width="500" @input="closeModal">
      <v-card>
        <v-card-title class="headline v-card-titulo white--text"
          >Cambiar Contraseña</v-card-title
        >
        <v-card-text>
          <v-form>
            <v-container>
              <v-row>
                <v-col cols="12" md="12">
                  <v-text-field
                    v-model="datosPassword.actual_password"
                    label="Contraseña Actual"
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="show1 ? 'text' : 'password'"
                    @click:append="show1 = !show1"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="12">
                  <v-text-field
                    v-model="datosPassword.new_password"
                    label="Nueva Contraseña"
                    :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="show2 ? 'text' : 'password'"
                    @click:append="show2 = !show2"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="12">
                  <v-text-field
                    v-model="datosPassword.confirm_password"
                    label="Confirmar Nueva Contraseña"
                    :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="show3 ? 'text' : 'password'"
                    @click:append="show3 = !show3"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-alert
                v-model="AlertCambioPassword"
                dense
                text
                :type="typeAlert"
              >
                {{ mensajeCambioPassword }}
              </v-alert>
            </v-container>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="red" text @click="closeModal(false)"
            >Cancelar</v-btn
          >

          <v-btn color="green darken-1" text @click="cambiarPassword"
            >Aceptar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import "material-design-icons-iconfont/dist/material-design-icons.css";
import axios from '@/plugins/axios'
import Cookies from 'js-cookie'

export default {
  props:{
    dialog:{
      type:Boolean,
      default: false
    }
  },
  data: () => ({
    typeAlert: "error",
    AlertCambioPassword: false,
    mensajeCambioPassword: "",
    dialogPass: false,
    nameRules: [(v) => !!v || "Este campo es requerido"],
    datosPassword: {
      actual_password: "",
      new_password: "",
      confirm_password: ""
    },
    show1: false,
    show2: false,
    show3: false
  }),
  computed: {
  },
  methods: {
    closeModal(value){
      this.$emit('closeModal', value)
    },
     async cambiarPassword() {
     let token = Cookies.get("token");
           await axios.put("change_pass",this.datosPassword,
           {headers: { Authorization: `Bearer ${token}` }})
           .then(res => {
             console.log('response',res)
             this.AlertCambioPassword = true
             this.mensajeCambioPassword = res.data.menssage
             if(res.data.menssage === 'Cambio de contraseña con exito!'){
               this.typeAlert = 'success'
               this.closeModal(false)
             }
           })
           .catch(err => {
             console.log('response', err)
           })
    },
  },
  watch: {
    dialog(newVal){
      if(newVal){
        this.dialogPass = newVal
      }
    }
  }
};
</script>

<style>
.v-card-titulo {
  background: #295382;
}
</style>