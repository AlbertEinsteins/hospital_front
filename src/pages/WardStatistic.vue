<template>
  <q-page>
    <q-card>
      <card-header icon-name="assignment" title="病房统计"/>
      <div class="q-pa-md">
        <div class="row q-gutter-lg">
          <q-select v-model="tid" class="col-3" label="病房类型" dense
            :options="options.types"
            option-label="name" option-value="tid" emit-value map-options>

          </q-select>
          <div>
            <q-btn color="green" class="q-px-md" @click="getPageData">查询</q-btn>
            <q-btn color="grey-1" class="text-black q-ml-md" @click="clear">清空条件</q-btn>
          </div>
        </div>

      </div>
    </q-card>

    <q-table class="q-mt-md" separator="vertical"
      :data="tableData" :columns="columns">
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="tid">{{ props.row.tid }}</q-td>
          <q-td key="name">{{ props.row.name }}</q-td>
          <q-td key="total">{{ props.row.total }}</q-td>
          <q-td key="rest_total">
            {{ props.row.total - props.row.used_total }}
          </q-td>
          <q-td key="used_total">{{ props.row.used_total }}</q-td>
          <q-td key="percent">
            <span v-if="props.row.total">
              {{ (props.row.used_total * 100.0 / props.row.total).toFixed(3) }}%
            </span>
            <span v-else>0.000%</span>
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <q-card class="q-mt-sm">
      <card-header icon-name="show_chart" title="数据概览"/>
      <div class="q-pa-md">
        <q-scroll-area horizontal style="width: 100%; height: 450px;">
          <div id="canvus"  style="width: 800px; height: 450px;"></div>
        </q-scroll-area>
      </div>
      <div class="q-pa-md">
        <q-scroll-area horizontal style="width: 100%; height: 450px;">
          <div id="canvus2"  style="width: 800px; height: 450px;"></div>
        </q-scroll-area>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import CardHeader from 'src/components/CardHeader.vue'

import DocTypeService from '../service/doctype.service.js'
import StatisticService from '../service/statistic.service.js'
export default {
  components: { CardHeader },
  name: 'WardStatistic',
  data () {
    return {
      options: {
        types: []
      },
      tid: '',
      tableData: [],
      columns: [
        { label: '科室编号', name: 'tid', align: 'left' },
        { label: '科室名称', name: 'name', align: 'left' },
        { label: '床位总数', name: 'total', align: 'left' },
        { label: '未使用', name: 'rest_total', align: 'left' },
        { label: '已使用', name: 'used_total', align: 'left' },
        { label: '使用率', name: 'percent', align: 'left' }
      ]
    }
  },
  created () {
    this.getDocTypes()
  },
  mounted () {
    this.getPageData()
  },
  methods: {
    getPageData () {
      StatisticService.wardStatistic(this.tid)
        .then(resp => {
          const { data: res } = resp
          if (res.code === 10000) {
            this.tableData = res.data

            this.drawLine()
            this.drawPie()
          }
        })
    },
    getDocTypes () {
      DocTypeService.getDocTypes()
        .then(resp => {
          const { data: res } = resp
          if (res.code === 10000) {
            this.options.types = res.data
          }
        })
    },
    drawLine () {
      // 基于准备好的dom，初始化echarts实例
      const myChart = this.$echarts.init(document.getElementById('canvus'))
      setTimeout(() => {
        window.onresize = () => {
          myChart.resize()
        }
      }, 200)

      // 准备数据
      const usedData = this.tableData.map(item => item.used_total)
      const restData = this.tableData.map(item => item.total - item.used_total)
      const yLabels = this.tableData.map(item => item.name)
      // 绘制图表
      myChart.setOption({
        title: { text: '使用情况' },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // Use axis to trigger tooltip
            type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
          }
        },
        xAxis: {
          type: 'value',
          minInterVal: 1
        },
        legend: {
          data: ['已使用', '未使用']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        yAxis: {
          type: 'category',
          data: yLabels
        },
        series: [{
          name: '已使用',
          type: 'bar',
          stack: 'total',
          label: {
            show: true
          },
          emphasis: {
            focus: 'series'
          },
          data: usedData
        },
        {
          name: '未使用',
          type: 'bar',
          stack: 'total',
          label: {
            show: true
          },
          emphasis: {
            focus: 'series'
          },
          data: restData
        }]
      })
    },
    drawPie () {
      const myChart = this.$echarts.init(document.getElementById('canvus2'))

      let used = 0, total = 0
      this.tableData.forEach(item => {
        used += item.used_total
      })
      this.tableData.forEach(item => {
        total += item.total
      })
      const dt = [
        { name: '未使用', value: total - used },
        { name: '已使用', value: used }
      ]
      setTimeout(() => {
        window.onresize = () => {
          myChart.resize()
        }
      }, 200)

      myChart.setOption({
        title: {
          text: '病床使用情况',
          subtext: '近期',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '占比',
            type: 'pie',
            radius: '50%',
            data: dt,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
    },
    clear () {
      this.tid = ''
      this.getPageData()
    }
  }
}
</script>
