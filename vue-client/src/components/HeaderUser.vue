
<template>
    <div class="header">
        <img src="../assets/logo_uab.png" class="logo" @click="this.$router.push('/')">
        <h3 class="header_element">TECTONIC CONTROL PANNEL - USER</h3>

    </div>
  </template>
  
  <script>
  export default {
    name: 'HeaderRoot',
    props:['modelValue'],
    methods:{

    },
  
  }
  </script>

  <style scoped>
  </style>







