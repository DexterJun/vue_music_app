// 控制图片旋转的钩子函数

import { useStore } from 'vuex'
import { computed, ref, watch } from 'vue'

export default function useCd() {
  const cdRef = ref(null)
  const cdImageRef = ref(null)
  const store = useStore()
  const playing = computed(() => store.state.playing)

  const cdCls = computed(() => {
    return playing.value ? 'playing' : ''
  })

  // 暂停时使图片固定到当前旋转的位置
  watch(playing, (newPlaying) => {
    if (!newPlaying) {
      syncTransform(cdRef.value, cdImageRef.value)
    }
  })

  function syncTransform(wrapper, inner) {
    const wrapperTransfrom = getComputedStyle(wrapper).transform
    const innerTransform = getComputedStyle(inner).transform
    wrapper.style.transform = wrapperTransfrom === 'none' ? innerTransform : innerTransform.concat(' ', wrapperTransfrom)
  }

  return { cdCls, cdRef, cdImageRef }
}
