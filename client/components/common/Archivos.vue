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
        <v-card-title class="headline white--text blue darken-4"
          >Archivo</v-card-title
        >
        <v-form ref="form" lazy-validation v-model="valid">
          <v-list shaped>
            <v-list-item-group color="primary" v-if="items.length > 0" >
              <v-list-item v-for="(item, i) in items" :key="i">
                <v-list-item-icon>
                  <v-icon>article</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="item"></v-list-item-title>
                </v-list-item-content>
                <v-list-item-icon @click="archivo(item)">
                  <v-icon class="file-download">file_download</v-icon>
                </v-list-item-icon>
              </v-list-item>
            </v-list-item-group>
            <v-list-item-group v-else>
              <v-row >
                <v-col cols="12" class="px-0">
                  <v-alert dense text type="warning"> No hay Archivos! </v-alert>
                </v-col>
              </v-row>
            </v-list-item-group>
          </v-list>
          <v-divider></v-divider>
          <div width="100%" class="d-flex justify-center m2">
            <v-file-input
              class="input-file"
              max-width="100"
              v-model="files"
              placeholder="Cargar Archivo"
              outlined
              :show-size="1000"
              @change="SubirArchivos"
            >
            </v-file-input>
            <v-btn color="error" text @click="hide">
                Cancelar
              </v-btn>
          </div>
        </v-form>
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
      alert: false,
      nombre: '',
      sectores: [],
      electedItem: 1,
      items: [],
      files: null,
    }
  },
  methods: {
    hide() {
      this.dialog = false
    },
    show() {
      this.dialog = !this.dialog
      this.archivosFile()
    },
    async archivosFile() {
      let items = {
        instrumento_marca: this.equipo.instrumento_marca,
        instrumento_modelo: this.equipo.instrumento_modelo,
      }
      try {
        await axios
          .get(
            'archivosList',
            { params: items },
            {
              headers: {
                Authorization: `Bearer ${this.token}`,
              },
            }
          )
          .then((res) => {
            this.items = res.data
          })
      } catch (error) {
        console.log(error)
      }
    },
    async SubirArchivos(event) {
      console.log(event)
      let items = new FormData()
      items.append('instrumento_marca', this.equipo.instrumento_marca)
      items.append('instrumento_modelo', this.equipo.instrumento_modelo)
      items.append('pdfIns', event)
      
      try {
        await axios
          .post(`archivos`, items, {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
            responseType: 'blob',
          })
          .then((response) => {})
      } catch (error) {
        this.alert = true
      }
    },
    async archivo(nameFile) {
      let items = {
        instrumento_marca: this.equipo.instrumento_marca,
        instrumento_modelo: this.equipo.instrumento_modelo,
        nameArchivos: nameFile,
      }
      try {
        await axios
          .get(`archivos`, {
            params: items,
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
            responseType: 'blob',
          })
          .then((response) => {
            const content = response.headers['content-type']
            download(response.data, `${nameFile}`, content)
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
.input-file > .v-input__control {
}
.input-file {
  background-color:white !important;
  text-align: center;
  transition: none;
}
.input-file > .v-input__control > .v-input__slot {
  margin:0px;
  padding: 0px;
  border: none;
  background:rgb(135, 165, 204);
  width: 200px;
  height: 40px;
  min-height: 0px;
  font-size: 1rem;
}
.input-file > .v-input__control > .v-input__slot:hover{
  cursor: pointer;
  border: 2px solid rgb(111, 111, 165) !important;
}
.file-download:hover{
  color: rgb(94, 192, 94);
}
</style> 