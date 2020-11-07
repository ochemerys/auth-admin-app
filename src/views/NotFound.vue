<template>
  <v-container fluid>
    <page-header msg="ERROR"/>

    <v-card width="400" class="mx-auto mt-5" data-test-id="landing-card">
      <v-card-title>
        <h2 class="mx-auto display-1 blue--text text--darken-4">Page not found</h2>
      </v-card-title>
    </v-card>

    <page-footer/>
  </v-container>
</template>
<script>
import PageHeader from '@/components/page-header.vue';
import PageFooter from '@/components/page-footer.vue';

export default {
  name: 'NotFound',
  components: {
    PageHeader,
    PageFooter,
  },
};
</script>
