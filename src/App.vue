<template>
  <m-header></m-header>
  <Tab></Tab>
  <router-view></router-view>
</template>

<script>
import Header from './components/Header/Header.vue'
import Tab from './components/Tab/Tab.vue'

export default {
  components: {
    MHeader: Header,
    Tab
  }
}
</script>
