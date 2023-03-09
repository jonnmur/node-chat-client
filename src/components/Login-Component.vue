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
        <div class="loginbox">
          <label class="inputlabel" for="username">Username:</label><br>
          <input v-model="username" type="text" id="username" name="username"><br>
          <label class="inputlabel" for="password">Password:</label><br>
          <input v-model="password" type="password" id="password" name="password"><br><br>
          <button @click="login(username, password)" type="button">Login</button>
          <div @click="router.push('/register')">Register</div>
      </div>
    </form> 
</template>

<style scoped>
  .loginbox {
    background-color: rgb(247, 247, 247);
    height: 150px;
    width: 300px;
    padding: 20px;
    border: 2px solid rgba(232, 232, 232, 0.507);
    margin: 0;
    position: absolute;
    top: 30%;
    left: 50%;
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }
</style>