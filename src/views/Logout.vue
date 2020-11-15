<template>
  <!-- empty template to get rid off -->
  <span></span>
</template>

<script>
export default {
  name: 'Logout',
  async created() {
    await this.$store.dispatch('AUTH_LOGOUT', null);
    this.$router.push('/');
  },
};
</script>
