<template>
  <q-page>
    <q-card>
      <card-header icon-name="assignment" title="费用查询"/>

      <div class="q-pa-md">
        <div class="row q-gutter-lg">
          <q-input label-slot dense label="住院号" v-model="hid">
            <template v-slot:prepend>
              <div><span class="text-red" style="font-size: 0.8rem;">*</span></div>
            </template>
          </q-input>

          <div class="q-ml-lg">
            <q-btn class="" color="green" @click="getData">费用查询</q-btn>
            <q-btn class="text-white q-ml-md" color="secondary" @click="doSum">费用结算</q-btn>
          </div>
        </div>
      </div>
    </q-card>

    <q-table class="q-mt-md" hide-pagination
      title="费用项" :data="cost" :columns="columns_cost">
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="hid">{{ props.row.hid }}</q-td>
          <q-td key="name">{{ props.row.name }}</q-td>
          <q-td key="type">
            {{ props.row.itemName }}
          </q-td>
          <q-td key="price">{{ props.row.itemPrice }}￥</q-td>
          <q-td key="total">
            <span>{{props.row.itemAmount * props.row.itemPrice}}￥</span>
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <q-table class="q-mt-sm" hide-pagination
      title="返还项" :data="rtn" :columns="columns_cost">
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="hid">{{ props.row.hid }}</q-td>
          <q-td key="name">{{ props.row.name }}</q-td>
          <q-td key="type">
            <span v-if="props.row.medicine_name">
              {{ props.row.medicine_name }}: {{ props.row.rtn_amount }}瓶
            </span>
          </q-td>
          <q-td key="price">
            <span v-if="props.row.price">{{props.row.price}}</span>
            <span v-else>{{props.row.subTotal}}</span>￥
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <q-table class="q-mt-sm" v-if="isShowSum"  title="总计" hide-pagination
      :data="summary" :columns="columns_summary" card-class="bg-green-1" table-class="bg-green-3">
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="operate">
            <div>
              <q-btn color="teal" v-if="allCost >= props.row.preAmount">
                <q-icon left name="money"></q-icon>
                <div @click="paySuccess">确认支付/待返还</div>
              </q-btn>
              <div v-else>
              </div>
            </div>
          </q-td>
          <q-td key="preAmount">{{ props.row.preAmount }}元</q-td>
          <q-td key="allCost">{{ allCost }}元</q-td>
          <q-td key="supplyCost">
            <span v-if="props.row.preAmount < allCost">{{ allCost - props.row.preAmount }}</span>
            <span v-else>0</span>元
          </q-td>
          <q-td key="rtnCost">
            <span v-if="props.row.preAmount > allCost">{{ props.row.preAmount - allCost }}</span>
            <span v-else>0</span>元
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import CardHeader from 'src/components/CardHeader.vue'

import PayService from '../service/pay.service.js'
export default {
  components: { CardHeader },
  name: 'PaySearch',
  data () {
    return {
      hid: '',
      cost: [],
      columns_cost: [
        { label: '住院号', name: 'hid', align: 'left' },
        { label: '姓名', name: 'name', align: 'left' },
        { label: '费用类型', name: 'type', align: 'left' },
        { label: '单价(元)', name: 'price', align: 'left' },
        { label: '小结(元)', name: 'total', align: 'left' }
      ],
      rtn: [],

      isShowSum: false,
      summary: [],
      columns_summary: [
        { label: '操作', name: 'operate', align: 'left' },
        { label: '总缴费(￥)', name: 'preAmount', align: 'left' },
        { label: '总花费(￥)', name: 'allCost', align: 'left' },
        { label: '补交(￥)', name: 'supplyCost', align: 'left' },
        { label: '退费(￥)', name: 'rtnCost', align: 'left' }
      ]
    }
  },
  created () {
  },
  methods: {
    getData () {
      this.cost = []
      this.rtn = []

      PayService.getPayItems(this.hid)
        .then(resp => {
          const { data: res } = resp
          if (res.code === 10000) {
            this.cost = res.data
            console.log(res)
            return
          }
          this.$message.warn(`操作失败${',' + res.message}`)
        }).catch(() => this.$message.error('Network Error'))

      PayService.getRtnItems(this.hid)
        .then(resp => {
          const { data: res } = resp
          if (res.code === 10000) {
            this.rtn = res.data
          }
        })

      if (this.isShowSum) {
        this.getPreAmount()
      }
    },
    doSum () {
      this.isShowSum = !this.isShowSum
      this.getPreAmount()
    },
    getPreAmount () {
      PayService.getPreAmountByHid(this.hid)
        .then(resp => {
          const { data: res } = resp
          this.summary = []
          let preAmount = 0
          if (res.data && res.code === 10000) {
            res.data.forEach(prePay => {
              preAmount += prePay.preAmount
            })
          }
          this.summary.push({
            preAmount
          })
        })
    },
    paySuccess () {
      PayService.paySuccess(this.hid, this.allCost)
        .then(resp => {
          const { data: res } = resp
          if (res.code === 10000) {
            this.$message.success('支付成功，状态已更改(已支付/已返还)')
            this.hid = ''
            this.cost = []
            this.rtn = []
            this.isShowSum = false
            return
          }
          this.$message.info(`信息提示：${res.message}`)
        })
    }
  },
  computed: {
    allCost () {
      let sum = 0
      this.cost.forEach(item => {
        sum += item.itemPrice * item.itemAmount
      })

      this.rtn.forEach(item => {
        sum -= (item.itemPrice * item.itemAmount)
      })
      return sum
    }
  }
}
</script>
