/* 该组件的作用是使页面上下滚动时有动态效果 */
<template>
  <div ref="rootRef">
    <slot></slot>
  </div>
</template>

<script>
import { ref } from 'vue'
import useScroll from './useScroll'

export default {
  name: 'scroll',
  props: { // 为组件添加默认的点击事件
    click: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const rootRef = ref(null)
    useScroll(rootRef, props)
    return { rootRef }
  }
}
</script>

<style>

</style>
