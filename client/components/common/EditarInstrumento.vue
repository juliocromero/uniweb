<template>
  <div class="d-flex justify-end">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
              <v-icon
              v-bind="attrs"
              v-on="on"
              @click="show"
              >mdi-pencil
              </v-icon>
          </template>
          <span>Editar Instrumento</span>
        </v-tooltip>

        <v-dialog v-model="dialog" width="500">
          <v-card>
            <v-card-title class="headline white--text blue darken-4">
              Editar Instrumento
            </v-card-title>

            <v-card-text>
              <v-form ref="form" lazy-validation v-model="valid">
                <v-container>
                  <v-row>
                    <v-col cols="6">
                      <v-text-field 
                      v-model="instrumento.marca"
                      label="Marca"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field 
                      v-model="instrumento.modelo"
                      label="Modelo"
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="6">
                      <v-text-field 
                      v-model="instrumento.serie"
                      label="Serie"
                      :rules="rules"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-autocomplete
                      v-model="instrumento.tipo_id"
                      label="Tipo"
                      :items="instrumentoTipo"
                      :rules="rules"
                      >
                      </v-autocomplete>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="6">
                      <v-text-field 
                      v-model="instrumento.resolucion"
                      label="Resolución"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                      v-model="instrumento.tolerancia" 
                      label="Tolerancia"
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>


                  <v-row>
                    <v-col cols="6">
                      <v-autocomplete
                      v-model="instrumento.unidad_id"
                      label="Unidad"
                      :items="instrumentoUnidad"
                      :rules="rules"
                      >
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="6">
                      <v-autocomplete
                      v-model="instrumento.magnitud_id"
                      label="Magnitud"
                      :items="instrumentoMagnitud"
                      :rules="rules"
                      >
                      </v-autocomplete>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="6">
                      <v-text-field
                      v-model="instrumento.rango_de" 
                      label="Rango de"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field 
                      v-model="instrumento.rango_a"
                      label="Rango a"
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="6">
                      <v-text-field 
                      v-model="instrumento.rango_normal_de"
                      label="Rango normal de"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field 
                      v-model="instrumento.rango_normal_a"
                      label="Rango normal a"
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="6">
                      <v-autocomplete
                      v-model="instrumento.encargado_calibracion"
                      label="Encargado"
                      :items="listEmpresas"
                      :rules="rules"
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
              <v-btn color="primary" text @click="editarInstrumento">
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
    id:{
      type: String,
      required: true
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
      instrumentoTipo:[],
      instrumentoUnidad:[],
      instrumentoMagnitud:[],
      listEmpresas:[],
      instrumento:{
        marca: "",
        modelo: "",
        serie: "",
        rango_de: null,
        rango_a: null,
        rango_normal_de: null,
        rango_normal_a: null,
        resolucion: null,
        tolerancia: null, 
        tipo_id: null,
        unidad_id: null,
        magnitud_id: '',
        encargado_calibracion: null
      },
      rules:[ v => !!v || 'Requerido' ],
    }
  },
  methods:{
    show(){
      this.getInstrumento();
      this.getUnidad();
      this.getMagnitud();
      this.getInstrumentoTipo();
      this.getEmpresas();
      this.dialog = true;
    },
   async editarInstrumento(){
      try {
        if(this.$refs.form.validate()){
          await axios.put(`instrumento/${this.id}`, this.instrumento ,{
              headers: { Authorization: `Bearer ${this.token}` },
            })
            .then(()=>{
              this.alertMsg = "Instrumento actualizado correctamente"
              this.alertType = "success"
              this.alertShow = true;
              this.$emit('click');
              this.hide();
            })
      }
      } catch (error) {
        console.log(error)
        this.alertMsg = "Hubo un error al processar tu solicitud"
        this.alertType = "error"
        this.alertShow = true;
      }
    },
   async getInstrumento(){
        try {
         await axios.get(`instrumento/${this.id}`, {
            headers: { Authorization: `Bearer ${this.token}` },
          })
          .then((res)=>{
            console.log('getIntrumento:',res.data.data);
            this.instrumento = res.data.data;   
          })
          } catch (error) {
            console.log(error)
          }
        },
    getInstrumentoTipo(){
        try {
          axios.get('instrumentoTipo', {
            headers: { Authorization: `Bearer ${this.token}` },
          })
          .then((res)=>{
            for (const item of res.data.data) {
              this.instrumentoTipo.push({ text:item.nombre, value:item.id });
            }
          })
          } catch (error) {
            console.log(error)
          }
        },
      getUnidad(){
        try {
          axios.get('unidad', {
            headers: { Authorization: `Bearer ${this.token}` },
          })
          .then((res)=>{
            for (const item of res.data.data) {
              this.instrumentoUnidad.push({ text:item.nombre, value:item.id });
            }
          })

          } catch (error) {
            console.log(error)
          }

      },
      getMagnitud(){
      try {
        axios.get('magnitud', {
          headers: { Authorization: `Bearer ${this.token}` },
        })
        .then((res)=>{
          for (const item of res.data.data) {
            this.instrumentoMagnitud.push({ text:item.nombre, value:item.id });
          }
        })

        } catch (error) {
          console.log(error)
        }
      },

      getEmpresas(){
        try {
          axios.get('getempresas', {
            headers: { Authorization: `Bearer ${this.token}` },
          })
          .then((res)=>{
            for (const item of res.data) {
              this.listEmpresas.push({ text: item.empresa , value: item.id});
            }
          })

          } catch (error) {
            console.log(error)
          }

      },

      hide(){
        this.dialog = false;
        this.$refs.form.reset();
        this.alertShow = false;
      },
  }
}
</script>

<style>
</style>
