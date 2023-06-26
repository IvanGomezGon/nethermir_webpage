<template>
  <div class="flex-container">
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
    }
    },
    components: {
        GetInfoVM,
        HeaderUser,
    }
  }
  
  </script>