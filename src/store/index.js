import { createStore } from 'vuex'

export default createStore({
  state: {
    count: 0,
    baseUrl: process.env.VUE_APP_API_URL
  },
  mutations: {
    increment(state) {
      state.count++
    }
  },
  actions: {
    increment({ commit }) {
      commit('increment')
    }
  },
  getters: {
    doubleCount(state) {
      return state.count * 2
    },
    getBaseUrl(state) {
      return state.baseUrl
    },
    loged(){
      return localStorage.getItem('user') !== null;
    },
    user() {
      return JSON.parse(localStorage.getItem('user'));
    },
    rol(){
      const user = JSON.parse(localStorage.getItem('user'));
      console.log('rol()', user);
      if(user && user.role){
        return user.role;
      } 
      return 'juani';
    }
  }
})
