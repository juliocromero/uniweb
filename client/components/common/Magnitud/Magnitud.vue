<template>
<v-container>
          <v-card max-width="600px">
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
                  <agregar-magnitud @click="getMagnitud"/>
                </v-toolbar>
              </template>
              <template v-slot:[`item.acciones`]="{ item }">
                <v-row class="d-flex align-start">
                  <edit-magnitud
                    :id="item.id"
                    class="mr-2"
                    @click="getMagnitud"
                  />
                  <delete-magnitud
                    :id="item.id"
                    @click="getMagnitud"
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
import AgregarMagnitud from "~/components/common/Magnitud/AgregarMagnitud.vue";
import EditMagnitud from "~/components/common/Magnitud/EditMagnitud.vue";
import DeleteMagnitud from "~/components/common/Magnitud/DeleteMagnitud.vue";
import 'material-design-icons-iconfont/dist/material-design-icons.css'
export default {
 middleware: 'NOAUTH',
  components: {
      AgregarMagnitud,
      EditMagnitud,
      DeleteMagnitud
    
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
    async getMagnitud() {
      try {
        await axios
          .get('Magnitud', {
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
      this.getMagnitud()
  } 
}
</script>

<style>

</style>