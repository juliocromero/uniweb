<template>
  <div class="d-flex justify-end"
  >
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              v-bind="attrs"
              v-on="on"
              @click="openModal"
            >
              mdi-pencil
            </v-icon>
          </template>
          <span>Editar Tarea</span>
        </v-tooltip>

        <v-dialog v-model="dialog" width="500">
          <v-card>
            <v-card-title class="headline white--text blue darken-4">
              Agregar Nueva Tarea 
            </v-card-title>

            <v-card-text>
              <v-form ref="form" lazy-validation v-model="valid">
                <v-container>

                  <v-row>
                    <v-col cols="12">
                      <v-autocomplete
                      v-model="tarea.calibracion_tipo_id"
                      label="Tipo de Calibración"
                      :items="calibracionTipo"
                      :rules="rules"
                      >
                      </v-autocomplete>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-autocomplete
                      v-model="tarea.habilitada"
                      label="Habilitación"
                      :items="[{value: false, text: 'Deshabilitada'}, {value: true, text: 'Habilitada'}]"
                      >
                      </v-autocomplete>
                    </v-col>  
                  </v-row>
                  
                  <!-- Modal status http request -->
                  <v-row v-if="alertShow">
                    <v-col cols="12" class="px-0">
                      <v-alert
                        dense
                        text
                        :type="alertType"
                      >
                        {{alertMsg}}
                      </v-alert>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </v-card-text>
            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error" text @click="hide">
                Cancelar
              </v-btn>
              <v-btn color="primary" text @click="EditCalibrations">
                Ok
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
  </div>
</template>

<script>
import axios from '~/plugins/axios';
import Cookies from 'js-cookie';
export default {
  props:{
    calibracionItem:{
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      picker: new Date().toISOString().substr(0, 10),
      valid:false,
      token: Cookies.get('token'),
      dialog: false,
      alertShow: false,
      alertMsg:'',
      alertType:'success',
      calibracionTipo:[],
      tarea:{
          instrumento_id: "",
          calibracion_tipo_id: "",
          frecuencia: 0,
          habilitada: 1,
          proxima: new Date().toISOString().substr(0, 10),
      },
      rules:[ v => !!v || 'Requerido' ],
    }
  },
  methods:{
    openModal(){
      this.dialog = true
      this.alertShow = false
      this.getCalibracionTipo();
      this.tarea.calibracion_tipo_id = this.calibracionItem.calibracion_tarea_tipo_id
      this.tarea.habilitada = this.calibracionItem.calibracion_tarea_habilitada
    },
   async EditCalibrations(){
      const obj = this.tarea;
      try {          
        await axios.put(`calibracionEdit/${this.calibracionItem.num_tarea}`, this.tarea ,{
            headers: { Authorization: `Bearer ${this.token}` },
          })
          .then(()=>{
            this.alertMsg = "Se agregó una nueva tarea de calibración"
            this.alertType = "success"
            this.alertShow = true;
            this.dialog = false
            this.$emit('reload');
            this.hide();
          }) 
      } catch (error) {
        console.log(error)
        this.alertMsg = "Hubo un error al processar tu solicitud"
        this.alertType = "error"
        this.alertShow = true;
      }
    },
    hide(){
      this.$refs.form.reset();
      this.dialog = false;
    },
    async getCalibracionTipo(){
        try {
          await axios.get('calibracionTipo', {
            headers: { Authorization: `Bearer ${this.token}` },
          })
          .then((res)=>{
            this.calibracionTipo = [];
            for (const item of res.data.data) {
             this.calibracionTipo.push({ text: item.nombre , value: item.id}); ;
            }
          })
          } catch (error) {
            console.log(error)
          }
        }
},
  created(){
 
  }
}
</script>

<style>
</style>
