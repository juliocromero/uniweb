<template>
<div>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title class="headline blue darken-4 white--text">
          Eliminar Sector
        </v-card-title>

        <v-card-subtitle class="mt-5 Subtitle 1">
            <strong><h3>¿Está seguro de que desea eliminar este Sector.?</h3></strong>
        </v-card-subtitle>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="dialog=false">
            Cancelar
          </v-btn>
          <v-btn color="blue darken-1" text >
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
    props: {
        sector: {
            type: Object,
            default: false
        },
        sectorModal:{
            type: Boolean
        }
    },
    data:() =>({
    dialog: false
    })

}
</script>

<style>

</style>