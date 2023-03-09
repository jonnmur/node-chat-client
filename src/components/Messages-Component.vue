<script setup>
import { ref, onBeforeUnmount, onBeforeMount } from 'vue'
import SocketioService from '../services/socketio.service.js';
import axios from 'axios';

import {useRouter} from "vue-router";

const router = useRouter();

const connectedUsers = ref([]);
const message = ref('');
const messages = ref([]);
const offset = ref(0);

const pushSocketIoUpdates = async () => {
  SocketioService.setupSocketConnection();

  SocketioService.socket.on('newMessage', (data) => {
    if (data.user_id !== SocketioService.socket.auth.id) {
      messages.value.push(data);
    }
  });

  SocketioService.socket.on('syncConnectedUsers', (users) => {
    console.log('updated users list');
    users.forEach((user) => {
      if (!connectedUsers.value.find(connectedUser => connectedUser.id === user.id)) {
        connectedUsers.value.push(user);
      }
    });
  });

  SocketioService.socket.on('userConnected', (user) => {
    console.log(user.username + ' connected');
  });

  SocketioService.socket.on('userDisconnected', (user) => {
    console.log(user.username + ' disconnected');
    const index = connectedUsers.value.findIndex(connectedUser => connectedUser.id === user.id);
    if (index > -1) {
      connectedUsers.value.splice(index, 1);
    }
  });
}

const getMessages = async () => {
  try {
    const response = await axios.get(process.env.VUE_APP_SERVER_URL + '/api/message?limit=10&offset=' + offset.value, { withCredentials: true });

    messages.value = response.data.concat(messages.value);
    offset.value = offset.value + 10;

  } catch (error) {
    console.log(error);
    
    if (error.response.status === 401) {
      router.push('/login');
    }
  }
}

const sendMessage = async (msg) => {
  try {
    await axios.post(process.env.VUE_APP_SERVER_URL + '/api/message', { body: msg }, { withCredentials: true });

    messages.value.push({ created_at: new Date(), body: msg, User: SocketioService.socket.auth });
    message.value = '';

  } catch (error) {
    console.log(error);
    if (error.response.status === 401) {
      router.push('/login');
    }
  }
}

onBeforeMount(() => {
  getMessages();
  pushSocketIoUpdates();
});

onBeforeUnmount(() => {
  SocketioService.disconnect();
});


</script>

<template>
  Users online:
  <div v-for="connectedUser in connectedUsers" v-bind:key="connectedUser.id">
    
    <strong v-if="connectedUser.id === SocketioService.socket.auth.id">{{ connectedUser.username }}</strong>
    <span v-else>{{ connectedUser.username }}</span>
  </div>
  <hr>

  <button @click="getMessages()" type="button">Load more</button>
  <div v-if="messages">
    <div v-for="message in messages" v-bind:key="message.id">
      <div class="msgbox" id="msgbox">
        <div class="msg-date">{{ new Date(message.created_at) }}</div>
        <div class="msg-author">{{ message.User.username }}:</div>
        <div class="msg-body">{{ message.body }}</div>
      </div>
    </div>
  </div>

  <form>
      <label for="message">Message:</label><br>
      <input v-model="message" type="text" id="message" name="message"><br>
      <button @click="sendMessage(message)" type="button">Send</button>
  </form> 
</template>

<style scoped>
  .msgbox {
    background-color: rgb(247, 247, 247);
    padding: 10px;
    border: 2px solid rgba(232, 232, 232, 0.507);
    margin-top: 5px;
    margin-bottom: 5px;
  }

  .msg-date {
    font-size: smaller;
  }
  .msg-author {
    margin-top: 5px;
    font-weight: bold;
  }
  .msg-body {
    margin-top: 5px;
  }
</style>