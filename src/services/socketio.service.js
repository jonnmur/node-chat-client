import { io } from 'socket.io-client';
import axios from 'axios';

class SocketioService {
  socket;

  constructor() {}

  async setupSocketConnection() {
    this.socket = io(process.env.VUE_APP_SERVER_URL, { 
      autoConnect: false,
      withCredentials: true,
    });

    try {
      const me = await axios.get(process.env.VUE_APP_SERVER_URL + '/api/auth/me', { 
        withCredentials: true 
      });

      this.socket.auth = me.data;
      this.socket.connect();

    } catch (error) {
      if (error.response.status === 401) {
        console.log(error);
      }
    }

    //this.socket.emit('my message', 'Hello there from Vue.');

    /*
    this.socket.on('newMessage', (data) => {
      console.log(data);
    });
    */
  }

  /*
  connect() {
    this.socket.connect();
  }
  */

  disconnect() {
    if (this.socket) {
        this.socket.disconnect();
    }
  }
}

export default new SocketioService();