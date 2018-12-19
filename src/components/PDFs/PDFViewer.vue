<template>
  <div class="pdf-viewer" v-resize="updateViewerParams">
    <main v-show="pdf" class="pdfviewer-main" :style="{height: viewerHeight + 'px'}">
      <PDFPreview v-show="enablePreview" v-bind="{pages}"></PDFPreview>
      <div class="adjust-line-vertical" @mousedown.stop.prevent="adjustWidth"></div>
      <PDFDocument v-bind="{pages}"></PDFDocument>
      <PDFController class="pdf-controller" @pages-fetch="fetchPages" ref="pdfcontroller"></PDFController>
      <div class="adjust-line-bottom" @mousedown.stop.prevent="adjustHeight"></div>
    </main>
    <div v-show="loadingPercent < 100" class="loading" :style="{width: loadingPercent + '%'}">
    </div>
  </div>
</template>

<script>
import PDFDocument from './PDFDocument'
import PDFPreview from './PDFPreview'
import PDFController from './PDFController'
import { BATCH_COUNT } from '@/store/params'
import { range, throttle } from '@/store/utils'
import { mapGetters, mapState } from 'vuex'
import resize from '@/directives/resize'

export default {
  name: 'PDFViewer',
  components: {
    PDFController,
    PDFDocument,
    PDFPreview
  },
  directives: {
    resize
  },
  data () {
    return {
      fit: undefined,
      pdfTotalPagesNum: 0,
      latestEndPage: 0,
      isPreviewEnabled: false,
      pdf: undefined,
      pages: [],
      adjusting: false,
      mouseX: undefined,
      viewerHeight: undefined,
      loadingPercent: 0
    }
  },
  props: {
    PDFURL: String
  },
  computed: {
    ...mapGetters(['didDocReachedBottom', 'didPreviewReachedBottom']),
    ...mapState(['Mscale', 'docClientWidth', 'pageDefaultWidth',
      'docClientHeight', 'pageDefaultHeight', 'enablePreview', 'headerHeight', 'footerHeight'])
  },
  methods: {
    fetchPDF () {
      import('pdfjs-dist/webpack')
        .then(pdfjs =>
          pdfjs.getDocument(this.PDFURL, false, null, progress => {
            this.loadingPercent = 100 * progress.loaded / progress.total
          })
        )
        .then(pdf => {
          this.pdf = pdf
          if (pdf.numPages) {
            this.pdfTotalPagesNum = pdf.numPages
            this.$store.commit('cmtChange', {param: 'pdfTotalPagesNum', value: this.pdfTotalPagesNum})
            this.$emit('document-handled', {text: 'fetched pdf successfully'})
          }
        })
    },
    fetchPages (currentPage = 0, jump = false) {
      // 没有取到pdf立刻退出
      if (!this.pdf) { return }
      // currentCount：已获取的总页数
      // 如果已获取的总页数等于pdf文件总页数，表示最后一页已经取到，立刻退出
      const fetchedPagesNum = this.pages.length
      if (this.pdfTotalPagesNum > 0 && fetchedPagesNum === this.pdfTotalPagesNum) { return }
      // 使用this.latestEndPage跟踪最近请求的endPage，以确保相同的批处理只请求一次
      // 如果最近请求的endPage比也获得的总页数还大，说明发生重复请求，立刻退出
      if (this.latestEndPage > fetchedPagesNum) { return }
      // PDFPage从1开始
      const startPage = fetchedPagesNum + 1
      // 考虑最后一次获取页面的情况，要保证endPage不比pdf的总页数大
      const endPage = Math.min(Math.max(currentPage, fetchedPagesNum + BATCH_COUNT), this.pdfTotalPagesNum)
      // 更新最近请求的endPage
      this.latestEndPage = endPage
      // 开始异步请求页面
      const batchPages = range(startPage, endPage + 1).map(num => this.pdf.getPage(num))
      Promise.all(batchPages)
        .then((pages) => {
          // 这里不要使用
          // this.pages = this.pages.concact(pages)
          // 因为Promise.all()是并行执行的，不能保证concat的顺序
          this.pages.splice(fetchedPagesNum, 0, ...pages)
          return this.pages
        })
        .then((pages) => {
          this.pageCount = pages.length
          const pdfDoc = document.querySelector('.pdf-document')
          if (pdfDoc) {
            this.$store.commit('cmtChange', {param: 'docScrollHeight', value: pdfDoc.scrollHeight})
          }
        })
        .then(() => {
          if (jump) {
            const pdfcontroller = this.$refs.pdfcontroller
            pdfcontroller.jumpToPageIndex(parseInt(pdfcontroller.pageIndexShowing))
          }
        })
    },
    adjustWidth () {
      window.onmousemove = throttle((event) => {
        let pdfPreviwew = document.querySelector('.pdf-preview')
        let PDFDocument = document.querySelector('.pdf-document')
        let changedWidth = event.clientX - this.$el.offsetLeft - 2
        for (let item of [pdfPreviwew, PDFDocument]) {
          if ((item.style.cursor && item.style.cursor !== 'we-resize') || !item.style.cursor) {
            item.style.cursor = 'we-resize'
          }
        }
        if (changedWidth >= window.innerWidth * 0.1 && changedWidth <= window.innerWidth * 0.3) {
          pdfPreviwew.style.width = `${changedWidth}px`
          this.$store.commit('cmtChange', {param: 'docClientWidth', value: PDFDocument.offsetWidth})
        }
      }, 50)
    },
    adjustHeight () {
      window.onmousemove = throttle((event) => {
        let pdfViewerMain = document.querySelector('.pdfviewer-main')
        let pdfPreviwew = document.querySelector('.pdf-preview')
        let PDFDocument = document.querySelector('.pdf-document')
        let footer = document.querySelector('.footer-bottom')
        for (let item of [pdfPreviwew, PDFDocument, footer]) {
          if ((item.style.cursor && item.style.cursor !== 'ns-resize') || !item.style.cursor) {
            item.style.cursor = 'ns-resize'
          }
        }
        const minHeight = 570
        let changedHeight = event.pageY - this.headerHeight - 2
        if (changedHeight >= minHeight) {
          pdfViewerMain.style.height = `${changedHeight}px`
          this.$store.commit('cmtChange', {param: 'viewerHeight', value: changedHeight})
        }
      }, 50)
    },
    updateViewerParams () {
      this.viewerHeight = window.innerHeight - this.headerHeight
      if (this.viewerHeight < 570) this.viewerHeight = 570
      this.viewerWidth = window.innerWidth
      this.$store.commit('cmtChange', {param: 'viewerHeight', value: this.viewerHeight})
      this.$store.commit('cmtChange', {param: 'viewerWidth', value: this.viewerWidth})
    }
  },
  watch: {
    PDFURL () {
      // 每次更新URL都得清空Mscale，不然drawPage的时候还是上次的Mscale
      this.$store.commit('cmtChange', {param: 'Mscale', value: undefined})
      this.fetchPDF()
    },
    pdf () {
      this.fetchPages()
    },
    didDocReachedBottom (didDocReachedBottom) {
      if (didDocReachedBottom) {
        this.fetchPages()
      }
    },
    didPreviewReachedBottom (didPreviewReachedBottom) {
      if (didPreviewReachedBottom) {
        this.fetchPages()
      }
    }
  },
  mounted () {
    this.updateViewerParams()
    window.onmouseup = () => {
      const pdfPreviwew = document.querySelector('.pdf-preview')
      const PDFDocument = document.querySelector('.pdf-document')
      const footer = document.querySelector('.footer-bottom')
      pdfPreviwew.style.cursor = 'auto'
      PDFDocument.style.cursor = 'auto'
      footer.style.cursor = 'auto'
      window.onmousemove = null
    }
  },
  beforeDestroy () {
    window.onmouseup = null
  }
}
</script>

<style scoped>
.pdf-viewer{
  position: relative;
  overflow: hidden;
  padding-bottom: 5px;
  min-height: 570px;
  background: #DADADA;
}
main{
  position: relative;
  display: flex;
  flex-direction: row;
}
.pdf-preview{
  flex: none;
}
.pdf-document{
  flex: 1;
}
.pdfviewer-main{
  min-height: 480px;
}
.adjust-line-vertical{
  margin-left: 5px;
  width: 5px;
  align-self: stretch;
  /* /* background: #777; */
  box-shadow: -3px 0 5px 0 rgba(0, 0, 0, 0.5);
  color:#fff;
  cursor: ew-resize;
}
.adjust-line-bottom{
  position: absolute;
  bottom: -5px;
  height: 5px;
  width: 100%;
  /* border-top: 2px solid #fff; */
  background:#4d4e4e;
  /* background: #888; */
  box-shadow: -3px 0 8px 0 rgba(0, 0, 0, 0.5), 0 0 10px 0 rgba(0, 0, 0, 0.3);
  cursor: ns-resize;
}
.loading{
  position: absolute;
  top: 0;
  left: 0;
  height: 3px;
  background: #0078D7;
}
</style>
