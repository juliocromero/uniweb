<template>
  <div class="d-flex justify-start">
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          depressed
          x-small
          height="30"
          color="info"
          v-bind="attrs"
          v-on="on"
          @click="show"
        >
          <v-icon>folder</v-icon>
        </v-btn>
      </template>
      <span>Archivos</span>
    </v-tooltip>
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="headline white--text blue darken-4">
          Archivos
        </v-card-title>
        <v-card-text>
          <v-form ref="form" lazy-validation v-model="valid">
            <v-container>
              <v-row class="mt-3" v-if="equipo">
                <v-col cols="6">
                  <v-text-field
                    :value="equipo.instrumento_marca"
                    outlined
                    dense
                    disabled
                    hide-details
                    label="Marca"
                    background-color="white"
                  ></v-text-field>
                </v-col>

                <v-col cols="6">
                  <v-text-field
                    :value="equipo.instrumento_modelo"
                    outlined
                    dense
                    disabled
                    hide-details
                    label="Modelo"
                    background-color="white"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-autocomplete
                    v-model="ruta_archivo"
                    :items="sectores"
                    label="Explorador Archivos"
                    auto-select-first
                  />
                </v-col>
              </v-row>
            </v-container>
             <v-row v-if="alert">
                    <v-col cols="12" class="px-0">
                      <v-alert
                        dense
                        text
                        type="warning"
                      >
                        No hay Archivos!
                      </v-alert>
                    </v-col>
                  </v-row>
            <v-btn :disabled="rules(ruta_archivo)" @click="archivo">archivo</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>   

<script>
import axios from '../../plugins/axios'
import Cookies from 'js-cookie'
import download from 'downloadjs'

export default {
  props: {
    equipo: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      manual: false,
      valid: false,
      token: Cookies.get('token'),
      dialog: false,
      alertMsg: '',
      alerType: '',
      alert: false ,
      ruta_archivo: '',
      rules: (v) => v == '',
      nombre: '',
      sectores: [],
    }
  },
  methods: {
    show() {
      this.dialog = !this.dialog
      this.addDefault()
    },
    async addDefault() {
      if (
        (this.sectores[0] = `storage/archivos/instrumentos/${this.equipo.instrumento_marca}/${this.equipo.instrumento_modelo}/`)
      ) {
        return
      } else {
        this.sectores.push(
          `storage/archivos/instrumentos/${this.equipo.instrumento_marca}/${this.equipo.instrumento_modelo}/`
        )
      }
    },
    async archivo() {
      let items = {
        instrumento_marca: this.equipo.instrumento_marca,
        instrumento_modelo: this.equipo.instrumento_modelo,
        id: this.equipo.instrumento_id,
      }
      try {
        await axios
          .get(`archivos`, {
            params: items,
            headers: {
              Authorization: `Bearer ${this.token}`
            },
            responseType: 'blob',
          })
          .then((response) => {
            const content = response.headers['content-type']
            download(response.data, 'Instrumentos.pdf', content)
          })
      } catch (error) {
        this.alert = true
      }
    },
  },
  computed: {
    /*  sectores(){
      if (this.equipo){
      let sector = [`storage/archivos/instrumentos/${this.equipo.instrumento_marca }/${ this.equipo.instrumento_modelo }/`]
      return sector
      }
      return ''
      
    } */
  },
}
</script>

<style>
</style> 