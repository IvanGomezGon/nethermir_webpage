import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import {createI18n} from "vue-i18n";
import './assets/main.css'
import messages from './lang.json'

function getStartingLocale() {
    if (localStorage.getItem('last-locale')) {
        return localStorage.getItem('last-locale')
    }
    return process.env.VUE_APP_I18N_LOCALE || "CA"
}

const i18n = createI18n({
    locale: getStartingLocale(),
    messages: messages
});
createApp(App).use(store).use(router).use(i18n).mount("#app");
