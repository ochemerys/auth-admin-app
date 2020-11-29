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
      <app-dialog :disabled="isDeleteDisabled" title="Delete" @onConfirm="onDeleteUser(user.id)">
        Selected User will be deleted permanently.
        Do you want to delete the user?
      </app-dialog>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import AppDialog from './app-dialog.vue';

export default {
  name: 'UserCard',
  components: {
    AppDialog,
  },
  props: {
    user: {
      type: Object,
      required: true,
      validation: (value) => 'id' in value && 'displayName' in value && 'email' in value && 'role' in value,
    },
  },
  data() {
    return {
    };
  },
  methods: {
    ...mapActions({ deleteUser: 'DELETE_USER' }),
    ...mapMutations({ updateSnackbar: 'UPDATE_SNACKBAR' }),
    async onDeleteUser(userId) {
      try {
        this.deleteUser({ userId });
        // this.$store.dispatch('DELETE_USER', { userId });
        this.updateSnackbar({ variant: 'success', message: 'Success! User is deleted successfully.' });
        // this.$store.commit(
        //   'UPDATE_SNACKBAR', {
        //     variant: 'success',
        //     message: 'Success! User is deleted successfully.'
        //   },
        // );
      } catch (err) {
        this.updateSnackbar({ variant: 'error', message: `Error: ${err.message}` });
        // this.$store.commit(
        //  'UPDATE_SNACKBAR', { variant: 'error', message: `Error: ${err.message}` },
        // );
      }
    },
  },
  computed: {
    ...mapGetters(['loggedUserId']),
    isDeleteDisabled() {
      return this.user.id === this.loggedUserId;
      // return this.user.id === this.$store.getters.loggedUserId;
    },
  },
};
</script>

<style>
</style>
