<template>
  <div>
    <div v-for="(item, index) in menus" :key="index">
      <div v-if="!item.children || item.children.length === 0">
        <q-item
          clickable
          v-ripple
          :inset-level="initLevel"
          :to="item.url"
          active-class="bg-green-5 text-white">

          <q-item-section avatar>
            <q-icon :class="iconColor" :name="item.icon"></q-icon>
          </q-item-section>
          <q-item-section class=""
            style="flex-direction: row;
             align-items: center;justify-content: flex-start;">
            <q-icon name="chevron_right"/><span>{{ item.name }}</span>
          </q-item-section>
        </q-item>
      </div>
      <div v-else>
        <q-expansion-item
          :header-inset-level="initLevel">
          <template v-slot:header>
            <q-item-section avatar>
              <q-icon :class="iconColor" :name="item.icon"></q-icon>
            </q-item-section>
            <q-item-section>
              {{ item.name }}
            </q-item-section>

          </template>

          <MenuItem :icon-color="iconColor" :menus="item.children" :init-level="initLevel + 0.1"></MenuItem>
        </q-expansion-item>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MenuItem',
  props: ['menus', 'initLevel', 'iconColor'],
  data () {
    return { }
  }
}
</script>
