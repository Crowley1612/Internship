// store.js
import { createStore } from 'vuex';

const store = createStore({
    state() {
        return {
            username: '',
        };
    },
    mutations: {
        setUsername(state, username) {
            state.username = username;
        },
        setPassword(state, password) {
            state.password = password;
        },
    },
});

export default store;