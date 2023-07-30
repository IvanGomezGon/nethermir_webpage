<template>
<h2> Informació Assignatures </h2>
<fieldset style="display: inline-block; width:12vw;">
    <legend> Curs: </legend>
        <input type="text" v-model="curs" placeholder="2022-1" ><br>
    </fieldset>

    
    <fieldset style="display: inline-block; width:12vw;">
    <legend> Assignatura: </legend>
        <input type="text" v-model="assignatura" placeholder="FX" ><br>
    </fieldset>

    <fieldset style="display: inline-block; width:12vw;">
    <legend> Assignatura id: </legend>
        <input type="text" v-model="vmTemplateID" placeholder="01" ><br>
    </fieldset>
    <br><br>
    <button type="button" @click="addSubject()" style="display: inline-block; width:20vw;"> Agregar assignatura</button><br><br>

    <table>
        <tr>
            <th>Assignatura id</th>
            <th>Nom</th>
            <th>Està activa?</th>
            <th>Activar/Desactivar</th>
            <th>Eliminar</th>
        </tr> 
     
        <tr v-for="subject in data">
            <td>{{subject.idsubject < 10 ? "0" + subject.idsubject : subject.idsubject}}</td>
            <td>{{subject.subject_name}}</td>   
            <td>{{subject.active ? "True" : "False"}}</td>
            <td><button type="button" @click="activateSubject(subject.idsubject)"> {{subject.active ? "Desactivar" : "Activar"}}</button></td>
            <td><button type="button" @click="eliminateSubject(subject.idsubject)"> Eliminar Assignatura</button></td>
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
            fetch(`${process.env.VUE_APP_FETCH_URL}getSubjects`).then(resolve)
            })
            p.then(response=>{
                response.json().then(json=> {
                console.log(json)
                this.data = json
            })})    
        },
        eliminateSubject(id){
            fetch(`${process.env.VUE_APP_FETCH_URL}eliminateSubject?id=${id}`, {credentials: process.env.VUE_APP_FETCH_CREDENTIALS}).then()
        },
        addSubject(){
            fetch(`${process.env.VUE_APP_FETCH_URL}addSubject?id=${this.assignatura+"-"+this.curs+"-"+this.vmTemplateID}`, {credentials: process.env.VUE_APP_FETCH_CREDENTIALS}).then()
        },
        activateSubject(id){
            fetch(`${process.env.VUE_APP_FETCH_URL}activateSubject?id=${id}`, {credentials: process.env.VUE_APP_FETCH_CREDENTIALS}).then()
        }

    },
  
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
  </style>
  
