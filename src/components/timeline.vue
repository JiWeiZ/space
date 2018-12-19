<template>
  <div class="timeline-wrapper">
    <p class="tip">嗯...！目前共计{{blogs.length}}篇文章。继续努力！</p>
    <div class="timeline" v-for="(item, index) of blogsKey" :key="index">
      <h1 class="dot-h1">{{item}}</h1>
      <p class="timeline-main dot-p" v-for="(blog, index) of blogsSorted.get(item).sort((a,b) => b.addTime - a.addTime)" :key="index">
        <span class="timeline-date">{{blog.addMD}}</span><span class="timeline-title"><router-link class="bottom-line" :to="'/blog/' + blog._id">{{blog.title}}</router-link></span><span class="timeline-author"><i style="color:#999" class="fas fa-user"></i>{{blog.creatorName}}</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    blogs: Array
  },
  data () {
    return {
    }
  },
  computed: {
    blogsSorted () {
      // 简单处理一下从后端拿到的原始blog：
      // 1. 加了addYear, addMonth, addDay, addMD四个属性
      // 2. 把blog.creator.userName => blog.creatorName

      function DeepCopyArr (blogArr) {
        function DeepCopyObj (obj) {
          let obj1 = {}
          for (let item of Object.entries(obj)) {
            if (typeof item[1] === 'object') {
              obj1[item[0]] = DeepCopyObj(item[1])
            } else {
              obj1[item[0]] = item[1]
            }
          }
          return obj1
        }

        let blogArr1 = []
        for (let blog of blogArr) {
          blogArr1.push(DeepCopyObj(blog))
        }
        return blogArr1
      }

      function addZero (n) {
        return n >= 0 && n < 10 ? `0${n}` : `${n}`
      }

      let blogs = DeepCopyArr(this.blogs)
      let blogsMap = new Map()
      for (let blog of blogs) {
        blog.creatorName = blog.creator.userName
        delete blog.creator
        let addDate = new Date(blog.addTime)
        let dateObj = {
          addYear: addDate.getFullYear(),
          addMD: `${addZero(addDate.getMonth() + 1)}-${addZero(addDate.getDate())}`
        }
        Object.assign(blog, dateObj)
        // 分组，如果blogsSorted有addYear就添加到addYear对应的组，否则新建分组
        if (blogsMap.has(blog.addYear)) {
          blogsMap.get(blog.addYear).push(blog)
        } else {
          blogsMap.set(blog.addYear, [blog])
        }
      }
      return blogsMap
    },
    blogsKey () {
      return [...this.blogsSorted.keys()].sort((a, b) => b - a)
    }
  }
}
</script>

<style lang="scss" scoped>
.bottom-line::before {
  height: 1px;
}
.dot-h1{
  position: relative;
  &::before{
    position: absolute;
    top: 12px;
    left: -16px;
    content: '';
    display: block;
    width: 8px;
    height: 8px;
    border-radius: 10px;
    background: #888;
  }
}

.dot-p{
  position: relative;
  &::before{
    position: absolute;
    top: 16px;
    left: -5px;
    content: '';
    display: block;
    width: 6px;
    height: 6px;
    border-radius: 10px;
    background: #999;
  }
}

.timeline-wrapper {
  padding: 10px 0 20px 0;
  .tip {
    margin: 10px;
    position: relative;
    &::before{
    position: absolute;
    top: 3px;
    left: -17px;
    content: '';
    display: block;
    width: 10px;
    height: 10px;
    border-radius: 10px;
    background: #777;
    }
  }
  border-left: 4px solid #eee;
  .timeline {
    h1 {
      margin-left: 10px;
    }
    .timeline-main {
      padding: 10px 0 10px 10px;
      border-bottom: 1px dashed #ccc;
      .timeline-date {
        margin: 0 5px;
        font-size: 14px;
      }
      .timeline-author{
        i{
          margin-right: 3px;
        }
        margin-left: 15px;
      }
    }
  }
}
</style>
