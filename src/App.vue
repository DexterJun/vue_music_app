<template>
  <m-header></m-header>
  <Tab></Tab>
  <router-view :style="viewStyle"></router-view>
  <!-- 为用户中心路由跳转添加专属滑动效果 -->
  <router-view v-slot="{ Component }" :style="viewStyle" name="user">
    <transition appear name="slide">
      <component :is="Component"></component>
    </transition>
  </router-view>
  <Player></Player>
</template>

<script>
import Header from './components/Header/Header.vue'
import Tab from './components/Tab/Tab.vue'
import Player from './components/player/Player.vue'
import { mapState } from 'vuex'

export default {
  components: {
    MHeader: Header,
    Tab,
    Player
  },
  computed: {
    viewStyle() {
      const bottom = this.playList.length ? '60px' : '0'
      return { bottom }
    },
    ...mapState(['playList'])
  }
}
</script>
