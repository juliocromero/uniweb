<template>
<div>
    <v-dialog v-model="dialog" max-width="500px" @click:outside="closeModal">
      <v-card>
        <v-card-title class="headline blue darken-4 white--text">
          Eliminar Sector
        </v-card-title>

        <v-card-subtitle class="mt-5 Subtitle 1">
            <strong>
              <div v-if="!inDeleteSector.children">
                <h3>¿Está seguro de que desea eliminar este Sector {{inDeleteSector.name}}.?</h3>
              </div>
              <div v-else>
                <h3>¿Está seguro de que desea eliminar este Sector {{inDeleteSector.name}}?
                  Tiene elementos dentro: <span v-for="(item, index) in inDeleteSector.children" :key="index">{{ item.name + ', '}}</span>
                </h3>
              </div>
              <div v-if="alertShow">
                <v-alert
                    dense
                    text
                    :type="alertType"
                    class="mx-4"
                  >
                    {{alertMsg}}
                </v-alert>
              </div>
              
              </strong>
            
        </v-card-subtitle>

        <v-card-actions>
          
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="closeModal">
            Cancelar
          </v-btn>
          <v-btn color="blue darken-1" text @click="deleteSector">
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from '@/plugins/axios'
import Cookies from 'js-cookie'

export default {
    props: {
        sector: {
            type: Object,
            default: () => {}
        },
        sectorModal:{
            type: Boolean,
            default: false
        }
    },
    data:() =>({
      token: Cookies.get('token'),
      alertMsg:"",
      alertType:"",
      alertShow:false,
    }),
    watch:{
      sectorModal(newVal,oldVal){
        if(newVal){
          this.alertShow = false
        }
      }
    },
    computed:{
      inDeleteSector(){
        return this.sector
      },
      dialog(){
        return this.sectorModal
      }
    },
    methods:{
      closeModal(){
        this.$emit('input', false)
      },
      async deleteSector(){
        try {
          await axios.delete(`sector/${this.inDeleteSector.id}`, 
          { headers: { Authorization: `Bearer ${this.token}` },})
            .then(res => {
              console.log(res)
              this.closeModal()
              this.alertMsg = `Sector agregado exitosamente`;
              this.alertType = 'success';
              this.alertShow = true;
              this.$emit('deleteOk')
            })
        } catch (error) {        
          if(this.inDeleteSector.children){             
            this.alertMsg = `Este sector tiene elementos no se puede eliminar`;
            this.alertType = 'error';
            this.alertShow = true;      
          }else{                       
            this.alertMsg = `Hubo un error durante el proceso`;
            this.alertType = 'error';
            this.alertShow = true;  
          }   
        }    
      }
    }

}
</script>

<style>

</style>