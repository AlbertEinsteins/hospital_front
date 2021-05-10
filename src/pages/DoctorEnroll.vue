<template>
  <q-page class="">
    <q-card>
      <card-header icon-name="assignment" title="医生录入" />

      <div class="q-pa-md">
        <q-form ref="addForm">
          <div class="row">
            <q-input dense label="姓名" v-model="doctor.name"
              :rules="[val => !!val || 'Field is required']">
              <template v-slot:prepend>
                <span class="text-red" style="font-size: 0.8rem">*</span>
              </template>
            </q-input>
          </div>
          <div class="row">
            <q-select class="col-4" dense label="科室" v-model="doctor.tid"
              :options="options.docTypes" option-label="name" option-value="tid"
              :rules="[val => !!val || 'Field is required']" emit-value map-options>
              <template v-slot:prepend>
                <span class="text-red" style="font-size: 0.8rem">*</span>
              </template>
            </q-select>
          </div>
          <div class="row">
            <q-input dense label="入职时间" v-model="doctor.hireDateStr" mask="date"
              :rules="['date']">
              <template v-slot:prepend>
                <span class="text-red" style="font-size: 0.8rem">*</span>
              </template>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date v-model="doctor.hireDateStr" minimal>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="row">
            <q-select class="col-4" dense label="职位" v-model="doctor.pid"
              :options="options.docPos" option-label="name" option-value="pid"
              emit-value map-options
              :rules="[val => !!val || 'Field is required']">
              <template v-slot:prepend>
                <span class="text-red" style="font-size: 0.8rem">*</span>
              </template>
            </q-select>
          </div>
          <div class="row">
            <q-select v-model="doctor.isMale" class="col-4" dense label="性别"
              :options="options.sexs" emit-value map-options>
              <template v-slot:prepend>
                <span class="text-red" style="font-size: 0.8rem">*</span>
              </template>
            </q-select>
          </div>
          <div class="row q-pt-md q-gutter-lg">
            <q-btn color="green" class="q-px-sm" label="注册" @click="addDoctor"></q-btn>
            <q-btn color="grey-1" class="text-black" @click="reset" label="清空条件"></q-btn>
          </div>
        </q-form>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import CardHeader from 'components/CardHeader.vue'

import DocTypeService from '../service/doctype.service.js'
import DocPostionService from '../service/docpos.service.js'
import DoctorService from 'src/service/doctor.service.js'

export default {
  name: 'DoctorEnroll',
  components: { CardHeader },
  data () {
    return {
      doctor: {
        name: '',
        tid: '',
        hireDate: '',
        pid: '',
        isMale: '',
        hireDateStr: ''
      },

      options: {
        docTypes: [],
        docPos: [],
        sexs: [{ label: '男', value: 1 }, { label: '女', value: 0 }]
      }
    }
  },
  created () {
    this.getOptions()
  },
  methods: {
    getOptions () {
      this.getDocTypes()
      this.getPotions()
    },

    getDocTypes () {
      DocTypeService.getDocTypes()
        .then(resp => {
          const { data: res } = resp
          if (res.code === 10000) {
            this.options.docTypes = res.data
          }
        })
    },
    getPotions () {
      DocPostionService.getDocPositions()
        .then(resp => {
          const { data: res } = resp
          if (res.code === 10000) {
            this.options.docPos = res.data
          }
        })
    },
    addDoctor () {
      this.$refs.addForm.validate().then(isValid => {
        if (isValid) {
          console.log(this.doctor)
          DoctorService.addDoctor(this.doctor)
            .then(resp => {
              const { data: res } = resp
              if (res.code === 10000) {
                this.$message.success('录入成功')
                return
              }
              this.$message.warn(`新增失败${',' + res.message}`)
            }).catch(() => this.$message.error('NetWork Error'))
        }
      })
    },
    reset () {
      this.doctor = {
        name: '',
        tid: '',
        hireDateStr: '',
        pid: '',
        isMale: ''
      }
      this.$refs.addForm.resetValidation()
    }
  }
}

</script>
