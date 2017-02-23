var data = {
  name: 'root',
  path: '/root',
  children: [{
    name: 'hello',
    path: '/root/hello'
  }]
}

// define the item component
Vue.component('item', {
  template: '#item-template',
  props: {
    model: Object
  },
  data: function() {
    return {
      open: true
    }
  },
  computed: {
    isFolder: function() {
      return this.model.children &&
        this.model.children.length
    }
  },
  methods: {
    displayPath: function() {
      console.log(this.model.path);
    },
    deleteEle: function() {
      this.$parent.model.children.shift();
    },
    toggle: function() {
      if (this.isFolder) {
        this.open = !this.open
      }
    },
    changeType: function() {
      if (!this.isFolder) {
        Vue.set(this.model, 'children', [])
        this.addChild()
        this.open = true
      }
    },
    addChild: function() {
      var tmpPath = this.model.path;
      this.model.children.push({
        name: 'newStuff',
        path: tmpPath + '/newStuff'
      })
    }
  }
})

// boot up the demo
var demo = new Vue({
  el: '#demo',
  data: {
    treeData: data
  }
})
