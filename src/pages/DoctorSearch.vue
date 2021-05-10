<template>
  <q-page class="">
    <q-card>
      <card-header icon-name="assignment" title="医生查询"/>

      <div class="q-pa-md q-pl-lg">
        <q-form ref="searchForm">
          <div class="row q-gutter-lg">
            <q-select class="col-3" label="医生类型" dense
              :options="docTypes" option-label="name" option-value="tid" emit-value map-options
              v-model="query.tid"></q-select>
            <q-input label="姓名" dense class="col-3"
                v-model="query.name"></q-input>
            <q-input label="注册时间" dense
              v-model="query.hireDateStr" mask="date">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date v-model="query.hireDateStr" minimal>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
              </template>
            </q-input>

          </div>
          <div class="row q-gutter-lg q-pt-md">
            <q-select label="职称" dense class="col-3"
              v-model="query.tid" :options="docPos" option-label="name" option-value="pid"
              emit-value map-options></q-select>
            <q-select label="是否离职" dense class="col-3"
              v-model="query.isRetire" :options="isRetire" emit-value map-options></q-select>
          </div>
          <div class="row q-gutter-lg q-mt-xs">
            <q-btn class="q-px-sm" color="green" label="查询" @click="getDocPages"></q-btn>
            <q-btn color="grey-1" class="text-black" @click="reset" label="清空条件"></q-btn>
          </div>
        </q-form>
      </div>
    </q-card>

    <q-table class="q-mt-md" :data="data" :columns="columns"
      title="医生" row-key="name">
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="did">{{ props.row.did }}</q-td>
          <q-td key="name">{{ props.row.name }}</q-td>
          <q-td key="typeName">{{ props.row.typeName }}</q-td>
          <q-td key="sex">
            <q-badge color="secondary" v-if="props.row.is_male">男</q-badge>
            <q-badge color="secondary"  v-else>女</q-badge>
          </q-td>
          <q-td key="posName" >{{ props.row.posName }}</q-td>
          <q-td key="hireDate" >
            {{ props.row.hiredate |dateFilter }}
          </q-td>
          <q-td key="isRetire">
            <q-badge v-if="props.row.is_retire">否</q-badge>
            <q-badge v-else>是</q-badge>
          </q-td>
          <q-td key="operate">
            <q-btn size="sm" color="primary" @click="modify(props.row)">修改</q-btn>
            <q-btn size="sm" class="q-ml-xs" color="warning" @click="showRetire(props.row)">
              <span v-if="props.row.is_retire">入职</span>
              <span v-else>离职</span>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>

  <q-dialog v-model="edit" persistent transition-show="scale" transition-hide="scale">
    <div>
      <doctor-change @isReload="reload" @closeWindow="close" :doc="modifyDoc"/>
    </div>
  </q-dialog>

  <q-dialog v-model="confirm">
    <q-card style="min-width: 280px;">
      <q-card-section class="row items-center">
        <q-avatar icon="warning" color="info" text-color="white" />
        <span class="q-ml-sm">确认?</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="撤销" color="primary" v-close-popup />
        <q-btn flat color="warning" @click="retire">
          <span v-if="retireRow.is_retire">入职</span>
          <span v-else>离职</span>
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
  </q-page>
</template>

<script>
import CardHeader from 'src/components/CardHeader.vue'
import DoctorChange from 'src/pages/DoctorChange.vue'

import DoctorService from '../service/doctor.service.js'
import DoctorTypeServie from '../service/doctype.service.js'
import DoctorPosServie from '../service/docpos.service.js'

import { date } from 'quasar'

export default {
  components: { CardHeader, DoctorChange },
  name: 'DoctorSearch',
  data () {
    return {
      docTypes: [],
      docPos: [],
      isRetire: [{ label: '离职', value: 1 }, { label: '未离职', value: 0 }, { label: '查询所有', value: '' }],
      query: {
        tid: '',
        name: '',
        hireDateStr: '',
        hireDate: '',
        isRetire: ''
      },
      pagenum: 1,
      pagesize: 10,
      columns: [
        { label: '医生编号', name: 'did', field: 'did', align: 'left' },
        { label: '医生姓名', name: 'name', field: 'name', align: 'left' },
        { label: '科室', name: 'typeName', field: 'typeName', align: 'left' },
        { label: '性别', name: 'sex', align: 'left' },
        { label: '职称', name: 'posName', field: 'posName', align: 'left' },
        { label: '入职时间', name: 'hireDate', align: 'left' },
        { label: '是否在职', name: 'isRetire', align: 'left' },
        { label: '操作', name: 'operate', align: 'left' }
      ],
      data: [],

      edit: false,
      confirm: false,
      modifyDoc: '',

      retireRow: {}
    }
  },
  created () {
    this.getData()
  },
  methods: {
    reload () {
      this.getDocPages()
    },
    close () {
      this.edit = false
    },
    showRetire (row) {
      this.retireRow = row
      this.confirm = true
    },
    retire () {
      // TODO
      console.log(this.retireRow)
      DoctorService.reviseInfo({
        did: this.retireRow.did,
        isRetire: !this.retireRow.is_retire
      }).then(resp => {
        const { data: res } = resp
        if (res.code === 10000) {
          this.$message.success('修改成功')
          this.confirm = false
          this.getDocPages()
          return
        }
        this.$message.success('修改成功')
      })
    },
    modify (props) {
      this.edit = !this.edit
      this.modifyDoc = props
    },
    getData () {
      this.getDocTypes()
      this.getDocPos()
      this.getDocPages()
    },
    getDocPos () {
      DoctorPosServie.getDocPositions()
        .then(resp => {
          const { data: res } = resp
          console.log(res)
          if (res.code === 10000) {
            this.docPos = res.data
            return
          }
          this.$message.warn(`操作失败${',' + res.message}`)
        }).catch(() => this.$message.error('Network Error'))
    },
    getDocTypes () {
      DoctorTypeServie.getDocTypes()
        .then(resp => {
          const { data: res } = resp
          console.log(res)
          if (res.code === 10000) {
            this.docTypes = res.data
          }
        })
    },
    getDocPages () {
      DoctorService.pageResult(this.query, this.pagenum, this.pagesize)
        .then(resp => {
          const { data: res } = resp
          console.log(res)
          if (res.code === 10000) {
            this.data = res.data.records
          }
        })
    },
    reset () {
    }
  },
  filters: {
    dateFilter (dateStr) {
      return date.formatDate(dateStr, 'YYYY-MM-DD')
    }
  }
}
</script>
