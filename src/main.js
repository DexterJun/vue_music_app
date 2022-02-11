import { createApp } from 'vue'
import lazyPlugin from 'vue3-lazy'
import App from './App.vue'
import router from './router'
import store from './store'
import loadingDirective from './components/base/loading/directive'
import noresultDirective from './components/base/noResult/directive'
import { load, saveAll } from './assets/js/arrayStore'
import { FAVORITE_KEY, PLAY_KEY } from './assets/js/constant'
import { processSongs } from './service/song'

// 引入全局样式文件
import './assets/scss/index.scss'

/* 由于歌曲的url每过一段时间会更新，因此在程序初始化时需要对缓存在本地的歌曲信息进行更新 */
const favoriteSongs = load(FAVORITE_KEY)
if (favoriteSongs.length > 0) {
  processSongs(favoriteSongs).then((songs) => {
    store.commit('setFavoriteList', songs)
    saveAll(songs, FAVORITE_KEY)
  })
}
const historySongs = load(FAVORITE_KEY)
if (historySongs.length > 0) {
  processSongs(historySongs).then((songs) => {
    store.commit('setPlayHistory', songs)
    saveAll(songs, PLAY_KEY)
  })
}

createApp(App).use(store).use(router).use(lazyPlugin, {
  //  vue3-lazy插件注册完成后，相当于在全局注册了v-lazy指令
  loading: require('./assets/images/default.png')
}).directive('loading', loadingDirective)
.directive('no-result', noresultDirective).mount('#app')
