<script setup>
import axios from 'axios';
import {useRouter} from "vue-router";

const router = useRouter();

const email = '';
const display_name = '';
const password = '';

const register = async (email, display_name, password) => {
  try {
    const response = await axios.post(process.env.VUE_APP_SERVER_URL + '/api/auth/register', {
      email: email,
      display_name: display_name,
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
        <label for="email">E-mail:</label><br>
        <input v-model="email" type="text" id="email" name="email"><br>
        <label for="display_name">Display name:</label><br>
        <input v-model="display_name" type="text" id="display_name" name="display_name"><br>
        <label for="password">Password:</label><br>
        <input v-model="password" type="password" id="password" name="password"><br><br>
        <button @click="register(email, display_name, password)" type="button">Register</button>
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
    margin: 0;
    position: absolute;
    top: 30%;
    left: 50%;
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }
</style>