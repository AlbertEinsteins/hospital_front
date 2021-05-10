<template>
  <q-page class="">
    <q-card>
      <card-header icon-name="assignment" title="退药处理" />
      <div class="q-pa-md q-pl-lg">
        <q-form ref="myForm">
          <div class="row">
            <q-input label="住院号" dense outlined square
              v-model="rtn.hid"></q-input>
          </div>
          <div class="row q-pt-sm">
            <q-input  label="患者姓名" dense outlined square
              v-model="rtn.name"></q-input>
          </div>
          <div class="row q-pt-sm">
            <q-input  label="药品名称" dense outlined square
              v-model="rtn.medicineName"></q-input>
          </div>
          <div class="row q-pt-sm">
            <q-input  label="数量" dense outlined square
              v-model="rtn.rtnAmount"></q-input>
          </div>
          <div class="row q-pt-sm">
            <q-input class="col-md-6" label="退药原因" type="textarea" filled
              v-model="rtn.reason"></q-input>
          </div>
          <div class="row q-pt-md q-gutter-lg">
            <q-btn color="green" class="q-px-sm" @click="rtnRecord" label="退药"></q-btn>
            <q-btn color="grey-1" class="text-black" @click="reset" label="重置"></q-btn>
          </div>
        </q-form>
      </div>

    </q-card>
  </q-page>
</template>

<script>
import CardHeader from 'src/components/CardHeader.vue'

import MedicineRtnService from '../service/medrtn.service.js'
export default {
  components: {
    CardHeader
  },
  name: 'MedicationReturn',
  data () {
    return {
      rtn: {
        hid: '',
        name: '',
        medicineName: '',
        rtnAmount: '',
        reason: '无'
      }
    }
  },
  methods: {
    rtnRecord () {
      MedicineRtnService.addRtnRecord(this.rtn)
        .then(resp => {
          const { data: res } = resp
          if (res.code === 10000) {
            this.$message.success(`${res.message}`)
            return
          }
          this.$message.warn(`Error: ${res.message}`)
        }).catch(() => this.$message.error('Network Error'))
    },
    reset () {
      this.rtn = {
        hid: '',
        name: '',
        medicineName: '',
        rtnAmount: '',
        reason: ''
      }
    }
  }
}

</script>
