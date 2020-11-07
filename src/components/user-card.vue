<template>
  <v-card outlined width="300" class="mx-auto mt-1">
    <v-card-title>
      <h3 display-1>{{user.displayName}}</h3>
    </v-card-title>
    <v-card-subtitle>
      <h4 display-1>{{user.email}}</h4>
    </v-card-subtitle>
    <v-card-text>
      Role: {{ user.role }}
    </v-card-text>
    <v-card-actions>
      <v-btn color="success" outlined :to="`/profile/${user.id}`">
        <v-icon left small>mdi-plus</v-icon>
        Edit
      </v-btn>
      <v-spacer></v-spacer>
      <app-dialog :disabled="isDeleteDisabled" title="Delete" @onConfirm="DELETE_USER(user.id)">
        Selected User will be deleted permanently.
        Do you want to delete the user?
      </app-dialog>
    </v-card-actions>
  </v-card>
</template>

<script>
import AppDialog from './app-dialog.vue';

export default {
  name: 'UserCard',
  components: {
    AppDialog,
  },
  props: {
    user: Object,
  },
  data() {
    return {
    };
  },
  methods: {
    async DELETE_USER(userId) {
      try {
        this.$store.dispatch('DELETE_USER', { userId });
        this.$store.commit(
          'UPDATE_SNACKBAR', { variant: 'success', message: 'Success! User is deleted successfully.' },
        );
      } catch (err) {
        this.$store.commit(
          'UPDATE_SNACKBAR', { variant: 'error', message: `Error: ${err.message}` },
        );
      }
    },
    // getUserRolesString(userRoles) {
    //   let str = '';
    //   const roleCount = userRoles.length;
    //   userRoles.forEach((role, idx) => {
    //     str += role;
    //     if (idx < roleCount - 1) {
    //       str += '; ';
    //     }
    //   });
    //   return str;
    // },
  },
  computed: {
    isDeleteDisabled() {
      return this.user.id === this.$store.getters.loggedUserId;
    },
  },
};
</script>

<style>
</style>
