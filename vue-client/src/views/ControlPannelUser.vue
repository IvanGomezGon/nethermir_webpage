<template>
  <div class="flex-container" v-if="render">
    <div class="header">
        <HeaderUser/>
    </div>
    <div class="inner-element rootControl">
      <GetInfoVM></GetInfoVM>
    </div>
  </div>
  </template>
  
  <script>

  // @ is an alias to /src
  import GetInfoVM from '@/components/GetInfoVM.vue'
  import HeaderUser from '@/components/HeaderUser.vue'

  export default {
    name: 'controlPannelUser',
    data: ()=>{
    return {
      render: false,
    }
    },
    components: {
        GetInfoVM,
        HeaderUser,
    },
    // TODO: Change this for Router Navigation guards 
    // https://stackoverflow.com/questions/69148784/stop-vue-page-from-loading-till-data-fetch-is-loaded
    beforeCreate: function () {
            fetch(`http://192.168.30.2:80/backend/checkCookie`, {credentials: "include"}).then(response=>{
                response.text().then(text=> {
                    console.log("TEXT: ", text)
                    if (text == 'root' || text == 'failed-login'){this.$router.push('/')}
                    else {this.render = true}
            })})
    },
  }
  
  </script>