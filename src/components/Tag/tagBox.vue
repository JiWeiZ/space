<template>
  <div class="tag-box">
    <div
      :is="item.component"
      v-for="(item, index) in items"
      :key="item.id"
      :initTag="initTag"
      @deleteTag="onDeleteTag(index)"
      @changeTag="onChangeTag(index, arguments)"
      @addTag="onAddTag()"
      @focusPrevious="onFocusPrevious(index)"
      ref="tagInput"
    ></div><div v-if="this.items.length < this.maxTagNum" class="tag-title" @click="onAddTag">
      <i class="fas fa-plus-square"></i><span class="tag-title-content"><slot></slot></span>
    </div>
  </div>
</template>

<script>
import tagInput from './tagInput'

export default {
  components: {
    tagInput
  },
  props: {
    maxTagNum: {type: Number}
  },
  data () {
    return {
      items: [],
      tags: [],
      initTag: ''
    }
  },
  methods: {
    onAddTag () {
      if (this.$refs.tagInput) {
        for (let item of this.$refs.tagInput) {
          if (item.tag === '') return
        }
      }
      this.initTag = ''
      this.items.push({
        'component': tagInput,
        'id': Date.now()
      })
    },
    onInitTag (e) {
      this.initTag = e
      this.items.push({
        'component': tagInput,
        'id': Date.now()
      })
    },
    onDeleteTag (index) {
      if (this.items.length) {
        this.items.splice(index, 1)
      }
      if (this.tags.length) {
        this.tags.splice(index, 1)
      }
    },
    onChangeTag () {
      const index = arguments[0]
      const tag = arguments[1][0]
      // 不能使用this.tags[index] = tag，这样vue监测不到数组变化
      this.tags.splice(index, 1, tag)
    },
    onFocusPrevious (index) {
      if (index !== 0) {
        this.$el.children[index - 1].children[0].focus()
      }
    }
  },
  watch: {
    items: {
      handler: function () {
        if (this.items.length > this.maxTagNum) {
          this.items.pop()
        }
      }
    },
    tags: {
      handler: function (newValue, oldValue) {
        this.$emit('tagsChange', newValue)
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
.tag-box {
  display: inline-block;
  margin: 0 auto;
  min-height: 26px;
  .tag-title {
    display: inline-block;
    margin-left: 5px;
    margin-bottom: 5px;
    color:#2790DA;
    &:hover {
      cursor: pointer;
    }
    .tag-title-content {
      margin-left: 5px;
    }
  }
  .tag-input {
    font-size: 14px;
    padding: 5px;
    width: 12em;
    outline: none;
    border: none;
  }
}
</style>
