export default ({ store }, inject) => {
  inject('notifier', {
    showMessage({ message = '', variant = '' }) {
      store.commit('UPDATE_SNACKBAR', { message, variant });
    },
  });
};
