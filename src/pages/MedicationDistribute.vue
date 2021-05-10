<template>
  <q-page class="">
    <q-card>
      <card-header icon-name="assignment" title="药品发放"/>
      <div class="q-pa-md q-pl-lg">
        <q-form ref="myForm">
          <div class="row q-gutter-lg">
            <q-select v-model="distribute.hid" label="住院号" dense :rules="[val => !!val || 'Field is required']"
              class="col-4" :options="hidsWithNames" option-label="name" option-value="hid"
              use-input emit-value  @filter="nameFilter">
              <template v-slot:prepend>
                <span class="text-red" style="font-size: 0.8rem">*</span>
              </template>
            </q-select>

          </div>
          <div class="row">
            <q-input v-model="distribute.name" label="姓名" dense :rules="[val => !!val || 'Field is required']"
              class="col-4">
              <template v-slot:prepend>
                <span class="text-red" style="font-size: 0.8rem">*</span>
              </template>
            </q-input>
          </div>
          <div class="row">
            <q-input v-model="distribute.mid" label="药品编号" dense :rules="[val => !!val || 'Field is required']"
              class="col-4">
              <template v-slot:prepend>
                <span class="text-red" style="font-size: 0.8rem">*</span>
              </template>
            </q-input>
          </div>
          <div class="row">
            <q-input v-model.number="distribute.disAmount" type="number" label="数量" dense :rules="[val => !!val || 'Field is required']"
              class="col-4">
              <template v-slot:prepend>
                <span class="text-red" style="font-size: 0.8rem">*</span>
              </template>
              <template v-slot:append>
                <span style="font-size: 0.8rem">(个/瓶)</span>
              </template>
            </q-input>
          </div>
          <div class="row">
            <q-input v-model="distribute.price" label="单价" dense class="col-4"
              :rules="[val => !!val || 'Field is required']">
              <template v-slot:prepend>
                <span class="text-red" style="font-size: 0.8rem">*</span>
              </template>
              <template v-slot:append>
                <span style="font-size: 0.8rem">元(￥)</span>
              </template>
            </q-input>
          </div>
          <div class="row q-gutter-lg q-pt-sm">
            <q-btn color="green" class="q-px-sm" @click="addDistribution" label="发放"></q-btn>
            <q-btn color="grey-1" class="q-px-sm text-black" @click="reset" label="重置"></q-btn>
          </div>
        </q-form>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import CardHeader from 'src/components/CardHeader.vue'

import MedDisService from '../service/meddis.service.js'
export default {
  components: { CardHeader },
  name: 'MedicationDistribute',
  data () {
    return {
      initHidsWithNames: [],
      hidsWithNames: [],

      distribute: {
        hid: '',
        name: '',
        mid: '',
        disAmount: '',
        price: ''
      }
    }
  },
  created () {
    this.getData()
  },
  methods: {
    addDistribution () {
      this.$refs.myForm.validate().then(isValid => {
        if (isValid) {
          MedDisService.addDistributeRecord(this.distribute)
            .then(resp => {
              const { data: res } = resp
              if (res.code === 10000) {
                this.$message.success(`${res.message}`)
                this.reset()
                return
              }
              this.$message.warn(`Error: ${res.message}`)
            })
        }
      })
    },
    nameFilter (val, update) {
      if (val === '') {
        update(() => {
          this.hidsWithNames = this.initHidsWithNames
        })
        return
      }
      update(() => {
        this.hidsWithNames = this.initHidsWithNames
          .filter(item => item.name.indexOf(val) > -1)
      })
    },
    getData () {
      MedDisService.getAllHidsWithName()
        .then(resp => {
          const { data: res } = resp

          console.log(res)
          if (res.code === 10000) {
            this.initHidsWithNames = res.data
            return
          }
          this.$message.info('操作失败' + `${',' + res.message}`)
        }).catch(() => this.$message.error('Network Error'))
    },
    reset () {
      this.distribute = {
        hid: '',
        name: '',
        mid: '',
        disAmount: '',
        price: ''
      }
      this.$refs.myForm.resetValidation()
    }
  }
}
</script>
