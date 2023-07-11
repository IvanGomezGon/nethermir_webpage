
<template>
    <div class="header">
        <img src="../assets/logo_uab.png" class="logo" @click="this.$router.push('/')">
        <h3 class="header_element">TECTONIC CONTROL PANNEL - USER</h3>
        <button class="push logout" @click="eliminateCookie()">LOG OUT</button>

    </div>
  </template>
  
  <script>
  export default {
    name: 'HeaderRoot',
    props:['modelValue'],
    methods:{
      eliminateCookie(){
            fetch(`http://nethermir.uab.cat:80/backend/eliminateCookie`, {credentials: "include"}).then()
            this.$router.push('/')
        }
    },
  
  }
  </script>

  <style scoped>
  </style>







