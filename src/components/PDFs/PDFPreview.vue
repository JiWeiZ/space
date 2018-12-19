<template>
  <div class="pdf-preview" v-resize="updatePreParams" v-scroll="updatePreParams">
    <PDFThumbnail
      v-for="(page, index) in pages"
      :key="index"
      v-bind="{page, index, Nscale}"
    >
    </PDFThumbnail>
  </div>
</template>

<script>
import PDFThumbnail from './PDFThumbnail'
import { mapState } from 'vuex'
import resize from '@/directives/resize'
import scroll from '@/directives/scroll'
import { floor } from '@/store/utils'

export default {
  data () {
    return {
      Nscale: undefined
    }
  },
  components: {
    PDFThumbnail
  },
  directives: {
    resize,
    scroll
  },
  props: {
    pages: {type: Array, required: true}
  },
  computed: {
    ...mapState(['viewerHeight', 'pageDefaultWidth', 'pageDefaultHeight'])
  },
  methods: {
    updatePreParams () {
      this.$store.commit('cmtChange', {param: 'preScrollTop', value: this.$el.scrollTop})
      this.$store.commit('cmtChange', {param: 'preScrollHeight', value: this.$el.scrollHeight})
      this.$store.commit('cmtChange', {param: 'preScrollBottom', value: this.$el.scrollTop + this.$el.clientHeight})
    },
    updateNscale () {
      const em = parseInt(window.getComputedStyle(this.$el, null).fontSize)
      const scaleFitWidth = floor((this.$parent.$el.clientWidth * 0.15 - em) / this.pageDefaultWidth, 2)
      this.Nscale = scaleFitWidth
    }
  },
  updated () {
    this.updateNscale()
    this.$nextTick(() => {
      this.updatePreParams()
    })
  }
}
</script>

<style scoped>
.pdf-preview{
  display: flex;
  width: 15%;
  height: 100%;
  align-items: center;
  flex-direction: column;
  background: #aaa;
  overflow-x: hidden;
  overflow-y: scroll;
}
</style>
