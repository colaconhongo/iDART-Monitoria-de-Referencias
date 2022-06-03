<template>
   <q-banner
    dense
    inline-actions
    :class="[bgColor, headerClass]"
    class="text-white q-pa-none">
        <span class="text-bold text-subtitle1 vertical-middle q-pl-md"><slot></slot></span>
        <template v-slot:action>
          <q-btn v-if="doneVisible" flat dense round color="white" icon="done" @click="$emit('done')"/>
          <q-btn dense flat round color="white" :icon="expanded ? 'expand_less' : 'expand_more'" class="float-right" @click="expand"/>
          <q-btn dense v-if="addVisible" flat round color="white" icon="add" class="float-right" @click="$emit('showAdd')"/>
          <q-btn dense v-if="closeVisible" flat round color="white" icon="close" class="float-right" @click="closeSection"/>
        </template>
    </q-banner>
</template>

<script setup>
import { onMounted, ref } from 'vue';
const headerClass = ref('')
const expanded = ref(false)

const emit = defineEmits(['closeSection', 'expandLess', 'done', 'showAdd'])

const determineHeaderClass = () => {
    if (props.mainContainer) {
      headerClass.value = 'list-header'
    } else {
      headerClass.value = ''
    }
  };
  const expand = () => {
    expanded.value = !expanded.value
    emit('expandLess', expanded.value)
  };
  const closeSection = () => {
    emit('closeSection')
  }

  onMounted(() => {
    determineHeaderClass();
  });

  /*
  Props
  */
  const props = defineProps(['addVisible', 'bgColor', 'mainContainer', 'doneVisible', 'closeVisible']);


</script>

<style lang="scss" scoped>
    .list-header {
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
    }
</style>
