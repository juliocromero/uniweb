<template>
  <v-app dark>
    <v-navigation-drawer
      
       v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      
      app
    >

      <v-list>       
        <v-list-item class="menuUser pointer" @click="drawer=false" to="/">
          <v-list-item-title>
            <v-icon left color="#295382" align="center" >list</v-icon>
            Equipos
          </v-list-item-title>
        </v-list-item>
        <v-list-item class="menuUser pointer" @click="drawer=false" to="/instrumento">
          <v-list-item-title>
            <v-icon left color="#295382" align="center" >build</v-icon>
            Instrumentos
          </v-list-item-title>
        </v-list-item>         
        <v-list-item class="menuUser pointer" @click="drawer=false" to="/instrumentos-patron">
          <v-list-item-title>
            <v-icon left color="#295382" align="center" >build</v-icon>
            Instrumentos patrón
          </v-list-item-title>
        </v-list-item>         
      </v-list>

    
      <password/>
    </v-navigation-drawer>

<v-app-bar :clipped-left="clipped" fixed app color="#295382">
      <v-app-bar-nav-icon dark @click.stop="drawer = !drawer" />
      <!--<v-btn dark icon><v-icon  @click.stop="drawer = !drawer">list</v-icon></v-btn>-->
      
      <v-spacer />
<div style="margin-right: 10px; color: white">{{userName}} [{{userEmpresa}}]</div>
<v-menu bottom left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn dark icon v-bind="attrs" v-on="on">
            <v-img max-width="40px" max-height="40px" src="user2.png" />
          </v-btn>
        </template>
       <v-list >
          <v-list-item class="menuUser pointer" @click="toggleDialogPassword(true)" >
            <v-list-item-title  >
              <v-icon left color="#295382" align="center" >lock</v-icon>
              Cambiar contraseña
            </v-list-item-title>
          </v-list-item>
           <v-list-item  v-if="isRolUser" class="menuUser poiter" to="/Panel" >
            <v-list-item-title>
              <v-icon left color="#295382" >settings</v-icon>
              Panel de control
            </v-list-item-title>
          </v-list-item>
          <v-list-item class="menuUser poiter" @click="SET_DESLOGIN()">
            <v-list-item-title>
              <v-icon left color="#295382" >west</v-icon>
              Salir
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-main>
        <nuxt />
    </v-main>
    <v-app-bar :bottom="true" :fixed="true">
      <v-row>
        <v-col>
          <v-img
          max-height="80"
          max-width="120"
          alt="PX Control"
          src="/logo.png"
        ></v-img>
        </v-col>
         <v-col class="d-flex justify-end">
          <v-img
          max-height="80"
          max-width="120"
          alt="PX Control"
          src="/logo.png"
        ></v-img>
        </v-col>
      </v-row>
    </v-app-bar>
    <passwordDialog :dialog="dialog" @closeModal="toggleDialogPassword"/>
  </v-app>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import passwordDialog from "@/components/public/cambiarPassword";
import Cookies from 'js-cookie'

export default {
  components:{
    passwordDialog
  },
  data() {
    return {
      dialog: false,
      clipped: true,
      drawer: false,
      fixed: false,
      userName: Cookies.get('user_name'),
      userRol: Cookies.get('user_rol'),
      userEmpresa: Cookies.get('user'),
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/',
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire',
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js',
    }
  },
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
    ...mapMutations(["SET_DESLOGIN"]),
    toggleDialogPassword(val){
      this.dialog = val
    }
  },
}
</script>

<style scoped>
a {  
  text-decoration: none;
  color:rgb(0, 0, 0, 0.87);
  }
.menuUser:hover{
 background: rgb(189, 189, 189);
  
}
.pointer {cursor: pointer;}
</style>