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
  props: {
    // 为组件添加默认的点击事件
    click: {
      type: Boolean,
      default: true
    },
    /* probeType 为 0，在任何时候都不派发 scroll 事件
    probeType 为 1，仅仅当手指按在滚动区域上，每隔 momentumLimitTime 毫秒派发一次 scroll 事件
    probeType 为 2，仅仅当手指按在滚动区域上，一直派发 scroll 事件
    probeType 为 3，任何时候都派发 scroll 事件，包括调用 scrollTo 或者触发 momentum 滚动动画 */
    probeType: {
      type: Number,
      default: 0
    }
  },
  emits: ['scroll'], // 向外派发一个名为scroll的自定义事件
  setup(props, { emit }) {
    const rootRef = ref(null)
    const scroll = useScroll(rootRef, props, emit)
    return { rootRef, scroll }
  }
}
</script>

<style>

</style>
