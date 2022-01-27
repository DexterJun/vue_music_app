import { onMounted, onUnmounted, ref } from 'vue'
import BScroll from '@better-scroll/core'
import ObserveDOM from '@better-scroll/observe-dom'

BScroll.use(ObserveDOM)

/* 由于我们将Scroll包裹在了Recommend组件的最外层，因此Scroll组件加载的时候Recommend组件的内容还没有加载出来，
页面还是空的，而当页面加载完成后useScroll已经执行完了，所以不会出现滚动效果。这里需要借助ObserveDOM插件，
会监测当Scroll组件内容发生变化时从新执行useScroll */
export default function useScroll(wrapperRef, options) {
  const scroll = ref(null)
  onMounted(() => {
    scroll.value = new BScroll(wrapperRef.value, {
      observeDOM: true,
      ...options
    })
  })
  onUnmounted(() => {
    scroll.value.destroy()
  })
}
