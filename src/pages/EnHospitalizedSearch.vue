<template>
  <q-page>
    <q-card>
      <card-header icon-name="assignment" title="住院查询"/>

      <div class="q-pa-md">
        <div class="row q-gutter-lg">
          <q-select v-model="queryVo.tid" class="col-4" label="科室" dense
            :options="options.docTypes" option-label="name" option-value="tid" emit-value map-options
            ></q-select>
          <q-input v-model="queryVo.hid" class="col" label="住院号" dense></q-input>
          <q-input class="col" label="住院日期" v-model="queryVo.enrollTime" dense>
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date minimal v-model="queryVo.enrollTime">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="row q-gutter-lg q-pt-sm">

          <q-input label="姓名" class="col-4" v-model="queryVo.name" dense></q-input>
          <q-input label="床位号" class="col-4" v-model="queryVo.sid" dense></q-input>
          <q-btn label="查询" class="q-px-sm" color="green" @click="pageResult"></q-btn>
          <q-btn label="清空条件" class="bg-grey-1 text-black" @click="clear"></q-btn>
        </div>
      </div>

      <q-table title="Patient" :data="data"
       :columns="columns" row-key="name">
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="hid" >{{ props.row.hid }}</q-td>
          <q-td key="name" >{{ props.row.name }}</q-td>
          <q-td key="id" >{{ props.row.id }}</q-td>
          <q-td key="sex" >
            <span v-if="props.row.sex">男</span>
            <span v-else>女</span>
          </q-td>
          <q-td key="dName">{{ props.row.doctorName }}</q-td>
          <q-td key="wid" >{{ props.row.wid }}</q-td>
          <q-td key="sid" >{{ props.row.sid }}</q-td>
          <q-td key="bodyStatus" >
            <q-badge color="warning">{{ props.row.body_status }}</q-badge>
          </q-td>
          <q-td key="enrollTime" >
            {{ props.row.enroll_time }}
          </q-td>
          <q-td key="during">
            {{ props.row.duringTime }}天
          </q-td>
        </q-tr>
      </template>
      </q-table>

    </q-card>

    <q-card class="q-mt-md">
      <card-header icon-name="assignment" title="住院查询(病房查询)"/>

      <q-table title="Patient" grid :data="data"
       :columns="columns" row-key="name" :loading="loading">
      <template v-slot:top-right>
        <q-input dense debounce="300" v-model="queryVo.wid"
          placeholder="病房号">
          <template v-slot:append>
            <q-icon name="search" @click="pageResult"/>
          </template>
        </q-input>
      </template>

      <template v-slot:item="props">
        <div class="q-pa-sm col-4">
          <q-card>
            <q-card-section>
              <span>病人信息</span>
            </q-card-section>
            <q-separator />
            <q-list dense>
              <q-item v-for="col in props.cols" :key="col.name">
                <q-item-section>
                  <q-item-label>{{ col.label }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label caption>
                    {{ col.value }}
                    <span v-if="col.label === '已住时间(天)'">
                      天
                    </span>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
      </template>
      </q-table>

    </q-card>
  </q-page>
</template>

<script>
import CardHeader from 'components/CardHeader.vue'

import DoctorTypeService from '../service/doctype.service.js'
import EnHospitalService from '../service/enhospital.service.js'

import { date } from 'quasar'

export default {
  components: { CardHeader },
  name: 'EnHospitalizedSearch',
  data () {
    return {
      options: {
        docTypes: []
      },
      loading: false,
      queryVo: {
        tid: '',
        hid: '',
        wid: '',
        enrollTime: '',
        name: '',
        sid: '',
        pagenum: 1,
        pagesize: 10
      },
      data: [],
      columns: [
        { label: '住院号', name: 'hid', align: 'left', field: 'hid' },
        { label: '姓名', name: 'name', align: 'left', field: 'name' },
        { label: '证件号', name: 'id', align: 'left', field: 'id' },
        { label: '性别', name: 'sex', align: 'left', field: 'sex' },
        { label: '主治医生', name: 'dName', align: 'left', field: 'doctorName' },
        { label: '病房', name: 'wid', align: 'left', field: 'wid' },
        { label: '床位号', name: 'sid', align: 'left', field: 'sid' },
        { label: '入院情况', name: 'bodyStatus', align: 'left', field: 'body_status' },
        { label: '入院时间', name: 'enrollTime', align: 'left', field: 'enroll_time' },
        { label: '已住时间(天)', name: 'during', align: 'left', field: 'duringTime' }
      ]
    }
  },
  created () {
    this.getData()
    this.pageResult(this.queryVo, this.pagenum, this.pagesize)
  },
  methods: {
    getData () {
      DoctorTypeService.getDocTypes()
        .then(resp => {
          const { data: res } = resp
          if (res.code === 10000) {
            this.options.docTypes = res.data
          }
        }).catch(() => this.$message.error('NetWork Error'))
    },
    pageResult () {
      this.loading = true
      this.queryVo.enrollTime = date.formatDate(this.queryVo.enrollTime, 'YYYY-MM-DD HH:mm:ss')
      EnHospitalService.getPageResult(this.queryVo)
        .then(resp => {
          const { data: res } = resp
          console.log(res)
          if (res.code === 10000) {
            this.data = res.data.records
            this.data.map(item => {
              item.duringTime = this.existTime(item.enroll_time)
            })
            this.loading = false
            return
          }
          this.loading = false
          this.$message.info(`${res.message}`)
        }).catch()
    },
    clear () {
      this.queryVo = {
        tid: '',
        hid: '',
        wid: '',
        enrollTime: '',
        name: '',
        sid: '',
        pagenum: 1,
        pagesize: 10
      }
    },
    existTime (enrollTime) {
      const now = new Date(enrollTime)
      return date.getDateDiff(new Date(), now)
    }
  },
  computed: {

  },
  filters: {
    timeFilter (timeStr) {
      return date.formatDate(timeStr, 'YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>
