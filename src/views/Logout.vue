<template>
  <!-- empty template to get rid off -->
  <span></span>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'Logout',
  async created() {
    await this.logout(null);
    // await this.$store.dispatch('AUTH_LOGOUT', null);
    this.$router.push('/');
  },
  methods: {
    ...mapActions({ logout: 'AUTH_LOGOUT' }),
  },
};
</script>
