<template>
  <q-page>
    <q-card>
      <card-header icon-name="assignment" title="缴费记录"/>

      <div class="q-pa-md">
        <div class="row q-gutter-lg">
          <q-input outlined label="住院号" dense
            v-model="queryVo.hid">

          </q-input>
          <q-input outlined label="姓名" dense
            v-model="queryVo.name">

          </q-input>
          <q-input  outlined label="缴费时间" dense
            v-model="queryVo.payDate">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date v-model="queryVo.payDate" minimal>
                      <div class="row items-center  justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
          </q-input>

          <q-btn color="green" class="q-px-sm" label="查询" size="md" @click="getPageData"></q-btn>
          <q-btn color="grey-1" class="text-black" label="清空条件" @click="reset"></q-btn>
        </div>

      </div>
    </q-card>

    <q-table class="q-mt-md" :data="data" :columns="columns"
      title="缴费记录">
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="pid">{{ props.row.pid }}</q-td>
          <q-td key="hid">{{ props.row.hid }}</q-td>
          <q-td key="name">{{ props.row.name }}</q-td>
          <q-td key="preAmount">{{ props.row.pre_amount }}元</q-td>
          <q-td key="payAmount">
            <span v-if="props.row.pay_amount && props.row.pay_amount != 0">
              {{ props.row.pay_amount }}
            </span>
            <q-badge outline color="primary" v-else>
              暂未付款
            </q-badge>
          </q-td>
          <q-td key="payType">{{ props.row.typeName }}</q-td>
          <q-td key="payDate">{{ props.row.pay_date }}</q-td>
          <q-td key="receiveName">{{ props.row.receive_name }}</q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import CardHeader from 'src/components/CardHeader.vue'

import PayService from '../service/pay.service.js'
import { date } from 'quasar'
export default {
  components: { CardHeader },
  name: 'PayRecord',
  data () {
    return {
      pagenum: 1,
      pagesize: 10,
      queryVo: {
        hid: '',
        name: '',
        payDate: ''
      },
      data: [],
      columns: [
        { label: '账单号', name: 'pid', align: 'left' },
        { label: '住院号', name: 'hid', align: 'left' },
        { label: '付款账户', name: 'name', align: 'left' },
        { label: '预缴金额（￥）', name: 'preAmount', align: 'left' },
        { label: '实付(￥)', name: 'payAmount', align: 'left' },
        { label: '缴费方式', name: 'payType', align: 'left' },
        { label: '缴费时间', name: 'payDate', align: 'left' },
        { label: '收款用户', name: 'receiveName', align: 'left' }
      ]
    }
  },
  created () {
    this.getPageData()
  },
  methods: {
    reset () {
      this.pagenum = 1
      this.pagesize = 10
      this.queryVo = {
        hid: '',
        name: '',
        payDate: ''
      }
    },
    getPageData () {
      this.queryVo.payDate = date.formatDate(this.queryVo.payDate, 'YYYY-MM-DD HH:mm:ss')
      PayService.getPageResult(this.queryVo, this.pagenum, this.pagesize)
        .then(resp => {
          const { data: res } = resp
          console.log(res)
          if (res.code === 10000) {
            console.log(res.data)
            this.data = res.data.records
            return
          }
          this.$message.warn(`操作失败: ${',' + res.message}`)
        }).catch(() => this.$message.error('Network Error'))
    }
  }
}
</script>
