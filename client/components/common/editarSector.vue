<template>
  <div>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-icon v-bind="attrs" v-on="on" class="editar" @click="show"
          >mdi-pencil</v-icon
        >
      </template>
      <span>Editar Sector</span>
    </v-tooltip>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title class="headline blue darken-4" style="color: white">
          <span>Editar Sector</span>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="hideModal">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-container>
            <v-form ref="form" lazy-validation v-model="valid">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="sector.nombre"
                    label="Nombre"
                    :rules="rules"
                  ></v-text-field>
                </v-col><!-- 
                <v-col cols="12">
                  <v-autocomplete
                    v-model="sector.ruta_id"
                    :items="sectores"
                    label="sector"
                    auto-select-first
                    :rules="rules"
                  />
                </v-col> -->
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <!-- Mensaje del request http -->
        <v-col cols="12" v-if="alertShow">
          <v-alert dense text :type="alertType" class="mx-4">
            {{ alertMsg }}
          </v-alert>
        </v-col>
        <!--Fin Mensaje del request http -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="hideModal"> Cancelar </v-btn>
          <v-btn color="blue darken-1" text @click="agregarSector"> Ok </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from '~/plugins/axios'
import Cookies from 'js-cookie'

export default {
    props:{
        sectorData:{
            type: Object,
            require: true
        }
    },
  components: {},
  data() {
    return {
      valid: false,
      dialog: false,
      alertMsg: '',
      alertType: '',
      alertShow: '',
      rules: [(v) => !!v || 'Requerido'],
      sectores: ['/'],
      sector: {
        nombre: '',
        ruta_id: '',
      },
      token: Cookies.get('token'),
    }
  },
  methods: {
    show() {
      this.dialog = true
      this.sector.nombre = this.sectorData.name
    },
    async agregarSector() {
      try {
        if (this.$refs.form.validate()) {
          await axios
            .put(`sector/${this.sectorData.id}`, {nombre: this.sector.nombre} , {
              headers: { Authorization: `Bearer ${this.token}` },
            })
            .then((resp) => {
              this.alertMsg = `Sector Editado exitosamente`
              this.alertType = 'success'
              this.alertShow = true
              this.$refs.form.reset()
              setTimeout(() => (this.alertShow = false), 3000)
              this.dialog = false
              this.$emit('reloag')
            })
        }
      } catch (error) {
        console.log(error)
        this.alertMsg = error
        this.alertType = 'error'
        this.alertShow = true
      }
    },
    hideModal() {
      this.dialog = false
      this.$refs.form.reset()
    },
  },
}
</script>

<style>
.editar:hover {
  color: rgb(76, 117, 206);
}
</style>