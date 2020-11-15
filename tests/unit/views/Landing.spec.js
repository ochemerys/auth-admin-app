import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuetify from 'vuetify';

import Landing from '@/views/Landing.vue';

describe('Landing.vue', () => {
  let localVue;
  let vuetify;

  beforeEach(() => {
    localVue = createLocalVue(); // because of vuetify, we should use a localVue instance
    vuetify = new Vuetify();
  });

  it('should always render the landing card ', () => {
    let wrapper;
    wrapper = shallowMount(Landing, {
      localVue,
      vuetify,
      computed: {
        isLoggedIn: () => true,
      },
    });
    expect(wrapper.find('[data-test-id="landing-card"]').exists()).toBe(true);
    wrapper.destroy();
    wrapper = shallowMount(Landing, {
      localVue,
      vuetify,
      computed: {
        isLoggedIn: () => false,
      },
    });
    expect(wrapper.find('[data-test-id="landing-card"]').exists()).toBe(true);
  });

  it('should render the login button when user is not logged in', () => {
    const wrapper = shallowMount(Landing, {
      localVue,
      vuetify,
      computed: {
        isLoggedIn: () => false,
      },
    });
    console.log(wrapper.find('[data-test-id="login-button"]').html());
    expect(wrapper.find('[data-test-id="login-button"]').exists()).toBe(true);
  });

  it('should not render the login button when user is logged in', () => {
    const wrapper = shallowMount(Landing, {
      localVue,
      vuetify,
      computed: {
        isLoggedIn: () => true,
      },
    });
    expect(wrapper.find('[data-test-id="login-button"]').exists()).toBe(false);
  });
});
