<template>
  <div class="row bg-green-1" bordered>
    <div class="col text-green q-pa-xs">
      <q-icon :name="iconName" style="font-size: 1.2rem"/>
      <span class="text-weight-bold text-black q-ml-xs" style="font-size: 13px">{{ title }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardHeader',
  props: ['iconName', 'title'],
  data () {
    return {
    }
  }
}
</script>
