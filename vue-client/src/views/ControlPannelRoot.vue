<template>
    <div v-if="render">
        <div class="flex-container">
            <div class="header">
                <HeaderRoot  v-model="active"/>
            </div>
        
        <div class="inner-element rootControl" v-if="proxmoxInfo">
            <GetProxmoxVMs />         
        </div>

        <div class="inner-element rootControl" v-if="groupsInfo" style="height:auto;">
            <GetGroups />
        </div>
        
        <div class="inner-element rootControl" v-if="emailsInfo" style="height:auto;">
            <GetEmails />
        </div>
        <div class="inner-element rootControl" v-if="subjectsInfo" style="height:auto;">
            <GetSubjects />
        </div>
    </div>
    </div>
  </template>
  
  <script>

  // @ is an alias to /src
  import HeaderRoot from '@/components/HeaderRoot.vue'
  import GetProxmoxVMs from '@/components/GetProxmoxVMs.vue'
  import GetGroups from '@/components/GetGroups.vue'
  import GetEmails from '@/components/GetEmails.vue'
  import GetSubjects from '@/components/GetSubjects.vue'

  export default {
    name: 'ControlPannelRoot',
    data: ()=>{
    return {
        active:['',''],
        proxmoxInfo:false,
        groupsInfo: false,
        emailsInfo: false,
        subjectsInfo: false,
        areYouSure: false,
        render: false,
    }
    },
    // TODO: Change this for Router Navigation guards 
    // https://stackoverflow.com/questions/69148784/stop-vue-page-from-loading-till-data-fetch-is-loaded
    beforeCreate: function () {
            fetch(`${process.env.VUE_APP_URL_FETCH}checkCookie`, {credentials: "include"}).then(response=>{
                response.text().then(text=> {
                    if (text != 'root'){this.$router.push('/')}
                    else {this.render = true}
            })})
    },
    watch: {
        active: {
            handler(newValue, oldValue) {
                console.log("Gonna change")
                this.proxmoxInfo = false;
                this.groupsInfo = false;
                this.emailsInfo = false;
                this.subjectsInfo = false;
                this.areYouSure = false;
                if (this.active['0']  == 'ProxmoxInfo' || this.active['1'] == 'ProxmoxInfo'){console.log("proxmox"); this.proxmoxInfo=true}
                if (this.active['0'] == 'groupsInfo' || this.active['1'] == 'groupsInfo' ){console.log("groupsInfo");this.groupsInfo=true}
                if (this.active['0'] == 'emailsInfo' || this.active['1'] == 'emailsInfo'){console.log("emailsInfo");this.emailsInfo=true}
                if (this.active['0'] == 'subjectsInfo' || this.active['1'] == 'subjectsInfo'){console.log("subjectsInfo");this.subjectsInfo=true}
                if (this.active['0'] == 'areYouSure' || this.active['1'] == 'areYouSure'){console.log("areYouSure");this.areYouSure=true}
                console.log("Changed")
            },
            deep: true
        }
    },
    components: {
        HeaderRoot,
        GetProxmoxVMs,
        GetGroups,
        GetEmails,
        GetSubjects,
    }
  }
  
  </script>