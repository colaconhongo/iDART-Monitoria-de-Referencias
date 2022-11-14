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
  localStorage.setItem('token', null);
  localStorage.setItem('role_menus', null);
  router.push({
    path: '/Login',
  });
});
</script>
