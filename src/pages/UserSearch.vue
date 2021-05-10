<template>
  <q-page class="">
    <q-card>
      <card-header icon-name="assignment" title="用户查询" />

      <div class="q-pa-md q-pl-lg">
        <div class="row q-gutter-lg">
          <q-select class="col-4" label="用户类型" square dense v-model="queryVo.rid"
            :options="options.roles"
            option-label="name" option-value="rid" emit-value map-options>
          </q-select>
          <q-input class="col-4" label="账号" square dense v-model="queryVo.username"></q-input>
          <q-input class="col-4" label="真实姓名" square dense v-model="queryVo.fullname"></q-input>
          <q-input class="col-4" label="注册时间" square dense v-model="queryVo.registTime">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date v-model="queryVo.registTime" minimal>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

        </div>
        <div class="row q-pt-md q-gutter-lg">
          <q-btn color="green" class="q-px-sm" label="查询" @click="getPage"></q-btn>
          <q-btn color="grey-1" class="text-black" label="清空条件" @click="clear"></q-btn>
        </div>
      </div>
    </q-card>

    <q-table class="q-mt-md" title="用户"
      :data="data" :columns="columns">

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="username">{{ props.row.username }}</q-td>
          <q-td key="fullname">{{ props.row.fullname }}</q-td>
          <q-td key="type">
            <q-badge>{{ props.row.typeName }}</q-badge>
          </q-td>
          <q-td key="phone">{{ props.row.phone }}</q-td>
          <q-td key="registTime">{{ props.row.regist_time }}</q-td>
          <q-td key="operate" >
            <q-btn size="sm"
              @click="showConfirmDialog(props.row.uid)"
              class="q-ml-xs" color="warning" label="删除">
            </q-btn>
            <q-btn size="sm" class="q-ml-xs" color="cyan" @click="resetPwd(props.row.uid)">重置密码</q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>

  <q-dialog v-model="showConfirm">
    <q-card style="min-width: 280px;">
      <q-card-section class="row items-center">
        <q-avatar icon="warning" color="info" text-color="white" />
        <span class="q-ml-sm">确认?</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="撤销" color="primary" v-close-popup />
        <q-btn flat color="warning" @click="del">
          删除
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
  </q-page>
</template>

<script>
import CardHeader from 'src/components/CardHeader.vue'

import UserService from '../service/user.service.js'
import { date } from 'quasar'
export default {
  components: {
    CardHeader
  },
  name: 'UserSearch',
  data () {
    return {
      queryVo: {
        rid: '',
        username: '',
        fullname: '',
        registTime: ''
      },
      pagenum: 1,
      pagesize: 10,
      options: {
        roles: []
      },

      data: [],
      columns: [
        { label: '账号', name: 'username', align: 'left' },
        { label: '真实姓名', name: 'fullname', align: 'left' },
        { label: '用户类型', name: 'type', align: 'left' },
        { label: '电话号码', name: 'phone', align: 'left' },
        { label: '注册时间', name: 'registTime', align: 'left' },
        { label: '编辑', name: 'operate', align: 'left' }
      ],
      showConfirm: false,
      uid: ''
    }
  },
  created () {
    this.getPage()
    this.getRoles()
  },
  methods: {
    showConfirmDialog (uid) {
      this.uid = uid
      this.showConfirm = true
    },
    del () {
      console.log(this.uid)
      UserService.delById(this.uid)
        .then(resp => {
          const { data: res } = resp
          if (res.code === 10000) {
            this.$message.success('删除成功')
            this.showConfirm = false
            this.getPage()
            return
          }
          this.$message.warn(`操作失败${',' + res.message}`)
        })
    },
    resetPwd (uid) {
      this.uid = uid
      UserService.resetPwd(uid)
        .then(resp => {
          const { data: res } = resp
          if (res.code === 10000) {
            this.$message.success('重置成功')
            return
          }
          this.$message.warn('重置失败')
        }).catch(() => this.$message.error('重置失败, Service Error'))
    },
    getRoles () {
      UserService.getRoles()
        .then(resp => {
          const {
            data: res
          } = resp
          if (res.code === 10000) {
            console.log(res)
            this.options.roles = res.data
          }
        }).catch(() => this.$message.error('Network Error'))
    },
    getPage () {
      this.queryVo.registTime = date.formatDate(this.queryVo.registTime, 'YYYY-MM-DD HH:mm:ss')
      UserService.getPageResult(this.queryVo, this.pagenum, this.pagesize)
        .then(resp => {
          const {
            data: res
          } = resp
          if (res.code === 10000) {
            console.log(res.data)
            this.data = res.data.records
          }
        })
    },
    clear () {
      this.queryVo = {
        rid: '',
        username: '',
        fullname: '',
        registTime: ''
      }
      this.pagenum = 1
      this.pagesize = 10
    }
  }
}

</script>
