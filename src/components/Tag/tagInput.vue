<template>
  <div class="tag-input-wrapper">
    <input
      class="tag-input"
      type="text" maxlength="12"
      v-model="tag"
      @change="emitChangeTag"
      @keydown.enter="emitAddTag"
      @keydown.delete="onReadyToDelete"
      @keyup.delete="emitDeleteAndFoucusPrevious"
      @blur="onBlur"
      :style="{width: inputWidth + 'em'}"
    ><span class="tag-input-icon" @click="emitDeleteTag"><i class="fas fa-times"></i></span>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tag: '',
      readyToDelete: false
    }
  },
  props: {
    initTag: { type: String }
  },
  computed: {
    // input框宽度随字数自适应
    inputWidth () {
      // 考虑中英文字符宽度不同
      let tag = this.tag
      if (tag.length) {
        let reLen = 0
        for (let i = 0; i < tag.length; i++) {
          if (tag.charCodeAt(i) >= 0 && tag.charCodeAt(i) <= 128) {
            reLen += 0.5
          } else {
            reLen += 1
          }
        }
        return reLen + 1
      } else {
        return 1
      }
    }
  },
  methods: {
    emitAddTag () {
      if (this.tag !== '') {
        this.$emit('addTag')
      }
    },
    emitDeleteTag () {
      this.$emit('deleteTag')
    },
    emitChangeTag () {
      this.$emit('changeTag', this.tag)
    },
    onBlur () {
      if (this.tag === '') {
        this.emitDeleteTag()
      }
    },
    onReadyToDelete () {
      if (this.tag === '') {
        this.readyToDelete = true
      }
    },
    emitDeleteAndFoucusPrevious () {
      if (this.readyToDelete) {
        this.emitDeleteTag()
        this.$emit('focusPrevious')
        this.readyToDelete = false
      }
    }
  },
  mounted () {
    if (this.initTag) {
      this.tag = this.initTag
      this.emitChangeTag()
    }
    this.$el.children[0].focus()
  }
}
</script>

<style lang="scss" scoped>
.tag-input-wrapper {
  display: inline-block;
  margin: 0 5px 5px 5px;
  .tag-input {
    border: none;
    background: #ADDAF9;
    color: #222;
    outline: none;
    border-radius: 3px;
    padding: 3px 5px;
    min-width: 1.5em;
    line-height: 1em;
    font-size: 13px;
    font-family: Consolas, monospace;
  }
  .tag-input-icon {
    color:#2790DA;
    margin-left: 5px;
  }
}
</style>
