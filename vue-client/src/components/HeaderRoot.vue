
<template>
    <div class="header">
        <img src="../assets/logo_uab.png" class="logo selector" @click="this.$router.push('/')">
        <h3 class="header_element title">PANELL DE CONTROL ROOT</h3>
        <a href="#" :style="{'--widthVar': cssProxmox}" class="header_element push" id ="proxmox" @click="saveStatus = !proxmox; switchTab('ProxmoxInfo'); proxmox = saveStatus">Proxmox VMs</a>
        <a href="#" :style="{'--widthVar': cssGrups}" class="header_element" id="grups" @click="saveStatus = !grups; switchTab('groupsInfo'); grups = saveStatus" >Grups</a>
        <a href="#" :style="{'--widthVar': cssUsuaris}" class="header_element" id="usuaris" @click="saveStatus = !usuaris; switchTab('emailsInfo'); usuaris = saveStatus">Usuaris</a>
        <a href="#" :style="{'--widthVar': cssAssignatures}" class="header_element" id="assignatures" @click="saveStatus = !assignatures; switchTab('subjectsInfo'); assignatures = saveStatus">Assignatures</a>
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
    computed:{
        cssProxmox(){ 
            if (this.proxmox){return '100%'}else{return 0} 
        },
        cssGrups(){
            if (this.grups){return '100%'}else{return 0}
        },
        cssUsuaris(){
            if (this.usuaris){return '100%'}else{return 0}
        },
        cssAssignatures(){
            if (this.assignatures){return '100%'}else{return 0}
        },
    },
    methods:{

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

<style>
   a.header_element::after {
    width: var(--widthVar)
   }

</style>







