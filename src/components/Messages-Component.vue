<script setup>
import { ref, onBeforeUnmount, onBeforeMount, nextTick } from 'vue'
import SocketioService from '../services/socketio.service.js';
import axios from 'axios';
import { DateTime } from 'luxon';

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

    scroll(true);
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
    console.log(user.display_name + ' connected');
  });

  SocketioService.socket.on('userDisconnected', (user) => {
    console.log(user.display_name + ' disconnected');
    const index = connectedUsers.value.findIndex(connectedUser => connectedUser.id === user.id);
    if (index > -1) {
      connectedUsers.value.splice(index, 1);
    }
  });
}

const getMessages = async (loadMore) => {
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

  if (!loadMore) {
    scroll(true);
  } else {
    scroll();
  }
}

const sendMessage = async (msg) => {
  try {
    await axios.post(process.env.VUE_APP_SERVER_URL + '/api/message', { body: msg }, { withCredentials: true });

    messages.value.push({ created_at: (new DateTime(DateTime.now())).toLocaleString(DateTime.DATETIME_MED), body: msg, User: SocketioService.socket.auth });
    message.value = '';

  } catch (error) {
    console.log(error);
    if (error.response.status === 401) {
      router.push('/login');
    }
  }

  scroll(true);
}

const scroll = async (toBottom) => {
  const messagelist = document.getElementById('messagelist');

  if (!toBottom) {
    const messagelistHeight = messagelist.scrollHeight;

    await nextTick();

    messagelist.scroll(0, messagelist.scrollHeight - messagelistHeight);
  } else {
    await nextTick();

    messagelist.scroll(0, messagelist.scrollHeight);
  }
}

onBeforeMount(() => {
  pushSocketIoUpdates();
  getMessages();
});

onBeforeUnmount(() => {
  SocketioService.disconnect();
});


</script>

<template>

  <div class="row">
    <div class="col-2 overflow-auto userlist">
      Users online:
      <div v-for="connectedUser in connectedUsers" v-bind:key="connectedUser.id">
        <div class="connecteduser">
          <strong v-if="connectedUser.id === SocketioService.socket.auth.id">{{ connectedUser.display_name }}</strong>
          <span v-else>{{ connectedUser.display_name }}</span>
        </div>
      </div>
    </div>

    <div class="col-10 messagecontainer">
      <div class="messagelist" id="messagelist">
        <button @click="getMessages(true)" type="button">Load more</button>
        <div v-if="messages">
          <div v-for="message in messages" v-bind:key="message.id">
            <div v-bind:class="{ 'mymsgbox' : (message.user_id === SocketioService.socket.auth.id || !message.user_id) }" class="msgbox" id="msgbox">
              <div class="row">
                <div class="msg-author col-6">{{ message.User.display_name }}:</div>
                <div class="msg-date col-6">{{ (new DateTime(message.created_at)).toLocaleString(DateTime.DATETIME_MED) }}</div>
              </div>
              <div class="msg-body">{{ message.body }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="messagesend">
        <form>
          <label for="message">Message:</label><br>
          <input v-model="message" type="text" id="message" name="message"><br>
          <button @click="sendMessage(message)" type="button">Send</button>
        </form>
      </div>

    </div>
  </div>

</template>

<style scoped>
  .userlist {
    background-color: rgb(0, 136, 255, 0.3);
    overflow-y: scroll;
    height: 100vh;
  }

  .connecteduser {
    animation: fadeIn 0.5s;
  }

  .messagecontainer {
    padding: 0;
  }

  .messagelist {
    background-color: rgb(0, 136, 255, 0.1);
    overflow-y: scroll;
    height: calc(100vh - 100px);
    padding: 12px;
  }

  .messagesend {
    background-color: rgb(241, 241, 250);
    height: 100px;
    padding: 12px;
  }

  .msgbox {
    background-color: rgb(255, 255, 255);
    padding: 10px;
    border-radius: 10px 10px 10px 0px;
    margin-top: 5px;
    margin-bottom: 5px;
    box-shadow: 0px 1px 2px 0px rgb(0, 0, 0, 0.2);
    animation: fadeIn 0.5s;
  }

  .mymsgbox {
    background-color: rgba(17, 160, 255, 0.8);
    border-radius: 10px 10px 0px 10px;
    color: rgb(255, 255, 255);
    box-shadow: 0px 1px 2px 0px rgb(0, 0, 0, 0.2);
    animation: fadeIn 0.5s;
  }

  .msg-date {
    padding-right: 15px;
    font-size: x-small;
    text-align: right;
  }
  .msg-author {
    font-size: smaller;
    font-weight: bold;
  }
  .msg-body {
    font-size: smaller;
    margin-top: 5px;
  }

  @keyframes fadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
</style>