<template>
  <q-page class="">
    <q-card>
      <card-header icon-name="assignment" title="运行日志"/>

      <div class="q-pa-md q-pl-lg">
        <div class="row q-gutter-lg">
          <q-select label="事件类型" dense class="col-2" v-model="query.level"
            :options="options.types" option-label="value" option-value="value" emit-value map-options>
          </q-select>
          <q-input label="事件发生时间" dense v-model="query.from">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date v-model="query.happenTime" minimal>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <div>
            <q-btn class="q-px-sm" color="green" label="查询" @click="search"></q-btn>
            <q-btn class="text-black q-ml-sm" color="grey-1" @click="clear" label="清空条件"></q-btn>
          </div>
        </div>
      </div>
    </q-card>

    <q-table title="Events" class="q-mt-md" :columns="columns" :data="logs"
      :pagination.sync="pageOption"
      @request="getPageResult"
      :loading="loading">
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="type">
            <q-badge v-if="props.row.typeId == 57">INFO</q-badge>
            <q-badge color="warning" v-if="props.row.typeId == 58">WARN</q-badge>
            <q-badge color="red" v-if="props.row.typeId == 59">ERROR</q-badge>
            <q-badge color="grey" v-if="props.row.typeId == 60">DEBUG</q-badge>
          </q-td>
          <q-td key="happenTime">{{ props.row.happenTime }}</q-td>
          <q-td key="describe">{{ props.row.describ }}</q-td>
          <q-td key="operate">{{ props.row.operate }}</q-td>
        </q-tr>

      </template>
    </q-table>
  </q-page>
</template>

<script>
import CardHeader from 'src/components/CardHeader.vue'

import DictService from '../service/dict.service.js'
import LogService from '../service/log.service.js'
export default {
  components: { CardHeader },
  name: 'Systemlog',
  data () {
    return {
      query: {
        level: 'INFO',
        from: ''
      },
      loading: false,
      pageOption: {
        page: 1,
        rowsPerPage: 7,
        rowsNumber: 10
      },
      options: {
        types: []
      },
      logs: [],
      columns: [
        { label: '事件类型', name: 'type', align: 'left' },
        { label: '发生时间', name: 'happenTime', align: 'left' },
        { label: '事件描述', name: 'describe', align: 'left' },
        { label: '操作状态', name: 'operate', align: 'left' }
      ]
    }
  },
  mounted () {
    this.getTypes()
    this.getPageResult({
      pagination: this.pageOption
    })
  },
  methods: {
    search () {
      this.getPageResult({
        pagination: this.pageOption
      })
    },
    clear () {
    },
    getTypes () {
      DictService.getAllEventTypes()
        .then(resp => {
          const { data: res } = resp
          if (res.code === 10000) {
            this.options.types = res.data
          }
        }).catch(() => this.$message.error('Network Error'))
    },
    getPageResult (props) {
      const { page, rowsPerPage } = props.pagination
      this.loading = true
      console.log(page, rowsPerPage, props)
      LogService.pageResult(this.query, page, rowsPerPage)
        .then(resp => {
          const { data: res } = resp
          if (res.code === 10000) {
            console.log(res)
            this.logs = res.data.records
            this.pageOption.rowsNumber = res.data.total
            this.pageOption.page = page
            this.pageOption.rowsPerPage = rowsPerPage
            this.loading = false
          }
        }).catch(() => {
          this.$message.warn('Server Error')
          this.loading = false
        })
    }
  }
}
</script>
