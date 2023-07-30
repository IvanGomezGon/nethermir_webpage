
<template>
    <div class="header">
        <img src="../assets/logo_uab.png" class="logo" @click="this.$router.push('/')">
        <h3 class="header_element title">PANELL DE CONTROL D'USUARI</h3>
        <button class="push logout" @click="eliminateCookie()">SORTIR</button>

    </div>
  </template>
  
  <script>
  export default {
    name: 'HeaderRoot',
    props:['modelValue'],
    methods:{
      eliminateCookie(){
            fetch(`${process.env.VUE_APP_FETCH_URL}eliminateCookie`, {credentials: process.env.VUE_APP_FETCH_CREDENTIALS}).then()
            this.$router.push('/')
        }
    },
  
  }
  </script>

  <style scoped>
  </style>







