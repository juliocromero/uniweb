<template>
<v-container>
          <v-card>
            <v-container>
          <v-data-table
              :headers="headers"
              :items="tableData"
              :options.sync="options"
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
                    @keyup.enter="date"
                    v-model="txtBuscar"
                  ></v-text-field>

                  <v-spacer></v-spacer>
                  <agregar-tipo-instrumento @click="TipoInstrumento"/>
                </v-toolbar>
              </template>

              <template v-slot:[`item.tag`]="{ item }">
                <nuxt-link :to="`detalle_equipo/${item.id}`" :exact="true">
                  <v-tooltip right>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        fab
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
              <template v-slot:[`item.acciones`]="{ item }">
                <v-row class="d-flex ">
                  <edit-tipo-instrumento
                    :id="item.id"
                    class="mr-2"
                    @click="TipoInstrumento"
                  />
                  <delete-tipo-instrumento
                    :id="item.id"
                    @click="TipoInstrumento"
                  />
                </v-row>
              </template>
            </v-data-table>
            </v-container>
          </v-card>
</v-container>
   
</template>

<script>
import Cookies from 'js-cookie'
import axios from '~/plugins/axios'
import AgregarTipoInstrumento from "~/components/common/TipoInstrumento/AgregarTipoInstrumento.vue";
import DeleteTipoInstrumento from "~/components/common/TipoInstrumento/DeleteTipoInstrumento.vue";
import EditTipoInstrumento from "~/components/common/TipoInstrumento/EditTipoInstrumento.vue";
import 'material-design-icons-iconfont/dist/material-design-icons.css'
export default {
 middleware: 'NOAUTH',
  components: {
      AgregarTipoInstrumento,
      EditTipoInstrumento,
      DeleteTipoInstrumento
    
  },
  data: () => ({
    token: Cookies.get('token'),
    benched: 0,
     tab: null,
    items: [],
    itemsSelected: [],
    
    loading: false,
    options: {},
    txtBuscar: '',
    filtroTree: undefined,
    listRutas: [],
    dialog: false,
    dialogDelete: false,
    editedIndex: -1,
   
    headers: [
      { text: 'N°', align: 'start', value: 'id' },
      { text: 'Nombre', value: 'nombre' },
      { text: 'Acciones', value: 'acciones', sortable: false, align: 'start' },
    ],
    tableData: [],
  }),
     methods: {
    async TipoInstrumento() {
      try {
        await axios
          .get('instrumentoTipo', {
            headers: { Authorization: `Bearer ${this.token}` },
          })
          .then((res) => {
            this.tableData = res.data.data;
          })
      } catch (error) {
        console.log(error)
      }
    },
  },
   mounted(){
      this.TipoInstrumento()
  } 
}
</script>

<style>

</style>