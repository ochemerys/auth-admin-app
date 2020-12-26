<template>
  <v-container>
    <page-header msg="User Details" />

    <v-card width="480" class="mx-auto mt-5">
      <v-card-title>
        id: {{ currentUser.id }}
      </v-card-title>
      <v-card-text>
        <v-form ref="form" lazy-validation>
          <v-text-field
            type="text"
            v-model="currentUser.displayName"
            label="User Name"
            prepend-icon="mdi-account-circle"
            :disabled="isRootUser"
          />
          <v-text-field
            type="email"
            v-model="currentUser.email"
            label="User Email"
            prepend-icon="mdi-email"
            :disabled="isRootUser"
            :rules="[rules.required, rules.email]"
            required
          />
          <v-radio-group
            prepend-icon="mdi-account-cog"
            v-model="currentUser.role"
            row
            :rules="[rules.required]"
            :disabled="isLoggedUser || isRootUser"
          >
            <v-spacer></v-spacer>
            <v-radio label="Admin" value="admin"></v-radio>
            <v-radio label="Manager" value="manager"></v-radio>
            <v-radio label="Registered User" value="user"></v-radio>
          </v-radio-group>
          <v-btn
            block
            small
            v-if="isLoggedUser"
            @click="onChangePasswordRquest"
          >
            Request Password Change
            <v-icon right dark >
              mdi-cloud-upload
            </v-icon>
          </v-btn>
          <v-text-field
            :type="showPassword ? 'text': 'password'"
            v-model="currentUser.password"
            v-else-if="isNewUser"
            label="Password"
            prepend-icon="mdi-lock"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword=!showPassword"
            :rules="[
              rules.pswdRequres,
              rules.pswdMinLength,
              rules.pswdUpper,
              rules.pswdNumber,
              rules.pswdSpecial
            ]"
            required
          />
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          v-if="!isRootUser"
          color="info"
          :disabled="!isCurrentUserChanged"
          @click="onSubmitDetails">{{submitButtonTitle}}
        </v-btn>
        <v-btn @click="navigateTo">Cancel</v-btn>
      </v-card-actions>
    </v-card>

    <page-footer/>
  </v-container>
</template>

<script>
import { mapMutations } from 'vuex';

import auth from '../services/firebase-auth-proxy';
import PageHeader from '../components/page-header.vue';
import PageFooter from '../components/page-footer.vue';

export default {
  name: 'UserDetails',
  components: {
    PageHeader,
    PageFooter,
  },
  created() {
    const userId = this.$route.params.id;
    this.currentUser = this.getCurentUser(userId);
    if (!this.currentUser) {
      this.currentUser = { id: 'new' };
    }
    this.currentUser.password = '';
    // clone current user: Object.assign(this.currentUser, this.userBeforeEdit)
    this.userBeforeEdit = { ...this.currentUser };
  },
  data() {
    return {
      currentUser: null,
      userBeforeEdit: null,
      showPassword: false,
      confirmPassword: '',
      rules: {
        required: (v) => !!v || 'Required.',
        pswdRequres: (v) => this.currentUser.id !== 'new' || !!v || 'Required',
        pswdMinLength: (v) => !v || (v && v.length >= 6) || 'Must have 5+ characters',
        pswdUpper: (v) => !v || /(?=.*[A-Z])/.test(v) || 'Must have one uppercase character',
        pswdNumber: (v) => !v || /(?=.*\d)/.test(v) || 'Must have one number',
        pswdSpecial: (v) => !v || /([!@$%])/.test(v) || 'Must have one special character [!@#$%]',
        email: (value) => {
          const pattern = /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/;
          return pattern.test(value) || 'Invalid e-mail';
        },
      },
    };
  },
  methods: {
    ...mapMutations({ updateSnackbar: 'UPDATE_SNACKBAR' }),
    getCurentUser(userId) {
      return this.$store.getters.activeUsers.find((user) => user.id === userId);
    },
    async onChangePasswordRquest(e) {
      e.preventDefault();
      let sb;
      try {
        await auth.changePasswordRequest(this.currentUser.email);
        sb = {
          variant: 'primary',
          message: 'INFO: Check your registered email to reset the password!',
        };
      } catch (err) {
        sb = {
          variant: 'error',
          message: `ERROR: ${err.message}`,
        };
      }
      this.updateSnackbar(sb);
    },
    async onSubmitDetails(e) {
      e.preventDefault();
      const isValid = this.$refs.form.validate();

      if (isValid) {
        const action = this.currentUser.id === 'new' ? 'CREATE_USER' : 'PATCH_USER';
        const payload = {
          displayName: this.currentUser.displayName,
          email: this.currentUser.email,
          role: this.currentUser.role,
          password: this.currentUser.password,
        };
        (this.currentUser.id !== 'new') && (payload.id = this.currentUser.id);
        try {
          await this.$store.dispatch(action, payload);
        } catch (err) {
          const sb = {
            variant: 'error',
            message: `ERROR: ${err.message}`,
          };
          this.updateSnackbar(sb);
          return;
        }
        this.navigateTo();
      }
    },
    navigateTo() {
      if (this.isLoggedUser && this.isRegularUser) {
        this.$router.push('/');
      } else {
        this.$router.go(-1);
      }
    },
  },
  computed: {
    submitButtonTitle() {
      return this.currentUser.id === 'new' ? 'Create' : 'Update';
    },
    isRegularUser() {
      return !!this.currentUser && this.currentUser.role === 'user';
    },
    isLoggedUser() {
      return !!this.currentUser && this.currentUser.id === this.$store.getters.loggedUserId;
    },
    isRootUser() {
      return !!this.currentUser && this.currentUser.email === process.env.VUE_APP_ROOT_USER_EMAIL;
    },
    isNewUser() {
      return !!this.currentUser && this.currentUser.id.toLowerCase() === 'new';
    },
    isCurrentUserChanged() {
      return this.currentUser.displayName !== this.userBeforeEdit.displayName
      || this.currentUser.email !== this.userBeforeEdit.email
      || this.currentUser.role !== this.userBeforeEdit.role;
    },
  },
};
</script>
