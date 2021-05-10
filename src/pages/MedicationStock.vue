<template>
  <q-page class="">
    <q-card>
      <card-header icon-name="assignment" title="库存查询"/>

      <div class="q-pa-md q-pl-lg">
        <div class="row q-gutter-lg">
          <q-input label="药品编号" class="col-5" square outlined  dense v-model="queryVo.mid">

          </q-input>
          <q-input label="药品名称" class="col-5" square dense outlined v-model="queryVo.name">
          </q-input>

        </div>
        <div class="row q-gutter-lg q-pt-md">
          <q-btn color="green" class="q-px-sm" @click="getStockData" label="查询"></q-btn>
          <q-btn color="grey-1" class="text-black" @click="reset" label="清空条件"></q-btn>
        </div>
      </div>
    </q-card>
    <q-table class="q-mt-md" separator="vertical"
      title="库存" :data="data" :columns="columns">
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="mid"   :props="props">{{ props.row.mid }}</q-td>
          <q-td key="name"  :props="props">{{ props.row.name }}</q-td>
          <q-td key="price"  :props="props">
            {{ props.row.price }}元
          </q-td>
          <q-td key="restAmount"  :props="props">
            <q-badge>{{ props.row.amount - props.row.disAmount }}</q-badge>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import CardHeader from 'src/components/CardHeader.vue'

import MedicineService from '../service/medicine.service.js'
export default {
  components: { CardHeader },
  name: 'MedicationStock',
  data () {
    return {
      queryVo: {
        mid: '',
        name: ''
      },
      pagenum: 1,
      pagesize: 10,

      data: [],
      columns: [
        { label: '药品编号', name: 'mid', align: 'left' },
        { label: '药品名称', name: 'name', align: 'left' },
        { label: '药品价格(￥)', name: 'price', align: 'left' },
        { label: '药品数量', name: 'restAmount', align: 'left' }
      ]
    }
  },
  created () {
    this.getStockData()
  },
  methods: {
    getStockData () {
      this.queryVo.mid = this.queryVo.mid === '' ? null : this.queryVo.mid
      this.queryVo.name = this.queryVo.name === '' ? null : this.queryVo.name
      MedicineService.getPage(this.queryVo, this.pagenum, this.pagesize)
        .then(resp => {
          const { data: res } = resp
          console.log(res)
          if (res.code === 10000) {
            this.data = res.data.records
            return
          }
          this.$message.warn(`Error: ${res.message}`)
        })
    },
    reset () {
      this.queryVo = {
        mid: '',
        name: ''
      }
    }
  }
}
</script>
