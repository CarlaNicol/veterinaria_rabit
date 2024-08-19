<template>
    <div class="login-container" style="margin-top: 100px">
        
        <form @submit.prevent="handleLogin">
            <div class="form-group">
                <label for="email">email</label>
                <input type="text" v-model="email" id="email" required />
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <div class="password-wrapper">
                    <input :type="passwordFieldType" v-model="password" id="password" required />
                    <button type="button" @click="togglePasswordVisibility">
                        {{ showPassword ? 'Hide' : 'Show' }}
                    </button>
                </div>
            </div>
            <button type="submit">Login</button>
        </form>
    </div>
</template>
  
<script>
import {mapGetters } from 'vuex'
export default {
    name: 'LoginView',
    data() {
        return {
            email: '',
            password: '',
            showPassword: false,
        };
    },
    computed: {
        ...mapGetters(['getBaseUrl','loged', 'user']),
        passwordFieldType() {
            return this.showPassword ? 'text' : 'password';
        },
        getUser(){
            return this.user;
        }
    },
    methods: {
        togglePasswordVisibility() {
            this.showPassword = !this.showPassword;
        },
        handleLogin() {
            // Handle the login logic here
            console.log('handleLogin');
            const vm = this;
            localStorage.removeItem('user');
            this.axios.get(this.getBaseUrl + "/usuarios?email=" + this.email)
                .then(function (response) {
                    if(response.data.length === 0){
                        vm.$toast.show("Email o password no valido", "danger");
                    } else {
                        localStorage.setItem('user',JSON.stringify(response.data[0]));
                    }
                    location.reload();
                    console.log(response);
                    
                })
                .catch(function (error) {
                    console.error(error);
                });
        },
    },
};
</script>
  
<style scoped>
.login-container {
    max-width: 400px;
    margin: auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}



.form-group {
    margin-bottom: 15px;
}

.password-wrapper {
    display: flex;
    align-items: center;
}

.password-wrapper input {
    flex: 1;
}

.password-wrapper button {
    margin-left: 10px;
}
</style>
  