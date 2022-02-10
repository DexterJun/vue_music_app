<template>
  <m-header></m-header>
  <Tab></Tab>
  <router-view :style="viewStyle"></router-view>
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
