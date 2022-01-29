import { createApp } from 'vue'
import { addClass, removeClass } from './dom'

const relativeCls = 'g-relative'

export default function loadingLikeDirective(Comp) {
  return {
    mounted(el, binding) {
      const app = createApp(Comp) // 创建Loading组件的实例对象
      const instance = app.mount(document.createElement('div')) //  生成Loading组件所对应的DOM对象
      const name = Comp.name
      if (!el[name]) {
        el[name] = {}
      }
      el[name].instance = instance // 解决当一个组件中使用了多个自定义指令时的变量冲突
      const title = binding.arg
      if (typeof title !== 'undefined') {
        instance.setTitle(title)
      }
      if (binding.value) {
        append(el)
      }
    },
    updated(el, binding) {
      const title = binding.arg
      const name = Comp.name
      if (typeof title !== 'undefined') {
        el[name].instance.setTitle(title)
      }
      if (binding.value !== binding.oldValue) {
        binding.value ? append(el) : remove(el)
      }
    }
  }
  function append(el) {
    /* 这里想要使所开发的Loading组件具有通用性
    由于在Loading组件中使用绝对定位使其在页面中居中显示，而实际使用v-loading的组件并不一定就开启了定位，
    如果没有开启定位，则Loading组件并不能实现应有的效果。因此在这里对使用了v-loading元素的样式进行判断，
    如果该元素没有开启定位，则为其添加一个相对定位，如果开启了则不作操作。 */
    const name = Comp.name
    const style = getComputedStyle(el)
    if (['absolute', 'fixed', 'relative'].indexOf(style.position) === -1) {
      addClass(el, relativeCls)
    }
    el.appendChild(el[name].instance.$el)
  }
  function remove(el) {
    // 在Loading组件卸载后移除所添加的相对定位样式
    const name = Comp.name
    removeClass(el, relativeCls)
    el.removeChild(el[name].instance.$el)
  }
}
