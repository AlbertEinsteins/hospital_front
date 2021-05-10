<template>
  <q-page class="">
    <q-card>
      <card-header icon-name="assignment" title="药品入库"/>

      <div class="q-pa-md">
        <q-form ref="myForm">
        <div class="row q-gutter-lg">
          <q-input class="col-3" label-slot label="编号" dense v-model="medicine.mid"
            :rules="[val => !!val || 'Field is required']">
            <template v-slot:prepend>
              <span class="text-red" style="font-size: 0.8rem">*</span>
            </template>
          </q-input>
          <q-input class="col-3" label="药品名称" dense v-model="medicine.name"
            :rules="[val => !!val || 'Field is required']">
            <template v-slot:prepend>
              <span class="text-red" style="font-size: 0.8rem">*</span>
            </template>

          </q-input>
        </div>
        <div class="row q-gutter-lg">

          <q-input class="col-3" label="单价" dense v-model="medicine.price"
           :rules="[val => !!val || 'Field is required']">
            <template v-slot:prepend>
              <span class="text-red" style="font-size: 0.8rem">*</span>
            </template>
            <template v-slot:append>
              <span style="font-size: 1.1rem">￥</span>
            </template>
          </q-input>
          <q-input type="number" class="col-3" label="数量" dense v-model="medicine.amount"
            :rules="[val => !!val || 'Field is required']">
            <template v-slot:prepend>
              <span class="text-red" style="font-size: 0.8rem">*</span>
            </template>
            <template v-slot:append>
              <span style="font-size: 0.9rem">(个/瓶)</span>
            </template>
          </q-input>
        </div>
        <div class="row q-gutter-lg">
          <q-input class="col-3" label="生产日期" dense v-model="produceTimeStr"
            :rules="['date']">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date minimal v-model="produceTimeStr">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input class="col-3" label="保质期" dense v-model="endTimeStr"
            :rules="['date']">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date minimal v-model="endTimeStr">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="row q-gutter-lg ">

          <q-input class="col-3" label="入库日期" dense :rules="['date']" v-model="inTimeStr">
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
          <q-input class="col-3" label="生产厂商" dense v-model="medicine.producer"
            :rules="[val => !!val || 'Field is required']">
            <template v-slot:prepend>
              <span class="text-red" style="font-size: 0.8rem">*</span>
            </template>
          </q-input>
        </div>
        <div class="row q-gutter-lg">
          <q-input class="col-3" label="供货单位" dense v-model="medicine.supplier"
            :rules="[val => !!val || 'Field is required']">
            <template v-slot:prepend>
              <span class="text-red" style="font-size: 0.8rem">*</span>
            </template>
          </q-input>
        </div>
        <div class="row q-pt-md q-gutter-md">
          <q-btn color="green" class="q-px-sm" @click="inStock" label="保存"></q-btn>
          <q-btn color="grey-1" class="text-black q-px-sm" @click="reset" label="重置"></q-btn>
        </div>
      </q-form>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import CardHeader from 'src/components/CardHeader.vue'

import MedicineService from '../service/medicine.service.js'
import { date } from 'quasar'
export default {
  components: { CardHeader },
  name: 'MedicationEnroll',
  data () {
    return {
      medicine: {
        mid: '',
        name: '',
        amount: 0,
        price: 0.0,

        producer: '',
        supplier: '',
        produceTime: '',
        endTime: '',
        inTime: ''
      },
      produceTimeStr: '',
      endTimeStr: '',
      inTimeStr: ''
    }
  },
  created () {

  },
  methods: {
    inStock () {
      // this.$message.info(JSON.stringify(this.medicine))
      this.medicine.produceTime = date.formatDate(this.produceTimeStr, 'YYYY-MM-DD')
      this.medicine.endTime = date.formatDate(this.endTimeStr, 'YYYY-MM-DD')
      this.medicine.inTime = date.formatDate(this.inTimeStr, 'YYYY-MM-DD')
      this.$refs.myForm.validate().then(isValid => {
        if (isValid) {
          MedicineService.addMedicine(this.medicine)
            .then(resp => {
              const { data: res } = resp
              if (res.code === 10000) {
                this.$message.success('操作成功')
                return
              }
              this.$message.warn(`新增失败: ${res.message}`)
            }).catch(() => this.$message.error('Network Error'))
        }
      })
    },
    reset () {
      this.medicine = {
        medicine: {
          mid: '',
          name: '',
          amount: 0,
          price: 0.0,

          producer: '',
          supplier: '',
          produceTime: '',
          endTime: '',
          inTime: ''
        },
        produceTimeStr: '',
        endTimeStr: '',
        inTimeStr: ''
      }
      this.$refs.myForm.resetValidation()
    }
  }
}
</script>
