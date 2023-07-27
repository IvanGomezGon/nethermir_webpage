<template>
    <div >
    <br><br><br>
      <h1 style="text-align: center;"> ARE YOU SURE YOU WANT TO RESTART THE DATABASE? THIS WILL ELIMINATE EVERYTHING</h1>
      <button type="button" @click="restartDatabase()" style="width:13vw;"> YES, I UNDERSTAND, RESTART</button>
      <button type="button" @click="this.$router.push('/ControlPannelRoot')" style="width:13vw;"> NO, TAKE ME BACK</button>
    <br><br><br>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Restart Database',
    methods:{
        restartDatabase(){
            fetch(`${process.env.VUE_APP_URL_FETCH}restartDatabase`, {credentials: "include"}).then()
            this.$router.push('/ControlPannelRoot')
        }
    },
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
  </style>
  
