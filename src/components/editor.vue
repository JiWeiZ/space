<template>
  <div id="editor">
    <div class="editor-top">
      <div class="editor-top-left">
        <input type="text" class="blog-title" v-model="blogTitle" placeholder="请输入标题">
      </div>
      <div class="editor-top-right">
        <div class="save">
          <div title="保存(ctrl+s)" @click="saveDraft($refs.md.d_value, $refs.md.d_render)" class="save-i"><i class="far fa-save"></i><span>保存</span></div>
        </div>
        <div class="release">
          <div class="release-i" @click="showClassifyBox"><i class="fas fa-sync"></i><span>发布</span></div>
          <div class="classify-box" v-show="isClassifyBoxShow">
            <div class="row">
              <label class="classify-label">文章归类：</label>
              <div class="classify-content">
                <tag-box :maxTagNum="1" @tagsChange="categoryChange" ref="tagBoxCategory">新增类别（最多1个）</tag-box>
              </div>
            </div>
            <div class="row">
              <label class="classify-label">文章标签：</label>
              <div class="classify-content">
                <tag-box :maxTagNum="6" @tagsChange="labelsChange" ref="tagBoxLabel">添加标签（最多6个）</tag-box>
              </div>
            </div>
            <div class="row">
              <label class="classify-label">快速添加：</label>
              <div class="labels-box">
                <ul class="labels-box-categories">
                  <li
                    class="labels-box-category"
                    :class="{selected: categoryLabelBoxSelected === item.category}"
                    @click="changeLablesShowing(item)"
                    v-for="(item, index) in categories"
                    :key="index"
                  >{{item.category}}</li>
                </ul>
                <div class="labels-box-content">
                  <div v-if="lablesShowing.length" v-for="(item, index) in lablesShowing" :key="index" class="label" @click="addLable(item)">{{item}}</div>
                  <div v-if="!lablesShowing.length" class="no-label">{{noLabelTips}}</div>
                </div>
              </div>
            </div>
            <div class="row" style="padding-left: 95px;margin-top: 20px">
                <div class="btn btn-primary" style="margin-right:20px;" @click="saveBlog($refs.md.d_value, $refs.md.d_render)">{{blogId ? '更新博文' : '直接发布'}}</div>
                <div class="btn btn-primary" title="保存(ctrl+s)" @click="saveDraft($refs.md.d_value, $refs.md.d_render)">{{blogDraftId ? '更新草稿' : '保存为草稿'}}</div>
                <div class="btn btn-primary-s" @click="hideClassifyBox">返回</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <mavon-editor
      :ishljs="true"
      :toolbars="toolbars"
      :value="mdValue"
      class="m-editor"
      @save="saveDraft"
      @imgAdd="imgAdd"
      ref="md"
    ></mavon-editor>
  </div>
</template>

<script>
import 'mavon-editor/dist/css/index.css'
import { mavonEditor } from 'mavon-editor'
import tagBox from '@/components/Tag/tagBox'
import MessageBox from '@/components/Common/MessageBox/MessageBox'

import fetchData from '@/store/fetchData'
import {toText} from '@/store/utils'

mavonEditor.getMarkdownIt()
export default {
  name: 'editor',
  components: {
    mavonEditor,
    tagBox,
    MessageBox
  },
  data () {
    return {
      categoryLabelBoxSelected: '',
      mdValue: '',
      blogTitle: '',
      blogDraftId: '',
      blogId: '',
      isClassifyBoxShow: false,
      categoryAdded: '',
      labelsSelected: [],
      categories: [],
      labels: [],
      lablesShowing: [],
      noLabelTips: '选择一个类别快速添加标签~',
      toolbars: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        mark: true, // 标记
        superscript: true, // 上角标
        subscript: true, // 下角标
        quote: true, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        code: true, // code
        table: true, // 表格
        // fullscreen: true, // 全屏编辑
        readmodel: true, // 沉浸式阅读
        htmlcode: true, // 展示html源码
        help: true, // 帮助
        /* 1.3.5 */
        undo: true, // 上一步
        redo: true, // 下一步
        trash: true, // 清空
        // save: true, // 保存（触发events中的save事件）
        /* 1.4.2 */
        navigation: true, // 导航目录
        /* 2.1.8 */
        alignleft: true, // 左对齐
        aligncenter: true, // 居中
        alignright: true, // 右对齐
        /* 2.2.1 */
        subfield: true, // 单双栏模式
        preview: true
      },
      uploadToken: ''
    }
  },
  props: {
    initBlogDraftId: { type: String, default: '' },
    initBlogId: { type: String, default: '' }
  },
  methods: {
    initContent: function () {
      let data
      if (this.initBlogId) {
        data = fetchData('/blog/edit', { id: this.initBlogId }, 'GET').then(r => {
          if (r.ok) {
            this.blogDraftId = r.msg.blogDraft
            return r
          }
        })
      } else {
        if (this.initBlogDraftId) {
          data = fetchData('/blog/draft', { id: this.initBlogDraftId }, 'GET').then(r => {
            if (r.ok) {
              this.blogId = r.msg.blog
              return r
            }
          })
        } else {
          return
        }
      }
      data
        .then(r => {
          if (r.ok) {
            this.blogTitle = r.msg.title
            this.mdValue = r.msg.sourceValue
            if (r.msg.category) {
              this.categoryLabelBoxSelected = r.msg.category.content
            }
            let labelArr
            if (r.msg.labels.length) {
              labelArr = r.msg.labels.map(e => e.content)
            }
            if (r.msg.category && r.msg.labels.length) {
              this.$nextTick(() => {
                for (let item of this.categories) {
                  if (item.category === this.categoryLabelBoxSelected) {
                    this.changeLablesShowing(item)
                  }
                }
                for (let i = 0; i < labelArr.length; i++) {
                  // 因为我用了时间戳做key，所以如果不加个setTimeout的话会造成key值重复
                  setTimeout(() => {
                    this.addLable(labelArr[i])
                  }, 2)
                }
              })
            }
          }
        })
        .catch(e => {
          console.log(e)
        })
    },
    imgAdd (fileName, file) {
      const $vm = this.$refs.md
      if (file.size >= 1048576) {
        this.$confirm({
          content: '图片大小限制1MB',
          type: 'error',
          cancelButtonText: '取消上传'
        })
          .then(() => {
            this.$message({
              content: '已取消上传',
              type: 'success'
            })
            // $vm.$refs.toolbar_left.$imgDelByFilename(fileName)
            $vm.$imgDel([file, fileName])
          })
          .catch(() => {
            this.$message({
              content: '已取消上传',
              type: 'success'
            })
            // $vm.$refs.toolbar_left.$imgDelByFilename(fileName)
            $vm.$imgDel([file, fileName])
          })
      } else {
        fetchData('/blog/uploadToken', {}, 'POST').then(r => {
          if (r.ok) {
            this.uploadToken = r.msg
          } else {
            throw new Error(r.msg)
          }
        }).then(() => {
          let formData = new FormData()
          formData.append('token', this.uploadToken)
          formData.append('file', file)
          fetchData('http://upload-z2.qiniup.com', formData, 'POST_FD').then(r => {
            $vm.$img2Url(fileName, r.url)
          }).catch(e => {
            console.log(e)
          })
        }).catch(error => {
          this.$message({
            content: error.message,
            type: 'error'
          })
        })
      }
    },
    showClassifyBox () {
      this.isClassifyBoxShow = !this.isClassifyBoxShow
    },
    hideClassifyBox () {
      this.isClassifyBoxShow = false
    },
    saveDraft (sourceValue, htmlValue) {
      let abstract = toText(htmlValue).substr(0, 180) + '...'
      const postData = {
        id: this.blogDraftId,
        title: this.blogTitle,
        category: this.categoryAdded,
        labels: Array.prototype.slice.call(this.labels),
        sourceValue,
        abstract
      }
      fetchData('/blog/draft', postData, 'POST').then(result => {
        if (result.ok) {
          this.blogDraftId = result.blogDraftId
          this.$message({
            content: result.msg,
            type: 'success'
          })
        } else {
          this.$message({
            content: result.msg,
            type: 'error'
          })
        }
      })
    },
    saveBlog (sourceValue, htmlValue) {
      let abstract = toText(htmlValue).substr(0, 180) + '...'
      const postData = {
        id: this.blogId,
        blogDraftId: this.blogDraftId,
        title: this.blogTitle,
        category: this.categoryAdded,
        labels: Array.prototype.slice.call(this.labels),
        sourceValue,
        abstract
      }
      fetchData('/blog/save', postData, 'POST').then(result => {
        if (result.ok) {
          this.blogId = result.blogId
          this.$message({
            content: result.msg,
            type: 'success'
          })
        } else {
          this.$message({
            content: result.msg,
            type: 'error'
          })
        }
      })
    },
    getCategorieAndLabels () {
      fetchData('/blog/getCategorieAndLabels', {}, 'GET').then(result => {
        if (result.ok) {
          this.categories = result.msg
        }
      })
    },
    categoryChange (tags) {
      this.categoryAdded = tags[0]
    },
    labelsChange (tags) {
      this.labels = tags
    },
    changeLablesShowing (item) {
      this.categoryLabelBoxSelected = item.category
      this.lablesShowing = item.labels.map(e => e.content)
      this.$refs.tagBoxCategory.onDeleteTag(0)
      this.$refs.tagBoxCategory.onInitTag(item.category)

      if (!item.labels.length) {
        this.noLabelTips = '这个类别下面暂无标签~'
      }
    },
    addLable (item) {
      if (this.labels.length) {
        for (let label of this.labels) {
          if (item === label) {
            this.$message({
              content: '这个标签已经添加过了',
              type: 'warn'
            })
            return
          }
        }
      }
      this.$refs.tagBoxLabel.onInitTag(item)
    },
    addCategory () {}
  },
  watch: {
    initBlogDraftId () {
      this.blogDraftId = this.initBlogDraftId
      this.initContent()
    },
    initBlogId () {
      this.blogId = this.initBlogId
      this.initContent()
    }
  },
  mounted () {
    this.getCategorieAndLabels()
    // 调整一下toolbar的高度
    let toolbar = document.querySelector(
      '#editor > div.v-note-wrapper.markdown-body.m-editor > div.v-note-op.shadow'
    )
    toolbar.style.position = 'absolute'
    toolbar.style.top = '-93px'
  }
}
</script>

<style lang="scss" scoped>
#editor {
  height: 100%;
  padding-top: 6px;
  .editor-top {
    display: flex;
    flex-direction: row;
    font-size: 20px;
    font-weight: 700;
    padding-top: 40px;
    .editor-top-left {
      flex: 1 0 50%;
      .blog-title {
        width: 100%;
        outline: none;
        border: none;
        line-height: 50px;
        padding: 0 1em;
        border-right: 6px solid #e5e5e5;
      }
    }
    .editor-top-right {
      flex: 1 0 50%;
      display: flex;
      align-items: center;
      color: #757575;
      background: #fff;
      .save {
        margin-left: auto;
        padding: 13px 25px;
        cursor: pointer;
        &:hover {
          color: #959595;
        }
      }
      .release {
        position: relative;
        padding: 13px 25px;
        .release-i {
          cursor: pointer;
          &:hover {
            color: #959595;
          }
        }
        .classify-box {
          padding: 10px 0;
          border-radius: 5px;
          position: absolute;
          width: 550px;
          top: 45px;
          right: 15px;
          z-index: 2000;
          background: #fff;
          box-shadow: 0px 0px 12px 2px rgba(0, 0, 0, 0.18);
          font-size: 15px;
          font-weight: 400;
          color: #333;
          .row {
            margin: 10px 0;
            display: flex;
            .classify-label {
              width: 90px;
              text-align: right;
            }
            .classify-content {
              width: 440px;
              .classify-title {
                display: inline-block;
                margin-left: 5px;
                color: #2790da;
              }
              .category-select {
                border: 1px solid #ddd;
                border-radius: 4px;
                background-color: #fff;
                margin-left: 5px;
              }
            }
            .labels-box {
              margin-left: 5px;
              border-radius: 4px;
              border: 1px solid #c1c1c1;
              padding-left: 2px;
              display: flex;
              align-items: stretch;
              .labels-box-categories {
                padding-top: 5px;
                border-radius: 4px;
                width: 7em;
                height: 185px;
                overflow-y: scroll;
                .selected {
                  color: #222;
                  background: #addaf9;
                }
                .labels-box-category {
                  margin: 0 5px 3px 5px;
                  padding: 2px;
                  text-align: center;
                  border-radius: 3px;
                  color: #333;
                  cursor: pointer;
                  &:hover {
                    color: #222;
                    background: #addaf9;
                  }
                }
              }
              .labels-box-content {
                padding: 5px 10px 0px 10px;
                width: calc(440px - 7em);
                position: relative;
                height: 185px;
                overflow-y: scroll;
                .label {
                  display: inline-block;
                  margin: 3px;
                  white-space: nowrap;
                  background: #addaf9;
                  padding: 3px 7px;
                  border-radius: 10px;
                  color: #222;
                  &:hover {
                    cursor: pointer;
                  }
                }
                .no-label {
                  position: absolute;
                  white-space: nowrap;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                }
              }
            }
          }
          &::before {
            content: "";
            cursor: default;
            display: block;
            position: absolute;
            background: #fff;
            width: 15px;
            height: 15px;
            top: -8px;
            right: 20px;
            -webkit-transform: rotate(45deg);
            transform: rotate(45deg);
          }
        }
      }
      span {
        margin-left: 5px;
      }
    }
  }
  .m-editor {
    height: calc(100% - 90px);
    min-height: 474px;
  }
}
</style>
