import {createRouter, createWebHistory} from "vue-router";
import MessagesComponent from "../components/Messages-Component.vue";
import LoginComponent from "../components/Login-Component.vue";
import LogoutComponent from "../components/Logout-Component.vue";
import RegisterComponent from "../components/Register-Component.vue";

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: 'messages',
            component: MessagesComponent
        },
        {
            path: "/login",
            name: 'login',
            component: LoginComponent
        },
        {
            path: "/logout",
            name: 'logout',
            component: LogoutComponent
        },
        {
            path: "/register",
            name: 'register',
            component: RegisterComponent
        },
    ]
})

export default router;