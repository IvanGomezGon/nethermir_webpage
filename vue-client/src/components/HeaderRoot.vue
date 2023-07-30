
<template>
    <div class="header">
        <img src="../assets/logo_uab.png" class="logo" @click="this.$router.push('/')">
        <h3 class="header_element title">PANELL DE CONTROL ROOT</h3>
        <a href="#" class="push header_element" @click="switchTab('ProxmoxInfo')">PROXMOX VMs</a>
        <a href="#" class="header_element" @click="switchTab('groupsInfo')">GRUPS</a>
        <a href="#" class="header_element" @click="switchTab('emailsInfo')">USUARIS</a>
        <a href="#" class="header_element" @click="switchTab('subjectsInfo')">ASSIGNATURES</a>
        <button class="logout" @click="this.$router.push('/restartDatabase')">REINICIAR BASE DE DADES</button>
        <button class="logout" @click="eliminateCookie()">SORTIR</button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'HeaderRoot',
    props:['modelValue'],
    methods:{
        switchTab(tab){
            this.$emit('update:modelValue',  tab == this.modelValue ? '' : tab)
        },
        eliminateCookie(){
            fetch(`${process.env.VUE_APP_FETCH_URL}eliminateCookie`, {credentials: process.env.VUE_APP_FETCH_CREDENTIALS}).then()
            this.$router.push('/')
        }
    },
  
  }
  </script>

  <style scoped>
  </style>







