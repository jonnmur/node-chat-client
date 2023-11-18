<script setup>
import axios from 'axios';
import {useRouter} from "vue-router";

const router = useRouter();

const email = '';
const password = '';

const login = async (email, password) => {
  try {
    const response = await axios.post(`${process.env.VUE_APP_SERVER_URL}/api/auth/login`, {
      email: email,
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

const googleAuth = () => {
  window.location.href=`${process.env.VUE_APP_SERVER_URL}/api/auth/google?client=${process.env.VUE_APP_CLIENT_URL}`;
}

</script>

<template>
    <form>
        <div class="loginbox">
          <label class="inputlabel" for="email">E-mail:</label><br>
          <input v-model="email" type="text" id="email" name="email"><br>
          <label class="inputlabel" for="password">Password:</label><br>
          <input v-model="password" type="password" id="password" name="password"><br><br>
          <button @click="login(email, password)" type="button">Login</button>
          <div @click="googleAuth">Google Auth</div>
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