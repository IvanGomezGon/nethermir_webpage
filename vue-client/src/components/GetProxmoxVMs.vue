<template>
    <button type="button" @click="getData()"> refreshData</button><br><br>
    
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
     
        <tr v-for="vm in data" :style=" 'color: ' + getColor(vm.status, vm.cpu)">
            <td>{{vm.vmid}}</td>
            <td>{{vm.name}}</td>
            <td>{{(vm.cpu*100).toFixed(2) + "%"}}</td>
            <td>{{vm.status == "stopped" ? "Stopped" : vm.cpu<0.005 ? "Running (Paused)" : "Running"}}</td>
            <td>{{vm.uptime}}</td>
            <td><button type="button" @click="stopActivate(vm.status, vm.vmid)" style="width:13vw;">{{vm.status == 'stopped' ? "Start" : "Stop"}} </button></td>

            <td><button type="button" :disabled="vm.status == 'stopped'" @click="resumeSuspend(vm.cpu, vm.vmid)" style="width:13vw;"> {{vm.cpu < 0.005 ? "Resume" : "Pause"}}</button></td>

        </tr>
     
    </table>   
  </template>
  
  <script>
  export default {
    name: 'GetProxmoxVMs',
    data: function(){
        return{
            data:"",
        }
    },
    props : ['user','password'],
    mounted: function () {
        this.getData()
        setInterval(() => {this.getData()}, 2000)
    },
    methods: {
        getData(){
            let p = new Promise((resolve, reject)=>{
            fetch(`http://localhost:8081/getNodes`, {credentials: "include"}).then(resolve)
            })
            p.then(response=>{
                response.json().then(json=> {
                console.log(json)
               this.data = json
            })})    
        },
        getColor(status, cpu){
            return status == "stopped" ? "red" : cpu<0.005 ? "orange" : "green"
        },
        stopActivate(status,id){
            if (status=='running'){this.stopVM(id)}else{this.activateVM(id)}
        },
        resumeSuspend(cpu, id){
            if (cpu<0.005){this.resumeVM(id)}else{this.suspendVM(id)}
        },
        activateVM(id){
            fetch(`http://localhost:8081/activateMachine?id=${id}&hours=4`, {credentials: "include"}).then()
        },
        stopVM(id){
            fetch(`http://localhost:8081/stopMachine?id=${id}`, {credentials: "include"}).then()
        },
        resumeVM(id){
            console.log("yay")
            fetch(`http://localhost:8081/resumeMachine?id=${id}`, {credentials: "include"}).then()
        },
        suspendVM(id){
            fetch(`http://localhost:8081/suspendMachine?id=${id}`, {credentials: "include"}).then()
        }
    },
  }
  </script>
  <style scoped>
  </style>
  