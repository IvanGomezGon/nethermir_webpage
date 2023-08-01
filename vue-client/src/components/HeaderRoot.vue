
<template>
    <div class="header">
        <img src="../assets/logo_uab.png" class="logo selector" @click="this.$router.push('/')">
        <h3 class="header_element title">PANELL DE CONTROL ROOT</h3>
        <a href="#" :style="getStyle('proxmox')" class="push header_element" @click="saveStatus = !proxmox; switchTab('ProxmoxInfo'); proxmox = saveStatus">Proxmox VMs</a>
        <a href="#" :style="getStyle('grups')" class="header_element" @click="saveStatus = !grups; switchTab('groupsInfo'); grups = saveStatus" >Grups</a>
        <a href="#" :style="getStyle('usuaris')" class="header_element" @click="saveStatus = !usuaris; switchTab('emailsInfo'); usuaris = saveStatus">Usuaris</a>
        <a href="#" :style="getStyle('assignatures')" class="header_element" @click="saveStatus = !assignatures; switchTab('subjectsInfo'); assignatures = saveStatus">Assignatures</a>
        <button class="logout" @click="this.$router.push('/restartDatabase')">Reiniciar base de dades</button>
        <button class="logout" @click="eliminateCookie()">Sortir</button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'HeaderRoot',
    props:['modelValue'],
    data: function() {
        return{
            proxmox: false,
            grups: false,
            usuaris: false,
            assignatures: false,
        }
    },
    methods:{
        getStyle(tab){
            if ((this.proxmox && tab == 'proxmox') || 
                (this.grups && tab == 'grups') || 
                (this.usuaris && tab == 'usuaris') || 
                (this.assignatures && tab == 'assignatures')){
                    return 'border-bottom: 2px solid rgb(32, 102, 0);'
                }
            return '';
        },
        switchTab(tab){
            this.proxmox = false
            this.grups = false
            this.usuaris = false
            this.assignatures = false
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







