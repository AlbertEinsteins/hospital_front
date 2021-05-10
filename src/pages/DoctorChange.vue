<template>
  <q-page class="" style="min-width: 300px; min-height: 100px;">
    <q-card>
      <card-header icon-name="assignment" title="修改信息" />

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
            <q-select class="col-6" dense label="科室" v-model="doctor.tid"
              :options="options.docTypes" option-label="name" option-value="tid"
              :rules="[val => !!val || 'Field is required']" emit-value map-options>
              <template v-slot:prepend>
                <span class="text-red" style="font-size: 0.8rem">*</span>
              </template>
            </q-select>
          </div>
          <div class="row">
            <q-select class="col-6" dense label="职位" v-model="doctor.pid"
              :options="options.docPos" option-label="name" option-value="pid"
              emit-value map-options
              :rules="[val => !!val || 'Field is required']">
              <template v-slot:prepend>
                <span class="text-red" style="font-size: 0.8rem">*</span>
              </template>
            </q-select>
          </div>
          <div class="row q-pt-md q-gutter-lg">
            <q-btn color="green" class="q-px-sm" label="修改" @click="modify"></q-btn>
            <q-btn color="grey-1" class="text-black q-px-sm" @click="close" label="关闭"></q-btn>
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
import DoctorService from '../service/doctor.service.js'

export default {
  name: 'DoctorEnroll',
  components: { CardHeader },
  props: ['doc'],
  data () {
    return {
      doctor: {
        name: '',
        tid: '',
        pid: '',
        did: ''
      },

      options: {
        docTypes: [],
        docPos: []
      }
    }
  },
  created () {
    this.getOptions()
    const { name, tid, pid, did } = this.doc
    this.doctor = {
      name,
      tid,
      pid,
      did
    }
  },
  methods: {
    modify () {
      // TODO
      console.log(this.doctor)

      DoctorService.reviseInfo(this.doctor)
        .then(resp => {
          const { data: res } = resp
          if (res.code === 10000) {
            this.$message.success('修改成功')
            this.close()
            return
          }
          this.$message.success(`修改失败${',' + res.message}`)
        })
    },
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
    close () {
      this.$emit('closeWindow', false)
      this.$emit('isReload', true)
    }
  }
}

</script>
