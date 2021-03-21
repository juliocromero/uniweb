<template>
  <div class="d-flex justify-end">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              v-bind="attrs"
              v-on="on"
              @click="dialog = true"
            >
              file_upload
            </v-icon>
          </template>
          <span>Cargar certificado</span>
        </v-tooltip>

        <v-dialog v-model="dialog" width="500">
          <v-card>
            <v-card-title class="headline white--text blue darken-4">
              Cargar certificado
            </v-card-title>

            <v-card-text>
              <v-form ref="form" lazy-validation v-model="valid">
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-file-input
                      accept=".pdf"
                      :rules="rules"
                      @change="setCert"
                      />
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12">
                      <v-card class="pa-5">
                        <v-text-field
                          v-model="tarea.fecha"
                          label="Fecha"
                          readonly
                          :rules="rules"
                        ></v-text-field>

                        <v-date-picker
                          v-model="tarea.fecha"
                          :first-day-of-week="1"
                          locale="es-ar"
                          width="auto"
                        ></v-date-picker>
                      </v-card>
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
              <v-btn color="info" text @click="cargarTarea">
                Cargar
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
   props: {
      calibracion_tarea_id: 1
  }, 

  watch: {
    calibracion_tarea_id: function () {
      this.tarea.calibracion_tarea_id = this.calibracion_tarea_id;
    }
  },

  data() {
    return {
      valid:false,
      token: Cookies.get('token'),
      dialog: false,
      alertShow: false,
      alertMsg:'',
      alertType:'success',
      calibracionTipo:[],
      tarea: {
        calibracion_tarea_id: 1,
        fecha: ''
      },
      certificado: '',
      rules:[ v => !!v || 'Requerido' ],
    }
  },
  methods:{
    async cargarTarea(){
      try {
        if (this.$refs.form.validate()) {
          let formData = new FormData()


          formData.append('certificado', this.certificado);
          formData.append('tareaFecha', this.tarea.fecha);
          formData.append('tareaId', this.tarea.calibracion_tarea_id);


          await axios.post('cargacertificado', formData, {
                headers: { Authorization: `Bearer ${this.token}` }
              })
              .then(()=>{
                this.alertMsg = "Se agregó una nueva tarea de calibración"
                this.alerType = "success"
                this.alertShow = true;
                this.$refs.form.reset();
                this.$emit('click');
              }) 
        }
      } catch (error) {
        console.log(error)
        this.alertMsg = "Hubo un error al processar tu solicitud"
        this.alerType = "error"
        this.alertShow = true;
      }
    },
    hide(){
      this.$refs.form.reset();
      this.dialog = false;
    },
    setCert(e) {
    this.certificado = e;
  }
  }

}
</script>

<style>
</style>
