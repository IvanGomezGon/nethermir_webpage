<template>
<h2> Informació Grups </h2>
      
      <table>
          <tr>
              <th>Grup id</th>
              <th>VLAN id</th>
              <th>Nom</th>
              <th>Actiu</th>
              <th>Eliminar</th>
          </tr> 
       
          <tr v-for="group in data">
              <td>{{group.idgroup}}</td>
              <td>{{group.vlan_id + 65434}}</td>
              <td>{{group.name}}</td>
              <td>{{group.active}}</td>
              <td><button type="button" @click="eliminateGroup(group.idgroup)">Eliminar</button></td>
          </tr>
       
      </table>  
  </template>
  
  <script>
  export default {
    name: 'GetGroups',
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
            fetch(`${process.env.VUE_APP_FETCH_URL}getGroups`, {credentials: process.env.VUE_APP_FETCH_CREDENTIALS}).then(resolve)
            })
            p.then(response=>{
                response.json().then(json=> { 
                console.log(json)
               this.data = json
            })})    
        },
        eliminateGroup(id){
            fetch(`${process.env.VUE_APP_FETCH_URL}eliminateGroup?id=${id}`, {credentials: process.env.VUE_APP_FETCH_CREDENTIALS}).then()
        },

    },
  }
  </script>
  
  <style scoped>
  </style>
  