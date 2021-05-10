<template>
  <q-page>
    <q-card>
      <card-header icon-name="assignment" title="病人统计"/>
      <div class="q-pa-md">
        <div class="row q-gutter-lg">
          <q-input v-model="fromDate" label="开始日期" mask="date" dense>
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date minimal v-model="fromDate">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input v-model="toDate" label="结束日期" mask="date" dense>
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date minimal v-model="toDate">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <div>
            <q-btn color="green" class="q-px-md" @click="getData">查询</q-btn>
            <q-btn color="grey-1" class="text-black q-ml-md">清空条件</q-btn>
          </div>
        </div>

      </div>
    </q-card>

    <q-table class="q-mt-md" :data="tableData" :columns="columns"
      separator="vertical">
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="tid">{{ props.row.tid }}</q-td>
          <q-td key="name"><q-badge>{{ props.row.name }}</q-badge></q-td>
          <q-td key="in">{{ props.row.sumOfIn }}</q-td>
          <q-td key="out">
            {{ props.row.sumOfOut }}
          </q-td>
          <q-td key="percent">
              {{ ((props.row.sumOfOut * 100.0) /props.row.sumOfIn).toFixed(3) }}%
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <q-card class="q-mt-md">
      <card-header icon-name="show_chart" title="数据概览"/>
      <div class="q-pa-md">
        <q-scroll-area horizontal style="width: 100%; height: 450px;">
          <div id="canvus" style="width: 800px; height: 450px;"></div>
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

import { date } from 'quasar'
import StatisticService from '../service/statistic.service.js'

export default {
  components: { CardHeader },
  name: 'PatientStatistic',
  data () {
    return {
      fromDate: '',
      toDate: '',

      tableData: [],
      columns: [
        { label: '科室编号', name: 'tid', align: 'left' },
        { label: '科室名称', name: 'name', align: 'left' },
        { label: '累计入院', name: 'in', align: 'left' },
        { label: '累计出院', name: 'out', align: 'left' },
        { label: '出院比(%)', name: 'percent', align: 'left' }
      ]
    }
  },
  created () {
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      this.fromDate = this.fromDate && date.formatDate(this.fromDate, 'YYYY-MM-DD')
      this.toDate = this.toDate && date.formatDate(this.toDate, 'YYYY-MM-DD')
      StatisticService.patientStatistic(this.fromDate, this.toDate)
        .then(resp => {
          const { data: res } = resp
          this.tableData = res.data
          this.tableData = this.tableData.map(item => {
            if (!item.sumOfOut) {
              item.sumOfOut = 0
            }
            return item
          })
          this.drawLine()
          this.drawPie()
        })
    },
    drawLine () {
      // 基于准备好的dom，初始化echarts实例
      const myChart = this.$echarts.init(document.getElementById('canvus'))
      // 绘制图表

      const inSeries = this.tableData.map(item => item.sumOfIn)
      const outSeries = this.tableData.map(item => item.sumOfOut)
      const yAxisLabel = this.tableData.map(item => item.name)
      const legend = ['入院人数', '出院人数']
      myChart.setOption({
        title: { text: '病人入出院统计', subtext: '数据来源于近期' },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: legend
        },
        xAxis: {
          type: 'value',
          minInterval: 1
        },
        yAxis: {
          type: 'category',
          data: yAxisLabel
        },
        series: [{
          name: '入院人数',
          type: 'bar',
          data: inSeries
        },
        {
          name: '出院人数',
          type: 'bar',
          data: outSeries
        }]
      })

      setTimeout(() => {
        window.onresize = () => {
          myChart.resize()
        }
      }, 200)
    },
    drawPie () {
      const myChart = this.$echarts.init(document.getElementById('canvus2'))
      const serials = this.tableData.map(item => {
        return { value: item.sumOfIn, name: item.name }
      })
      setTimeout(() => {
        window.onresize = () => {
          myChart.resize()
        }
      }, 200)

      myChart.setOption({
        title: {
          text: '各科室患者占比(%)',
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
            data: serials,
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
    }
  }
}
</script>
