<template>
    <q-list padding>
      <MenuItem :menus="menus" :init-level="0" :icon-color="iconColor"></MenuItem>
    </q-list>
</template>

<script>

import MenuItem from './MenuItem.vue'

export default {
  name: 'MenuTest',
  components: {
    MenuItem
  },
  props: ['menus', 'iconColor'],
  data () {
    return {
    }
  }
}
</script>
