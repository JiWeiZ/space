<script>
import {mapState} from 'vuex'
import {PIXEL_RATIO} from '@/store/params'
import { floor } from '@/store/utils'

export default {
  props: {
    page: {type: Object, required: true},
    index: {type: Number}
  },
  data () {
    return {
      pageTop: undefined,
      pageBottom: undefined,
      defaultViewport: undefined
    }
  },
  computed: {
    ...mapState(['docClientWidth', 'docScrollTop', 'docScrollBottom', 'Mscale']),
    isPageVisible () {
      const isTopVisible = this.pageTop >= this.docScrollTop && this.pageTop <= this.docScrollBottom
      const isBottomVisible = this.pageBottom >= this.docScrollTop && this.pageBottom <= this.docScrollBottom
      const isPartVisible = this.pageTop <= this.docScrollTop && this.pageBottom >= this.docScrollBottom
      return isTopVisible || isBottomVisible || isPartVisible
    },
    scale () {
      if (!this.defaultViewport) return 1.0
      return floor(this.docClientWidth / this.defaultViewport.width, 2)
    },
    actualViewport () {
      return this.defaultViewport.clone({scale: this.Mscale})
    },
    canvasStyle () {
      const {width: actualWidth, height: actualHeight} = this.actualViewport
      const [pixelWidth, pixelHeight] = [actualWidth, actualHeight]
        .map(e => Math.ceil(e / PIXEL_RATIO))
      return `width: ${pixelWidth}px; height: ${pixelHeight}px;`
    },
    canvasAttrs () {
      let {width, height} = this.actualViewport
      width = Math.ceil(width)
      height = Math.ceil(height)
      const style = this.canvasStyle
      const title = `第${this.index + 1}页`
      return {title, width, height, style, class: 'pdf-page'}
    }
  },
  methods: {
    drawPage () {
      // 如果有renderTak立刻退出，防止重复执行renderTask
      if (this.renderTask) return
      // 如果actualViewport还没拿到Mscale，立刻退出
      // 一定要加这一句，初始化页面的时候是拿到Mscale的undefined，稍后才会更新Mscale
      if (!this.actualViewport.width) return
      const canvasContext = this.$el.getContext('2d')
      const renderContext = {canvasContext, viewport: this.actualViewport}
      this.renderTask = this.page.render(renderContext)
      delete this.renderTask
    },
    updatePageParams () {
      this.pageTop = this.$el.offsetTop
      this.pageBottom = this.pageTop + this.$el.offsetHeight
      this.$store.commit('cmtChange', {param: 'pageWidth', value: this.$el.offsetWidth})
      this.$store.commit('cmtChange', {param: 'pageHeight', value: this.$el.offsetHeight})
    },
    destroyPage (_newPage, page) {
      // PDFPageProxy#_destroy
      // https://mozilla.github.io/pdf.js/api/draft/PDFPageProxy.html
      if (page) page._destroy()
      this.destroyRenderTask()
    },
    destroyRenderTask () {
      if (!this.renderTask) return
      // RenderTask#cancel
      // https://mozilla.github.io/pdf.js/api/draft/RenderTask.html
      this.renderTask.cancel()
      delete this.renderTask
    }
  },
  watch: {
    page: 'destroyPage',
    isPageVisible () {
      if (this.isPageVisible) {
        this.drawPage()
      }
    },
    Mscale (newScale, oldScale) {
      if (newScale !== oldScale && this.isPageVisible) {
        this.drawPage()
      }
    }
  },
  created () {
    this.defaultViewport = this.page.getViewport(1.0)
  },
  updated () {
    this.updatePageParams()
  },
  mounted () {
    this.updatePageParams()
  },
  beforeDestroy () {
    this.destroyPage(undefined, this.page)
  },
  render (h) {
    const {canvasAttrs: attrs} = this
    return h('canvas', {attrs})
  }
}
</script>
