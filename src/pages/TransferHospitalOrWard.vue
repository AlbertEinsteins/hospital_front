<template>
  <q-page>
    <q-card>
      <card-header icon-name="assignment" title="转院/病房"/>

      <div class="q-pa-md box">
        <div class="row q-gutter-lg">
          <label class="w text-justify lh">住院号:</label>
          <q-input outlined square dense></q-input>

          <label class="w text-justify lh">姓名: </label>
          <q-input outlined square dense></q-input>
        </div>
        <div class="row q-pt-xs q-gutter-lg">
          <label class="w text-justify lh">科室:</label>
          <q-input outlined square dense></q-input>

          <label class="w text-justify lh">主治医生: </label>
          <q-input outlined square dense></q-input>
        </div>
        <div class="row q-pt-xs q-gutter-lg">
          <label class="w text-justify lh">病房类型:</label>
          <q-input outlined square dense></q-input>

          <label class="w text-justify lh">病房号: </label>
          <q-input outlined square dense></q-input>
        </div>
        <div class="row q-pt-xs q-gutter-lg">
          <label class="w text-justify lh">床位号:</label>
          <q-input outlined square dense></q-input>

        </div>
        <div class="row q-mt-auto q-gutter-lg q-ml-auto">
          <q-btn class="q-px-sm" color="green" label="保存"></q-btn>
          <q-btn color="grey-1" class="text-black q-px-sm" label="重置"></q-btn>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import CardHeader from 'src/components/CardHeader.vue'
export default {
  components: { CardHeader },
  name: 'Transfer',
  data () {
    return {
    }
  }
}
</script>
<style lang="scss">
.lh {
  line-height: 2.5rem;
}
.w {
  width: 75px;
}
</style>
