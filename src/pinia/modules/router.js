import { asyncRouterHandle } from '@/utils/asyncRouter'

import { asyncMenu } from '@/api/menu'
import { defineStore } from 'pinia'
import { ref } from 'vue'

const routerListArr = []
const keepAliveRoutersArr = []

const formatRouter = (routes, routeMap) => {
  routes && routes.forEach(item => {
    if ((!item.children || item.children.every(ch => ch.hidden)) && item.name !== '404' && !item.hidden) {
      routerListArr.push({ label: item.meta.title, value: item.name })
    }
    item.meta.btns = item.btns
    item.meta.hidden = item.hidden
    routeMap[item.name] = item
    if (item.children && item.children.length > 0) {
      formatRouter(item.children, routeMap)
    }
  })
}

const KeepAliveFilter = (routes) => {
  routes && routes.forEach(item => {
    // 子菜单中有 keep-alive 的，父菜单也必须 keep-alive，否则无效。这里将子菜单中有 keep-alive 的父菜单也加入。
    if ((item.children && item.children.some(ch => ch.meta.keepAlive) || item.meta.keepAlive)) {
      item.component && item.component().then(val => { keepAliveRoutersArr.push(val.default.name) })
    }
    if (item.children && item.children.length > 0) {
      KeepAliveFilter(item.children)
    }
  })
}

export const useRouterStore = defineStore('router', () => {
  const asyncRouters = ref([])
  const routerList = ref(routerListArr)
  const keepAliveRouters = ref(keepAliveRoutersArr)
  const routeMap = ({})
  // 从后台获取动态路由
  const SetAsyncRouter = async() => {
    const baseRouter = [{
      path: '/layout',
      name: 'layout',
      component: 'view/layout/index.vue',
      meta: {
        title: '底层layout'
      },
      children: []
    }]
    const menus = {
      'code': 0,
      'data': {
        'menus': [
          {
            'parentId': '0',
            'path': 'dashboard',
            'name': 'dashboard',
            'hidden': false,
            'component': 'view/dashboard/index.vue',
            'sort': 0,
            'icon': 'key',
            'ID': 1,
            'menuId': 1,
            'meta': {
              'keepAlive': false,
              'title': '主頁',
              'icon': 'key',
              'closeTab': false
            },
            'children': []
          },
          {
            'parentId': '0',
            'path': 'classmanage',
            'name': 'classmanage',
            'hidden': false,
            'component': 'view/classmanage/Classmanage.vue',
            'sort': 0,
            'icon': 'House',
            'ID': 2,
            'menuId': 2,
            'meta': {
              'keepAlive': false,
              'title': '班级管理',
              'icon': 'House',
              'closeTab': false
            },
            'children': []
          },
          {
            'parentId': '0',
            'path': 'userlist',
            'name': 'userlist',
            'hidden': false,
            'component': 'view/userlist/Userlist.vue',
            'sort': 0,
            'icon': 'user',
            'ID': 3,
            'menuId': 3,
            'meta': {
              'keepAlive': false,
              'title': '学生管理',
              'icon': 'user',
              'closeTab': false
            },
            'children': []
          },
          {
            'parentId': '0',
            'path': 'lessonlist',
            'name': 'lessonlist',
            'hidden': false,
            'component': 'view/lessonlist/Lessonlist.vue',
            'sort': 0,
            'icon': 'Collection',
            'ID': 4,
            'menuId': 4,
            'meta': {
              'keepAlive': false,
              'title': '课程管理',
              'icon': 'Collection',
              'closeTab': false
            },
            'children': []
          },
          {
            'parentId': '0',
            'path': 'classroom',
            'name': 'classroom',
            'hidden': false,
            'component': 'view/classroom/Classroom.vue',
            'sort': 0,
            'icon': 'DataBoard',
            'ID': 4,
            'menuId': 4,
            'meta': {
              'keepAlive': false,
              'title': '课室管理',
              'icon': 'DataBoard',
              'closeTab': false
            },
            'children': []
          },
          {
            'parentId': '0',
            'path': 'lessontime',
            'name': 'lessontime',
            'hidden': false,
            'component': 'view/lessontime/Lessontime.vue',
            'sort': 0,
            'icon': 'Timer',
            'ID': 4,
            'menuId': 4,
            'meta': {
              'keepAlive': false,
              'title': '课程时间管理',
              'icon': 'Timer',
              'closeTab': false
            },
            'children': []
          },
          {
            'parentId': '0',
            'path': 'signhistory',
            'name': 'signhistory',
            'hidden': false,
            'component': 'view/signhistory/Signhistory.vue',
            'sort': 0,
            'icon': 'DocumentChecked',
            'ID': 4,
            'menuId': 4,
            'meta': {
              'keepAlive': false,
              'title': '签到记录',
              'icon': 'DocumentChecked',
              'closeTab': false
            },
            'children': []
          },
          {
            'parentId': '0',
            'path': 'accountinfo',
            'name': 'accountinfo',
            'hidden': true,
            'component': 'view/accountinfo/Accountinfo.vue',
            'sort': 0,
            'icon': 'user',
            'ID': 10,
            'menuId': 10,
            'meta': {
              'keepAlive': false,
              'title': '帳號詳情',
              'icon': 'user',
              'closeTab': false
            },
            'children': []
          },
          {
            'parentId': '0',
            'path': 'usermanage',
            'name': 'usermanage',
            'hidden': true,
            'component': 'view/usermanage/Usermanage.vue',
            'sort': 0,
            'icon': 'user',
            'ID': 6,
            'menuId': 6,
            'meta': {
              'keepAlive': false,
              'title': '用户管理',
              'icon': 'user',
              'closeTab': false
            },
            'children': []
          },
          {
            'parentId': '0',
            'path': 'refresh',
            'name': 'refresh',
            'hidden': true,
            'component': 'view/layout/refresh/Refresh.vue',
            'sort': 0,
            'icon': '',
            'ID': 40,
            'menuId': 40,
            'meta': {
              'keepAlive': false,
              'title': '刷新',
              'icon': '',
              'closeTab': false
            },
            'children': []
          }
        ]
      }
    }





    console.log(menus)

    // const asyncRouterRes = await asyncMenu()
    // const asyncRouter = asyncRouterRes.data.menus
    const asyncRouter=menus.data.menus
    asyncRouter && asyncRouter.push({
      path: '404',
      name: '404',
      hidden: true,
      meta: {
        title: '迷路了*。*',
        closeTab: true,
      },
      component: 'view/error/index.vue'
    }, {
      path: 'reload',
      name: 'Reload',
      hidden: true,
      meta: {
        title: '',
        closeTab: true,
      },
      component: 'view/error/reload.vue'
    })
    formatRouter(asyncRouter, routeMap)
    baseRouter[0].children = asyncRouter
    baseRouter.push({
      path: '/:catchAll(.*)',
      redirect: '/layout/404'

    })
    asyncRouterHandle(baseRouter)
    KeepAliveFilter(asyncRouter)
    asyncRouters.value = baseRouter
    routerList.value = routerListArr
    keepAliveRouters.value = keepAliveRoutersArr
    return true
  }

  return {
    asyncRouters,
    routerList,
    keepAliveRouters,
    SetAsyncRouter,
    routeMap
  }
})

