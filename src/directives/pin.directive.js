/* eslint-disable no-param-reassign */

// shortcut for bind and update combination
export default function (element, binding) {
  Object.keys(binding.value).forEach((val) => {
    element.style[val] = binding.value[val];
  });
  element.style.position = 'absolute';
}

// function applyStyle(element, binding) {
//   Object.keys(binding.value).forEach((val) => {
//     element.style[val] = binding.value[val];
//   });
//   element.style.position = 'absolute';
// }

// export default {
//   // lifecycle hooks
//   bind: (element, binding) => {
//     applyStyle(element, binding);
//   },
//   update: (element, binding) => {
//     applyStyle(element, binding);
//   },
//   // other hooks: unbind, inserted, componentUpdated
// };
