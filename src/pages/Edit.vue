<template>
<div class="mavon-editor" :style="{height: editorHeight + 'px'}" v-resize="updateEditorHeight">
  <editor
    :initBlogDraftId="initBlogDraftId"
    :initBlogId="initBlogId"
  ></editor>
</div>
</template>

<script>
import editor from '@/components/editor'
import resize from '@/directives/resize'
export default {
  components: {
    editor
  },
  data () {
    return {
      editorHeight: undefined,
      initBlogDraftId: '',
      initBlogId: ''
    }
  },
  directives: {
    resize
  },
  methods: {
    updateEditorHeight () {
      this.editorHeight = window.innerHeight - this.$store.state.headerHeight - 50
    }
  },
  mounted () {
    this.updateEditorHeight()
    const editOrDraft = this.$route.path.split('/')[2]
    if (editOrDraft === 'draft') {
      this.initBlogDraftId = this.$route.params.id
    } else if (editOrDraft === 'edit') {
      this.initBlogId = this.$route.params.id
    }
  }
}
</script>
