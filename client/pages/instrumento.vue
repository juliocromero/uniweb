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

                  <agregar-instrumento @click="getInstrumentos" :intrumento='intrumentoRefresh'/>
                </v-toolbar>
              </template>

              <template v-slot:[`item.acciones`]="{ item }">
                <v-row class="d-flex justify-center">
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
      { text: 'Estado', align: 'start', value: 'estado_name' },
      { text: 'Rango de', value: 'rango_de' },
      { text: 'Rango a', value: 'rango_a' },
      { text: 'Rango norm. de', value: 'rango_normal_de' },
      { text: 'Rango norm. a', value: 'rango_normal_a' },
      { text: 'Resolución', value: 'resolucion' },
      { text: 'Tolerancia', value: 'tolerancia' },
      { text: 'Tipo', value: 'tipo_name' },
      { text: 'Unidad', value: 'unidad' },
      { text: 'Magnitud', value: 'magnitud' },
      { text: 'Encargado', value: 'empresa' },
      { text: 'Creado', value: 'created_at' },
      { text: 'Actualizado', value: 'updated_at' },
      { text: 'Acciones', value: 'acciones', sortable: false, align: 'start' }
    ],
    tableData: [],
  }),
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