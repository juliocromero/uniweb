<template>
  <div>
        <v-icon 
        @click="evento">
          mdi-download
        </v-icon>
  </div>
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