<template>
  <v-container fluid>
    <page-header msg="Welcome to User Management"/>

    <v-card width="400" class="mx-auto mt-5" data-test-id="landing-card">
      <v-card-title>
        <h2 class="mx-auto display-1 blue--text text--darken-4">App Description</h2>
      </v-card-title>
      <v-card-text>
        <blockquote class="blockquote text-center">
          It's a basic Single Page application <br>
          with Google Firebase authentication
        </blockquote>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions v-if="!isLoggedIn">
        <v-spacer></v-spacer>
        <v-btn color="info" to="/login" data-test-id="login-button">Login</v-btn>
      </v-card-actions>
    </v-card>

    <page-footer/>
  </v-container>
</template>

<script>
import PageHeader from '@/components/page-header.vue';
import PageFooter from '@/components/page-footer.vue';

export default {
  name: 'Landing',
  components: {
    PageHeader,
    PageFooter,
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
  },
};
</script>
