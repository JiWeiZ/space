import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/Home'
import Classify from '@/pages/Classify'
import Shared from '@/pages/Shared'
import PDF from '@/components/PDFs/PDF'
import Edit from '@/pages/Edit'
import User from '@/pages/User'
import Read from '@/pages/Read'
import Labels from '@/pages/Labels'
import TimeLine from '@/pages/TimeLine'
import About from '@/pages/About'
import blogList from '@/components/Blog/blogList'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      component: Home
    }, {
      path: '/home',
      component: Home
    }, {
      path: '/classify',
      component: Classify
    }, {
      path: '/labels',
      component: Labels
    }, {
      path: '/timeline',
      component: TimeLine
    }, {
      path: '/shared',
      component: Shared
    }, {
      path: '/about',
      component: About
    }, {
      path: '/shared/pdf/:id',
      component: PDF
    }, {
      path: '/edit',
      component: Edit
    }, {
      path: '/user/:id',
      component: User,
      children: [{
        path: 'blogList',
        component: blogList,
        props: (route) => ({
          type: route.query.type,
          title: route.query.title,
          findParamsStr: route.query.findParamsStr
        })
      }]
    }, {
      path: '/blog/draft/:id',
      component: Edit
    }, {
      path: '/blog/edit/:id',
      component: Edit
    }, {
      path: '/blog/:id',
      component: Read
    }
  ]
})
