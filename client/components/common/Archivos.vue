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
          <div width="100%" class="d-flex justify-center align-center">
          <!-- <v-file-input
            max-width="100"
            truncate-length="15"
            v-model="files"
            :hide-details="true"
            placeholder="Cargar Archivo"
            outlined
            :show-size="1000"
          >
          </v-file-input> -->

            <v-file-input
              class="file-input"
              v-model="files"
              show-size
              truncate-length="5"              
            ></v-file-input>
            <v-btn  text color="primary"
              @click="SubirArchivos">Cargar</v-btn>
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
  computed:{
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
    async SubirArchivos() {
      let items = new FormData()
      items.append('instrumento_marca', this.equipo.instrumento_marca)
      items.append('instrumento_modelo', this.equipo.instrumento_modelo)
      items.append('pdfIns', this.files)
      
      try {
        await axios
          .post(`archivos`, items, {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
            responseType: 'blob',
          })
          .then((response) => {
            this.archivosFile()
          })
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
}
</script>

<style>
.file-input{
  min-width:10px;
}
</style> 