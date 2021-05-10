<template>
  <q-page>
    <q-card>
      <card-header icon-name="assignment" title="出院登记"/>

      <div class="q-pa-md">
        <q-form ref="myF">
          <div>
            <div class="row q-gutter-lg">
              <q-input class="col-4" required=true label="住院号" dense
              :rules="[val => !!val || 'Field is required']" v-model="out.uid">
                <template v-slot:prepend>
                  <span class="text-red" style="font-size: 0.8rem">*</span>
                </template>
              </q-input>
              <q-input class="col-4" required=true label="姓名" dense
                :rules="[val => !!val || 'Field is required']" v-model="out.name">
                <template v-slot:prepend>
                  <span class="text-red" style="font-size: 0.8rem">*</span>
                </template>
              </q-input>
            </div>

            <div class="row q-gutter-lg">
              <q-select class="col-4" required=true label="科室" dense
                :rules="[val => !!val || 'Field is required']" v-model="out.tid"
                :options="options.types" option-label="name" option-value="tid" emit-value map-options>
                <template v-slot:prepend>
                  <span class="text-red" style="font-size: 0.8rem">*</span>
                </template>
              </q-select>
              <q-select class="col-4" required=true label="性别" dense
                :rules="[val => !!val || 'Field is required']" v-model="out.isMale"
                :options="options.sex">
                <template v-slot:prepend>
                  <span class="text-red" style="font-size: 0.8rem">*</span>
                </template>
              </q-select>

            </div>

            <div class="row q-gutter-lg">
              <q-input class="col-4" required=true label="身份证号" dense
                :rules="[val => !!val || 'Field is required']" v-model="out.id"
                mask="##################">
                <template v-slot:prepend>
                  <span class="text-red" style="font-size: 0.8rem">*</span>
                </template>
              </q-input>
              <q-input class="col-4" required=true label="主治医生" dense
                :rules="[val => !!val || 'Field is required']" v-model="out.doctorName">
                <template v-slot:prepend>
                  <span class="text-red" style="font-size: 0.8rem">*</span>
                </template>
              </q-input>

            </div>

            <div class="row q-pt-xs q-gutter-lg">
              <q-input class="col-4" required=true label="病房号" dense
                :rules="[val => !!val || 'Field is required']" v-model="out.wid">
                <template v-slot:prepend>
                  <span class="text-red" style="font-size: 0.8rem">*</span>
                </template>
              </q-input>
              <q-input class="col-4" required=true label="床位号" dense
                :rules="[val => !!val || 'Field is required']" v-model="out.sid">
                <template v-slot:prepend>
                  <span class="text-red" style="font-size: 0.8rem">*</span>
                </template>
              </q-input>
            </div>
            <div class="row q-gutter-md">
              <q-btn color="green" label="登记" class="q-px-sm" @click="commit"></q-btn>
              <q-btn class="text-black q-px-sm" @click="reset" color="grey-1" label="重置"></q-btn>
            </div>
          </div>
        </q-form>
      </div>
    </q-card>

  </q-page>
</template>

<script>
import CardHeader from 'components/CardHeader.vue'

import UnHospitalService from '../service/unhospital.service.js'
import DocTypeService from '../service/doctype.service.js'
export default {
  components: { CardHeader },
  name: 'OutHospitalizedEnroll',
  data () {
    return {
      out: {
        uid: '',
        name: '',
        tid: '',
        isMale: '',
        id: '',
        doctorName: '',
        wid: '',
        sid: ''
      },

      options: {
        sex: [{ label: '男', value: 1 }, { label: '女', value: 0 }],
        types: []
      }
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      DocTypeService.getDocTypes()
        .then(resp => {
          const { data: res } = resp
          if (res.code === 10000) {
            this.options.types = res.data
          }
        })
    },
    commit () {
      this.$refs.myF.validate().then(isValid => {
        if (isValid) {
          UnHospitalService.enrollUnHospital(this.out.uid)
            .then(resp => {
              const { data: res } = resp
              if (res.code === 10000) {
                this.$message.success('登记成功')
                return
              }
              this.$message.info(`操作失败${',' + res.message}`)
            }).catch(() => this.$message.error('Network Error'))
        }
      })
    },
    clear () {
      this.out = {
        uid: '',
        name: '',
        tid: '',
        isMale: '',
        id: '',
        doctorName: '',
        wid: '',
        sid: '',
        isPay: ''
      }
    },
    reset () {
      this.$refs.myF.resetValidation()
    }
  }
}
</script>
<style lang="scss">
</style>
