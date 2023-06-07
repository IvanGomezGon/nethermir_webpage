const options = {
    data: function() {
        return {
            user:"",
            password:"",
            feedback:"",
            login: true,
            register: false,
            controlPanel: false,
            controlPanelRoot: false,
            proxmoxInfo: false,
            emailInfo: false,
            groupsInfo: false,
            areYouSure: false,
            subjectInfo: false,
        }
    },
    methods: {
        setUser(user, pass){
            this.user=user
            this.password=pass
            this.login=false; 
            this.register=false;
            if (user == "root") {this.controlPanelRoot = true}
            else {this.controlPanel = true}
        },     
        activate(hours){            
            this.feedback="Processing..."
            let p = new Promise((resolve, reject)=>{
            fetch(`http://192.168.30.2:80/activateMachine?user=${this.user}&pass=${this.password}&hours=${hours}`).then(resolve)
            })
            p.then(x=>{x.text().then(y=> {
                this.feedback = y; 
                if (y == "Y"){
                    this.feedback = "Machine activated!"; 
                }
            })})      
        },
        stop(){
            this.feedback="Processing..."
            let p = new Promise((resolve, reject)=>{
            fetch(`http://192.168.30.2:80/stopMachine?user=${this.user}&pass=${this.password}`).then(resolve)
            })
            p.then(x=>{x.text().then(y=> {
                this.feedback = y; 
                if (y == "Y"){
                    this.feedback = "Machine stopped!"; 
                }
            })}) 

        },
        restartDatabase(){
            let p = new Promise((resolve, reject)=>{
                fetch(`http://192.168.30.2:80/restartDatabase?user=${this.user}&pass=${this.password}`).then(resolve)
                })
                p.then(x=>{x.text().then(y=> {
                    this.feedback = y; 
                    if (y == "Y"){
                        this.feedback = "Machine stopped!"; 
                    }
                })}) 
        }

    },
    template: `
   
    
    <div class="flex-container" v-if="login">
        <div class="inner-element">
            <Login v-on:user="setUser"></Login><br><br>
            <a href="#" @click="login=false; register=true">Don't have an account yet? Register!</a>
            <br><br>
        </div>
    </div>
     
    <div class="flex-container" v-if="register">
        <div class="inner-element" id="register" >
            <Register></Register><br><br>
            <a href="#" @click="login=true; register=false">Already have an account? Login!</a>
            <br><br>
        </div>
    </div>
    
    <div class="flex-container" v-if="controlPanel">
        <div class="header">
            <img src="/assets/logo_uab.png" class="logo">
            <h3 class="header_element">TECTONIC CONTROL PANNEL</h3>
        </div>
    
        <div class="inner-element rootControl" style="height:auto;" >
            <GetInfoVM :user="user" :password="password"></GetInfoVM>
        </div>
    </div>

    <div class="flex-container" v-if="controlPanelRoot" style="align-items:baseline">
        <div v-if="areYouSure" style="background-color:red; color:white; z-index: 1000; width:100vw; height: 100vh; position:absolute">
            <h1>!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!</h1>
            <h1>ARE YOU SURE? THIS WILL RESTART THE WHOLE DATABASE, EVERYTHING WILL BE LOST</h1>
            <h1>!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!</h1>
            <button type="button" @click="restartDatabase(); areYouSure=false" style="background-opacity:30%"><h2>YES, RESTART</h2></button>
            <button type="button" @click="areYouSure=false"><h2>NO, DON'T RESTART</h2></button>
        </div>
        <div class="header">
            <img src="/assets/logo_uab.png" class="logo">
            <h3 class="header_element">TECTONIC CONTROL PANNEL - ROOT USER</h3>
            <a href="#" class="push header_element" @click="proxmoxInfo=!proxmoxInfo; groupsInfo=false; emailInfo=false; subjectInfo=false">PROXMOX INFO</a>
            <a href="#" class="header_element" @click="groupsInfo=!groupsInfo; proxmoxInfo=false; emailInfo=false; subjectInfo=false">USERS INFO</a>
            <a href="#" class="header_element" @click="emailInfo=!emailInfo; proxmoxInfo=false; groupsInfo=false; subjectInfo=false;">EMAILS INFO</a>
            <a href="#" class="header_element" @click="subjectInfo=!subjectInfo; proxmoxInfo=false; groupsInfo=false; emailInfo=false">SUBJECTS INFO</a>
            <a href="#" class="header_element" @click="areYouSure=true">RESTART DATABASE</a>
        </div>


        <div class="inner-element rootControl" v-if="proxmoxInfo">
            <GetNodes :user="user" :password="password"></GetNodes>            
        </div>

        <div class="inner-element rootControl" v-if="groupsInfo" style="height:auto;">
            <GetGroups :user="user" :password="password"></GetGroups> 
        </div>
        
        <div class="inner-element rootControl" v-if="emailInfo" style="height:auto;">
            <GetEmails :user="user" :password="password"></GetEmails> 
        </div>
        <div class="inner-element rootControl" v-if="subjectInfo" style="height:auto;">
            <GetSubjects :user="user" :password="password"></GetSubjects> 
        </div>
    </div>

    `,
};
const app = Vue.createApp(options);

app.component('Login',{
    data: function() {
        return{

            feedback:"",
            usuari:"",
            password:"",
            errors:[],
        }
    },
    
    methods:{
        checkLogin(){
            this.feedback=""
            this.errors=[];
            if (!this.usuari){this.errors.push('User required');}
            if (!this.password){this.errors.push('Password required');}
            if (!this.errors.length){this.login()}
        },
        login(){
            this.feedback="Processing login..."
            let p = new Promise((resolve, reject)=>{
            fetch(`http://192.168.30.2:80/login?user=${this.usuari}&pass=${this.password}`).then(resolve)
            })
            p.then(x=>{x.text().then(y=> {
                if (y == "Login succesfull!"){
                    this.$emit('user', this.usuari, this.password);
                }else{
                    this.feedback = ""
                    this.errors.push(y)
                }
            })})},
    
            
     
        
    },
    template: `
        <br>
        <img src="/assets/logo_uab.png" class="logo">
        <h3>TECTONIC Sign in</h3>
        <h3>{{feedback}}</h3>
        <p v-if="errors.length" style="text-align:left; margin-left: 40px; color: #d93025">
            <b>Please correct the following error(s):</b>
                <p v-for="error in errors">{{ error }}</p>
        </p>
        <fieldset>
            <legend> User: </legend>
            <input type="text" v-model="usuari" placeholder="xx-20xx-x-1xx">
        </fieldset><br>

        <fieldset>
            <legend> Password: </legend>
            <input type="password" v-model="password" placeholder="**********">
        </fieldset><br><br>   
        <button type="button" @click="checkLogin()">Login</button>
        `
})

app.component('Register',{
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
        setInterval(() => {this.getData()}, 2000)
    },
    computed:{
        subjects(){
            retSubjects = []
            if (this.data){
                for (subject in this.data){
                    if (this.data[subject]['active']==1){
                    if (this.curs==""){retSubjects.push(this.data[subject]['subject_name'].slice(7,-4))}
                    else if (this.data[subject]['subject_name'].slice(0,6) != this.curs){retSubjects.push(this.data[subject]['subject_name'].slice(7,-4))}}
                }
            }  
            return retSubjects          
        },
        years(){
            retYears = []
            if (this.data){
                for (subject in this.data){
                    if (this.data[subject]['active']==1){
                    if (this.assignatura==""){retYears.push(this.data[subject]['subject_name'].slice(0, 6))}
                    else if (this.data[subject]['subject_name'].slice(7,-4) != this.assignatura){retYears.push(this.data[subject]['subject_name'].slice(0,6))}}
                }
            }  
            return retYears   
        },
    },  
    methods:{
        getData(){
            let p = new Promise((resolve, reject)=>{
            fetch(`http://192.168.30.2:80/getSubjects`).then(resolve)
            })
            p.then(response=>{
                response.json().then(json=> {
                console.log(json)
                this.data = json
            })})    
        },
        checkRegister(){
            this.errors=[];
            if (!this.assignatura){this.errors.push('Assignatura required.');}
            if (!this.curs){this.errors.push('Curs required.');}
            if (!this.emails.length){this.errors.push('At least 1 email required');}
            if (this.emails.length != this.numIntegrants){this.errors.push(`You need to enter ${this.numIntegrants} emails` )}
            this.emails.forEach((value, index)=>{
                if (!/.+@uab\.cat/.test(value)){this.errors.push(`Email ${index+1} should be in format:"example@uab.cat"`);}
            })
            if (!this.errors.length){this.register()}
        },
        register(){
            this.feedback="Processing register..."
            emailsString = this.emails.join('xv3dz1g')
            console.log(emailsString)
            let p = new Promise((resolve, reject)=>{
            fetch(`http://192.168.30.2:80/register?user=${this.assignatura+'-'+this.curs}&email=${emailsString}`).then(resolve)
            })
            p.then(x=>{x.text().then(y=> {
                if (y == "Y"){
                    this.feedback = "Register Succesfull! Email was sent to your account with credentials to log in"
                    this.registered=true
                }else{
                    this.feedback = ""
                    this.errors.push(y)
                }
            })})    
            

        }
    },
    template: `
        <br>
        <img src="/assets/logo_uab.png" class="logo">
        <h3>TECTONIC Register</h3>
        {{feedback}}
        <p v-if="errors.length" style="text-align:left; margin-left: 40px; color: #d93025">
            <b>Please correct the following error(s):</b>
                <p v-for="error in errors">{{ error }}</p>
        </p>
    <div v-if="!registered">
        <div class="register_options">
            
            <fieldset id="curs">
            <legend> Curs: </legend>
                <select v-model="curs">
                        <option v-for="year in years" :value="year"> {{year}}</option>                      
                </select> <br>
            </fieldset>    
        
            <fieldset id="assignatura">
            <legend> Assignatura: </legend>
                <select v-model="assignatura" >
                    <option v-for="subject in subjects" :value="subject">
                            {{subject}}                       
                    </option>

                    
                </select> <br>
            </fieldset> 

            <fieldset id="num">
            <legend> Num integrants: </legend>
                <select v-model="numIntegrants" @change="this.errors=[];">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                </select> <br>
            </fieldset> 
        </div>
        <br>
        <div v-for="index in parseInt(numIntegrants)" :key="index">
            <fieldset>
            <legend> Email {{index}}: </legend>
                <input type="email" v-model="emails[index-1]" placeholder="user@uab.cat" pattern=".+@uab\.cat"><br>
            </fieldset>
        </div>
        <br><br>


        <button type="button" @click="checkRegister()"> Create group</button>
    </div>
    `
})



app.component('GetNodes', {
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
            fetch(`http://192.168.30.2:80/getNodes?user=${this.user}&pass=${this.password}`).then(resolve)
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
            fetch(`http://192.168.30.2:80/activateMachine?user=${this.user+id}&pass=${this.password}&hours=4`).then()
        },
        stopVM(id){
            fetch(`http://192.168.30.2:80/stopMachine?user=${this.user+id}&pass=${this.password}`).then()
        },
        resumeVM(id){
            console.log("yay")
            fetch(`http://192.168.30.2:80/resumeMachine?user=${this.user+id}&pass=${this.password}`).then()
        },
        suspendVM(id){
            fetch(`http://192.168.30.2:80/suspendMachine?user=${this.user+id}&pass=${this.password}`).then()
        }
    },
    template:`
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
            <td><button type="button" @click="stopActivate(vm.status, vm.vmid)" >{{vm.status == 'stopped' ? "Start" : "Stop"}} </button></td>

            <td><button type="button" @click="resumeSuspend(vm.cpu, vm.vmid)"> {{vm.cpu < 0.005 ? "Resume" : "Pause"}}</button></td>

        </tr>
     
    </table>   
    `
})

app.component('GetGroups', {
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
            fetch(`http://192.168.30.2:80/getGroups?user=${this.user}&pass=${this.password}`).then(resolve)
            })
            p.then(response=>{
                response.json().then(json=> {
                console.log(json)
               this.data = json
            })})    
        },
        eliminateGroup(id){
            fetch(`http://192.168.30.2:80/eliminateGroup?user=${this.user+id}&pass=${this.password}`).then()
        },

    },
    template:`
    <button type="button" @click="getData()"> refreshData</button><br><br>
      
    <table>
        <tr>
            <th>group_id</th>
            <th>group_name</th>
            <th>Eliminate</th>
        </tr> 
     
        <tr v-for="group in data">
            <td>{{group.idgroup}}</td>
            <td>{{group.name}}</td>
            <td><button type="button" @click="eliminateGroup(group.idgroup)"> Eliminate Group</button></td>
        </tr>
     
    </table>   
    `
})

app.component('GetEmails', {
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
            fetch(`http://192.168.30.2:80/getEmails?user=${this.user}&pass=${this.password}`).then(resolve)
            })
            p.then(response=>{
                response.json().then(json=> {
                console.log(json)
               this.data = json
            })})    
        },
        eliminateEmail(id){
            fetch(`http://192.168.30.2:80/eliminateEmail?user=${this.user+id}&pass=${this.password}`).then()
        },

    },
    template:`
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
    `
})

app.component('GetSubjects', {
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
            fetch(`http://192.168.30.2:80/getSubjects?user=${this.user}&pass=${this.password}`).then(resolve)
            })
            p.then(response=>{
                response.json().then(json=> {
                console.log(json)
                this.data = json
            })})    
        },
        eliminateSubject(id){
            fetch(`http://192.168.30.2:80/eliminateSubject?user=${this.user+id}&pass=${this.password}`).then()
        },
        addSubject(){
            fetch(`http://192.168.30.2:80/addSubject?user=${this.user}&pass=${this.password}&id=${this.curs+"-"+this.assignatura+"-"+this.vmTemplateID}`).then()
        },
        activateSubject(id){
            fetch(`http://192.168.30.2:80/activateSubject?user=${this.user}&pass=${this.password}&id=${id}`).then()
        }

    },
    template:`
    
    <fieldset style="display: inline-block;">
    <legend> Curs: </legend>
        <input type="text" v-model="curs" placeholder="2022-1" ><br>
    </fieldset>

    
    <fieldset style="display: inline-block;">
    <legend> Assignatura: </legend>
        <input type="text" v-model="assignatura" placeholder="FX" ><br>
    </fieldset>

    <fieldset style="display: inline-block;">
    <legend> VM_Template_ID: </legend>
        <input type="text" v-model="vmTemplateID" placeholder="200" ><br>
    </fieldset>
    <br><br>
    <button type="button" @click="getData()" style="display: inline-block;"> refreshData</button>
    <button type="button" @click="addSubject()" style="display: inline-block;"> Add assignatura</button><br><br>

    <table>
        <tr>
            <th>subject_id</th>
            <th>subject_name</th>
            <th>is_active</th>
            <th>Activate/Desactivate</th>
            <th>Eliminate</th>
        </tr> 
     
        <tr v-for="subject in data">
            <td>{{subject.idsubjects}}</td>
            <td>{{subject.subject_name}}</td>   
            <td>{{subject.active ? "True" : "False"}}</td>
            <td><button type="button" @click="activateSubject(subject.idsubjects)"> {{subject.active ? "Desactivate" : "Activate"}}</button></td>
            <td><button type="button" @click="eliminateSubject(subject.idsubjects)"> Eliminate Subject</button></td>
        </tr>
     
    </table>   
    `
})


app.component('GetInfoVM', {
    data: function(){
        return{
            data:"",
            hours:4,
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
            fetch(`http://192.168.30.2:80/getNode?user=${this.user}&pass=${this.password}`).then(resolve)
            })
            p.then(response=>{
                response.json().then(json=> {
                console.log(json)
               this.data = json
            })})    
        },
        activateVM(){
            if (hours>0 && hours<7){
            fetch(`http://192.168.30.2:80/activateMachine?user=${this.user}&pass=${this.password}&hours=${this.hours}`).then()}
        },
        stopVM(){
            fetch(`http://192.168.30.2:80/stopMachine?user=${this.user}&pass=${this.password}`).then()
        }
    },
    template:`
    <button type="button" @click="getData()"> refreshData</button><br><br>
      
    <table>
        <tr>
            <th>VM_ID</th>
            <th>Name</th>
            <th>Status</th>
            <th>Uptime</th>
            <th>Start VM</th>
            <th>Stop VM</th>
        </tr> 
     
        <tr class="userTable">
            <td>{{data.vmid}}</td>
            <td>{{data.name}}</td>
            <td>{{data.status}}</td>
            <td>{{data.uptime}}</td>
            <td style="display: flex; justify-content: center; align-items: center;">
                <fieldset style="width:10vw;">
                    <legend> Hours: </legend>
                    <input type="number" v-model="hours" min="1" max="6" style="width:10vw;">
                </fieldset>
                <button type="button" @click="activateVM()" style="width:11vw;"> Start</button>              
            </td>
            <td><button type="button" @click="stopVM()"> Stop</button></td>
        </tr>
     
    </table>   
    `
})

const vm = app.mount('#app');