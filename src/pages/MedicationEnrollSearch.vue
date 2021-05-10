<template>
  <q-page class="">
    <q-card>
      <card-header icon-name="assignment" title="入库查询"/>

      <div class="q-pa-md q-pl-lg">
        <q-form ref="myForm">
          <div class="row q-gutter-lg">
            <q-input label="药品编号" square v-model="queryVo.mid" outlined dense>
            </q-input>
            <q-input label="药品名称" square v-model="queryVo.name" outlined dense>
            </q-input>
            <q-input label="入库时间" square outlined dense
              v-model="inTimeStr">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
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
            <div>
              <q-btn label="查询" color="green" @click="getPageData" class="q-px-sm"></q-btn>
              <q-btn label="重置条件" color="grey-1" @click="reset" class="text-black q-ml-sm"></q-btn>
            </div>
          </div>
        </q-form>

      </div>
    </q-card>
    <q-table class="q-mt-md" :data="data" :columns="columns"
      row-key="name" title="入库查询" separator="vertical">
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="mid">{{ props.row.mid }}</q-td>
          <q-td key="name">
            <q-badge color="primary">{{ props.row.name }}</q-badge>
          </q-td>
          <q-td key="amount" >
            {{ props.row.amount }}
          </q-td>
          <q-td key="price" class="text-center">{{ props.row.price }}元</q-td>
          <q-td key="produceTime" >{{ props.row.produceTime }}</q-td>
          <q-td key="endTime">
            <q-badge color="warning">{{ props.row.endTime }}</q-badge>
          </q-td>
          <q-td key="inTime">{{ props.row.inTime }}</q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import CardHeader from 'src/components/CardHeader.vue'

import MedicineService from '../service/medicine.service.js'
import { date } from 'quasar'
export default {
  components: { CardHeader },
  name: 'MedicationEnrollSearch',
  data () {
    return {
      queryVo: {
        mid: '',
        name: '',
        inTime: ''
      },
      inTimeStr: '',

      pagenum: 1,
      pagesize: 10,
      columns: [
        { label: '药品编号', name: 'mid', align: 'left' },
        { label: '药品名称', name: 'name', align: 'left' },
        { label: '药品数量', name: 'amount', align: 'left' },
        { label: '药品单价(￥)', name: 'price' },
        { label: '生产日期', name: 'produceTime', align: 'left' },
        { label: '有效日期', name: 'endTime', align: 'left' },
        { label: '入库日期', name: 'inTime', align: 'left' }
      ],
      data: []
    }
  },
  created () {
    this.getPageData()
  },
  methods: {
    getPageData () {
      this.queryVo.mid = this.queryVo.mid === '' ? null : this.queryVo.mid
      this.queryVo.name = this.queryVo.name === '' ? null : this.queryVo.name
      this.queryVo.inTime = date.formatDate(this.inTimeStr, 'YYYY-MM-DD')
      MedicineService.getPage(this.queryVo, this.pagenum, this.pagesize)
        .then(resp => {
          const { data: res } = resp
          console.log(res)
          if (res.code === 10000) {
            this.data = res.data.records
            return
          }
          this.$message.warn(`Error: ${res.message}`)
        })
    },
    reset () {
      this.queryVo = {
        mid: '',
        name: '',
        inTime: ''
      }
      this.inTimeStr = ''
    }
  }
}
</script>
