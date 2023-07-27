<template>
<h2> VM info </h2>
      <table>
          <tr>
              <th>VM_ID</th>
              <th>Name</th>
              <th>CPU</th>
              <th>Status</th>
              <th>Uptime</th>
              <th>Start VM</th>
              <th>Resume VM</th>
              <th>Suspend VM</th>
          </tr> 
       
          <tr class="userTable" :style=" 'color: ' + getColor(data.status, data.cpu)">
              <td>{{data.vmid}}</td>
              <td>{{data.name}}</td>
              <td>{{(data.cpu*100).toFixed(2) + "%"}}</td>
              <td>{{data.status == "stopped" ? "Stopped" : data.cpu<0.005 ? "Running (Paused)" : "Running"}}</td>
              <td>{{data.uptime}}</td>
              <td><button type="button" @click="activateVM()" style="width:11vw;" :disabled="data.status != 'stopped'"> Start</button></td>
              <td style="display: flex; justify-content: center; align-items: center;">
                  <fieldset style="width:10vw;">
                      <legend> Hours: </legend>
                      <input type="number" v-model="hours" min="1" max="6" style="width:10vw;">
                  </fieldset>
                  <button type="button" @click="resumeVM()" style="width:11vw;" :disabled="data.status == 'stopped' || data.cpu>0.005"> Resume</button>              
              </td>
              <td><button type="button" @click="suspendVM()" style="width:11vw;" :disabled="data.status == 'stopped' || data.cpu<0.005"> Suspend</button></td>
          </tr>
       
      </table>   
  </template>
  
  <script>
  export default {
    name: 'GetInfoVM',
    data: function(){
        return{
            data:"",
            hours:4,
        }
    },
    mounted: function () {
        this.getData()
        setInterval(() => {this.getData()}, 2000)
    },
    methods: {
        getData(){
            let p = new Promise((resolve, reject)=>{
            fetch(`${process.env.VUE_APP_URL_FETCH}getNode`, {credentials: "include"}).then(resolve)
            })
            p.then(response=>{
                response.json().then(json=> {
               this.data = json
            })})    
        },
        activateVM(id){
            fetch(`${process.env.VUE_APP_URL_FETCH}activateMachine`, {credentials: "include"}).then()
        },
        resumeVM(){
            if (this.hours>0 && this.hours<7){
            fetch(`${process.env.VUE_APP_URL_FETCH}resumeMachine?hours=${this.hours}`, {credentials: "include"}).then()}
        },
        suspendVM(){
            fetch(`${process.env.VUE_APP_URL_FETCH}suspendMachine?`, {credentials: "include"}).then()
        },
        getColor(status, cpu){
            return status == "stopped" ? "red" : cpu<0.005 ? "orange" : "green"
        },
    },
  
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
  </style>
  