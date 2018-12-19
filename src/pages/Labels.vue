<template>
  <container :contentTitle="'标签'">
    <div class="labels-wrapper">
      <div class="labelCounts"><span>目前共计{{labels.length}}个标签</span></div>
      <div class="labels">
        <span @click="selectLabel(item, index)" :class="[`l${item.level}`]" class="label bottom-line" v-for="(item, index) in labels" :key="index">{{item.content}}</span>
      </div>
    </div>
    <blog-list style="border: none" v-bind="blogList" :pageSize="8"></blog-list>
  </container>
</template>

<script>
import container from '@/components/container'
import blogList from '@/components/Blog/blogList'
import fetchData from '@/store/fetchData'
import {parsingObjToStr} from '@/store/utils'

export default {
  components: {
    container,
    blogList
  },
  data () {
    return {
      labels: [],
      blogsTotalCount: 0,
      currentIndex: undefined,
      blogList: {}
    }
  },
  methods: {
    getLabels () {
      fetchData('/blog/getLabels', {}, 'GET').then(r => {
        function level1 (num) {
          const seed = 0.03125
          if (num === 0) {
            return 0
          } else if (num > 0 && num < seed * 1) {
            return 1
          } else if (num >= seed * 1 && num < seed * 2) {
            return 2
          } else if (num >= seed * 2 && num < seed * 3) {
            return 3
          } else if (num >= seed * 3 && num < seed * 4) {
            return 4
          } else if (num >= seed * 4 && num < seed * 5) {
            return 5
          } else if (num >= seed * 5 && num < seed * 6) {
            return 6
          } else if (num >= seed * 6 && num < seed * 7) {
            return 7
          } else if (num >= seed * 7) {
            return 8
          }
        }
        if (r.ok) {
          let labels = r.msg
          this.blogsTotalCount = r.blogsTotalCount
          for (let label of labels) {
            let level = level1(label.blogs.length / r.blogsTotalCount)
            label = Object.assign(label, {level})
          }
          this.labels = labels
        }
      })
    },
    selectLabel (item, index) {
      this.blogList = {
        type: `label-${item._id}`,
        title: item.content,
        findParamsStr: parsingObjToStr({
          labelId: item._id
        })
      }
      this.currentIndex = index
    }
  },
  watch: {
    labels () {
      this.selectLabel(this.labels[0], 0)
    }
  },
  created () {
    this.getLabels()
  }
}
</script>

<style lang="scss" scoped>
.labels-wrapper{
  padding: 10px;
  border: 1px solid #777;
  border-radius: 8px;
  .labelCounts{
    text-align: center;
  }
  .labels {
    width: 90%;
    margin: 0px auto 20px auto;
    .label {
      color: #000;
      display: inline-block;
      margin: 10px 15px;
      &.l0{
        display: none;
      }
      &.l1 {
        font-size: 13px;
        opacity: 0.65;
      }
      &.l2 {
        font-size: 15px;
        opacity: 0.7;
      }
      &.l3 {
        font-size: 17px;
        opacity: 0.75;
      }
      &.l4 {
        font-size: 19px;
        opacity: 0.8;
      }
      &.l5 {
        font-size: 21px;
        opacity: 0.85;
      }
      &.l6 {
        font-size: 23px;
        opacity: 0.9;
      }
      &.l7 {
        font-size: 25px;
        opacity: 0.95;
      }
      &.l8 {
        font-size: 27px;
        opacity: 1;
      }
    }
    .bottom-line {
      cursor: pointer;
      &::before {
        height: 1px;
        visibility: visible;
        transform: scale(1);
        opacity: 0.3;
      }
    }
    .bottom-line:hover::before,
    .bottom-line.select::before{
      opacity: 1;
    }
  }
}
</style>
