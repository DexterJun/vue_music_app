import { onMounted, onUnmounted, ref, onActivated, onDeactivated } from 'vue'
import BScroll from '@better-scroll/core'
import ObserveDOM from '@better-scroll/observe-dom'

BScroll.use(ObserveDOM)

/* 由于我们将Scroll包裹在了Recommend组件的最外层，因此Scroll组件加载的时候Recommend组件的内容还没有加载出来，
页面还是空的，而当页面加载完成后useScroll已经执行完了，所以不会出现滚动效果。这里需要借助ObserveDOM插件，
会监测当Scroll组件内容发生变化时从新执行useScroll */
export default function useScroll(wrapperRef, options, emit) {
  const scroll = ref(null)
  onMounted(() => {
    scroll.value = new BScroll(wrapperRef.value, {
      observeDOM: true,
      ...options
    })
    if (options.probeType > 0) {
      scroll.value.on('scroll', (pos) => {
        emit('scroll', pos) //  触发自定义事件，将滚动的位置信息通过自定义事件传递出去
      })
    }
  })
  onUnmounted(() => {
    scroll.value.destroy()
  })
  onActivated(() => {
    scroll.value.enable()
    scroll.value.refresh()
  })
  onDeactivated(() => {
    scroll.value.disable()
  })
  return scroll
}
