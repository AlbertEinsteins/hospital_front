<template>
  <q-page class="">
    <q-card>
      <card-header icon-name="assignment" title="新置病房"/>

      <div class="q-pa-md">
        <q-form ref="addForm">
          <div class="row">
            <q-input class="col-md-4" v-model="ward.wid" label="房间号" dense
              :rules="[val => !!val || 'Field is required']">
              <template v-slot:prepend>
                <span class="text-red icon-fsize">*</span>
              </template>
            </q-input>
          </div>
          <div class="row">
            <q-select v-model="ward.doctorTypeId" :options="docTypes" emit-value map-options
              class="col-4" label="科室" dense
              :rules="[val => !!val || 'Field is required']">
              <template v-slot:prepend>
                <span class="text-red icon-fsize">*</span>
              </template>
            </q-select>
          </div>
          <div class="row">
            <q-select v-model="ward.wardTypeId" :options="wardTypes" emit-value
              map-options class="col-4" label="类型" dense
              :rules="[val => !!val || 'Field is required']">
              <template v-slot:prepend>
                <span class="text-red icon-fsize">*</span>
              </template>
            </q-select>
          </div>
          <div class="row">
            <q-input v-model.number="ward.capacity" type="number" class="col-md-4"
              label="容量" dense :rules="[val => !!val || 'Field is required']">
              <template v-slot:prepend>
                <span class="text-red icon-fsize">*</span>
              </template>
            </q-input>
          </div>

          <div class="row q-gutter-lg q-mt-auto">
            <q-btn color="green" type="submit" class="q-px-sm" @click="addWard" label="增加"></q-btn>
            <q-btn color="grey-1" class="text-black q-px-sm" @click="reset" label="重置"></q-btn>
          </div>
        </q-form>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import CardHeader from 'components/CardHeader.vue'
import WardTypeService from '../service/wardtype.service.js'
import DocTypeService from '../service/doctype.service.js'
import WardService from '../service/ward.service.js'

export default {
  components: { CardHeader },
  name: 'WardAdd',
  data () {
    return {
      ward: {
        wid: '',
        doctorTypeId: '',
        wardTypeId: '',
        capacity: '',
        createTime: ''
      },
      docTypes: [],
      wardTypes: []
    }
  },
  created () {
    this.getAllDocTypes()
    this.getAllWardTypes()
  },
  methods: {
    getAllDocTypes () {
      DocTypeService.getDocTypes()
        .then(resp => {
          const { data: res } = resp
          if (res.code !== 10000) {
            this.$message.info('服务器异常')
            return
          }
          this.docTypes = res.data.map(docType => {
            return {
              label: docType.name,
              value: docType.tid
            }
          })
        }).catch(() => {
          this.$message.warn('NetWork Error')
        })
    },
    getAllWardTypes () {
      WardTypeService.getWardTypes()
        .then(resp => {
          const { data: res } = resp
          console.log(res)
          if (res.code !== 10000) {
            this.$message.info('服务器异常')
            return
          }
          this.wardTypes = res.data.map(wardType => {
            return {
              label: wardType.name,
              value: wardType.id
            }
          })
        })
    },
    addWard () {
      this.$refs.addForm.validate().then(isValid => {
        if (isValid) {
          this.ward.createTime = new Date()
          WardService.addNewWard(this.ward)
            .then(resp => {
              const { data: res } = resp
              if (res.code === 10000) {
                this.$message.success('新增成功')
                return
              }
              this.$message.info(`新增失败${',' + res.message}`)
            }).catch(() => this.$message.error('NetWork Error'))
        }
      })
    },
    reset () {
      this.ward = {
        wid: '',
        doctorTypeId: '',
        wardTypeId: '',
        capacity: '',
        createTime: ''
      }
      this.$refs.addForm.resetValidation()
    }
  }
}
</script>
<style lang="scss">
  .icon-fsize {
    font-size: .8rem;
  }
</style>
