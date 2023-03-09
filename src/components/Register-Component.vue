<script setup>
import axios from 'axios';
import {useRouter} from "vue-router";

const router = useRouter();

const username = '';
const password = '';

const register = async (username, password) => {
  try {
    const response = await axios.post(process.env.VUE_APP_SERVER_URL + '/api/auth/register', {
      username: username ,
      password: password,
    },
    {
        withCredentials: true
    });

    if (response.status === 201) {
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
        <label for="username">Username:</label><br>
        <input v-model="username" type="text" id="username" name="username"><br>
        <label for="password">Password:</label><br>
        <input v-model="password" type="password" id="password" name="password"><br><br>
        <button @click="register(username, password)" type="button">Register</button>
      </div>
    </form> 
</template>

<style scopes>
  .loginbox {
    background-color: rgb(247, 247, 247);
    height: 150px;
    width: 300px;
    padding: 20px;
    border: 2px solid rgba(232, 232, 232, 0.507);
    border-radius: 3%;
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }
</style>