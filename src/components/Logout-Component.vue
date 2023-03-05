<script setup>
import { onBeforeMount } from 'vue'
import axios from 'axios';
import {useRouter} from "vue-router";

const router = useRouter();

const logout = async () => {
  try {
    const response = await axios.post(process.env.VUE_APP_SERVER_URL + '/api/auth/logout', {},
    {
        withCredentials: true
    });

    if (response.status === 200) {
        router.push('/login');
    }
  } catch (error) {
    console.log(error);
  }
}

onBeforeMount(() => {
  logout();
});

</script>

<template>
Logout
</template>