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
      <app-dialog :disabled="isLoggedUser" title="Delete" @onConfirm="onDeleteUser(user.id)">
        Selected User will be deleted permanently.
        Do you want to delete the user?
      </app-dialog>
    </v-card-actions>
    <v-icon
      v-if="isLoggedUser || isRootUser"
      v-pin="{top:'1px', right:'-2px'}"
      :color="cardMarkerVariant"
      dark
    >
      {{ cardMarker }}
    </v-icon>
  </v-card>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import AppDialog from './app-dialog.vue';

// cistom directives local usage
import pinDirective from '../directives/pin.directive';

export default {
  name: 'UserCard',
  directives: { pin: pinDirective },
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
      cardMarker: 'mdi-clippy',
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
    isLoggedUser() {
      return this.user.id === this.loggedUserId;
      // return this.user.id === this.$store.getters.loggedUserId;
    },
    isRootUser() {
      return this.user.email === process.env.VUE_APP_ROOT_USER_EMAIL;
    },
    cardMarkerVariant() {
      return this.isLoggedUser ? 'primary' : 'grey';
    },
  },
};
</script>

<style>
</style>
