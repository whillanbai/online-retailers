import Vue from 'vue'
import App from './App.vue'
import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'
import router from './router'
import './assets/font/iconfont.css'
import TreeTable from 'vue-table-with-tree-grid'
//富文本编译器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

//引入axios
import axios from 'axios'
//配置请求接口
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  //最后必须return config
  return config;
})

Vue.prototype.$http = axios

Vue.config.productionTip = false
Vue.use(ElementUI)

Vue.use(VueQuillEditor)

Vue.component('tree-table',TreeTable)

Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal * 1000)

  const y = dt.getFullYear()
  //加一是因为月从0开始，padStart（2,'0'）是表示显示两位，如果不够两位自动补0
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
