<template>
  <v-container>
    <page-header msg="Login" />
    <v-card width="400" class="mx-auto mt-5">
      <!-- <v-card-title>
        <h1 class="mx-auto display-1 blue--text text--darken-4">Login</h1>
      </v-card-title> -->
      <v-card-text>
        <v-form ref="form" lazy-validation>
          <v-text-field
            type="email"
            v-model="userEmail"
            label="User Email"
            prepend-icon="mdi-account-circle"
            :rules="[rules.required, rules.email]"
            required/>
          <v-text-field
            :type="showPassword ? 'text': 'password'"
            v-model="userPassword"
            label="Password"
            prepend-icon="mdi-lock"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword=!showPassword"
            :rules="[rules.required]"
            required/>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="info" @click="submitForm">Login</v-btn>
        <v-btn color="default" @click="onCancel">Cancel</v-btn>
      </v-card-actions>
    </v-card>
    <page-footer/>
  </v-container>
</template>

<script>
import PageHeader from '../components/page-header.vue';
import PageFooter from '../components/page-footer.vue';

export default {
  name: 'Login',
  components: {
    PageHeader,
    PageFooter,
  },
  created() {
    this.userEmail = this.$route.query.email;
  },
  mounted() {
  },
  data() {
    return {
      showPassword: false,
      userEmail: '',
      userPassword: '',
      rules: {
        required: (value) => !!value || 'Required.',
        email: (value) => {
          const pattern = /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/;
          return pattern.test(value) || 'Invalid e-mail';
        },
      },
    };
  },
  methods: {
    onCancel(e) {
      e.preventDefault();
      this.$router.push('/');
    },
    async submitForm(e) {
      e.preventDefault();
      const isValid = this.$refs.form.validate();
      if (isValid) {
        const user = await this.$store.dispatch('AUTH_LOGIN', { email: this.userEmail, password: this.userPassword });
        if (!user) {
          const sb = {
            show: true,
            variant: 'error',
            message: 'ERROR! User name or password does not match.',
          };
          this.$store.commit('UPDATE_SNACKBAR', sb);
          return;
        }
        if (user.role === 'admin') {
          this.$router.push('/dashboard');
        } else {
          // this.$router.push(`/profile/${user.id}`);
          this.$router.push({
            name: 'profile',
            params: {
              id: user.id,
            },
          });
        }
      }
    },
  },
};
</script>
