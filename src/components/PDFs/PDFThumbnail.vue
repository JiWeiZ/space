<template>
<div class="pdf-thumbnail" @click="jumpHere" :title="`第${this.index + 1}页`">
  <canvas class="pdf-thumbnail-canvas" :height="canvasAttrs.height" :width="canvasAttrs.width" :style="canvasAttrs.style"></canvas>
  <p>{{index + 1}}</p>
</div>
</template>

<script>
import { mapState } from 'vuex'
import resize from '@/directives/resize'
import { PIXEL_RATIO } from '@/store/params'
import { floor } from '@/store/utils'

export default {
  directives: {
    resize
  },
  props: {
    page: {type: Object, required: true},
    index: {type: Number},
    Nscale: {type: Number}
  },
  data () {
    return {
      thumbnailTop: undefined,
      thumbnailBottom: undefined
    }
  },
  computed: {
    ...mapState(['preScrollTop', 'preScrollHeight', 'preScrollBottom', 'Mscale', 'viewerWidth', 'enablePreview']),
    defaultViewport () {
      return this.page.getViewport(1.0)
    },
    actualViewport () {
      const defaultViewport = this.page.getViewport(1.0)
      const Nscale = floor((this.viewerWidth * 0.1 - 15) / defaultViewport.width, 2)
      return this.defaultViewport.clone({scale: Nscale})
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
      return {width, height, style}
    },
    isVisible () {
      const isTopVisible = this.thumbnailTop >= this.preScrollTop && this.thumbnailTop <= this.preScrollBottom
      const isBottomVisible = this.thumbnailBottom >= this.preScrollTop && this.thumbnailBottom <= this.preScrollBottom
      const isPartVisible = this.thumbnailTop <= this.preScrollTop && this.thumbnailBottom >= this.preScrollBottom
      return isTopVisible || isBottomVisible || isPartVisible
    }
  },
  methods: {
    drawPage () {
      if (this.renderTask) return
      if (!this.actualViewport.width) return
      const canvasContext = this.$el.children[0].getContext('2d')
      const renderContext = { canvasContext, viewport: this.actualViewport }
      this.renderTask = this.page.render(renderContext)
      delete this.renderTask
    },
    updateThumbnailParams () {
      this.thumbnailTop = this.$el.offsetTop
      this.thumbnailBottom = this.$el.offsetTop + this.$el.offsetHeight
    },
    jumpHere () {
      this.$store.commit('cmtChange', {param: 'targetPage', value: this.index})
    }
  },
  watch: {
    enablePreview (enablePreview) {
      if (enablePreview) {
        this.updateThumbnailParams()
        const preview = document.querySelector('.pdf-preview')
        this.$store.commit('cmtChange', {param: 'preScrollTop', value: preview.scrollTop})
        this.$store.commit('cmtChange', {param: 'preScrollHeight', value: preview.scrollHeight})
        this.$store.commit('cmtChange', {param: 'preScrollBottom', value: preview.scrollTop + preview.clientHeight})
      }
      if (enablePreview && this.isVisible) {
        this.drawPage()
      }
    },
    // 需要同时监视isVisible和enablePreview，因为watch只在数据变化时执行
    isVisible (isVisible) {
      if (this.enablePreview && isVisible) {
        this.drawPage()
      }
    },
    // 监视页面宽度变化
    viewerWidth () {
      if (this.enablePreview && this.isVisible) {
        this.drawPage()
      }
    }
  },
  mounted () {
    this.updateThumbnailParams()
  }

}
</script>

<style scoped>
.pdf-thumbnail{
  text-align: center;
  margin-bottom: 5px;
  cursor: pointer;
  position: relative;
}
.pdf-thumbnail-canvas{
  border-radius: 3px;
  transition: transform .75s cubic-bezier(0,1,.75,1);
}
.pdf-thumbnail-canvas:hover{
  box-shadow: 0 0 6px 4px #69A0F1;
  transform: scale(1.03);
}
.pdf-thumbnail:first-child{
  margin-top: 15px;
}
</style>
