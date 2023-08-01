<template>
    <div class="flex-container" v-if="register">
        <div class="inner-element" id="register"  style="width:auto" >
            <br>
            <img src="../assets/logo_uab.png" class="selector" style="height: 100px;">
            <h3>NETHERMIR Registre</h3>
            {{ feedback }}<br>
            <p v-if="errors.length" style="text-align:left; margin-left: 40px; color: #d93025">
                <b>Si us plau, corregeix els següents error(s):</b>
                    <p v-for="error in errors">{{ error }}</p>
            </p>
            <div v-if="!registered">
                <div class="register_options">
                    <fieldset id="curs">
                    <legend> Curs: </legend>
                        <select v-model="curs">
                            <option v-for="year in years()" :value="year"> {{year}}</option>                      
                        </select> <br>
                    </fieldset>    
                
                    <fieldset id="assignatura">
                    <legend> Assignatura: </legend>
                        <select v-model="assignatura" >
                            <option v-for="subject in subjects()" :value="subject">{{subject}}</option>
                        </select> <br>
                    </fieldset> 
                    <br>
                    <fieldset id="num">
                    <legend> Número d'integrants: </legend>
                        <select v-model="numIntegrants" @change="this.errors=[];">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                        </select> <br>
                    </fieldset> 
                </div><br>
                <div v-for="index in parseInt(numIntegrants)" :key="index">
                    <fieldset>
                    <legend> Email {{index}}: </legend>
                        <input type="email" v-model="emails[index-1]" placeholder="usuari@uab.cat" pattern=".+@uab\.cat"><br>
                    </fieldset>
                </div><br>
                <button type="button" @click="checkRegister()" style="width: 426.5px;"> Crear grup</button><br><br>
            </div>
            <router-link to="/">Ja tens un compte? Inicia sessió!</router-link><br><br>
        </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Register',
    data: function() {
        return{
            data:"",
            assignatura:"",
            curs:"",
            emails:[],
            errors:[],
            feedback:"",
            registered:false,
            numIntegrants:0,
        }
    },    
    mounted: function () {
        this.getData()
        setInterval(() => {this.getData()}, 10000)
    },
    computed:{

    }, 
    methods:{
        subjects(){
            let retSubjects = []
            if (this.data){
                for (var index in this.data){
                    if (this.data[index]['active']==1 && !retSubjects.includes(this.data[index]['subject_name'].slice(0,-7))){
                    if (this.curs==""){retSubjects.push(this.data[index]['subject_name'].slice(0,-7))}
                    else if (this.data[index]['subject_name'].slice(-6) == this.curs){retSubjects.push(this.data[index]['subject_name'].slice(0,-7))}}
                }
            }  
            return retSubjects          
        },
        years(){
            let retYears = []
            if (this.data){
                for (var index in this.data){
                    if (this.data[index]['active']==1 && !retYears.includes(this.data[index]['subject_name'].slice(-6))){
                    if (this.assignatura==""){retYears.push(this.data[index]['subject_name'].slice(-6))}
                    else if (this.data[index]['subject_name'].slice(0,-7) == this.assignatura){retYears.push(this.data[index]['subject_name'].slice(-6))}}
                }
            }  
            return retYears   
        },

        getData(){
            let p = new Promise((resolve, reject)=>{
            fetch(`${process.env.VUE_APP_FETCH_URL}getSubjects`).then(resolve)
            })
            p.then(response=>{
                response.json().then(json=> {
                this.data = json
            })})    
        },
        checkRegister(){
            this.errors=[];
            if (!this.assignatura){this.errors.push("El camp 'Assignatura' és obligatori.");}
            if (!this.curs){this.errors.push("El camp 'Curs' és obligatori.");}
            if (this.emails.length != this.numIntegrants){this.errors.push("El camp 'Email' és obligatori.")}
            this.emails.forEach((value, index)=>{
                if (!/.+@uab\.cat/.test(value)){this.errors.push(`L'email ${index+1} ha de tenir el format:"usuari@uab.cat"`);}
            })
            if (!this.errors.length){this.register()}
        },
        register(){
            this.feedback="Processant registre..."
            let emailsString = this.emails.join('xv3dz1g')
            let p = new Promise((resolve, reject)=>{
            fetch(`${process.env.VUE_APP_FETCH_URL}register?user=${this.assignatura+'-'+this.curs}&email=${emailsString}`).then(resolve)
            })
            p.then(x=>{x.text().then(y=> {
                if (y == "Y"){
                    this.feedback = "Registre completat! S'ha enviat un email al teu correu amb les credencials per iniciar sessió"
                    this.registered=true
                }else{
                    this.feedback = "Registre completat! S'ha enviat un email al teu correu amb les credencials per iniciar sessió"
                    this.errors.push(y)
                }
            })})    
            

        }
    },
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>

    
  </style>
  