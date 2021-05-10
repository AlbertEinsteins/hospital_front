<template>
  <div class="">
    <q-card class="my-card" flat bordered>
      <card-header :title="patient.personName" icon-name="person"/>
      <q-card-section horizontal>
        <q-card-section class="info-aside col-8">
          <q-list dense>
            <q-item class="row">
              <q-item-section class="col-7">
                <q-item-label>就诊科室：</q-item-label>
              </q-item-section>
              <q-item-section aside class="text-left col-5">
                <q-item-label caption>{{ patient.name }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item class="row">
              <q-item-section class="col-7">
                <q-item-label>所在病房：</q-item-label>
              </q-item-section>
              <q-item-section aside class="text-left col-5">
                <q-item-label caption>{{ patient.wid }}号</q-item-label>
              </q-item-section>
            </q-item>

            <q-item class="row">
              <q-item-section class="col-7">
                <q-item-label>所在床位：</q-item-label>
              </q-item-section>
              <q-item-section aside class="text-left col-5">
                <q-item-label caption>{{ patient.sid }}床</q-item-label>
              </q-item-section>
            </q-item>
            <q-item class="row">
              <q-item-section class="col-7">
                <q-item-label>入院健康状态：</q-item-label>
              </q-item-section>
              <q-item-section aside class="col-5 text-left">
                <q-item-label caption>{{ patient.body_status }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item class="row">
              <q-item-section class="col-7">
                <q-item-label>紧急联系人：</q-item-label>
              </q-item-section>
              <q-item-section aside class="text-left col-5">
                <q-item-label caption>{{ patient.emerge_name }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item class="row">
              <q-item-section class="col-7">
                <q-item-label>紧急联系人电话：</q-item-label>
              </q-item-section>
              <q-item-section aside class="text-left col-5">
                <q-item-label caption>{{ patient.emerge_phone }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

        </q-card-section>
        <q-img
          class="col-4"
          src="https://cdn.quasar.dev/img/parallax2.jpg"
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import CardHeader from 'src/components/CardHeader.vue'

export default {
  name: 'PatientCard',
  components: { CardHeader },
  props: ['patient'],
  data () {
    return {
    }
  }
}
</script>
<style lang="scss" scoped>
.info-aside {
  padding: 0;
}
</style>
