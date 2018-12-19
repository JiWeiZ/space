<template>
<div
  class="pdf-document"
  v-scroll.immediate="handleScroll"
  v-resize.immediate="handleResize"
>
  <PDFPage
    class="pdfpage"
    v-for="(page, index) in pages"
    :key="index"
    v-bind="{page, index}"
  ></PDFPage>
</div>
</template>

<script>
import PDFPage from './PDFPage'
import scroll from '@/directives/scroll'
import { mapState } from 'vuex'
import resize from '@/directives/resize'
import {floor} from '@/store/utils'
import {BATCH_COUNT} from '@/store/params'

export default {
  name: 'PDFDocument',
  directives: {
    scroll,
    resize
  },
  components: {
    PDFPage
  },
  props: {
    pages: {required: true}
  },
  data () {
    return {
      docScrollTop: 0,
      docScrollBottom: 0,
      docScrollHeight: 0,
      docClientWidth: 0,
      docClientHeight: 0,
      pageDefaultWidth: 0,
      pageDefaultHeight: 0,
      currentPage: 0
    }
  },
  computed: {
    ...mapState(['headerHeight'])
  },
  methods: {
    updateDocParmas () {
      this.docScrollTop = this.$el.scrollTop
      this.docScrollBottom = this.docScrollTop + this.$el.clientHeight
      this.docClientWidth = this.$el.clientWidth
      this.docClientHeight = this.$el.clientHeight
      this.docScrollHeight = this.$el.scrollHeight
      this.$store.commit('cmtChange', {param: 'docScrollTop', value: this.docScrollTop})
      this.$store.commit('cmtChange', {param: 'docScrollBottom', value: this.docScrollBottom})
      this.$store.commit('cmtChange', {param: 'docClientWidth', value: this.docClientWidth})
      this.$store.commit('cmtChange', {param: 'docClientHeight', value: this.docClientHeight})
      this.$nextTick(() => {
        this.$store.commit('cmtChange', {param: 'docScrollHeight', value: this.docScrollHeight})
      })
    },
    updatePageDefault () {
      if (this.pages.length) {
        const defaultViewport = this.pages[0].getViewport(1.0)
        this.pageDefaultWidth = Math.ceil(defaultViewport.width)
        this.pageDefaultHeight = Math.ceil(defaultViewport.height)
        this.$store.commit('cmtChange', {param: 'pageDefaultWidth', value: this.pageDefaultWidth})
        this.$store.commit('cmtChange', {param: 'pageDefaultHeight', value: this.pageDefaultHeight})
      }
    },
    updateMscale () {
      let scaleChanged
      const em = parseInt(window.getComputedStyle(this.$el, null).fontSize)
      const scaleFitWidth = floor((this.$el.clientWidth - em) / this.pageDefaultWidth, 2)
      const scaleFitHeight = floor((this.$el.clientHeight - em) / this.pageDefaultHeight, 2)
      scaleChanged = Math.min(scaleFitWidth, scaleFitHeight)
      if (scaleChanged >= 0.2) {
        this.$store.commit('cmtChange', {param: 'Mscale', value: scaleChanged})
      }
    },
    handleResize () {
      this.updateDocParmas()
      this.$nextTick(() => {
        this.updateMscale()
      })
    },
    handleScroll () {
      this.updateDocParmas()
    }
  },
  watch: {
    docScrollTop () {
      let childrens = this.$children
      for (let index in childrens) {
        if (childrens[index]._vnode.tag !== 'canvas') {
          childrens.splice(index, 1)
          break
        }
      }
      for (let index in childrens) {
        if (childrens[index].isPageVisible) {
          this.currentPage = parseInt(index)
          this.$store.commit('cmtChange', {param: 'currentPage', value: this.currentPage})
          break
        }
      }
    }
  },
  updated () {
    this.updateDocParmas()
    // 只在第一次updated时改变Mscale
    // 不是等于，否则BATCH_COUNT大于总页数的时候就GG
    if (this.pages.length <= BATCH_COUNT) {
      this.updatePageDefault()
      this.$nextTick(() => {
        this.updateMscale()
      })
    }
  }
}
</script>

<style scoped>
.pdf-document{
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
  overflow-x: hidden;
  padding-top: 5px;
}
.pdfpage {
  margin-bottom: 10px;
  box-shadow: 3px 3px 10px 0 rgba(0, 0, 0, 0.5), 0 0 5px 0 rgba(0, 0, 0, 0.3);
}
</style>
