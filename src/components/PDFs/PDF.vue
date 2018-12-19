<template>
  <div id="pdf">
    <PDFViewer
      v-bind="{PDFURL}"
      @document-handled="onDocumentHandled"
    ></PDFViewer>
  </div>
</template>

<script>
import PDFViewer from './PDFViewer'
import fetchData from '@/store/fetchData'

export default {
  name: 'PDF',
  components: {
    PDFViewer
  },
  data () {
    return {
      id: this.$route.params.id,
      PDFURL: '',
      documentInfo: ''
    }
  },
  methods: {
    getPDFURL () {
      const queries = {
        id: this.id
      }
      fetchData('/share/pdf', queries, 'GET').then((r) => {
        if (r.ok) {
          this.PDFURL = r.msg
        }
      })
    },
    onDocumentHandled (e) {
      this.documentInfo = e.text
    }
  },
  created () {
    this.getPDFURL()
  }
}
</script>
<style scoped>
#pdf{
  background: #fff;
}
</style>
