<template>
  <v-sheet :height="sheetProps.hight">
    <v-container class="fill-height">
      <v-row align="center" justify="center">
        <h1 class="text-center" :class="sheetProps.display">{{msg}}</h1>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script>
export default {
  name: 'PageHeader',
  props: { msg: String },
  computed: {
    sheetProps() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return { display: 'display-1', height: '100px' };
        case 'sm': return { display: 'display-2', height: '200px' };
        case 'md': return { display: 'display-2', height: '200px' };
        case 'lg': return { display: 'display-2', height: '200px' };
        case 'xl': return { display: 'display-3', height: '250px' };
        default: return { display: 'display-2', height: '200px' };
      }
    },
  },
};
</script>

<style>
</style>
