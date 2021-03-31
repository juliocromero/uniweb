<template>
  <div class="d-flex justify-end">
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          @click="dialog = true"
          color="primary"
          dark
          class="mb-2"
          v-bind="attrs"
          v-on="on"
        >
          Agregar
        </v-btn>
      </template>
      <span>Agregar Tipo De Instrumento</span>
    </v-tooltip>

    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="headline white--text blue darken-4">
          Agregar Tipo De Instrumento
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
                  <v-alert dense text :type="alertType">
                    {{ alertMsg }}
                  </v-alert>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="hide"> Cancelar </v-btn>
          <v-btn color="primary" text @click="AgregarTipoInstrumento"> Ok </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from '~/plugins/axios'
import Cookies from 'js-cookie'
export default {
  data() {
    return {
      show3: false,
      valid: false,
      token: Cookies.get('token'),
      dialog: false,
      alertShow: false,
      alertMsg: '',
      alertType: 'success',
      tipoInstrumento: {
        nombre: '',
       
      },
      
      rules: [(v) => !!v || 'Requerido'],
    }
  },
  methods: {
    async AgregarTipoInstrumento() {
      try {
        if (this.$refs.form.validate()) {
          await axios
            .post('instrumentoTipo', this.tipoInstrumento, {
              headers: { Authorization: `Bearer ${this.token}` },
            })
            .then(() => {
              this.alertMsg = 'Tipo De Instrumento agregado correctamente'
              this.alerType = 'success'
              this.alertShow = true
              this.$refs.form.reset()
              this.$emit('click')
            })
        }
      } catch (error) {
        console.log(error)
        this.alertMsg = 'Hubo un error al processar tu solicitud'
        this.alerType = 'error'
        this.alertShow = true
      }
    },
    hide() {
      this.$refs.form.reset()
      this.dialog = false
    },
  },
  created() {
    //this.getInstrumentoTipo();
    //this.getUnidad();
    //this.getMagnitud();
  },
}
</script>

<style>
</style>
