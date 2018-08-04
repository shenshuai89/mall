import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const state = {
    nickName:'',
    cartCount:0
}

const mutations = {
    updateUserInfo(state, nickName){
        state.nickName = nickName;
    },
    updateCartCount(state, count){
        state.cartCount += count;
    },
    initCartCount(state, count){
        state.cartCount = count;
    }
}


export default new Vuex.Store({
    state,	
    mutations
})