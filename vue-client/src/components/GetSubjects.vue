<template>
<fieldset style="display: inline-block; width:12vw;">
    <legend> Curs: </legend>
        <input type="text" v-model="curs" placeholder="2022-1" ><br>
    </fieldset>

    
    <fieldset style="display: inline-block; width:12vw;">
    <legend> Assignatura: </legend>
        <input type="text" v-model="assignatura" placeholder="FX" ><br>
    </fieldset>

    <fieldset style="display: inline-block; width:12vw;">
    <legend> Assignatura ID: </legend>
        <input type="text" v-model="vmTemplateID" placeholder="01" ><br>
    </fieldset>
    <br><br>
    <button type="button" @click="getData()" style="display: inline-block; width:20vw;" > refreshData</button>
    <button type="button" @click="addSubject()" style="display: inline-block; width:20vw;"> Add assignatura</button><br><br>

    <table>
        <tr>
            <th>subject_id</th>
            <th>subject_name</th>
            <th>is_active</th>
            <th>Activate/Desactivate</th>
            <th>Eliminate</th>
        </tr> 
     
        <tr v-for="subject in data">
            <td>{{subject.idsubject < 10 ? "0" + subject.idsubject : subject.idsubject}}</td>
            <td>{{subject.subject_name}}</td>   
            <td>{{subject.active ? "True" : "False"}}</td>
            <td><button type="button" @click="activateSubject(subject.idsubject)" style="width:11vw;"> {{subject.active ? "Desactivate" : "Activate"}}</button></td>
            <td><button type="button" @click="eliminateSubject(subject.idsubject)" style="width:11vw;"> Eliminate Subject</button></td>
        </tr>
     
    </table>   
  </template>
  
  <script>
  export default {
    name: 'GetSubjects',
    data: function(){
        return{
            data:"",
            curs:"",
            assignatura:"",
            vmTemplateID:"",

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
            fetch(`http://192.168.30.2:80/backend/getSubjects`).then(resolve)
            })
            p.then(response=>{
                response.json().then(json=> {
                console.log(json)
                this.data = json
            })})    
        },
        eliminateSubject(id){
            fetch(`http://192.168.30.2:80/backend/eliminateSubject?id=${id}`, {credentials: "include"}).then()
        },
        addSubject(){
            fetch(`http://192.168.30.2:80/backend/addSubject?id=${this.assignatura+"-"+this.curs+"-"+this.vmTemplateID}`, {credentials: "include"}).then()
        },
        activateSubject(id){
            fetch(`http://192.168.30.2:80/backend/activateSubject?id=${id}`, {credentials: "include"}).then()
        }

    },
  
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
  </style>
  