<template>
  <q-page>
    <q-card>
      <card-header icon-name="assignment" title="病房价格调整"/>
      <div>
        <q-table
        title="Treats"
        :data="data"
        :columns="columns"
        hide-pagination
        row-key="name">
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="id" :props="props">
              {{ props.row.id }}
            </q-td>
            <q-td key="name" :props="props">
              <q-badge color="green" outline>
                {{ props.row.name }}
              </q-badge>
            </q-td>
            <q-td key="price_before" :props="props">
              <q-badge color="green" outline>
                {{ props.row.price }}
              </q-badge>
            </q-td>

            <q-td key="price_after" class="flex content-center" :props="props">
              {{ props.row.price }}
              <q-popup-edit @save="(val, initVal) => changePrice(props.row, initVal)"
                v-model.number="props.row.price" title="Update Price" buttons>
                <q-input type="number" v-model="props.row.price" dense autofocus />
              </q-popup-edit>
            </q-td>
            <q-td key="update_time" :props="props">
                {{ props.row.updateTime |timeFilter }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import CardHeader from 'src/components/CardHeader.vue'
import WardTypeService from '../service/wardtype.service.js'

import { date } from 'quasar'
export default {
  components: { CardHeader },
  name: 'ReviseWard',
  data () {
    return {
      columns: [
        { name: 'id', field: 'id', label: '病房类型号', align: 'left' },
        { name: 'name', field: 'name', label: '类型名称' },
        { name: 'price_before', field: 'price', label: '调整前价格(元/天)' },
        { name: 'price_after', label: '调整后的价格(元/天)', align: 'left', headerStyle: 'width: 200px;' },
        { name: 'update_time', field: 'updateTime', label: '上次调整时间' }
      ],
      data: []
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      WardTypeService.getPageResult(1, 10)
        .then(resp => {
          const { data: res } = resp
          if (res.code === 10000) {
            console.log(res)
            this.data = res.data.records
            return
          }
          this.$message.info('服务器错误!')
        }).catch(() => this.$message.error('Network Error'))
    },
    changePrice (row, initVal) {
      const formDt = new FormData()
      formDt.append('id', row.id)
      formDt.append('price', row.price)
      WardTypeService.revisePrice(formDt)
        .then(resp => {
          const { data: res } = resp
          if (res.code === 10000) {
            this.$message.success('修改成功')
            return
          }
          row.price = initVal
          this.$message.info(res.message)
        }).catch(() => {
          this.$message.error('NetWork error')
          row.price = initVal
        })
    }
  },
  filters: {
    timeFilter (time) {
      return date.formatDate(time, 'YYYY-mm-DD HH:mm:ss')
    }
  }

}
</script>
