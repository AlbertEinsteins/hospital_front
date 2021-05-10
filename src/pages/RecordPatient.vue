<template>
  <q-page class="">
    <card-header title="过往病人" icon-name="assignment"/>
      <div class="q-pa-md">
        <div class="row q-gutter-lg">

          <q-input v-model="queryVo.hid" class="col" label="住院号" dense></q-input>
          <q-input class="col" label="住院开始日期" v-model="queryVo.startTime" dense>
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date minimal v-model="queryVo.startTime">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input class="col" label="住院开始日期" v-model="queryVo.endTime" dense>
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date minimal v-model="queryVo.endTime">
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
        <q-table title="往期住院历史"
          :data="data" :columns="columns">

       </q-table>
      </q-card>
  </q-page>
</template>

<script>
import CardHeader from 'src/components/CardHeader.vue'
import DoctorService from 'src/service/doctor.service'

import { date } from 'quasar'

export default {
  components: { CardHeader },
  name: 'RecordPatient',
  data () {
    return {
      queryVo: {
        hid: '',
        startTime: '',
        endTime: ''
      },
      pageConfig: {
        pagenum: 1,
        pagesize: 10
      },
      columns: [
        { label: '住院号', name: 'hid', align: 'left', field: 'hid' },
        { label: '姓名', name: 'name', align: 'left', field: 'personName' },
        { label: '科室', name: 'id', align: 'left', field: 'name' },
        { label: '房间号', name: 'sex', align: 'left', field: 'wid' },
        { label: '入院情况', name: 'sex', align: 'left', field: 'body_status' },
        { label: '入院时间', name: 'sex', align: 'left', field: 'enroll_time' },
        { label: '紧急联系人', name: 'sex', align: 'left', field: 'emerge_name' },
        { label: '联系人电话', name: 'sex', align: 'left', field: 'emerge_phone' }
      ],
      data: []
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      const startTStr = date.formatDate(this.queryVo.startTime, 'YYYY-MM-DD HH:mm:ss')
      const endTStr = date.formatDate(this.queryVo.endTime, 'YYYY-MM-DD HH:mm:ss')
      DoctorService.getInActivePatients(this.queryVo.hid, this.currentUser.username,
        startTStr, endTStr, this.pageConfig.pagenum, this.pageConfig.pagesize
      ).then(resp => {
        const { data: res } = resp
        console.log(res)
        if (res.code === 10000) {
          this.data = res.data.records
          return
        }
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
