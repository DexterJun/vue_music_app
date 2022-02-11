<template>
  <m-header></m-header>
  <Tab></Tab>
  <router-view :style="viewStyle" v-slot="{ Component }">
    <keep-alive>
      <component :is="Component"></component>
    </keep-alive>
  </router-view>
  <!-- 为用户中心路由跳转添加专属滑动效果 -->
  <router-view v-slot="{ Component }" :style="viewStyle" name="user">
    <transition appear name="slide">
      <keep-alive>
        <component :is="Component"></component>
      </keep-alive>
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
