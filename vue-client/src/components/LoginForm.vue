<template>
    <div class="flex-container">
        <div class="inner-element" style="width:auto">
            <br>
            <img src="../assets/logo_uab.png" class="selector" style="height: 100px;">
            <h3>NETHERMIR Inici de sessió</h3>
            <h3>{{feedback}}</h3><br>
            <p v-if="errors.length" style="text-align:left; margin-left: 40px; color: #d93025">
                <b>Si us plau, corregeix els següents error(s):</b>
                    <p v-for="error in errors">{{ error }}</p>
            </p>
            <fieldset>
                <legend> Usuari: </legend>
                <input type="text" v-model="usuari" placeholder="xx-20xx-x-1xx">
            </fieldset><br>

            <fieldset>
                <legend> Contrasenya: </legend>
                <input :type="passwordType ? 'password' : 'text'" v-model="password" placeholder="**********">
                <img class="selector" @click="passwordType = (passwordType+1)%2" :src="passwordType ? require('../assets/password_eye_hide.png') : require('../assets/password_eye_show.png')" style="padding-bottom:3px; height: 30px; float: right; filter: opacity(80%)">
            </fieldset><br><br>   
            <button type="button" @click="checkLogin()" style="width: 426.5px;">Iniciar sessió</button><br><br>
            <router-link to="/register">No tens un compte encara? Registrat! </router-link><br><br>
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
            passwordType: 1,
        }
    },
    
    methods:{
        checkLogin(){
            this.feedback=""
            this.errors=[];
            if (!this.usuari){this.errors.push('Usuari obligatori');}
            if (!this.password){this.errors.push('Contrasenya obligatoria');}
            if (!this.errors.length){this.login()}
        },
        login(){
            this.feedback="Processant inici de sessió..."
            
            fetch(`${process.env.VUE_APP_FETCH_URL}login?user=${this.usuari}&pass=${this.password}`, {credentials: process.env.VUE_APP_FETCH_CREDENTIALS}).then(x=>{x.text().then(y=> {
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
  