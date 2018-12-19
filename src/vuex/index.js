import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 页面头部高度
    headerHeight: undefined,
    footerHeight: undefined,
    // pdfViewer宽高·
    viewerWidth: undefined,
    viewerHeight: undefined,
    // pdf文档形态数据
    docScrollTop: undefined,
    docScrollBottom: undefined,
    docScrollHeight: undefined,
    docClientWidth: undefined,
    docClientHeight: undefined,
    // pdf缩略图形态数据
    preScrollTop: undefined,
    preScrollHeight: undefined,
    preScrollBottom: undefined,
    thumbnailTop: undefined,
    thumbnailBottom: undefined,
    // pdf页面默认宽高
    pageDefaultWidth: undefined,
    pageDefaultHeight: undefined,
    // pdf页面实际宽高,
    pageWidth: undefined,
    pageHeight: undefined,
    // pdf缩放比例
    Mscale: undefined,
    // pdf总页数
    pdfTotalPagesNum: undefined,
    // 当前页面
    currentPage: 0,
    // 跳转页面
    targetPage: undefined,
    // 是否显示preview
    enablePreview: false,
    user: {}
  },
  mutations: {
    cmtChange (state, payload) {
      state[payload.param] = payload.value
    }
  },
  getters: {
    didDocReachedBottom (state) {
      return state.docScrollBottom >= state.docScrollHeight - 30
    },
    didPreviewReachedBottom (state) {
      if (state.preScrollTop === 0 && state.preScrollBottom === state.preScrollHeight) {
        return false
      } else {
        return state.preScrollBottom >= state.preScrollHeight - 30
      }
    }
  }
})
