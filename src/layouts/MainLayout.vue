<template>
  <q-layout view="hHh lpr lff">
    <q-header elevated>
      <q-toolbar class="q-pt-sm q-px-xs title-bg">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title class="row"
          style="font-family: STKaiti;">
            <div style="height: 45px;"><img style="height: 45px;" src="~assets/lo.png" alt=""></div>
            <span style="font-weight: 300; margin-left: 2px;padding-top: 3px;">
              <div>住院管理系统</div>
              <div style="font-size: 10px; font-family: Microsoft Yahei">System of hospital management in</div>
            </span>
        </q-toolbar-title>

        <div class="q-mr-lg"><q-icon name="person"></q-icon>欢迎您,{{ currentUser.username }}</div>
        <div class="q-mr-lg col-shrink">岗位: [ {{ currentPosition }} ]</div>
        <q-btn-dropdown auto-close stretch flat>
          <template v-slot:label>
            <div class=" justify-around items-center no-wrap">
              <q-icon name="perm_identity" style="font-size: 21px;"/>
              {{ currentUser.username }}
            </div>
          </template>

          <q-list bordered style="">
            <q-item clickable v-ripple @click="showChangePwdDialog = true">
              <q-item-section avatar>
                <q-icon name="settings_suggest" color="primary"></q-icon>
              </q-item-section>
              <q-item-section style="font-size: 13px;" class="text-grey-7">修改密码</q-item-section>
            </q-item>

            <q-item clickable v-ripple @click="logOut">
              <q-item-section avatar>
                <q-icon name="cached" color="primary"></q-icon>
              </q-item-section>
              <q-item-section style="font-size: 13px;" class="text-grey-7">退出登录</q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/">
              <q-item-section avatar>
                <q-icon name="home" color="primary"></q-icon>
              </q-item-section>
              <q-item-section style="font-size: 13px;" class="text-grey-7">返回主页</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="250"
      class="bg-green-3"
    >
      <q-scroll-area class="fit bg-green-1">
        <Time />
        <Menu class="text-grey-8" :menus="menuList" icon-color="text-cyan"/>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <keep-alive :exclude="['PatientStatistic', 'WardStatistic', 'MedicationStock',
        'MedicationEnrollSearch', 'OutHospitalizedSearch', 'EnHospitalizedSearch', 'PaySearch',
        'MedicalAdvice', 'PayRecord']">
        <router-view class="q-pa-xs"/>
      </keep-alive>
    </q-page-container>

  <q-dialog v-model="showChangePwdDialog">
    <q-card style="min-width: 280px; width: 70%;">
      <q-card-section class="row items-center">
        <q-avatar icon="warning" color="info" text-color="white" />
        <span class="q-ml-sm">请输入新密码:</span>
      </q-card-section>
      <q-card-section>
        <q-input v-model="user.password" type="password" label="新密码"></q-input>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="撤销" color="primary" v-close-popup />
        <q-btn flat color="warning" @click="changePwd">
          修改
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
  </q-layout>
</template>

<script>

import Menu from 'components/Menu.vue'
import Time from 'components/Time.vue'

import MenuService from '../service/menu.service.js'
import UserService from 'src/service/user.service.js'
// import UserService from '../service/user.service.js'

export default {
  name: 'MainLayout',
  components: { Menu, Time },
  data () {
    return {
      leftDrawerOpen: false,
      menuList: [],
      showChangePwdDialog: false,

      user: {
        username: '',
        password: ''
      }
    }
  },
  created () {
    this.getMenu()
  },
  methods: {
    changePwd () {
      this.user.username = this.currentUser.username
      UserService.changePwd(this.user)
        .then(resp => {
          const { data: res } = resp
          if (res.code === 10000) {
            this.$message.success('修改成功')
            this.showChangePwdDialog = false
            return
          }
          this.$message.warn(`操作失败${',' + res.message}`)
        })
    },
    getMenu () {
      const menus = sessionStorage.getItem('menu')
      if (!menus) {
        MenuService.getMenus(this.currentUser.rid)
          .then(resp => {
            // console.log(resp)
            this.menuList = resp.data.data
            // sessionStorage.setItem('menu', JSON.stringify(this.menuList))
          })
          .catch(err => {
            console.log(err && err.message)
            this.menuList = menus
          })
      } else {
        this.menuList = JSON.parse(menus)
      }
    },
    logOut () {
      this.$router.replace('/')
      window.location.reload()
      sessionStorage.removeItem('menu')
      localStorage.removeItem('user')
      this.$store.dispatch('auth/logOut')
    }
  },
  computed: {
    currentUser () {
      return this.$store.state.auth.user
    },
    currentPosition () {
      const role = this.currentUser.roles[0]
      if (role === 'ROLE_ADMIN') {
        return '管理员'
      } else if (role === 'ROLE_FRONT') {
        return '服务前台'
      } else if (role === 'ROLE_DOCTOR') {
        return '住院医师'
      } else if (role === 'ROLE_NURSE') {
        return '护士'
      }
      return 'Unknown'
    }
  }
}
</script>

<style lang="scss">
  .title-bg {
    background-image: linear-gradient(to right, rgb(62, 165, 250), #3825e6);
  }
</style>
