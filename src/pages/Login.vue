<template>
  <div class="box fullscreen flex flex-center">
    <q-card class="signin-bg inset-shadow-down">
      <div class="q-pa-md q-px-lg">
        <div class="q-px-lg">
          <div class="logo text-right q-px-lg">
            <img src="~/assets/logo.jpeg" alt="Logo">
          </div>
          <div class="content q-px-lg">
            <q-input filled  label="用户名" v-model="username" dense>
              <template v-slot:prepend>
                <q-icon name="perm_identity"></q-icon>
              </template>
            </q-input>
            <q-input type="password" v-model="password" class="q-pt-sm" filled label="密码" dense>
              <template v-slot:prepend>
                <q-icon name="lock"></q-icon>
              </template>
            </q-input>
            <div class="q-pt-sm">
              <Verify :showButton="false"
                :barSize="{ width: '220px', height: '38px' }"
                :type="3" @success="success"
                ></Verify>
            </div>
          </div>
          <!-- <div class="q-mt-md text-right q-px-lg">
            <q-btn v-if="isShowLoginBtn" size="md" class="q-px-sm"
              label="登陆" @click="login" color="red-5"></q-btn>
          </div> -->
        </div>
      </div>
    </q-card>
  </div>
</template>

<script>
import Verify from 'vue2-verify'

export default {
  name: 'Login',
  components: { Verify },
  data () {
    return {
      // isShowLoginBtn: false,
      username: '',
      password: ''
    }
  },
  methods: {
    login (obj) {
      this.$store.dispatch('auth/login',
        { username: this.username, password: this.password })
        .then((res) => {
          console.log(res)
          if (res.code) {
            obj.refresh()
            this.$message.info(`登陆失败${',' + res.message}`)
            this.password = ''
            return
          }
          this.$message.success('登陆成功')
          this.$router.replace('/')
        }).catch(() => {
          obj.refresh()
          this.$message.error('Service error')
        })
    },
    success (obj) {
      // this.isShowLoginBtn = true
      this.login(obj)
    }
  }
}
</script>
<style lang="scss" slot-scope="Login">
  .box {
    background: url('~assets/bg2.jpg') no-repeat;
    background-size: 100% 100%;

  }
  .logo>img {
    width: 45px;
    height: 45px;
  }
  .signin-bg {
    background-size: 100% 100%;
    background-color: $blue-1;
  }
</style>
