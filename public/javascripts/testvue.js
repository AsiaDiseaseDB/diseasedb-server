// var treeData = {
//   name: 'root',
//   path: '/root',
//   children: []
// };

Vue.component('child', {
  // 声明 props
  props: ['myMessage'],
  // 就像 data 一样，prop 可以用在模板内
  // 同样也可以在 vm 实例中像 “this.message” 这样使用
  template: '<span>{{ myMessage }}</span>'
})

var app = new Vue({
  el: '#app',
  data: {
    parentMsg: ''
  }
});
