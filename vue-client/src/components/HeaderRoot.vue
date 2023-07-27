
<template>
    <div class="header">
        <img src="../assets/logo_uab.png" class="logo" @click="this.$router.push('/')">
        <h3 class="header_element title">NETHERMIR CONTROL PANNEL - ROOT</h3>
        <a href="#" class="push header_element" @click="switchTab('ProxmoxInfo')">PROXMOX INFO</a>
        <a href="#" class="header_element" @click="switchTab('groupsInfo')">GROUPS INFO</a>
        <a href="#" class="header_element" @click="switchTab('emailsInfo')">EMAILS INFO</a>
        <a href="#" class="header_element" @click="switchTab('subjectsInfo')">SUBJECTS INFO</a>
        <button class="logout" @click="this.$router.push('/restartDatabase')">RESTART DATABASE</button>
        <button class="logout" @click="eliminateCookie()">LOG OUT</button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'HeaderRoot',
    props:['modelValue'],
    methods:{
        switchTab(tab){
            var activeTabs = [this.modelValue[0], this.modelValue[1]]
            if (this.modelValue[0] == tab){activeTabs[0] =''}
            else if (this.modelValue[1] == tab){activeTabs[1] = ''}
            else {activeTabs[0] = activeTabs[1]; activeTabs[1] = tab}
            console.log(activeTabs)
            this.$emit('update:modelValue', activeTabs)
        },
        eliminateCookie(){
            fetch(`${process.env.VUE_APP_URL_FETCH}eliminateCookie`, {credentials: "include"}).then()
            this.$router.push('/')
        }
    },
  
  }
  </script>

  <style scoped>
  </style>







