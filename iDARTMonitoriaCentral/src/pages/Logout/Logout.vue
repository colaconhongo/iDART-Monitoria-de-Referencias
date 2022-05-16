<template>
  <div>Logout</div>
</template>
<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

/*
  Router
*/
const router = useRouter();
/*
  Mounted Hooks
*/
onMounted(() => {
  localStorage.setItem('user', null);
  router.push({
    path: '/Login',
  });
});
</script>
