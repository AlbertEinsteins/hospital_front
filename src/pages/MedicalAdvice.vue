<template>
  <div>
    <div class="menu">
      <div class="row items-center q-pa-md">
        <q-icon class="q-ml-sm" @click="$router.back()" name="arrow_back" color="blue">返回</q-icon>
      </div>
    </div>
    <q-splitter v-model="rate">
      <template v-slot:before>
        <div class="q-pa-md q-px-lg" style="background-color: #fff;">
          <div class="title text-center">
            <div class="text-h6">医院</div>
            <div class="text-h4">临时医嘱</div>
          </div>
          <div class="info row q-mt-sm q-px-xs">
            <div class="col">姓名: {{ patientInfo.name }}</div>
            <div class="col">科别: {{ patientInfo.typeName }}</div>
            <div class="col">病房: {{ patientInfo.wid }}</div>
            <div class="col">病床: {{ patientInfo.sid }}号</div>
            <div class="col-auto">住院号: {{ $route.query.hid }}</div>
          </div>
          <div class="table">
            <q-table separator="vertical" flat bordered
              :hide-pagination="true" :data="adviceItems" :columns="columns">
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td key="date">{{ props.row.start_time |dateFilter }} </q-td>
                  <q-td key="time">{{ props.row.start_time |timeFilter }}</q-td>
                  <q-td key="content">{{ props.row.content }} </q-td>
                  <q-td key="doctorName">{{ props.row.doctor_name }} </q-td>
                  <q-td key="execTime">
                    <span v-if="props.row.exec_time">
                      {{ props.row.exec_time |timeFilter }}
                    </span>
                    <span v-else>
                      <q-badge color="primary">待执行</q-badge>
                    </span>
                  </q-td>
                  <q-td key="execName">
                    <span v-if="props.row.nurse_name">
                      {{ props.row.nurse_name }}
                    </span>
                    <div v-else-if="!props.row.nurse_name && isNurse">
                      <div class="row">
                        <q-input class="col" v-model="execName" dense></q-input>
                        <q-btn class="col" flat color="primary" @click="enrollExecName(props.row)">确认</q-btn>
                      </div>
                    </div>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
        </div>
      </template>
      <template v-slot:after v-if="!isNurse">
        <div class="q-pa-md">
          <q-input label="医嘱内容" v-model="addItem.content"></q-input>

          <q-input label="医师签名" v-model="addItem.doctorName"></q-input>
          <div class="row">
            <q-btn class="q-mt-md" color="primary" @click="addAdviceItem">新增</q-btn>
          </div>
        </div>
      </template>
    </q-splitter>
  </div>
</template>

<script>
import DoctorService from 'src/service/doctor.service'
import NurseService from 'src/service/nurse.service'
import { date } from 'quasar'

export default {
  name: 'MedicalAdvice',
  data () {
    return {
      rate: 70,
      advice: {},
      adviceItems: [],
      columns: [
        { label: '日期', name: 'date', align: 'left' },
        { label: '时间', name: 'time', align: 'left' },
        { label: '医嘱内容', name: 'content', align: 'left' },
        { label: '医师签名', name: 'doctorName' },
        { label: '执行时间', name: 'execTime', align: 'left' },
        { label: '执行者签名', name: 'execName', align: 'left' }
      ],
      addItem: {
        content: '',
        doctorName: ''
      },

      // 护士角色所需
      execName: ''
    }
  },
  created () {
    if (this.isNurse) {
      this.rate = 100
    }
    this.getAdviceList()
  },
  methods: {
    addAdviceItem () {
      const { hid } = this.$route.query
      DoctorService.addAdviceItem(hid, this.currentUser.username, this.addItem)
        .then(resp => {
          const { data: res } = resp
          if (res.code === 10000) {
            this.getAdviceList()
            this.$message.success('新增成功')
            this.addItem.content = ''
            this.addItem.doctorName = ''
            return
          }
          this.$message.info(`${res.message}`)
        })
    },
    getAdviceList () {
      const {
        hid
      } = this.$route.query
      DoctorService.getMedicalAdvice(hid)
        .then(resp => {
          const {
            data: res
          } = resp
          if (res.code === 10000) {
            console.log(res)
            if (res.data.advice) {
              this.advice = res.data.advice
              this.adviceItems = res.data.items
            }
            return
          }
          this.$message.warn(`${res.$message}`)
        }).catch(() => this.$message.error('Server Error'))
    },
    // 护士对医嘱进行签字确认并执行
    enrollExecName (row) {
      if (!this.execName) {
        this.$message.info('姓名不可为空')
        return
      }
      NurseService.signAdviceItem(row.id, this.execName)
        .then(resp => {
          const { data: res } = resp
          if (res.code === 10000) {
            this.$message.info('确认')
            location.reload()
            return
          }
          this.$message.info(`${res.message}`)
        })
    }
  },
  computed: {
    currentUser () {
      return this.$store.state.auth.user
    },
    patientInfo () {
      console.log(this.$route.query.patient)
      return this.$route.query.patient
    },
    isNurse () {
      return this.currentUser.roles.includes('ROLE_NURSE')
    }
  },
  filters: {
    dateFilter (dateTime) {
      return date.formatDate(dateTime, 'YYYY-MM-DD')
    },
    timeFilter (dateTime) {
      return date.formatDate(dateTime, 'HH:mm')
    }
  }
}

</script>
