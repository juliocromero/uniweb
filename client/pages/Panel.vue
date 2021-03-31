<template>
  <div>
     <div>
    <v-container>
    <v-tabs
      v-model="tab"
      background-color="transparent"
      dense
      icons-and-text
      centered
      next-icon="arrow_forward_ios"
      prev-icon="arrow_back_ios"
      show-arrows
    >
      <v-tab href="#tab-1">
        Unidad
        <v-icon>build</v-icon>
      </v-tab>
      <v-tab href="#tab-2" >
        Magnitud
        <v-icon>build</v-icon>
      </v-tab>
      <v-tab href="#tab-3" >
        Tipo Calibración
        <v-icon>build</v-icon>
      </v-tab>
       <v-tab href="#tab-4" >
        Tipo Instrumento
        <v-icon>build</v-icon>
      </v-tab>
      <v-tab href="#tab-5">
        Usuarios
        <v-icon>people_alt</v-icon>
      </v-tab>
    </v-tabs>

    </v-container>
    
    <v-tabs-slider></v-tabs-slider>

    <v-tabs-items v-model="tab">
      <v-tab-item
        v-for="i in 5"
        :key="i"
        :value="'tab-' + i"
      >
        <v-card flat>
         <unidad
          v-if="i==1" 
          ref="Unidad"
          />

          <magnitud 
          v-if="i==2" 
          ref="Magnitud"
          />
          <tipo-calibracion 
          v-if="i==3" 
          ref="TipoCalibracion"
          />
          <instrumento-tipo 
          v-if="i==4" 
          ref="InstrumentoTipo"
          />
          <users-table 
          v-if="i==5"
          ref="UsersTable"
          />

        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </div>
    
  </div>
</template>

<script>
import UsersTable from '~/components/common/Usuario/users_table.vue';
import Magnitud from "~/components/common/Magnitud/Magnitud.vue";
import Unidad from "~/components/common/Unidad/Unidad.vue";
import InstrumentoTipo from "~/components/common/TipoInstrumento/InstrumentoTipo.vue";
import TipoCalibracion from "~/components/common/TipoCalibracion/TipoCalibracion.vue";
import 'material-design-icons-iconfont/dist/material-design-icons.css'
export default {
 middleware: 'NOAUTH',
  components: {
    UsersTable,
    Magnitud,
    Unidad,
    InstrumentoTipo,
    TipoCalibracion
    
  },
  data: () => ({
   
     tab: null,
  }),
     methods: {
   
  },
}
</script>

<style>

</style>