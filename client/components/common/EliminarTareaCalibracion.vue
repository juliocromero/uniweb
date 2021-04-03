<template>
  <div>
     <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon 
            small 
            @click="dialog=true"
            v-bind="attrs"
            v-on="on"
            > 
              mdi-delete 
              </v-icon>
          </template>
          <span>Eliminar Tarea</span>
        </v-tooltip>
    
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title class="headline blue darken-4 white--text">
          Eliminar Tarea
        </v-card-title>

        <v-card-subtitle class="mt-5 Subtitle 1">
            <strong><h3>¿Está seguro de que desea eliminar la tarea de calibración N° {{id}}?</h3></strong>
        </v-card-subtitle>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="dialog=false">
            Cancelar
          </v-btn>
          <v-btn color="blue darken-1" text @click="deleteItem">
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Modal msj una vez Eliminado-->
    <v-dialog
      v-model="dialogEliminado"
      persistent
      max-width="400">
      <v-card>
        <v-card-title class="headline">
          <v-alert width="380" outlined type="success"> 
            Se ha eliminado la tarea
          </v-alert>
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="hide"
          >
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <loading :tag="`Eliminando...`"/>

  </div>
</template>

<script>
import axios from '~/plugins/axios'
import Cookies from 'js-cookie'
import { mapMutations } from "vuex";
import Loading from "~/components/common/Loading.vue";
export default {
  components:{
    Loading
  },
  props:{
    id:{
    type: Number,
    required:true
    }
  },
  data(){
    return{
      dialog:false,
      dialogEliminado:false,
    }
  },
  methods:{
   ...mapMutations(['toggleLoading']),
    async deleteItem() {
      const token = Cookies.get('token');
      this.toggleLoading(true);

      try {
        await axios.delete(`tarea-calibracion/${this.id}`, {
          headers: { Authorization: `Bearer ${token}`
          },
        })
        .then(()=>{
          this.dialog = false;
          this.toggleLoading(false);
          this.dialogEliminado = true;
        });
      } catch (error) {
        this.toggleLoading(false);
        console.log('Error Eliminar Item:', error);
        alert(error.response.data.message)
      }
    },
    hide(){
      this.dialogEliminado = false;
      this.$emit('click');
    }
  }
}
</script>

<style>
</style>