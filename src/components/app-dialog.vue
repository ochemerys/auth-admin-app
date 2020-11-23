<template>
  <v-dialog v-model="dialog" persistent max-width="320">
    <template v-slot:activator="{ on, attrs }">
      <v-btn :disabled="disabled" color="error" outlined v-bind="attrs" v-on="on">
        <v-icon left small>mdi-minus</v-icon>
        {{ title }}
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="headline">{{ title }} Confirmation</v-card-title>
      <v-card-text>
        <slot></slot>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="green darken-1"
          text
          @click="onConfirmClick"
        >
          OK
        </v-btn>
        <v-btn color="gray darken-1" text @click="dialog = false">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'AppDialog',
  props: {
    title: {
      type: String,
      required: true,
      validation: (value) => value.length > 0,
    },
    disabled: Boolean,
  },
  data() {
    return {
      dialog: false,
    };
  },
  methods: {
    onConfirmClick() {
      this.dialog = false;
      this.$emit('onConfirm');
    },
  },
};
</script>

<style>
</style>
