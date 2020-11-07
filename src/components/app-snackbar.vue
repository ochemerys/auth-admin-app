<template>
  <v-snackbar
    v-model="show"
    multi-line
    right
    bottom
    :timeout="6000"
    :color="variant"
  >
    {{message}}
    <template v-slot:action="{ attrs }">
      <v-btn
        text
        v-bind="attrs"
        @click.native="show = false"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  name: 'AppSnackbar',
  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'UPDATE_SNACKBAR') {
        this.message = state.snackbar.message;
        this.variant = state.snackbar.variant;
        this.show = state.snackbar.show;
      }
    });
  },
  data() {
    return {
      show: false,
      message: '',
      variant: '',
    };
  },
};
</script>
