<template>
  <q-page>
    <q-card>
      <card-header icon-name="assignment" title="费用缴纳"/>

      <div class="q-pa-md">
        <div class="row q-gutter-lg">
          <q-input class="col-3" label="住院号" dense v-model="pay.hid">
            <template v-slot:prepend>
              <span class="text-red" style="font-size: 0.8rem">*</span>
            </template>
          </q-input>
          <q-input class="col-3" label="姓名" dense v-model="pay.name">
            <template v-slot:prepend>
              <span class="text-red" style="font-size: 0.8rem">*</span>
            </template>
          </q-input>
        </div>
        <div class="row q-gutter-lg q-pt-sm">
          <q-select class="col-3" label="科室" dense v-model="pay.tid"
            :options="options.docTypes" option-label="name" option-value="tid"
            emit-value map-options></q-select>
          <q-select class="col-3" label="缴费方式" dense v-model="pay.typeId"
            :options="options.payTypes" option-label="name" option-value="id"
            emit-value map-options></q-select>
        </div>
        <div class="row q-gutter-lg q-pt-sm">
          <q-input  class="col-3" label="主治医生" dense v-model="pay.docName">
            <template v-slot:prepend>
              <span class="text-red" style="font-size: 0.8rem">*</span>
            </template>
          </q-input>
          <q-input type="number" class="col-3" label="预缴费用(￥)" dense v-model="pay.preAmount">
            <template v-slot:append>
              <span style="font-size: 0.8rem;">元</span>
            </template>
          </q-input>
        </div>
        <div class="row q-gutter-lg q-pt-sm">
          <q-input class="col-3" label="收款用户" v-model="pay.receiveUsername" dense></q-input>
          <q-input class="col-3" label="收款人姓名" dense v-model="pay.receiveName"></q-input>
        </div>
        <div class="row q-gutter-lg q-pt-sm">
          <q-input class="col-3" label="收款时间" dense v-model="pay.payDate">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date v-model="pay.payDate" minimal>
                    <div class="row items-center  justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="row q-gutter-lg q-mt-auto">
          <q-btn color="green" class="q-px-sm" label="保存" @click="prePay"></q-btn>
          <q-btn color="grey-1" class="text-black q-px-sm" label="重置" @click="reset"></q-btn>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import CardHeader from 'src/components/CardHeader.vue'

import PayService from '../service/pay.service.js'
import DocTypeService from '../service/doctype.service.js'
import { date } from 'quasar'
export default {
  components: { CardHeader },
  name: 'Pay',
  data () {
    return {
      pay: {
        hid: '',
        name: '',
        typeId: '',
        preAmount: 0,
        receiveName: '',
        receiveUsername: '',
        payDate: '',
        tid: '',
        docName: ''
      },
      options: {
        docTypes: [],
        payTypes: []
      }
    }
  },
  created () {
    this.getData()
  },
  computed: {
    currentUser () {
      return this.$store.state.auth.user
    }
  },
  methods: {
    getData () {
      PayService.getPayTypes()
        .then(resp => {
          const { data: res } = resp
          if (res.code === 10000) {
            this.options.payTypes = res.data
            return
          }
          this.$message.warn(`操作失败${',' + res.message}`)
        }).catch(() => this.$message.error('Network Error'))
      DocTypeService.getDocTypes()
        .then(resp => {
          const { data: res } = resp
          if (res.code === 10000) {
            this.options.docTypes = res.data
          }
        })
      this.pay.receiveUsername = this.currentUser.username
    },
    prePay () {
      this.pay.payDate = date.formatDate(this.pay.payDate, 'YYYY-MM-DD HH:mm:ss')
      PayService.prePay(this.pay)
        .then(resp => {
          const { data: res } = resp
          if (res.code === 10000) {
            this.$message.success('缴费成功!')
            this.reset()
          }
        })
    },
    reset () {
      this.pay = {
        hid: '',
        name: '',
        typeId: '',
        preAmount: 0,
        receiveName: '',
        payDate: '',
        tid: '',
        docName: ''
      }
    }
  }
}
</script>
