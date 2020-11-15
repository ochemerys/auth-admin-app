<template>
  <v-app>
    <top-nav-bar/>

    <v-main>
      <router-view/>
    </v-main>

    <app-snacbar/>
  </v-app>

</template>

<script>
import TopNavBar from '@/components/top-nav-bar.vue';
import AppSnacbar from './components/app-snackbar.vue';

// console.log('$auth', this.$auth);

export default {
  name: 'App',
  components: {
    TopNavBar,
    AppSnacbar,
  },
  data() {
    return {
      isHydrated: false,
    };
  },
  computed: {
    breakpoint() { // just an example, could be one specific value if that's all we need
      return this.isHydrated
        ? this.$vuetify.breakpoint
        : { // "empty" $breakpoint object with initial values
          xs: true,
          xsOnly: true,
          xsAndUp: false,
          sm: true,
          smOnly: true,
          smAndDown: true,
          smAndUp: false,
          md: false,
          mdOnly: false,
          mdAndDown: false,
          mdAndUp: false,
          lg: false,
          lgOnly: false,
          lgAndDown: false,
          lgAndUp: false,
          xl: false,
          xlOnly: false,
          xlAndDown: false,
        };
    },
  },
  mounted() {
    this.isHydrated = true;
  },
};
</script>

<style>
</style>
