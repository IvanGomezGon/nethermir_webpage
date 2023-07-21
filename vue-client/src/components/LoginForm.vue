<template>
    <div class="flex-container">
        <div class="inner-element">
            <br>
            <img src="../assets/logo_uab.png" class="logo">
            <h3>TECTONIC Sign in</h3>
            <h3>{{feedback}}</h3>
            <p v-if="errors.length" style="text-align:left; margin-left: 40px; color: #d93025">
                <b>Please correct the following error(s):</b>
                    <p v-for="error in errors">{{ error }}</p>
            </p>
            <fieldset>
                <legend> User: </legend>
                <input type="text" v-model="usuari" placeholder="xx-20xx-x-1xx">
            </fieldset><br>

            <fieldset>
                <legend> Password: </legend>
                <input type="password" v-model="password" placeholder="**********">
            </fieldset><br><br>   
            <button type="button" @click="checkLogin()">Login</button><br><br>
            <router-link to="/register">Don't have an account yet? Register! </router-link><br><br>
        </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Login',
    data: function() {
        return{

            feedback:"",
            usuari:"",
            password:"",
            errors:[],
        }
    },
    
    methods:{
        checkLogin(){
            this.feedback=""
            this.errors=[];
            if (!this.usuari){this.errors.push('User required');}
            if (!this.password){this.errors.push('Password required');}
            if (!this.errors.length){this.login()}
        },
        login(){
            this.feedback="Processing login..."
            
            fetch(`https://nethermir.uab.cat/backend/login?user=${this.usuari}&pass=${this.password}`, {credentials: "include"}).then(x=>{x.text().then(y=> {
                if (y == "root"){
                    this.$router.push('/controlPannelRoot')
                }else if (y == 'user'){
                    this.$router.push('/controlPannelUser')
                }else{
                    this.feedback = ""
                    this.errors.push(y)
                }
            })})     
        }
  }
}
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
  </style>
  