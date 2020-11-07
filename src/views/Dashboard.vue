<template>
  <v-container>
    <page-header msg="List of Users"/>
    <users-list/>
    <v-btn
      class="mt-16"
      top
      right
      color="info"
      dark
      fab
      fixed
      to="/profile"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <page-footer/>
  </v-container>
</template>

<script>
import PageHeader from '../components/page-header.vue';
import PageFooter from '../components/page-footer.vue';
import UsersList from '../components/users-list.vue';

export default {
  name: 'Home',
  components: {
    PageHeader,
    UsersList,
    PageFooter,
  },
};
</script>
