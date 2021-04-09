<template>
  <v-container>
    <v-card>
      <v-container class="pt-0">
        <v-card color="#FAFAFA">
          <v-container>
            <v-row class="mt-2">
              <v-col cols="12">
                <v-row>
                  <v-col class="d-flex pt-0">
                    <div
                      class="overline d-flex align-end"
                      style="padding-top: 8px"
                    >
                      Detalle
                    </div>
                    <v-chip
                      style="margin-left: 10px"
                      :color="estadoColor"
                      text-color="white"
                      >
                        {{estadoText}}
                    </v-chip>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row class="mt-3">
                  <v-col cols="6">
                    <v-text-field
                      v-model="item.marca"
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
                      v-model="item.modelo"
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
                      v-model="item.resolucion"
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
                      v-model="item.tolerancia"
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
                      v-model="item.serie"
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
                      v-model="item.tipo"
                      outlined
                      dense
                      disabled
                      hide-details
                      label="Tipo de instrumento"
                      background-color="white"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      v-model="item.unidad"
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
                      v-model="item.magnitud"
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
                      v-model="item.creador"
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
                      v-model="item.encargado_calibracion"
                      outlined
                      dense
                      disabled
                      hide-details
                      label="Encargado de Calibración"
                      background-color="white"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="3" sm="3">
                    <v-text-field
                      v-model="item.rango_de"
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
                      v-model="item.rango_a"
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
                      v-model="item.rango_normal_de"
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
                      v-model="item.rango_normal_a"
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
                      v-model="item.updated_at"
                      prepend-inner-icon="mdi-calendar"
                      prepend-icon
                      disabled
                      readonly
                      outlined
                      hide-details
                      dense
                      label="Fecha de actualización"
                      background-color="white"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-container>

      <v-container  >
        <v-card color="#FAFAFA">
          <v-container>
            <v-row >
              <v-col cols="12" sm="6">
                <v-row>
                  <v-col class="d-flex pr-1">
                    <div class="overline" style="padding-top: 8px">
                      Tareas de calibración
                    </div>
                    <agregar-calibracion
                      :instrumento_id="item.id"
                      @click="getInstrumento"
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
                    height="515"
                  >
                    <template v-slot:[`item.proxima`]="{ item }">
                      <v-chip
                      :color="setColorEstado(item)"
                      text-color="white"
                      >
                        {{item.proxima}}
                      </v-chip>
                    </template>

                    <template v-slot:[`item.habilitada`]="{ item }">
                      <v-checkbox
                        v-model="item.habilitada"
                        color="info"
                        hide-details
                        disabled
                      ></v-checkbox>
                    </template>

                    <template v-slot:[`item.acciones`]="{ item }">
                      <div class="d-flex">
                        <cargar-tarea-calibracion-realizada-patron
                          :calibracion_tarea_id="item.id"
                          class="mr-2"
                          @click="getTareasRealizadas"
                        />

                        <editar-tarea-calibracion-patron
                          v-if="rolUser == 0"
                          class="mr-2"
                          :calibracionItem="item"
                          @reload="getInstrumento"
                        />
                        
                        <eliminar-tarea-calibracion :id="item.id" @click="getInstrumento" v-if="rolUser == 0"/>
                      </div>
                    </template>
                  </v-data-table>
                </v-card>
              </v-col>
              <v-col cols="12" sm="6" >
                <div class="overline">CERTIFICADOS</div>
                <v-divider></v-divider>
                <div class="is-flex">
                  <filtro @click="filterByDate" ref="Filtro"/>
                  <div width="100%" class="d-flex justify-end align-center">
                      <v-btn
                          text
                          color="error"
                          @click="limpiarFiltros"
                        >
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
import moment from 'moment'
import Cookies from 'js-cookie'
import Filtro from '@/components/public/Filtro'
import AgregarCertificado from '~/components/common/AgregarCertificado.vue'
import AsignarInstrumento from '~/components/common/AsignarInstrumento.vue'
import AgregarCalibracion from '~/components/common/AgregarCalibracion.vue'
import CargarTareaCalibracionRealizadaPatron from '~/components/common/CargarTareaCalibracionRealizadaPatron.vue'
import download from 'downloadjs'
import {mapState, mapMutations} from 'vuex'
import EditarTareaCalibracionPatron from '../../components/common/EditarTareaCalibracionPatron.vue'

export default {
  middleware: 'NOAUTH',
  components: {
    BtnPDF,
    Filtro,
    AgregarCertificado,
    AgregarCalibracion,
    CargarTareaCalibracionRealizadaPatron,
    AsignarInstrumento,
    EditarTareaCalibracionPatron
  },
  layout: 'equipo',
  data() {
    return {
      paramsId: null,
      equipo: [],
      desde: null,
      hasta: null,
      equipoAsignado: [],
      estadoText: 'Sin estado',
      estadoColor: 'gray',
      listRutas: [],
     token: Cookies.get('token'),
      item: {},
      headersCertificados: [
        { text: 'Tarea', align: 'start', sortable: false, value: 'num_tarea' },
        { text: 'Instrumento', sortable: false, value: 'instrumento' },
        { text: ' Fecha Realización', sortable: false, value: 'fecha' },
        { text: 'Encargado', sortable: false, value: 'realizo' },
        { text: 'Certificado', sortable: false, align: 'center', value: 'certificado' },
      ],
      headersTareasCalibracion: [
        { text: 'N°', align: 'start', value: 'id' },
        {
          text: 'Tipo de Calibración',
          align: 'start',
          value: 'tipo.nombre',
        },
        { text: 'Frecuencia', value: 'frecuencia' },
        { text: 'Ultima Efectuada', value: 'ult_efectuado' },
        {
          text: 'Proxima Calibracion',
          align: 'center',
          value: 'proxima',
        },
        {
          text: 'Habilitada', value: 'habilitada', align: 'center'
        },
        { text: 'Acciones', align: 'center', value: 'acciones' },
      ],
      tareasCalibracion: [],
      tareasRealizadas: [],
      optionsCertificados: {},
      totalCertificados: 0,
      loadingCertificados: false
    }
  },
  computed:{
    ...mapState(['rolUser'])
  },
  methods: {
    ...mapMutations(['GET_NAME_INSTRUMENTO']),
    async getInstrumento() {
      try {
        const token = Cookies.get('token')

        await axios
          .get(`instrumento-patron/${this.paramsId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {

            this.item = res.data.data;
            this.tareasCalibracion = this.item.tareaCalibracion;

            this.estadoText = this.item.estado;

            switch (this.item.estado_id) {
              case 2:
                this.estadoColor = 'green'
                break;

              case 3:
                this.estadoColor = 'red'
                break;
            
              default:
                this.estadoColor = 'gray'
                break;
            }
          })
      } catch (error) {
        console.log(error)
      }
    },
    async getTareasRealizadas() {
      const token = Cookies.get('token')

      try {
        this.loadingCertificados = true;
        await axios
          .get('certificados-patron', {
            headers: { Authorization: `Bearer ${token}` },
            params: { instrumentoID: this.$route.params.id,
            desde: this.desde,
            hasta: this.hasta,
            options: this.optionsCertificados }
          })
          .then((res) => {
            this.tareasRealizadas = res.data.data;
            this.totalCertificados = res.data.total;
          })
      } catch (error) {
        console.log(error)
      }
      finally {
        this.loadingCertificados = false;
        this.getInstrumento();
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
    setColorEstado(item) {
      if (item.habilitada) {
        if (moment().isAfter(item.proxima)) {
          return 'red'
        }
        else
        {
          return 'green'
        }
      }
      else
      {
        return 'gray'
      }
      
    },
  },
  watch: {
    optionsCertificados: {
      handler() {
        this.getTareasRealizadas()
      },
      deep: true,
    }
  },
  mounted() {
    this.GET_NAME_INSTRUMENTO('Patrón')
    this.paramsId = this.$route.params.id
    this.getInstrumento();
/*     if (this.$route.query.desde) {
      this.desde = moment(this.$route.query.desde).format('YYYY-MM-DD')
      this.hasta = moment(this.$route.query.desde).format('YYYY-MM-DD')
      this.$refs.Filtro.date1 = this.desde
      //this.getTareasRealizadas();
    } */
    
    
  },
}
</script>

<style scoped>
.img {
  width: 245px;
  height: 145px;
}
.input-file-wrap {
  background-image: url('/pic.jpg');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  height: 145px;
  width: 245px;
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
  .is-flex{
    display: flex;
    
  }
}
</style>