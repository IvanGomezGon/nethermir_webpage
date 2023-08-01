<template>
    <div class="flexbox">
    <br><br>
      <h1 style="text-align: center;"> Estàs segur que vols reiniciar la base de dades? Aquesta acció ho eliminarà tot</h1>
      <button type="button" @click="restartDatabase()" style="width:13vw;"> Si, entenc el risc, reiniciar base de dades</button>
      <button type="button" @click="this.$router.push('/ControlPannelRoot')" style="width:13vw;"> No, tornar enrere</button>
    <br><br>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Restart Database',
    methods:{
        restartDatabase(){
            fetch(`${process.env.VUE_APP_FETCH_URL}restartDatabase`, {credentials: process.env.VUE_APP_FETCH_CREDENTIALS}).then()
            this.$router.push('/ControlPannelRoot')
        }
    },
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
  .flexbox{
    display: flex;
    flex-wrap: wrap;
    justify-content: center;  
  }
  .spacedOut{
    margin: 5px;
  }


    

  </style>
  
