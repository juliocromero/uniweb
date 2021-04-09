<template>
  <v-container>
    <v-card>
      <v-container>
        <v-row>
          <v-col>
            <v-card color="rgb(41, 83, 130)" dark class="mt-3">
              <v-container class="py-0">
                <v-row>
                  <v-col cols="12" sm="8" class="pb-0">
                    <v-card-title class="pt-0">
                      {{ item.tag }}
                      <v-chip style="margin-left: 10px" :color="estadoColor">
                        {{ estadoText }}
                      </v-chip>
                    </v-card-title>
                    <v-card-subtitle class="pb-0">
                      {{ item.descripcion }}
                    </v-card-subtitle>
                  </v-col>

                  <v-col cols="12" sm="4" class="d-flex justify-end">
                    <v-img class="input-file-wrap" :src="IsImg">
                      <input
                        type="file"
                        @change="CargarImg"
                        class="input-file"
                      />
                    </v-img>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <v-container>
        <v-card color="#FAFAFA">
          <v-container>
            <div class="overline">Detalle de Equipo</div>
            <v-divider></v-divider>

            <v-row class="mt-2">
              <v-col cols="10">
                <v-text-field
                  v-model="item.tag"
                  outlined
                  dense
                  disabled
                  hide-details
                  label="Tag"
                  background-color="white"
                ></v-text-field>
              </v-col>
              <v-col cols="2" class="d-flex align-center">
                <div>
                  <v-checkbox
                    v-model="item.serie_requerido"
                    label="Serie"
                    disabled
                    hide-details
                    class="mb=5"
                  ></v-checkbox>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="item.fecha_creacion_equipo"
                  prepend-inner-icon="mdi-calendar"
                  prepend-icon
                  disabled
                  readonly
                  outlined
                  hide-details
                  dense
                  label="Fecha de Creación"
                  background-color="white"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="item.fecha_update_equipo"
                  prepend-inner-icon="mdi-calendar"
                  prepend-icon
                  disabled
                  readonly
                  outlined
                  hide-details
                  dense
                  label="Fecha de Actualización"
                  background-color="white"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <v-container>
            <div class="overline">Sector del Equipo</div>
            <v-divider></v-divider>

            <v-row class="mt-2">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="item.sector_name"
                  outlined
                  dense
                  disabled
                  hide-details
                  label="Sector"
                  background-color="white"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="item.sector_planta"
                  outlined
                  dense
                  disabled
                  hide-details
                  label="Planta"
                  background-color="white"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-container>

      <v-container class="pt-0">
        <v-card color="#FAFAFA">
          <v-container>
            <v-row class="mt-2">
              <v-col cols="12" sm="7">
                <v-row>
                  <v-col class="d-flex pt-0">
                    <div
                      class="overline d-flex align-end"
                      style="padding-top: 8px"
                    >
                      Instrumento del Equipo
                    </div>
                    <asignar-instrumento
                      v-if="rolUser == 0"
                      :equipo="item"
                      :equipoID="$route.params.id"
                      @reload="reloadCambioEquipo"
                      class="ml-3"
                    />
                    <archivos
                      :equipo="item"
                      style="margin-left: 2px"
                      class="ml-3"
                    />
                  </v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row class="mt-3">
                  <v-col cols="6">
                    <v-text-field
                      v-model="item.instrumento_marca"
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
                      v-model="item.instrumento_modelo"
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
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="item.instrumento_resolucion"
                      outlined
                      dense
                      disabled
                      hide-details
                      label="Resolución"
                      background-color="white"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="item.instrumento_tolerancia"
                      outlined
                      dense
                      disabled
                      hide-details
                      label="Tolerancia"
                      background-color="white"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      v-model="item.instrumento_serie"
                      outlined
                      dense
                      disabled
                      hide-details
                      label="Serie"
                      background-color="white"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      v-model="item.tipo_instrumento"
                      outlined
                      dense
                      disabled
                      hide-details
                      label="Tipo de Instrumento"
                      background-color="white"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      v-model="item.instrumento_unidad"
                      outlined
                      dense
                      disabled
                      hide-details
                      label="Unidad"
                      background-color="white"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      v-model="item.instrumento_magnitud"
                      outlined
                      dense
                      disabled
                      hide-details
                      label="Magnitud"
                      background-color="white"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      v-model="item.instrumento_creado_usuario"
                      outlined
                      dense
                      disabled
                      hide-details
                      label="Usuario"
                      background-color="white"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      v-model="item.instrumento_encargado_calibracion"
                      outlined
                      dense
                      disabled
                      hide-details
                      label="Encargado de calibración"
                      background-color="white"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="3" sm="3">
                    <v-text-field
                      v-model="item.instrumento_rango_de"
                      outlined
                      dense
                      disabled
                      hide-details
                      label="Rango de"
                      background-color="white"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="3" sm="3">
                    <v-text-field
                      v-model="item.instrumento_rango_a"
                      outlined
                      dense
                      disabled
                      hide-details
                      label="Rango a"
                      background-color="white"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="3" sm="3">
                    <v-text-field
                      v-model="item.instrumento_rango_normal_de"
                      outlined
                      dense
                      disabled
                      hide-details
                      label="Rango normal de"
                      background-color="white"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="3" sm="3">
                    <v-text-field
                      v-model="item.instrumento_rango_normal_a"
                      outlined
                      dense
                      disabled
                      hide-details
                      label="Rango normal a"
                      background-color="white"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="item.instrumento_update"
                      prepend-inner-icon="mdi-calendar"
                      prepend-icon
                      disabled
                      readonly
                      outlined
                      hide-details
                      dense
                      label="Fecha de Actualización"
                      background-color="white"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" sm="5">
                <v-row>
                  <v-col cols="10" class="pt-2">
                    <div class="overline">Asignaciones</div>
                  </v-col>
                  <v-spacer></v-spacer>
                </v-row>
                <v-divider></v-divider>
                <v-card
                  height="425"
                  width="auto"
                  flat
                  style="border: 2px groove #d6d6d8"
                  class="mt-3"
                >
                  <v-data-table
                    :headers="headersEquiposAsignados"
                    :items="equipoAsignado"
                    hide-default-footer
                    disable-pagination
                    sortBy="[desde]"
                    sortDesc="[DESC]"
                    height="420"
                  >
                    <template v-slot=""> </template>
                  </v-data-table>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-container>

      <v-container>
        <v-card color="#FAFAFA">
          <v-container>
            <v-row>
              <v-col cols="12" sm="6">
                <v-row>
                  <v-col class="d-flex pr-1">
                    <div class="overline" style="padding-top: 8px">
                      Tareas de Calibración
                    </div>
                    <agregar-calibracion
                      v-if="rolUser == 0"
                      :instrumento_id="item.instrumento_id"
                      @click="getEquipo"
                      class="ml-3"
                    />
                  </v-col>
                </v-row>
                <v-divider></v-divider>
                <v-card
                  width="auto"
                  flat
                  style="border: 2px groove #d6d6d8"
                  class="mt-2"
                >
                  <v-divider />
                  <v-data-table
                    :headers="headersTareasCalibracion"
                    :items="tareasCalibracion"
                    hide-default-footer
                    disable-pagination
                    height="515"
                  >
                    <template
                      v-slot:[`item.calibracion_tarea_proxima`]="{ item }"
                    >
                      <v-chip :color="setColorEstado(item)" text-color="white">
                        {{ item.calibracion_tarea_proxima }}
                      </v-chip>
                    </template>

                    <template
                      v-slot:[`item.calibracion_tarea_habilitada`]="{ item }"
                    >
                      <v-checkbox
                        v-model="item.calibracion_tarea_habilitada"
                        color="info"
                        hide-details
                        disabled
                      ></v-checkbox>
                    </template>

                    <template v-slot:[`item.acciones`]="item">
                      <div class="d-flex">
                        <cargar-tarea-calibracion-realizada
                          :calibracion_tarea_id="item.item.num_tarea"
                          :user_id_for_admin="encargadoID"
                          @click="getTareasRealizadas"
                          class="mr-2"
                        />
                        <editar-tarea-calibracion
                          v-if="rolUser == 0"
                          class="mr-2"
                          :calibracionItem="item.item"
                          :calibracion_tarea_id="item.item.num_tarea"
                          @click="getTareasRealizadas"
                          :user_id_for_admin="encargadoID"
                          @reload="GetRealoadItems"
                        />

                        <eliminar-tarea-calibracion
                          :id="item.item.num_tarea"
                          @click="getEquipo"
                          v-if="rolUser == 0"
                        />
                      </div>
                    </template>
                  </v-data-table>
                </v-card>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="overline">CERTIFICADOS</div>
                <v-divider></v-divider>
                <div class="is-flex">
                  <filtro @click="filterByDate" ref="Filtro" />
                  <div width="100%" class="d-flex justify-end align-center">
                    <v-btn text color="error" @click="limpiarFiltros">
                      Limpiar Filtros
                    </v-btn>
                  </div>
                </div>

                <v-divider></v-divider>
                <v-card
                  height="425"
                  width="auto"
                  flat
                  style="border: 2px groove #d6d6d8"
                  class="mt-2"
                >
                  <v-data-table
                    :headers="headersCertificados"
                    :items="tareasRealizadas"
                    :options.sync="optionsCertificados"
                    :server-items-length="totalCertificados"
                    :loading="loadingCertificados"
                    no-data-text="Sin datos"
                    height="360"
                  >
                    <template v-slot:[`item.patron`]="{ item }">
                      <template v-if="!item.patron_isString">
                        <nuxt-link
                          :to="`../detalle_patron/${it.id}`"
                          :exact="true"
                          v-for="it in item.patron"
                          :key="it.id"
                        >
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                v-on="on"
                                v-bind="attrs"
                                text
                                small
                                color="info"
                                target="_blank"
                                download
                              >
                                {{ it.serie }}</v-btn
                              >
                            </template>
                            <span>Ir a patrón</span>
                          </v-tooltip>
                        </nuxt-link>
                      </template>
                      <template v-if="item.patron_isString">
                        {{ item.patron }}
                      </template>
                    </template>

                    <template v-slot:[`item.certificado`]="{ item }">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            v-on="on"
                            v-bind="attrs"
                            text
                            small
                            color="info"
                            @click="getCertificado(item.id, item.certificado)"
                            target="_blank"
                            download
                          >
                            {{ item.certificado }}</v-btn
                          >
                        </template>
                        <span>Descargar Certificado</span>
                      </v-tooltip>
                    </template>
                  </v-data-table>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-container>

      <v-card-actions class="d-flex justify-end">
        <v-col class="d-flex justify-end">
          <v-spacer></v-spacer>
        </v-col>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import BtnPDF from '~/components/common/btnPDF.vue'
import axios from '~/plugins/axios'
import Cookies from 'js-cookie'
import Filtro from '@/components/public/Filtro'
import AgregarCertificado from '~/components/common/AgregarCertificado.vue'
import AsignarInstrumento from '~/components/common/AsignarInstrumento.vue'
import Archivos from '~/components/common/Archivos.vue'
import EditarTareaCalibracion from '~/components/common/EditarTareaCalibracion.vue'
import AgregarCalibracion from '~/components/common/AgregarCalibracion.vue'
import CargarTareaCalibracionRealizada from '~/components/common/CargarTareaCalibracionRealizada.vue'
import download from 'downloadjs'
import moment from 'moment'
import { mapState, mapMutations } from 'vuex'
import EliminarTareaCalibracion from '../../components/common/EliminarTareaCalibracion.vue'

export default {
  middleware: 'NOAUTH',
  components: {
    BtnPDF,
    Filtro,
    AgregarCertificado,
    AgregarCalibracion,
    CargarTareaCalibracionRealizada,
    AsignarInstrumento,
    EditarTareaCalibracion,
    EliminarTareaCalibracion,
    Archivos,
  },
  layout: 'equipo',
  data() {
    return {
      paramsId: null,
      equipo: [],
      img: '',
      desde: null,
      hasta: null,
      encargadoID: null,
      estadoText: 'Sin estado',
      estadoColor: 'gray',
      equipoAsignado: [],
      listRutas: [],
      token: Cookies.get('token'),
      item: {
        fecha_creacion_equipo: '',
        fecha_update_equipo: '',
        calibracion_tarea_frecuencia: null,
        calibracion_tarea_id: null,
        calibracion_tarea_proxima: '',
        calibracion_tarea_tipo: '',
        calibracion_tarea_ult_efectuada: '',
        descripcion: '',
        id: null,
        instrumento_creado_usuario: '',
        instrumento_create: '',
        instrumento_encargado_calibracion: '',
        instrumento_magnitud: '',
        instrumento_marca: '',
        instrumento_modelo: '',
        instrumento_rango_a: null,
        instrumento_rango_de: null,
        instrumento_rango_normal_de: '',
        instrumento_rango_normal_a: '',
        instrumento_resolucion: null,
        instrumento_serie: '',
        instrumento_tolerancia: null,
        instrumento_unidad: '',
        instrumento_update: '',
        instrumento_estado: '',
        instrumento_id: '',
        sector_name: '',
        sector_planta: '',
        serie_requerido: null,
        tag: '',
        tipo_instrumento: '',
        userID: null,
      },
      headersEquiposAsignados: [
        { text: 'Equipo', align: 'start', value: 'equipo' },
        { text: 'Serie', value: 'instrumento' },
        { text: 'Desde', value: 'desde' },
        { text: 'Hasta', value: 'hasta' },
      ],
      headersCertificados: [
        { text: 'Tarea', align: 'start', value: 'Num_tarea', sortable: false },
        { text: 'Instrumento', sortable: false, value: 'intrumento' },
        { text: ' Fecha Realización', sortable: false, value: 'fecha' },
        { text: 'Encargado', sortable: false, value: 'realizo' },
        { text: 'Patrón', sortable: false, value: 'patron' },
        {
          text: 'Certificado',
          sortable: false,
          align: 'center',
          value: 'certificado',
        },
      ],
      headersTareasCalibracion: [
        { text: 'N°', align: 'start', value: 'num_tarea' },
        {
          text: 'Tipo de Calibración',
          align: 'center',
          value: 'calibracion_tarea_tipo',
        },
        {
          text: 'Frecuencia',
          value: 'calibracion_tarea_frecuencia',
          align: 'center',
        },
        {
          text: 'Ultima Efectuada',
          value: 'calibracion_tarea_ult_efectuada',
          align: 'center',
        },
        {
          text: 'Proxima Calibracion',
          align: 'center',
          value: 'calibracion_tarea_proxima',
        },
        {
          text: 'Habilitada',
          value: 'calibracion_tarea_habilitada',
          align: 'center',
        },
        {
          text: 'Acciones',
          value: 'acciones',
          sortable: false,
          align: 'center',
        },
      ],
      tareasCalibracion: [],
      tareasRealizadas: [],
      optionsCertificados: {},
      totalCertificados: 0,
      loadingCertificados: false,
    }
  },
  computed: {
    ...mapState(['rolUser']),
    IsImg() {
      let id = this.$route.params.id
      let imgRutas = `http://192.168.195.98:3333/archivos/equipo/${id}/imagen${id}.jpg`
      return imgRutas
    },
  },
  methods: {
    ...mapMutations(['GET_NAME_INSTRUMENTO']),
    GetRealoadItems() {
      this.getEquipo()
    },
    async CargarImg(event) {
      try {
        const token = Cookies.get('token')
        let file = event.target.files[0]
        console.log(file)
        let id = this.$route.params.id
        let items = new FormData()
        items.append('equipo_id', id)
        items.append('img', file)
        await axios
          .post('imgEquipos', items, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            console.log(res)
            this.$router.go(0)
          })
      } catch (error) {
        console.log(error)
        console.log('Error al cargar la img')
      }
    },
    async getImagen() {
      try {
        const token = Cookies.get('token')
        let id = this.$route.params.id
        console.log(id)
        await axios
          .get(
            'imgEquipos',
            { params: { equipo_id: id } },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
          .then((res) => {
            console.log(res)
            this.img = res.data
          })
      } catch (error) {
        console.log('Error al traer la img')
      }
    },
    setColorEstado(item) {
      if (item.calibracion_tarea_habilitada) {
        if (moment().isAfter(item.calibracion_tarea_proxima)) {
          return 'red'
        } else {
          return 'green'
        }
      } else {
        return 'gray'
      }
    },
    getRutas() {
      try {
        const token = Cookies.get('token')

        axios
          .get('sector', {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            this.listRutas = res.data.listRutas
          })
      } catch (error) {
        console.log('Error al traer rutas')
      }
    },
    async getEquipo() {
      try {
        const token = Cookies.get('token')

        await axios
          .get(`equipo/${this.paramsId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            this.item = res.data.data[0].detalleEquipos
            this.encargadoID = this.item.instrumento_encargado_id

            var auxRuta = this.listRutas.find(
              (el) => el.i == this.item.sector_id
            )

            if (auxRuta !== undefined) {
              this.item.sector_name = auxRuta.ruta
            } else {
              this.item.sector_name = 'Error en ruta'
            }

            this.estadoText = this.item.instrumento_estado

            switch (this.item.instrumento_estado_id) {
              case 2:
                this.estadoColor = 'green'
                break

              case 3:
                this.estadoColor = 'red'
                break

              default:
                this.estadoColor = 'gray'
                break
            }

            this.tareasCalibracion = res.data.data[0].calibracion
          })
      } catch (error) {
        console.log(error)
      }
    },
    async getEquipoAsignado() {
      try {
        const token = Cookies.get('token')
        await axios
          .get(`EquipoAsignado/${this.paramsId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            this.equipoAsignado = res.data.data
          })
      } catch (error) {
        console.log(error)
      }
    },
    async getTareasRealizadas() {
      const token = Cookies.get('token')

      try {
        this.loadingCertificados = true
        await axios
          .get('TareaRealizada', {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              equipoID: this.$route.params.id,
              desde: this.desde,
              hasta: this.hasta,
              options: this.optionsCertificados,
            },
          })
          .then((res) => {
            this.tareasRealizadas = res.data.data
            this.totalCertificados = res.data.total
          })
      } catch (error) {
        console.log(error)
      } finally {
        this.loadingCertificados = false
        this.getEquipo()
      }
    },
    async getCertificado(id, nombreArchivo) {
      const token = Cookies.get('token')
      try {
        await axios
          .get('certificado', {
            headers: { Authorization: `Bearer ${token}` },
            responseType: 'blob',
            params: { certId: id },
          })
          .then((response) => {
            const content = response.headers['content-type']
            download(response.data, nombreArchivo, content)
          })
      } catch (error) {
        alert(await error.response.data.text())
      }
    },
    show(item) {
      if (item.certificado == 'false') {
        this.$refs.cert.show()
      }
    },
    async filterByDate(desde, hasta) {
      this.desde = desde
      this.hasta = hasta
      this.getTareasRealizadas()
    },
    async limpiarFiltros() {
      this.desde = null
      this.hasta = null
      this.$refs.Filtro.click()
      this.filterByDate(null, null)
    },
    reloadCambioEquipo() {
      this.getEquipo()
      this.getEquipoAsignado()
    },
  },
  watch: {
    optionsCertificados: {
      handler() {
        this.getTareasRealizadas()
      },
      deep: true,
    },
  },
  mounted() {
    this.GET_NAME_INSTRUMENTO('Equipo')
    this.paramsId = this.$route.params.id
    this.getRutas()
    this.getEquipo()
    this.getEquipoAsignado()
    this.getTareasRealizadas()
    this.getImagen()
  },
}
</script>

<style scoped>
.input-file {
  width: 100%;
  height: 100%;
  font-size: 100px;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
}
.style-vencido {
  background-color: rgb(215, 215, 44);
}

.style-normal {
  background-color: rgb(255, 255, 255);
}

.img {
  width: 145px;
  height: 145px;
}
.input-file-wrap {
  background-image: url('/pic.jpg');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  height: 145px;
  width: 245px;
  max-width: 245px !important;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  border-radius: 7px;
  border: 3px inset #2a67a5;
}

.file-input {
  width: 100%;
  height: 100%;
  opacity: 0;
  /*     padding-left: 240px;
    margin-right: -240px; */
  cursor: pointer;
}

@media screen and (max-width: 480px) {
  .input-file-wrap {
    height: 195px;
    width: 100%;
  }
  .file-input {
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }
  .img {
    width: 100%;
    height: 195px;
  }
}

/* .img_banner{
  border-radius: 7px;
  border: 3px inset #2A67A5;
  height:150px;
  width:250px;
  background-color: slategrey;
} */
@media (min-width: 1500px) {
  .is-flex {
    display: flex;
  }
}
</style>