<template>
<v-container class="d-flex justify-center">
          <v-card max-width="1000px">
          
            <v-divider></v-divider>
        <v-container class="pt-0">
            <v-data-table
              :headers="headers"
              :items="tableData"
              :options.sync="options"
              :loading="loading"
              :search="txtBuscar"
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
                    
                    v-model="txtBuscar"
                  ></v-text-field>

                  <v-spacer></v-spacer>
                  <agregar-usuario @click="getUser"/>
                </v-toolbar>
              </template>

              <template v-slot:[`item.avisos`]="{ item }">
                      <v-checkbox
                        v-model="item.avisos"
                        color="info"
                        hide-details
                        disabled
                      ></v-checkbox>
              </template>

              <template v-slot:[`item.acciones`]="{ item }">
                <v-row class="d-flex justify-center">
                  <editar-usuario
                    :id="item.id"
                    class="mr-2"
                    @click="getUser"
                  />
                  <eliminar-usuario
                    :id="item.id"
                    @click="getUser"
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
import AgregarUsuario from "~/components/common/AgregarUsuario.vue";
import EliminarUsuario from "~/components/common/EliminarUsuario.vue";
import EditarUsuario from "~/components/common/EditarUsuario.vue";
import 'material-design-icons-iconfont/dist/material-design-icons.css'
export default {
 middleware: 'NOAUTH',
  components: {
      AgregarUsuario,
      EditarUsuario,
      EliminarUsuario
    
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
      { text: 'Nombre', align: 'start', value: 'nombre' },
      { text: 'Apellido', value: 'apellido' },
      { text: 'Email', value: 'email' },
      { text: 'Avisos', value: 'avisos'},
      { text: 'Empresa', value: 'empresa' },
      { text: 'Rol', value: 'rol_name' },
      { text: 'Creado', value: 'created_at' },
      { text: 'Acciones', value: 'acciones', sortable: false, align: 'start' },
    ],
    tableData: [],
  }),
     methods: {
    async getUser() {
      try {
        await axios
          .get('User', {
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
      this.getUser()
  } 
}
</script>

<style>

</style>