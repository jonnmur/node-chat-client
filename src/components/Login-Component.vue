<script setup>
import axios from 'axios';
import {useRouter} from "vue-router";

const router = useRouter();

const username = '';
const password = '';

const login = async (username, password) => {
  try {
    const response = await axios.post(process.env.VUE_APP_SERVER_URL + '/api/auth/login', {
      username: username ,
      password: password,
    },
    {
        withCredentials: true
    });

    if (response.status === 200) {
      router.push('/');
    }
  } catch (error) {
    console.log(error);
  }
}

</script>

<template>
    <form>
        <label for="username">Username:</label><br>
        <input v-model="username" type="text" id="username" name="username"><br>
        <label for="password">Password:</label><br>
        <input v-model="password" type="password" id="password" name="password"><br><br>
        <button @click="login(username, password)" type="button">Login</button>
        <div @click="router.push('/register')">Register</div>
    </form> 
</template>