<template>
    <h2> Informació Proxmox VMs </h2> 
    <button type="button" @click="server=0" :disabled="server==0"> Nethermir1</button>
    <button type="button" @click="server=1" :disabled="server==1"> Nethermir2</button>
    <button type="button" @click="server=2" :disabled="server==2"> Nethermir3</button><br><br>  
    <table>
        <colgroup>
        <col style="width:20px">
        <col span ="6">
    </colgroup>
        <tr>
            <th>VM id</th>
            <th>Nom</th>
            <th>CPU</th>
            <th>Estat</th>
            <th>Uptime</th>
            <th>Encendre / Parar</th>
            <th>Resumir / Suspendre</th>
        </tr> 
        
        <tr v-for="vm in data" :style=" 'color: ' + getColor(vm.status, vm.cpu, vm.template)">
            <td>{{vm.vmid}}</td>
            <td>{{vm.name}}</td>
            <td>{{vm.template == 1 ? "-" : (vm.cpu*100).toFixed(2) + "%"}}</td>
            <td>{{vm.template == 1 ? "Template" : vm.status == "stopped" ? "Stopped" : vm.cpu<0.005 ? "Corrent (Pausat)" : "Corrent"}}</td>
            <td>{{vm.template == 1 ? "-" : vm.uptime}}</td>
            <td><button type="button" :disabled="vm.template == 1 || vm.name == 'nethermir-mgmt'" @click="stopActivate(vm.status, vm.vmid)">{{vm.status == 'stopped' ? "Encendre" : "Parar"}} </button></td>

            <td><button type="button" :disabled="vm.status == 'stopped' || vm.template == 1 || vm.name == nethermir-mgmt" @click="resumeSuspend(vm.cpu, vm.vmid)"> {{vm.cpu < 0.005 ? "Resumir" : "Pausar"}}</button></td>

        </tr>
     
    </table>   
  </template>
  
  <script>
  export default {
    name: 'GetProxmoxVMs',
    data: function(){
        return{
            data:"",
            server:0,
        }
    },
    mounted: function () {
        this.getData()
        setInterval(() => {this.getData()}, 2000)
    },
    methods: {
        getData(){
            let p = new Promise((resolve, reject)=>{
            fetch(`${process.env.VUE_APP_FETCH_URL}getNodes?server=${this.server}`, {credentials: process.env.VUE_APP_FETCH_CREDENTIALS}).then(resolve)
            })
            p.then(response=>{
                response.json().then(json=> {
                console.log(json)
               this.data = json
            })})    
        },
        getColor(status, cpu, template){
            return template == 1 ? "dimgrey" : status == "stopped" ? "red" : cpu<0.005 ? "orange" : "green"
        },
        stopActivate(status,id){
            if (status=='running'){this.stopVM(id)}else{this.activateVM(id)}
        },
        resumeSuspend(cpu, id){
            if (cpu<0.005){this.resumeVM(id)}else{this.suspendVM(id)}
        },
        activateVM(id){
            fetch(`${process.env.VUE_APP_FETCH_URL}activateMachine?id=${id}&hours=4`, {credentials: process.env.VUE_APP_FETCH_CREDENTIALS}).then()
        },
        stopVM(id){
            fetch(`${process.env.VUE_APP_FETCH_URL}stopMachine?id=${id}`, {credentials: process.env.VUE_APP_FETCH_CREDENTIALS}).then()
        },
        resumeVM(id){
            console.log("yay")
            fetch(`${process.env.VUE_APP_FETCH_URL}resumeMachine?id=${id}`, {credentials: process.env.VUE_APP_FETCH_CREDENTIALS}).then()
        },
        suspendVM(id){
            fetch(`${process.env.VUE_APP_FETCH_URL}suspendMachine?id=${id}`, {credentials: process.env.VUE_APP_FETCH_CREDENTIALS}).then()
        }
    },
  }
  </script>
  <style scoped>
  </style>
  
