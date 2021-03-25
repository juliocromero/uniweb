<template>
  <v-container>
    <v-row style="background:#F9F9F9">
      <v-col md="4">
        <v-menu
          ref="menu1"
          v-model="menu1"
          :close-on-content-click="true"        
          transition="scale-transition"
          offset-y
          width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              class="date-filter"
              v-model="date1"
              label="Desde"
              prepend-inner-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
              hide-details
              outlined
              dense
              color="primary"
              background-color="white"
            ></v-text-field>
          </template>
            <v-date-picker v-model="date1" no-title scrollable>
    <!--                     <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menu1 = false">
                Cancel
              </v-btn>
              <v-btn text color="primary" @click="$refs.menu1.save(date1)">
                OK
              </v-btn> -->
            </v-date-picker>
        </v-menu>
      </v-col>

      <v-col  md="4">
        <v-menu
          ref="menu2"
          v-model="menu2"
            class="picker"
          :close-on-content-click="true"
          transition="scale-transition"
          offset-y
          width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              class="date-filter"
              v-model="date2"
              label="Hasta"
              prepend-inner-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
              hide-details
              outlined
              dense
              color="primary"
              background-color="white"
            ></v-text-field>
          </template>
          <v-date-picker v-model="date2" no-title scrollable>
<!--                     <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menu2 = false">
              Cancel
            </v-btn>
            <v-btn text color="primary" @click="$refs.menu2.save(date2)">
              OK
            </v-btn> -->
          </v-date-picker>
        </v-menu>
      </v-col>

      <v-col  md="4" class="d-flex" v-if="!home" > 
        <v-btn color="grey darken-1" outlined height="40" width="40px" @click="filtrar">
          <div class="text-button-filter">
            <v-icon>filter_list</v-icon>
          </div>
        </v-btn>
      </v-col>
      <v-col v-if="home" md="4" class="" > 
        <v-btn color="grey darken-1" outlined height="40" width="100%" @click="filtrar">
          <div class="d-flex align-center">
            <v-icon>refresh</v-icon>
            <div>Aplicar Filtro</div>
          </div>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import moment from 'moment'
export default {
  props:{
    home: {
      type: Boolean,
      default: false
    }
  },
  middleware: 'NOAUTH',
  layout: 'custom',
  data: () => ({
    date2: new Date().toISOString().substr(0, 10),
    date1: new Date().toISOString().substr(0, 10),
    menu2: false,
    menu1: false,
  }),

  created() {
    this.date1="";
    this.date2="";
  },
  computed:{
    filtro(){
      return this.home
    }
  },
  methods: {
    click(){
      this.date1="";
    this.date2="";
    },
    formatDate(date) {
      return moment(date).format('YYYY-MM-DD HH:mm')
    },
    filtrar(){
      this.$emit('click', this.date1, this.date2);
    }
  }
}
</script>

<style  scoped>
.panel-filtro {
  height: 80px;
  margin-top: 40px;
}
.text-button-filter{
      width: 100%;
    white-space: initial;
    text-overflow: ellipsis;
    overflow: inherit;
}
.date-picker-filter{
  max-width: 100%
}
.date-filter{
  max-width: 280px;
}
</style>