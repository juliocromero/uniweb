<template>
  <div class="d-flex justify-end">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              v-bind="attrs"
              v-on="on"
              @click="dialog = true"
            >
              Agregar
            </v-btn>
          </template>
          <span>Agregar Instrumento Patrón</span>
        </v-tooltip>

        <v-dialog v-model="dialog" width="500" @input="RefreshInstrumento">
          <v-card>
            <v-card-title class="headline white--text blue darken-4">
              Agregar Instrumento Patrón
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
                      type="number"
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
                      type="number"
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

                  <v-row v-if="(userRol == 0)">
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
              <v-btn color="primary" text @click="agregarInstrumento">
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
  props: {
    intrumento: {
      type : Object,
      required: true
    }
  },
  data() {
    return {
      valid:false,
      token: Cookies.get('token'),
      userRol: Cookies.get('user_rol'),
      userId: Cookies.get('user_id'),
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
        rango_de: 0,
        rango_a: null ,
        rango_normal_de: 0,
        rango_normal_a: null,
        resolucion: null,
        tolerancia: null, 
        tipo_id: null,
        unidad_id: null,
        magnitud_id: null,
        is_patron: true,
        encargado_calibracion: null
      },
      rules:[ v => !!v || 'Requerido' ],
      rulesNum:[ v => v > -1 || 'El rango no puede menor a 0' ],
    }
  },
  methods:{
    RefreshInstrumento(){
      const instrumentoRefresh = {
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
        magnitud_id: null,
        is_patron: true,
        encargado_calibracion: null
      }
      this.instrumento = instrumentoRefresh
    },
   async agregarInstrumento(){
      try {
        if(this.$refs.form.validate()){
          await axios.post('instrumento', this.instrumento ,{
              headers: { Authorization: `Bearer ${this.token}` },
            })
            .then(()=>{
              this.alertMsg = "Instrumento agregado correctamente"
              this.alerType = "success"
              this.alertShow = true;
              this.$emit('click');
              this.hide();
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
      this.RefreshInstrumento();
      this.dialog = false;
      this.alertShow = false;
    },
    getInstrumentoTipo(){
        try {
          axios.get('instrumentoTipo', {
            headers: { Authorization: `Bearer ${this.token}` },
          })
          .then((res)=>{
            for (const item of res.data.data) {
              this.instrumentoTipo.push({ text:item.nombre , value:item.id});
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
              this.instrumentoUnidad.push({ text: item.nombre , value: item.id});
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
           this.instrumentoMagnitud.push({ text: item.nombre , value: item.id});
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

  }
},
  watch:{
    dialog: function () {
      if (this.dialog)
      {
        if (this.userRol == 2) {
          this.instrumento.encargado_calibracion = this.userId;
        }
      }
    }
  },
  created(){
    this.getInstrumentoTipo();
    this.getUnidad();
    this.getMagnitud();
    this.getEmpresas();
  }
}
</script>

<style>
</style>
