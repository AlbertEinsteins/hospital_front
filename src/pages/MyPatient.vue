<template>
  <q-page class="" style="background: #fff;">

    <card-header title="我的病人" icon-name="group"/>
    <div class="row q-gutter-xs q-pa-xs" style="border: 1px solid #eee">

      <patient-card v-for="(patient, index) in data" :key="patient.hid"
        :patient="patient"
        :class="(index + 1) % 3 == 0 ? 'col' : 'col-4'"/>

    </div>

  </q-page>
</template>

<script>
import DoctorService from 'src/service/doctor.service'
import PatientCard from 'src/components/PatientCard.vue'
import CardHeader from 'src/components/CardHeader.vue'

export default {
  components: { PatientCard, CardHeader },
  name: 'MyPatient',
  data () {
    return {
      pageConfig: {
        pagenum: 1,
        pagesize: 10
      },
      data: []
    }
  },
  created () {
    this.getPageResult()
  },
  methods: {
    getPageResult () {
      const { username } = this.currentUser
      const isActive = 1
      DoctorService.getInfo(username, isActive,
        this.pageConfig.pagenum, this.pageConfig.pagesize)
        .then(resp => {
          const { data: res } = resp
          console.log(res.data.records[0])
          if (res.code === 10000) {
            this.data = res.data.records
            return
          }
          this.$message.info(`${res.message}`)
        }).catch(() => { this.$message.warn('Server Error') })
    }
  },
  computed: {
    currentUser () {
      return this.$store.state.auth.user
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
