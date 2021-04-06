<template>
  <div class="fondo">
    <v-container>
      <v-row>
        <v-col cols="12" md="3">
          <v-col class="d-flex pb-0 pl-1">
            <div class="overline">Sectores</div>
            <v-spacer />
            <agregar-sector @reloag="reloag" v-if="isRolUser" />
          </v-col>
          <v-divider></v-divider>
          <div class="sectores-sider">
            <v-treeview
              rounded
              hoverable
              activatable
              :active="itemsSelected"
              :items="items"
              item-key="id"
              v-on:update:active="filtrarTabla"
              style="cursor: pointer"
            >
              <template v-slot:append="{ item }" v-if="isRolUser">
                <div class="delete-sector">
                  <v-icon @click="DeleteSector(item)" class="borrar"
                    >delete_forever</v-icon
                  >
                </div>
              </template>
            </v-treeview>
          </div>
        </v-col>
        <v-col cols="12" md="9">
          <v-card>
            <v-card-title style="box-shadow: 1px 2px 4px #888888">
              Equipos
            </v-card-title>

            <v-divider></v-divider>
            <v-row>
              <v-col>
                <filtro @click="filterByDate" ref="Filtro" :home="true" />
                <v-divider></v-divider>
              </v-col>
            </v-row>

            <v-data-table
              :headers="headers"
              :items="tableData"
              :options.sync="options"
              :server-items-length="totalTableItems"
              :loading="loading"
              multi-sort
              no-data-text="Sin datos"
              class="elevation-1"
            >
              <template v-slot:top>
                <v-toolbar flat>
                  <v-text-field
                    append-icon="mdi-magnify"
                    label="Buscar"
                    single-line
                    hide-details
                    @keyup.enter="getDataTable()"
                    v-model="txtBuscar"
                  ></v-text-field>

                  <v-spacer></v-spacer>
                  <v-btn
                    text
                    color="error"
                    @click="limpiarFiltros"
                    class="mr-3 mb-2"
                  >
                    Limpiar Filtros
                  </v-btn>

                  <agregar-equipo @click="getDataTable" v-if="isRolUser" />
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        style="margin-left: 5px; margin-top: -7px"
                        outlined
                        color="success"
                        v-bind="attrs"
                        @click="DescargaCSV(tableData)"
                        v-on="on"
                        ><v-icon>file_download </v-icon></v-btn
                      >
                    </template>
                    <span>Descarga CSV</span>
                  </v-tooltip>
                </v-toolbar>
              </template>

              <template v-slot:[`item.tag`]="{ item }">
                <nuxt-link :to="`detalle_equipo/${item.id}`" :exact="true">
                  <v-tooltip right>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        small
                        depressed
                        class="tag"
                        v-bind="attrs"
                        v-on="on"
                      >
                        {{ item.tag }}
                      </v-btn>
                    </template>
                    <span>Ver Detalle</span>
                  </v-tooltip>
                </nuxt-link>
              </template>

              <template v-slot:[`item.estadoName`]="{ item }">
                <v-chip :color="setColorEstado(item)" text-color="white">
                  {{ item.estadoName }}
                </v-chip>
              </template>

              <template v-slot:[`item.acciones`]="{ item }">
                <v-row class="d-flex justify-center">
                  <ultima-tarea-realizada
                    @click="downloadUltCert(item.instrumento_id)"
                    class="mr-2"
                  />
                  <editar-equipo
                    :id="item.id"
                    class="mr-2"
                    @click="getDataTable"
                    v-if="isRolUser"
                  />
                  <eliminar-equipo
                    :id="item.id"
                    :tag="item.tag"
                    @click="getDataTable"
                    v-if="isRolUser"
                  />
                </v-row>
              </template>

              <template v-slot:[`item.proximaCalib`]="{ item }">
                {{ item.proximaCalib | fecha }}
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
      <eliminar-sector
        :sectorModal="sectorDeleteModal"
        :sector="sectorDelete"
        @input="closeModal"
        @deleteOk="deleteOkSector"
      />
    </v-container>
    {{options}}
  </div>
</template>

<script>
import moment from 'moment'
import Filtro from '@/components/public/Filtro'
import axios from '~/plugins/axios'
import { mapMutations, mapState } from 'vuex'
import Cookies from 'js-cookie'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import AgregarEquipo from '~/components/common/AgregarEquipo.vue'
import eliminarSector from '~/components/common/eliminarSector.vue'
import UltimaTareaRealizada from '~/components/common/UltimaTareaRealizada.vue'
import EditarEquipo from '~/components/common/EditarEquipo.vue'
import EliminarEquipo from '~/components/common/EliminarEquipo.vue'
import DescargarCetificado from '~/components/common/DescargarCetificado.vue'
import AgregarSector from '~/components/common/AgregarSector.vue'
import download from 'downloadjs'

export default {
  middleware: 'NOAUTH',
  components: {
    Filtro,
    AgregarEquipo,
    EliminarEquipo,
    EditarEquipo,
    DescargarCetificado,
    AgregarSector,
    eliminarSector,
  },
  data: () => ({
    sectorDelete: [],
    sectorDeleteModal: false,
    token: Cookies.get('token'),
    benched: 0,
    items: [],
    itemsSelected: [],
    totalTableItems: 0,
    loading: false,
    options: {},
    txtBuscar: '',
    filtroTree: undefined,
    listRutas: [],
    dialog: false,
    dialogDelete: false,
    editedIndex: -1,
    defaultItem: {
      tag: '',
      descripcion: '',
      sector: '',
      encargado: '',
    },
    headers: [
      { text: 'Tag', align: 'start', value: 'tag' },
      { text: 'Descripción', value: 'descripcion', align: 'start' },
      { text: 'Sector', value: 'sectorName', align: 'center' },
      { text: 'Estado', value: 'estadoName', align: 'center' },
      { text: 'Próxima', value: 'proximaCalib', align: 'center' },
      { text: 'Encargado', value: 'empresa', align: 'center' },
      { text: 'Acciones', value: 'acciones', sortable: false, align: 'center' },
    ],
    tableData: [],
  }),
  computed: {
    ...mapState(['rolUser']),

    formTitle() {
      return this.editedIndex === -1 ? 'Nuevo' : 'Editar'
    },
    isRolUser() {
      if (this.rolUser == 0) {
        return true
      }
      return false
    },
  },
  filters: {
    fecha(v) {
      if (v == '') {
        return 'No hay tarea asignada'
      } else {
        return v.toString().slice(0, 10)
      }
    },
  },
  methods: {
    setColorEstado(item) {
      switch (item.estadoId) {
        case 2:
          return 'green'

        case 3:
          return 'red'

        default:
          return 'gray'
      }
    },
    deleteOkSector() {
      this.fillItems()
    },
    closeModal() {
      this.sectorDeleteModal = false
    },
    DeleteSector(item) {
      ;(this.sectorDelete = item), (this.sectorDeleteModal = true)
    },
    reloag() {
      this.fillItems()
    },
    ...mapMutations(['toggleDialogPassword']),
    async fillItems() {
      await axios
        .get('sector', {
          headers: { Authorization: `Bearer ${this.token}` },
        })
        .then((res) => {
          this.items = res.data.sectoresResp
          this.listRutas = res.data.listRutas
        })
    },
    async getDataTable() {
      this.loading = true
      await axios
        .get('tablaequipos', {
          headers: { Authorization: `Bearer ${this.token}` },
          params: {
            desde: this.desde,
            hasta: this.hasta,
            options: this.options,
            buscar: this.txtBuscar,
            filtroTree: this.filtroTree,
          },
        })
        .then((res) => {
          console.log('resEquipoTabla:', res.data.tableItemsData)
          this.totalTableItems = res.data.total
          res.data.tableItemsData.forEach((it) => {
            var auxRuta = this.listRutas.find((el) => el.i == it.sector_id)

            if (auxRuta !== undefined) {
              it.sectorName = auxRuta.ruta
            } else {
              it.sectorName = 'Error en ruta'
            }
          })

          this.tableData = res.data.tableItemsData
          this.loading = false
        })
    },
    async downloadUltCert(id) {
      try {
        await axios
          .get('download/lastcert', {
            headers: { Authorization: `Bearer ${this.token}` },
            responseType: 'blob',
            params: { id },
          })
          .then((response) => {
            const content = response.headers['content-type']
            download(response.data, 'ultimo.pdf', content)
          })
      } catch (error) {
        alert(await error.response.data.text())
      }
    },
    async filtrarTabla(id) {
      this.filtroTree = id
      this.fillItems()
      this.getDataTable()
    },
    async limpiarFiltros() {
      this.filtroTree = undefined
      this.desde = null
      this.hasta = null
      this.txtBuscar = ''
      this.itemsSelected = []
      this.$refs.Filtro.click()
      this.getDataTable()
    },
    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    async filterByDate(desde, hasta) {
      this.desde = desde
      this.hasta = hasta
      this.getDataTable()
    },
    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.tableData[this.editedIndex], this.editedItem)
      } else {
        this.desserts.push(this.editedItem)
      }
      this.close()
    },
    async DescargaCSV() {
      let file = await this.archiveAll()
      if (file){
         await this.DownloadArchive(file)
      }
     
      
    },
    async archiveAll(){
       this.loading = true
       let page = this.options;
       page.itemsPerPage = 'all'
      return await axios
        .get('tablaequipos', {
          headers: { Authorization: `Bearer ${this.token}` },
          params: {
            desde: this.desde,
            hasta: this.hasta,
            options: page,
            buscar: this.txtBuscar,
            filtroTree: this.filtroTree,
          },
        })
        .then((res) => {
          res.data.tableItemsData.forEach((it) => {
            var auxRuta = this.listRutas.find((el) => el.i == it.sector_id)

            if (auxRuta !== undefined) {
              it.sectorName = auxRuta.ruta
            } else {
              it.sectorName = 'Error en ruta'
            }
          })
    
          
          
          return res.data.tableItemsData
        })

    },
    DownloadArchive(file){
      let csvContent = 'data:text/csv;charset=utf-8,'
      let value = file.map((val) => {
        let res = {
          "Sector": val.sectorName,
          "Tag": val.tag,
          "Descripcion": val.descripcion,
          "Encargado": val.empresa,
          "Estado": val.estadoName,
          "Proxima Calibración": val.proximaCalib
        }
        return res
      })
      csvContent += [
        Object.keys(value[0]).join(';'),
        ...value.map((item) => Object.values(item).join(';')),
      ]
        .join('\n')
        .replace(/(^\[)|(\]$)/gm, '')
      const data = encodeURI(csvContent)
      const link = document.createElement('a')
      link.setAttribute('href', data)
      link.setAttribute('download', 'plantilla.csv')
      link.click()
      this.loading = false
    }
  },
  watch: {
    options: {
      handler() {
        this.fillItems()
        this.getDataTable()
      },
      deep: true,
    },
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
  },
  mounted() {
    this.fillItems()
  },
}
</script>

<style lang="css" scoped>
.limpiar:hover {
  color: lightcoral;
  font-weight: 600;
}
.scrollItem:hover {
  background: rgb(245, 245, 245);
  cursor: pointer;
}
.tag {
  cursor: pointer;
  color: blue;
  background: lightblue;
}
.tag:hover {
  color: white;
  background: #1976d2;
}
a {
  text-decoration: none;
}
.fondo {
  background: #ebedef;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}

.font-weight-medium {
  size: 1;
}
.txt-treview {
  margin-top: 15px;
}
.borrar:hover {
  color: red;
}
.delete-sector {
  z-index: 20;
}
.sectores-sider {
  max-height: 70vh;
  overflow: auto;
}
</style>