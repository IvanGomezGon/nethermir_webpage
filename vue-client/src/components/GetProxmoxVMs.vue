<template>
    <button type="button" @click="getData()"> refreshData</button><br><br>  
    <button type="button" @click="server=0" :disabled="server==0"> Nethermir1</button>
    <button type="button" @click="server=1" :disabled="server==1"> Nethermir2</button>
    <button type="button" @click="server=2" :disabled="server==2"> Nethermir3</button><br><br>  
    <table>
        <tr>
            <th>VM_ID</th>
            <th>Name</th>
            <th>CPU</th>
            <th>Status</th>
            <th>Uptime</th>
            <th>Start / Stop</th>
            <th>Resume / Suspend</th>
        </tr> 
        
        <tr v-for="vm in data" :style=" 'color: ' + getColor(vm.status, vm.cpu, vm.template)">
            <td>{{vm.vmid}}</td>
            <td>{{vm.name}}</td>
            <td>{{vm.template == 1 ? "-" : (vm.cpu*100).toFixed(2) + "%"}}</td>
            <td>{{vm.template == 1 ? "Template" : vm.status == "stopped" ? "Stopped" : vm.cpu<0.005 ? "Running (Paused)" : "Running"}}</td>
            <td>{{vm.template == 1 ? "-" : vm.uptime}}</td>
            <td><button type="button" :disabled="vm.template == 1" @click="stopActivate(vm.status, vm.vmid)" style="width:13vw;">{{vm.status == 'stopped' ? "Start" : "Stop"}} </button></td>

            <td><button type="button" :disabled="vm.status == 'stopped' || vm.template == 1" @click="resumeSuspend(vm.cpu, vm.vmid)" style="width:13vw;"> {{vm.cpu < 0.005 ? "Resume" : "Pause"}}</button></td>

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
            fetch(`https://nethermir.uab.cat/backend/getNodes?server=${this.server}`, {credentials: "include"}).then(resolve)
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
            fetch(`https://nethermir.uab.cat/backend/activateMachine?id=${id}&hours=4`, {credentials: "include"}).then()
        },
        stopVM(id){
            fetch(`https://nethermir.uab.cat/backend/stopMachine?id=${id}`, {credentials: "include"}).then()
        },
        resumeVM(id){
            console.log("yay")
            fetch(`https://nethermir.uab.cat/backend/resumeMachine?id=${id}`, {credentials: "include"}).then()
        },
        suspendVM(id){
            fetch(`https://nethermir.uab.cat/backend/suspendMachine?id=${id}`, {credentials: "include"}).then()
        }
    },
  }
  </script>
  <style scoped>
  </style>
  