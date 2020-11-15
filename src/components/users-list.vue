<template>
  <v-container mb-8>
    <v-row>
      <v-col sm="10" offset-sm="1" lg="8" offset-lg="2">
        <v-row>
          <v-col sm="6" md="4" v-for="user in activeUsers" :key="user.id">
            <user-card :user="user"/>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import UserCard from './user-card.vue';

export default {
  name: 'UsersList',
  components: {
    UserCard,
  },
  data() {
    return {
    };
  },
  methods: {
  },
  computed: {
    activeUsers() {
      return this.$store.getters.activeUsers;
    },
  },
};
</script>

<style>
</style>
