<template>
  <div class="d-flex justify-start">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              depressed
              x-small
              height="30"
              color="info"
              v-bind="attrs"
              v-on="on"
              @click="show"
            >
              <v-icon>folder</v-icon>
            </v-btn>
          </template>
          <span>Archivos</span>
        </v-tooltip>
     <v-dialog v-model="dialog" width="500">
          <v-card>
            <v-card-title class="headline white--text blue darken-4">
              Archivos
            </v-card-title>
            <v-card-text>
              <v-form ref="form" lazy-validation v-model="valid">
                <v-container>
                    <h1>sfsdfd</h1>
                </v-container>
              </v-form>
            </v-card-text>
          </v-card>
     </v-dialog>  
</div>                    
</template>   

<script>
import axios from '~/plugins/axios';
import Cookies from 'js-cookie';
export default {
 props:{
    equipo:{
      type: Object,
      required: true
    },
  },
  data() {
      return {
           manual:false,
      valid:false,
      token: Cookies.get('token'),
      dialog: false,
      alertMsg:"",
      alerType:"",
      }
  }
}
</script>

<style>

</style> 