import { createApp } from 'vue'
import lazyPlugin from 'vue3-lazy'
import App from './App.vue'
import router from './router'
import store from './store'
import loadingDirective from './components/base/loading/directive'
import noresultDirective from './components/base/noResult/directive'

// 引入全局样式文件
import './assets/scss/index.scss'

createApp(App).use(store).use(router).use(lazyPlugin, {
  //  vue3-lazy插件注册完成后，相当于在全局注册了v-lazy指令
  loading: require('./assets/images/default.png')
}).directive('loading', loadingDirective)
.directive('no-result', noresultDirective).mount('#app')
