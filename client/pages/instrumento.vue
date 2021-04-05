<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <v-card>
            <v-card-title style="box-shadow: 1px 2px 4px #888888">
              Instrumentos
            </v-card-title>

            <v-divider></v-divider>
            <v-data-table
              :headers="headers"
              :items="tableData"
              :options.sync="options"
              :server-items-length="totalTableItems"
              no-data-text="Sin datos"
              :loading="loading"
              multi-sort
              class="elevation-1"
            >
              <template v-slot:top>
                <v-toolbar flat>
                  <v-text-field
                    append-icon="mdi-magnify"
                    label="Buscar"
                    single-line
                    hide-details
                    @keyup.enter="getInstrumentos"
                    v-model="txtBuscar"
                  ></v-text-field>

                  <v-spacer></v-spacer>

                  <agregar-instrumento @click="getInstrumentos" :intrumento='intrumentoRefresh' @instrumentoCreado="getInstrumentos" v-if="isRolUser"/>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        style="margin-left: 5px;"
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

              <template v-slot:[`item.estado_name`]="{ item }">
                <v-chip
                :color="setColorEstado(item)"
                text-color="white"
                >
                  {{item.estado_name}}
                </v-chip>
              </template>

              <template v-slot:[`item.acciones`]="{ item }">
                <v-row class="d-flex justify-center" v-if="isRolUser">
                  <editar-instrumento
                    :id="item.id"
                    class="mr-2"
                    @click="getInstrumentos"
                  />
                  <eliminar-instrumento
                    :id="item.id"
                    @click="getInstrumentos"
                  />
                </v-row>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Filtro from '@/components/public/Filtro';
import EditarInstrumento from "~/components/common/EditarInstrumento.vue";
import EliminarInstrumento from "~/components/common/EliminarInstrumento.vue";
import axios from '~/plugins/axios'
import Cookies from 'js-cookie'
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import AgregarInstrumento from "~/components/common/AgregarInstrumento.vue";
import { mapState } from 'vuex';

export default {
  middleware: 'NOAUTH',
  components: {
    Filtro,
    EditarInstrumento,
    EliminarInstrumento,
    AgregarInstrumento
  },
  data: () => ({
       intrumentoRefresh:{
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
        is_patron: false,
        encargado_calibracion: Cookies.get('user_id')
      },
    desde: null,
    hasta: null,
    instrumento_id:null,
    token: Cookies.get('token'),
    benched: 0,
    items: [],
    itemsSelected: [],
    loading: false,
    options: {},
    totalTableItems: 0,
    txtBuscar: '',
    filtroTree: undefined,
    listRutas: [],
    dialog: false,
    dialogDelete: false,
    editedIndex: -1,
   
    headers: [
      { text: 'Equipo', value: 'tag', align: 'start' },
      { text: 'Serie', value: 'serie', align: 'center' },
      { text: 'Marca', value: 'marca', align: 'center' },
      { text: 'Modelo', value: 'modelo', align: 'center' },
      { text: 'Estado', align: 'center', value: 'estado_name' },
      { text: 'Rango de', align: 'center', value: 'rango_de' },
      { text: 'Rango a', align: 'center', value: 'rango_a' },
      { text: 'Rango norm. de', align: 'center', value: 'rango_normal_de' },
      { text: 'Rango norm. a', align: 'center', value: 'rango_normal_a' },
      { text: 'Resolución', align: 'center', value: 'resolucion' },
      { text: 'Tolerancia', align: 'center', value: 'tolerancia' },
      { text: 'Tipo', align: 'center', value: 'tipo_name' },
      { text: 'Unidad', align: 'center', value: 'unidad' },
      { text: 'Magnitud', align: 'center', value: 'magnitud' },
      { text: 'Encargado', align: 'center', value: 'empresa' },
      { text: 'Creado', align: 'center', value: 'created_at' },
      { text: 'Actualizado', align: 'center', value: 'updated_at' },
      { text: 'Acciones', value: 'acciones', sortable: false, align: 'start' }
    ],
    tableData: [],
  }),
  computed: {
    ...mapState(['rolUser']),

    isRolUser(){    
      if(this.rolUser == 0){
        return true
      }
      return false
    }
  },
  methods: {
    async getInstrumentos() {
      try {
        this.loading = true;
        await axios
          .get('instrumentos', {
            headers: { Authorization: `Bearer ${this.token}`} , params:{ desde: this.desde, hasta: this.hasta, options: this.options, buscar: this.txtBuscar, isPatron: false } ,
          })
          .then((res) => {
            this.totalTableItems = res.data.total;
            this.tableData = res.data.data.data;
            this.loading = false;
          })
      } catch (error) {
        console.log(error)
      }
    },
    

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

    async limpiarFiltros () {
      this.desde = null;
      this.hasta = null;
      this.txtBuscar = '';
      this.$refs.Filtro.click();
      this.getInstrumentos();
    },

    async filterByDate(desde, hasta){
      this.desde = desde;
      this.hasta = hasta;
      this.getInstrumentos()
    },
     DescargaCSV(){
      let csvContent = "data:text/csv;charset=utf-8,";
      
       csvContent += [
        Object.keys(this.tableData[0]).join(";"),
        ...this.tableData.map((item) => Object.values(item).join(";")),
      ]
        .join("\n")
        .replace(/(^\[)|(\]$)/gm, "");

      const data = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", data);
      link.setAttribute("download", "plantilla.csv");
      link.click();
    }
  },
  watch: {
    options: {
      handler () {
        this.getInstrumentos();
      },
      deep: true,
    }
  },
  mounted(){
      this.getInstrumentos()
  } 
  
}
</script>

<style>
</style>