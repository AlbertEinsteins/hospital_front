<template>
  <q-page class="z-index: 100;">
    <q-card>
      <card-header icon-name="assignment" title="入院登记"/>

      <div class="q-pa-md">
        <q-form ref="myF">

          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="first">
              <div class="q-gutter-md row">
                <q-input class="col-4" label="姓名" dense v-model="enhospital.name"
                  :rules="[val => !!val || 'Field Required']">
                  <template v-slot:prepend>
                    <span class="text-red" style="font-size: 0.8rem">*</span>
                  </template>
                </q-input>
                <q-input class="col-4" label="身份证号" v-model="enhospital.id"
                  dense mask="##################" :rules="[val => val.length === 18 || '身份证有误']">
                  <template v-slot:prepend>
                    <span class="text-red" style="font-size: 0.8rem">*</span>
                  </template>
                </q-input>
              </div>
              <div class="q-gutter-md row">
                <q-select class="col-4" label="性别" v-model="enhospital.isMale"
                  :options="options.sexs" emit-value map-options dense>
                </q-select>
                <q-select class="col-4" label="民族" v-model="enhospital.nationId"
                  :options="options.nations" option-label="value" option-value="id"
                  emit-value map-options
                  dense>
                </q-select>
              </div>
              <div class="q-gutter-md row q-pt-sm">
                <q-input class="col-4" label="工作单位" v-model="enhospital.workAddress" dense></q-input>
                <q-input class="col-4" label="生日" v-model="enhospital.birthday" dense>
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                        <q-date minimal v-model="enhospital.birthday">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="q-gutter-md row  q-pt-sm">
                <q-input class="col-4" label="家庭住址" v-model="enhospital.address" dense></q-input>
                <q-input class="col-4" label="家庭电话" v-model="enhospital.phone" dense></q-input>
              </div>
              <div class="q-gutter-md row q-pt-sm ">
                <q-select class="col-4" label="婚姻状况" v-model="enhospital.isMarried"
                  :options="options.isMarried" emit-value map-options dense></q-select>
              </div>

              <div class="q-mt-lg">
                <q-btn color="green" @click="tab = 'second'">下一步</q-btn>
              </div>
            </q-tab-panel>

          <q-tab-panel name="second">
            <div class="row items-center">
              <q-icon class="q-ml-sm" @click="tab = 'first'" name="arrow_back" color="blue">返回</q-icon>
            </div>
            <div class="q-gutter-md row q-pt-sm ">
              <q-select :options="docTypes" v-model="tid" option-label="name" option-value="tid"
                class="col-4" label="科室" emit-value map-options dense>
              </q-select>
              <q-select :options="filterDocs" v-model="enhospital.did" option-label="name"
                option-value="did" emit-value map-options class="col-4" label="主治医生"
                dense @filter="selfDocFilter">
              </q-select>
            </div>
            <div class="q-gutter-md row q-pt-sm ">
              <q-select class="col-4" label="病房类型" v-model="wardTypeId"
                :options="wardTypes" dense
                option-label="name" option-value="id" emit-value map-options>
              </q-select>
              <q-select :option-label="ward => `${ward.wid ? ward.wid + '号' : ''}`" option-value="wid"
                v-model="enhospital.wid" class="col-4" label="病房号" :options="filterWards"
                @filter="selfWardFilter" emit-value map-options dense
                @input="(val) => { this.getSickBedsByWid(this.enhospital.wid) }">
              </q-select>
            </div>
            <div class="q-gutter-md row q-pt-sm">
              <q-select class="col-4" label="床位号" v-model="enhospital.sid" dense
                :option-label="sickbed => `${sickbed.sid ? sickbed.sid + '号' : ''}`" option-value="sid" emit-value map-options
                :options="options.sickbeds"></q-select>
              <q-input class="col-4" label="入院状况" v-model="enhospital.bodyStatus"
                placeholder="输入真实情况即可" dense></q-input>
            </div>
            <div class="row q-pt-sm">
              <q-select class="col-4" label="选择护理护士" dense
                v-model="enhospital.nurseId" :options="options.nurseList"
                option-label="fullname" option-value="uid" emit-value map-options></q-select>
            </div>
            <div class="q-gutter-md row  q-pt-sm">
              <q-input class="col-4" label="紧急联系人" v-model="enhospital.emergeName" dense></q-input>
              <q-input class="col-4" label="手机号" v-model="enhospital.emergePhone" dense></q-input>
            </div>

            <div class="q-gutter-md q-mt-sm">
              <q-btn label="登记" color="green" class="text-white q-px-sm" @click="add"></q-btn>
              <q-btn label="重置" color="grey-3" class="text-black q-px-sm" @click="reset"></q-btn>
            </div>
          </q-tab-panel>

          </q-tab-panels>
        </q-form>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import CardHeader from 'components/CardHeader.vue'

import DoctorTypeService from '../service/doctype.service.js'
import DoctorService from '../service/doctor.service.js'
import WardTypeService from '../service/wardtype.service.js'
import WardService from '../service/ward.service.js'
import DictService from '../service/dict.service.js'
import SickBedService from '../service/sickbed.service.js'
import EnHospitalService from '../service/enhospital.service.js'

import { idCardNoUtil } from '../utils/ididentity.js'
import { date } from 'quasar'
import NurseService from 'src/service/nurse.service.js'
export default {
  name: 'EnHospitalizedEnroll',
  components: { CardHeader },
  data () {
    return {
      // init state
      docs: [],
      docTypes: [],
      wards: [],
      wardTypes: [],

      options: {
        sexs: [{ label: '男', value: 1 }, { label: '女', value: 0 }],
        nations: [],
        isMarried: [{ label: '未婚', value: 0 }, { label: '已婚', value: 0 }],
        sickbeds: [],
        nurseList: []
      },

      tid: '',
      wardTypeId: '',
      enhospital: {
        name: '',
        id: '',
        isMale: '',
        nationId: '',
        workAddress: '',
        birthday: '',
        address: '',
        phone: '',
        isMarried: '',
        bodyStatus: '',
        emergeName: '',
        emergePhone: '',
        wid: '',
        sid: '',
        did: '',
        enrollTime: '',
        isActive: 1,
        nurseId: ''
      },
      filterDocs: [],
      filterWards: [],

      tab: 'first'
    }
  },
  created () {
    this.getData()
  },
  methods: {
    selfDocFilter (val, update) {
      if (this.tid === '') {
        update(() => {
          this.filterDocs = this.docs
        })
        return
      }

      update(() => {
        if (this.tid !== '') {
          this.filterDocs = this.docs.filter(doc => {
            return `${doc.tid}` === `${this.tid}`
          })
        }
      })
    },
    selfWardFilter (val, update) {
      if (this.wardTypeId === '') {
        update(() => {
          this.filterWards = this.wards
        })
        return
      }

      update(() => {
        if (this.wardTypeId !== '') {
          this.filterWards = this.wards.filter(ward => {
            return `${ward.wardTypeId}` === `${this.wardTypeId}` &&
              `${ward.doctorTypeId}` === `${this.tid}`
          })
        }
      })
    },
    getData () {
      this.getDoctorTypes()
      this.getDoctors()
      this.getWardTypes()
      this.getWards()
      this.getNations()
      this.getNurseList()
    },
    getDoctorTypes () {
      DoctorTypeService.getDocTypes()
        .then(resp => {
          const { data: res } = resp
          if (res.code === 10000) {
            this.docTypes = res.data
          }
        }).catch(() => this.$message.error('NetWork Error'))
    },
    getDoctors () {
      DoctorService.getDoctors()
        .then(resp => {
          const { data: res } = resp
          if (res.code === 10000) {
            this.docs = res.data
          }
        })
    },
    getWardTypes () {
      WardTypeService.getWardTypes()
        .then(resp => {
          const { data: res } = resp
          if (res.code === 10000) {
            this.wardTypes = res.data
          }
        })
    },
    getWards () {
      WardService.getAllWards()
        .then(resp => {
          const { data: res } = resp
          if (res.code === 10000) {
            this.wards = res.data
          }
        })
    },
    getNations () {
      DictService.getAllNations()
        .then(resp => {
          const { data: res } = resp
          if (res.code === 10000) {
            this.options.nations = res.data
          }
        })
    },
    getNurseList () {
      NurseService.getNurses()
        .then(resp => {
          const { data: res } = resp
          if (res.code === 10000) {
            this.options.nurseList = res.data
          }
        })
    },
    getSickBedsByWid (wid) {
      console.log(wid)
      SickBedService.getSickBedsByWardTypeId(wid)
        .then(resp => {
          const { data: res } = resp
          if (res.code === 10000) {
            this.options.sickbeds = res.data
            return
          }
          this.$message.warn(`操作失败: ${',' + res.message}`)
        })
    },
    add () {
      if (!idCardNoUtil.check18IdCardNo(this.enhospital.id)) {
        this.$message.info('身份证有误')
        return
      }
      this.enhospital.birthday = date.formatDate(this.enhospital.birthday, 'YYYY-MM-DD')
      this.enhospital.enrollTime = date.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss')
      EnHospitalService.patientEnroll(this.enhospital)
        .then(resp => {
          const { data: res } = resp
          if (res.code === 10000) {
            this.$message.success('录入成功')
            this.reset()
            return
          }
          this.$message.warn('操作失败')
        })
    },
    reset () {
      this.tid = ''
      this.wardTypeId = ''
      this.enhospital = {
        name: '',
        id: '',
        isMale: '',
        nationId: '',
        workAddress: '',
        birthday: '',
        address: '',
        phone: '',
        isMarried: '',
        bodyStatus: '',
        emergeName: '',
        emergePhone: '',
        wid: '',
        sid: '',
        did: '',
        enRollTime: '',
        isActive: 1
      }
      this.$refs.myF.resetValidation()
    }
  }
}
</script>
