<template>
  <header class="clearfix" :class="{'showController': showController, 'hideController': hideController}">
    <div class="enablePreview">
      <p v-if="!enablePreview" title="显示缩略图" class="fa" @click="previewToggle"><i class="fas fa-indent"></i></p>
      <p v-if="enablePreview" title="隐藏缩略图" class="fa" @click="previewToggle"><i class="fas fa-outdent"></i></p>
    </div>
    <div class="jump">
      <p class="fa" title="回到顶部" @click="jumpTop"><i class="fas fa-chevron-up"></i></p>
    </div>
    <div class="turn">
      <p class="fa" title="上一页" @click="previousPage()"><i class="fas fa-chevron-left"></i></p>
      <p class="fa" title="下一页" @click="nextPage()"><i class="fas fa-chevron-right"></i></p>
    </div>
    <div class="pagesNum">
      <p>跳转至</p>
      <input type="text" min="1" :max="pdfTotalPagesNum+1" :value="pageIndexShowing" @keyup="onKeyup($event)">
      <p>总页数</p>
      <p>{{pdfTotalPagesNum}}页</p>
    </div>
    <div class="scale">
      <p class="fa" title="适合窗口宽度" @click="commitScale('expand')"><i class="fas fa-expand"></i></p>
      <p class="fa" title="适合页面大小" @click="commitScale('compress')"><i class="fas fa-compress"></i></p>
      <p class="fa" title="放大页面" @click="commitScale('plus')"><i class="fas fa-search-plus"></i></p>
      <p class="fa" title="缩小页面" @click="commitScale('minus')"><i class="fas fa-search-minus"></i></p>
    </div>
  </header>
</template>

<script>
import { mapState } from 'vuex'
import { floor, throttle } from '@/store/utils'

const showingController = throttle((e) => {
  const header = document.querySelector('.pdf-controller')
  if (e.clientX >= window.innerWidth - 250) {
    // this.showController = true
    // this.hideController = false
    header.classList.add('showController')
    header.classList.remove('hideController')
  } else {
    // this.showController = false
    // this.hideController = true
    header.classList.add('hideController')
    header.classList.remove('showController')
  }
}, 200)

export default {
  data () {
    return {
      pageIndexShowing: 1,
      showController: false,
      hideController: true
    }
  },
  computed: {
    ...mapState(['pdfTotalPagesNum', 'docClientWidth', 'pageDefaultWidth',
      'docClientHeight', 'pageDefaultHeight', 'Mscale', 'currentPage',
      'enablePreview', 'headerHeight', 'pageHeight', 'targetPage'])
  },
  methods: {
    previewToggle () {
      this.$store.commit('cmtChange', {param: 'enablePreview', value: !this.enablePreview})
    },
    commitScale (type) {
      let scaleChanged
      const em = parseInt(window.getComputedStyle(this.$el, null).fontSize)
      const scaleFitWidth = floor((this.docClientWidth - em) / this.pageDefaultWidth, 2)
      const scaleFitHeight = floor((this.docClientHeight - em) / this.pageDefaultHeight, 2)
      switch (type) {
        case 'expand':
          scaleChanged = scaleFitWidth
          break
        case 'compress':
          scaleChanged = Math.min(scaleFitWidth, scaleFitHeight)
          break
        case 'plus':
          scaleChanged = floor(this.Mscale + 0.2, 2)
          break
        case 'minus':
          scaleChanged = floor(this.Mscale - 0.2, 2)
      }
      if (scaleChanged >= 0.2) {
        this.$store.commit('cmtChange', {param: 'Mscale', value: scaleChanged})
      }
      // 这里要跳转页面，因为改变scale会改变页面高度，但是docScrollTop不会变，会造成页面位置错误
      // 不要忘记加nextTick！否则dom还没有更新，跳也白跳
      this.$nextTick(() => {
        this.jumpToPageIndex(this.pageIndexShowing)
      })
    },
    jumpTop () {
      const pdfDocument = document.querySelector('.pdf-document')
      let timer = setInterval(() => {
        let delta
        let scrollTop = pdfDocument.scrollTop
        delta = Math.floor(0.7 * scrollTop)
        pdfDocument.scrollTop = delta
        if (scrollTop <= 0) { clearInterval(timer) }
      }, 10)
    },
    nextPage () {
      const pdfDocument = document.querySelector('.pdf-document')
      const pages = document.querySelectorAll('.pdfpage')
      const currentPage = pages[this.currentPage]
      const currentPageBottom = currentPage.offsetTop + currentPage.offsetHeight
      pdfDocument.scrollTop = currentPageBottom + 5
    },
    previousPage () {
      if (this.currentPage === 0) return
      const pdfDocument = document.querySelector('.pdf-document')
      const pages = document.querySelectorAll('.pdfpage')
      const previousPage = pages[this.currentPage - 1]
      const previousPageTop = previousPage.offsetTop
      pdfDocument.scrollTop = previousPageTop - 5
    },
    jumpToPageIndex (pageIndexShowing) {
      const pageIndex = pageIndexShowing - 1
      const pdfDocument = document.querySelector('.pdf-document')
      const pages = document.querySelectorAll('.pdfpage')
      const currentPage = pages[pageIndex]
      pdfDocument.scrollTop = currentPage.offsetTop - 5
    },
    onKeyup (e) {
      if (e.keyCode === 13) {
        this.pageIndexShowing = e.target.value
        const pages = document.querySelectorAll('.pdfpage')
        if (this.pageIndexShowing > pages.length) {
          // 如果键入的页面数大于当前获取到的总页面，需要先去去页面
          this.$emit('pages-fetch', this.pageIndexShowing, true)
        } else {
          this.jumpToPageIndex(parseInt(this.pageIndexShowing))
        }
      }
    },
    emitDownload () {
      this.$emit('download')
    }
  },
  watch: {
    currentPage () {
      this.pageIndexShowing = this.currentPage + 1
    },
    targetPage (pageIndex) {
      const pdfDocument = document.querySelector('.pdf-document')
      const pages = document.querySelectorAll('.pdfpage')
      const currentPage = pages[pageIndex]
      pdfDocument.scrollTop = currentPage.offsetTop - 5
    }
  },
  mounted () {
    window.addEventListener('mousemove', showingController)
  },
  beforeDestroy () {
    window.removeEventListener('mousemove', showingController)
  }
}
</script>

<style scoped>
@media screen
and (min-height: 1160px){
  .pdf-controller{
    top: 45vh;
    height: 530px;
    border-radius: 8px;
  }
  .enablePreview{
    margin-top: 1em;
  }
  .scale{
    bottom: 0.5em;
  }
  .fa{
    padding: 10px;
    margin: 7px 50%;
  }
}
@media screen
and (max-height: 1160px)
and (min-height: 610px){
  .pdf-controller{
    bottom: 15px;
    height: 530px;
    border-radius: 8px;
  }
  .enablePreview{
    margin-top: 1em;
  }
  .scale{
    bottom: 0.5em;
  }
  .fa{
    padding: 10px;
    margin: 5px 50%;
  }
}
@media screen
and (max-height: 610px){
  .pdf-controller{
    bottom: 15px;
    height: 408px;
    border-radius: 8px;
  }
  .enablePreview{
    margin-top: 5px;
  }
  .scale{
    bottom: 0.5em;
  }
  .fa{
    padding:7px;
    margin: 3px 50%;
  }
}
.pdf-controller{
  position: fixed;
  right:-75px;
  width: 5em;
  z-index: 1;
  display: flex;
  flex-direction: column;
  background: #AAA;
  transition: right 0.2s ease-in-out
}
.showController{
  right: 30px;
}
.hideController{
  right: -75px;
}
.pagesNum{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 4.5em;
  padding: 5px;
  border-top: 2px solid #F1F1F1;
  border-bottom: 2px solid #F1F1F1;
}
.pagesNum>*{
  margin-bottom: 5px;
}
.scale{
  position: absolute;
}
.fa{
  transform: translateX(-50%);
  background: #F2F2F2;
  color:#555;
  border-radius: 100%;
  cursor: pointer;
}
.fa:hover{
  background: #DADADA;
}
.fa i{
  width: 1em;
  text-align: center;
}
input{
  width: 100%;
  border: none;
  border-radius: 2px;
  padding: 0 3px;
}
</style>
