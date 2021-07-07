<template>
  <v-card color="grey lighten-4"
          flat
          height="30px"
          tile>
    <v-toolbar dense>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <v-toolbar-title>Safetee Call</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn text to="/home">HOME</v-btn>
        <v-btn text to="/urgencies">URGENCIES</v-btn>
      </v-toolbar-items>
      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-toolbar>
  </v-card>
</template>

<script>
export default {
  name: "nav-bar"
}
</script>

<style scoped>

</style>