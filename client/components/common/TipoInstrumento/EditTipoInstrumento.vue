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
          <span>Editar Tipo De Instrumento</span>
        </v-tooltip>

        <v-dialog v-model="dialog" width="500">
          <v-card>
            <v-card-title class="headline white--text blue darken-4">
                Editar Tipo De Instrumento
            </v-card-title>

            <v-card-text>
              <v-form ref="form" lazy-validation v-model="valid">
                <v-container>
                 <v-row>
                    <v-col cols="12">
                      <v-text-field 
                      v-model="tipoInstrumento.nombre"
                      label="Nombre"
                      :rules="rules"
                      >
                      </v-text-field>
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
              <v-btn color="primary" text @click="editarTipoInstrumento">
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
    id: Number,
    required: true
  },
  data() {
    return {
      show3: false,
      valid:false,
      token: Cookies.get('token'),
      dialog: false,
      alertShow: false,
      alertMsg:'',
      alertType:'success',
      tipoInstrumento:{
        nombre: "",
       
      },
      rules:[ v => !!v || 'Requerido' ],
    }
  },
  methods:{
    show(){
      this.getTipoInstrumento()
      this.dialog = true;
    },
   async editarTipoInstrumento(){
      try {
        if(this.$refs.form.validate()){
          await axios.put(`instrumentoTipo/${this.id}`, this.tipoInstrumento ,{
              headers: { Authorization: `Bearer ${this.token}` },
            })
            .then(()=>{
              this.alertMsg = "Tipo de Instrumento actualizado correctamente"
              this.alertType = "success"
              this.alertShow = true;
              this.$refs.form.reset();
              this.$emit('click');
            })
      }
      } catch (error) {
        console.log(error)
        this.alertMsg = "Hubo un error al processar tu solicitud"
        this.alertType = "error"
        this.alertShow = true;
      }
    },
    async getTipoInstrumento(){
      try {
      await axios.get(`instrumentoTipo/${this.id}`,{
        headers: { Authorization: `Bearer ${this.token}` },
      }).then(resp=>{
        this.tipoInstrumento = resp.data.data
      })  
      } catch (error) {
        
      }
    },
      hide(){
        this.$refs.form.reset();
        this.dialog = false;
      },
  }
}
</script>

<style>
</style>
