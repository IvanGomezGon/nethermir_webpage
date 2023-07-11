<template>
    <button type="button" @click="getData()"> refreshData</button><br><br>
      <table>
          <tr>
              <th>email_id</th>
              <th>email</th>
              <th>group_name</th>
              <th>Eliminate</th>
          </tr> 
       
          <tr v-for="email in data">
              <td>{{email.email_id}}</td>
              <td>{{email.email}}</td>
              <td>{{email.group_name}}</td>
              <td><button type="button" @click="eliminateEmail(email.email_id)"> Eliminate Email</button></td>
          </tr>
       
      </table>   
  </template>
  
  <script>
  export default {
    name: 'GetEmails',
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
            fetch(`http://nethermir.uab.cat:80/backend/getEmails`, {credentials: "include"}).then(resolve)
            })
            p.then(response=>{
                response.json().then(json=> {
                console.log(json)
               this.data = json
            })})    
        },
        eliminateEmail(id){
            fetch(`http://nethermir.uab.cat:80/backend/eliminateEmail?id=${id}`, {credentials: "include"}).then()
        },

    },
  
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
  </style>
  