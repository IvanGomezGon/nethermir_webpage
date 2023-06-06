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
            <a href="#" class="push header_element" @click="proxmoxInfo=!proxmoxInfo; groupsInfo=false; emailInfo=false;">PROXMOX INFO</a>
            <a href="#" class="header_element" @click="groupsInfo=!groupsInfo; proxmoxInfo=false; emailInfo=false;">USERS INFO</a>
            <a href="#" class="header_element" @click="emailInfo=!emailInfo; proxmoxInfo=false; groupsInfo=false;">EMAILS INFO</a>
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
            })})     
            
     
        }
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
            <input type="text" v-model="password" placeholder="**********">
        </fieldset><br><br>   
        <button type="button" @click="checkLogin()">Login</button>
        `
})

app.component('Register',{
    data: function() {
        return{
            assignatura:"",
            curs:"",
            emails:[],
            errors:[],
            feedback:"",
            registered:false,
            numIntegrants:0,
        }
    },
    methods:{
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
                    <option value="2022-1">2022-1</option>
                    <option value="2022-2">2022-2</option>
                </select> <br>
            </fieldset>    
        
            <fieldset id="assignatura">
            <legend> Assignatura: </legend>
                <select v-model="assignatura">
                    <option value="XX">XX</option>
                    <option value="XT">XT</option>
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
        activateVM(id){
            fetch(`http://192.168.30.2:80/activateMachine?user=${this.user+id}&pass=${this.password}&hours=4`).then()
        },
        stopVM(id){
            fetch(`http://192.168.30.2:80/stopMachine?user=${this.user+id}&pass=${this.password}`).then()
        },
        resumeVM(id){
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
            <th>Status</th>
            <th>Uptime</th>
            <th>Start VM</th>
            <th>Stop VM</th>
            <th>Resume</th>
            <th>Suspend</th>
        </tr> 
     
        <tr v-for="vm in data">
            <td>{{vm.vmid}}</td>
            <td>{{vm.name}}</td>
            <td>{{vm.status}}</td>
            <td>{{vm.uptime}}</td>
            <td><button type="button" style="width:10vw" @click="activateVM(vm.vmid)" :disabled="vm.status=='running'"> Start</button></td>
            <td><button type="button" style="width:10vw" @click="stopVM(vm.vmid)" :disabled="vm.status=='stopped'"> Stop</button></td>
            <td><button type="button" style="width:10vw" @click="resumeVM(vm.vmid)" :disabled="vm.status=='stopped'"> Resume</button></td>
            <td><button type="button" style="width:10vw" @click="suspendVM(vm.vmid)" :disabled="vm.status=='stopped'"> Suspend</button></td>
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

app.component('GetInfoVM', {
    data: function(){
        return{
            data:"",
            hours:4,
        }
    },
    props : ['user','password'],
    mounted: function () {
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