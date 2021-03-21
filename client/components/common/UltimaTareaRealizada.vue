<template>
  <v-icon small @click="evento">
    mdi-download
  </v-icon>
</template>

<script>
export default {
  methods: {
    evento() {
      this.$emit('click');
    }
  }
}
</script>

<style>
</style>