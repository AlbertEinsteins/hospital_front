<template>
  <q-page>
    <q-card>
      <card-header icon-name="assignment" title="出院查询"/>

      <div class="q-pa-md">
        <div class="row q-gutter-lg">
          <q-select class="col-3" label="科室" dense
            :options="options.types" option-label="name" option-value="tid"
            emit-value map-options v-model="queryVo.tid">
          </q-select>
          <q-input class="col-3" label="住院号" v-model="queryVo.uid" dense></q-input>
          <q-input class="col-3" label="姓名" dense v-model="queryVo.name"></q-input>

        </div>
        <div class="row q-mt-auto q-gutter-lg">

          <q-input style="" outlined dense label="入院时间"  mask="date"
            v-model="inTimeStr">

            <template v-slot:append>
              <q-icon  name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date minimal v-model="inTimeStr">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <q-input style="" outlined dense label="出院时间"  mask="date"
            v-model="outTimeStr">

            <template v-slot:append>
              <q-icon  name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date minimal v-model="outTimeStr">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

            <q-btn label="查询" class="q-px-sm" color="green" @click="pageResult"></q-btn>
            <q-btn label="清空条件" @click="clear" class="bg-grey-1 text-black"></q-btn>
        </div>
      </div>
    </q-card>

    <q-table class="q-mt-md" :data="data" title="出院记录"
      :columns="columns" separator="horizontal" :loading="loading">
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="uid">{{ props.row.uid }}</q-td>
          <q-td key="name">{{ props.row.name }}</q-td>
          <q-td key="sex">
            <span v-if="props.row.sex">男</span>
            <span v-else>女</span>
          </q-td>
          <q-td key="doc">{{ props.row.doctor_name }}</q-td>
          <q-td key="id">{{ props.row.id }}</q-td>
          <q-td key="inTime">{{ props.row.in_hospital_time }}</q-td>
          <q-td key="outTime">{{ props.row.out_hospital_time }}</q-td>
          <q-td key="status">
            <q-badge color="orange" v-if="props.row.status == 0">未缴费</q-badge>
            <q-badge color="primary" v-if="props.row.status == 1">已预交</q-badge>
            <q-badge color="green" v-if="props.row.status == 9">已支付</q-badge>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import CardHeader from 'components/CardHeader.vue'
import DocTypeService from '../service/doctype.service.js'
import UnHospitalService from '../service/unhospital.service.js'
import { date } from 'quasar'

export default {
  components: { CardHeader },
  name: 'OutHospitalizedSearch',
  data () {
    return {
      data: [],
      columns: [
        { label: '住院号', name: 'uid', align: 'left' },
        { label: '姓名', name: 'name', align: 'left' },
        { label: '性别', name: 'sex', align: 'left' },
        { label: '主治医师', name: 'doc', align: 'left' },
        { label: '证件号', name: 'id', align: 'left' },
        { label: '入院时间', name: 'inTime', align: 'left' },
        { label: '出院时间', name: 'outTime', align: 'left' },
        { label: '支付状态', name: 'status' }
      ],
      loading: false,
      options: {
        types: []
      },
      pagenum: 1,
      pagesize: 10,
      queryVo: {
        tid: '',
        uid: '',
        name: '',
        inTime: '',
        outTime: ''
      },
      inTimeStr: '',
      outTimeStr: ''
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      DocTypeService.getDocTypes()
        .then(resp => {
          const { data: res } = resp
          if (res.code === 10000) {
            this.options.types = res.data
          }
        }).catch(() => this.$message.error('Network Error'))
      this.pageResult()
    },
    pageResult () {
      this.loading = true
      this.queryVo.inTime = date.formatDate(this.inTimeStr, 'YYYY-MM-DD HH:mm:ss')
      this.queryVo.outTime = date.formatDate(this.outTimeStr, 'YYYY-MM-DD HH:mm:ss')
      UnHospitalService.page(this.queryVo)
        .then(resp => {
          const { data: res } = resp
          if (res.code === 10000) {
            this.data = res.data.records
          }
          this.loading = false
        })
    },
    clear () {
      this.pagenum = 1
      this.pagesize = 10
      this.queryVo = {
        tid: '',
        uid: '',
        name: '',
        inTime: '',
        outTime: ''
      }
      this.inTimeStr = ''
      this.outTimeStr = ''
    }
  }
}
</script>
