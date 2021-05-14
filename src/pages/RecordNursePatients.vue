<template>
  <q-page class="">
    <card-header title="过往病人" icon-name="assignment"/>
      <div class="q-pa-md">
        <div class="row q-gutter-lg">

          <q-input v-model="queryVo.hid" class="col" label="住院号" dense></q-input>
          <q-input class="col" label="住院开始日期" v-model="startTStr" dense>
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date minimal v-model="startTStr">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input class="col" label="住院结束日期" v-model="endTStr" dense>
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date minimal v-model="endTStr">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-btn label="查询" class="q-px-sm col-shrink" color="green" @click="getData"></q-btn>
          <q-btn label="清空条件" class="bg-grey-1 col-shrink text-black"></q-btn>
        </div>
      </div>
      <q-card class="q-mt-md">
        <q-table title="过往护理病人"
          :loading="loading"
          :data="data" :columns="columns">

       </q-table>
      </q-card>
  </q-page>
</template>

<script>
import CardHeader from 'src/components/CardHeader.vue'

import { date } from 'quasar'
import EnhospitalService from 'src/service/enhospital.service'

export default {
  components: { CardHeader },
  name: 'RecordNursePatients',
  data () {
    return {
      loading: false,
      queryVo: {
        hid: '',
        patientName: '',
        username: '',
        startTime: '',
        endTime: ''
      },
      startTStr: '',
      endTStr: '',
      pageConfig: {
        pagenum: 1,
        pagesize: 10
      },
      columns: [
        { lable: '123', name: 'index', field: 'index' },
        { label: '住院号', name: 'hid', align: 'left', field: 'hid' },
        { label: '姓名', name: 'name', align: 'left', field: 'personName' },
        { label: '科室', name: 'typeName', align: 'left', field: 'typeName' },
        { label: '主治医生', name: 'dName', align: 'left', field: 'doctorName' },
        { label: '房间号', name: 'wid', align: 'left', field: 'wid' },
        { label: '入院情况', name: 'body_status', align: 'left', field: 'body_status' },
        { label: '入院时间', name: 'enroll_time', align: 'left', field: 'enroll_time' },
        { label: '紧急联系人', name: 'emerge_name', align: 'left', field: 'emerge_name' },
        { label: '联系人电话', name: 'emerge_phone', align: 'left', field: 'emerge_phone' }
      ],
      data: []
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      this.loading = true
      this.queryVo.startTime = date.formatDate(this.startTStr, 'YYYY-MM-DD HH:mm:ss')
      this.queryVo.endTime = date.formatDate(this.endTStr, 'YYYY-MM-DD HH:mm:ss')
      this.queryVo.username = this.currentUser.username
      EnhospitalService.getPatientsOfNurseInActive(this.queryVo,
        this.pageConfig.pagenum, this.pageConfig.pagesize
      ).then(resp => {
        const { data: res } = resp
        console.log(res)
        if (res.code === 10000) {
          this.data = res.data.records
          this.data.forEach((row, index) => {
            row.index = index + 1
          })
          this.loading = false
          return
        }
        this.loading = false
        this.$message.info(`${res.message}`)
      }).catch(() => { this.$message.warn('Server Error') })
    }
  },
  computed: {
    currentUser () {
      return this.$store.state.auth.user
    }
  }
}
</script>
