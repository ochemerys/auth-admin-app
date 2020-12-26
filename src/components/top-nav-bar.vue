<template>
  <div>
    <v-app-bar>
      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor: pointer">
          User Management
        </router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-toolbar-items class="hidden-xs-only">
        <v-btn :to="menuItems[0].path" text v-if="menuItems[0].isVisible">
          <v-icon left>mdi-{{ menuItems[0].icon }}</v-icon>
          {{ menuItems[0].title }}
        </v-btn>
      </v-toolbar-items>

      <v-spacer></v-spacer>

      <v-toolbar-items class="hidden-xs-only">
        <v-btn :to="menuItems[1].path" text v-if="menuItems[1].isVisible">
          <v-icon left>mdi-{{ menuItems[1].icon }}</v-icon>
          {{ menuItems[1].title }}
        </v-btn>
        <v-btn :to="menuItems[2].path" text v-if="menuItems[2].isVisible">
          <v-icon left>mdi-{{ menuItems[2].icon }}</v-icon>
          {{ menuItems[2].title }}
        </v-btn>
        <v-btn :to="menuItems[3].path" text v-if="menuItems[3].isVisible">
          <v-icon left>mdi-{{ menuItems[3].icon }}</v-icon>
          {{ menuItems[3].title }}
        </v-btn>
      </v-toolbar-items>

      <span class="hidden-sm-and-up">
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      </span>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" absolute temporary right>
      <v-list dense>
        <v-list-item link v-for="item in visibleMenuItems" :key="item.title" :to="item.path">
          <v-list-item-icon>
            <v-icon small>mdi-{{item.icon}}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{item.title}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'TopNavBar',
  created() {
    this.menuItems = this.getMenuItems();
  },
  data() {
    return {
      drawer: false,
      menuItems: [],
    };
  },
  methods: {
    getMenuItems() {
      return [
        {
          title: 'Dashboard',
          path: '/dashboard',
          icon: 'account-supervisor',
          isVisible: this.isLoggedIn && this.isUserAdmin,
        },
        {
          title: this.loggedUserName,
          path: `/profile/${this.loggedUserId}`,
          icon: 'account-edit',
          isVisible: this.isLoggedIn,
        },
        {
          title: 'Login',
          path: '/login',
          icon: 'lock-open',
          isVisible: !this.isLoggedIn,
        },
        {
          title: 'Logout',
          path: '/logout',
          icon: 'lock',
          isVisible: this.isLoggedIn,
        },
      ];
    },
  },
  computed: {
    // vuex helpers:
    ...mapGetters(['isLoggedIn', 'loggedUserName', 'loggedUserId']),
    ...mapGetters({
      isUserAdmin: 'isLoggedUserAdmin',
    }),
    // instead of:
    // isLoggedIn() {
    //   return this.$store.getters.isLoggedIn;
    // },
    // isUserAdmin() {
    //   return this.$store.getters.isLoggedUserAdmin;
    // },
    // loggedUserName() {
    //   return this.$store.getters.loggedUserName;
    // },
    // loggedUserId() {
    //   return this.$store.getters.loggedUserId;
    // },
    visibleMenuItems() {
      return this.menuItems.filter((item) => item.isVisible);
    },
  },
  watch: {
    isLoggedIn() {
      this.menuItems = this.getMenuItems();
    },
  },
};
</script>

<style>

</style>
