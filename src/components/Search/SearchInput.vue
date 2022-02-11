/* 输入框组件 */
<template>
  <div class="search-input">
    <i class="icon-search"></i>
    <input type="text" :placeholder="placeholder" class="input-inner" v-model="query">
    <i class="icon-dismiss" v-show="query" @click="clear"></i>
  </div>
</template>

<script>
import { debounce } from 'throttle-debounce'

export default {
  name: 'SearchInput',
  props: {
    modelValue: String,
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  data() {
    return {
      query: this.modelValue
    }
  },
  created() {
    // 当输入框内容发生变化时触发默认事件将输入的值传递给Search组件
    this.$watch('query', debounce(300, (newQuery) => {
      this.$emit('update:modelValue', newQuery.trim())
    }))
    // 如果外部给输入框传递了值则需要将其填入输入框中
    this.$watch('modelValue', (newVal) => {
      this.query = newVal
    })
  },
  methods: {
    clear() {
      this.query = ''
    }
  }
}
</script>

<style lang="scss" scoped>
  .search-input {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    padding: 0 6px;
    height: 32px;
    background: $color-highlight-background;
    border-radius: 6px;
    .icon-search {
      font-size: 24px;
      color: $color-text-d;
    }
    .input-inner {
      flex: 1;
      margin: 0 5px;
      line-height: 18px;
      background: $color-highlight-background;
      color: $color-text;
      font-size: $font-size-medium;
      outline: 0;
      &::placeholder {
        color: $color-text-d;
      }
    }
    .icon-dismiss {
      font-size: 16px;
      color: $color-text-d;
    }
  }
</style>
