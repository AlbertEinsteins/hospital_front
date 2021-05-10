<template>
  <q-page class="">
    <q-card>
      <card-header icon-name="assignment" title="用户注册" />

      <q-form ref="myF">
        <div class="q-pa-md">
          <div class="row">
            <q-input class="" dense label="账号"
              v-model="user.username" :rules="[val => !!val || 'Field is required']">
              <template v-slot:prepend>
                <span class="text-red" style="font-size: 0.8rem">*</span>
              </template>
            </q-input>
          </div>
          <div class="row">
            <q-input class="" dense label="真实姓名"
              v-model="user.fullname" :rules="[val => !!val || 'Field is required']">
              <template v-slot:prepend>
                <span class="text-red" style="font-size: 0.8rem">*</span>
              </template>
            </q-input>
          </div>
          <div class="row">
            <q-input class="" dense label="手机号"
              v-model="user.phone" :rules="[val => !!val || 'Field is required']">
              <template v-slot:prepend>
                <span class="text-red" style="font-size: 0.8rem">*</span>
              </template>
              </q-input>
          </div>
          <div class="row">
            <q-input class="" dense label="密码" type="password"
              v-model="user.password" :rules="[val => !!val || 'Field is required']">
              <template v-slot:prepend>
                <span class="text-red" style="font-size: 0.8rem">*</span>
              </template>
              </q-input>
          </div>
          <div class="row">
            <q-input class="" dense label="再次输入密码" type="password"
              v-model="repassword" :rules="[val => !!val || 'Field is required']">
              <template v-slot:prepend>
                <span class="text-red" style="font-size: 0.8rem">*</span>
              </template>
              </q-input>
          </div>
          <div class="row">
            <q-select class="col-3" dense label="权限设置"
              v-model="user.rid" :rules="[val => !!val || 'Field is required']"
              :options="options.roles" option-label="name" option-value="rid" emit-value map-options>
              <template v-slot:prepend>
                <span class="text-red" style="font-size: 0.8rem">*</span>
              </template>
              </q-select>
          </div>
          <div class="row q-gutter-lg">
            <q-btn color="green" class="q-px-sm" label="注册" @click="regist"></q-btn>
            <q-btn color="grey-1" class="text-black" label="清空条件" @click="clear"></q-btn>
          </div>
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>

<script>
import CardHeader from 'src/components/CardHeader.vue'

import UserService from '../service/user.service.js'
import AuthService from '../service/auth.service.js'
export default {
  components: {
    CardHeader
  },
  name: 'UserRegister',
  data () {
    return {
      user: {
        username: '',
        fullname: '',
        phone: '',
        password: '',
        rid: ''
      },
      repassword: '',
      options: {
        roles: []
      }
    }
  },
  created () {
    this.getRoles()
  },
  methods: {
    getRoles () {
      UserService.getRoles()
        .then(resp => {
          const { data: res } = resp
          if (res.code === 10000) {
            this.options.roles = res.data
          }
        }).catch(() => this.$message.error('Network Error'))
    },
    regist () {
      if (this.repassword !== this.user.password) {
        this.$message.info('两次密码不一致')
        return
      }

      this.$refs.myF.validate().then(isValid => {
        if (isValid) {
          AuthService.signup(this.user)
            .then(resp => {
              const { data: res } = resp
              if (res.code === 10000) {
                this.$message.info('注册成功!')
              }
            })
        }
      })
    },
    clear () {
      this.user = {
        username: '',
        fullname: '',
        phone: '',
        password: '',
        rid: ''
      }
      this.repassword = ''
      setTimeout(() => {
        this.reset()
      }, 200)
    },
    reset () {
      this.$refs.myF.resetValidation()
    }
  }
}

</script>
