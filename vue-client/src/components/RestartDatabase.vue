<template>
    <div >
    <br><br><br>
      <h1 style="text-align: center;"> ESTÀS SEGUR QUE VOLS REINICIAR LA BASE DE DADES? AQUESTA ACCIÓ HO ELIMINARÀ TOT</h1>
      <button type="button" @click="restartDatabase()" style="width:13vw;"> SI, ENTENC EL RISC, REINICIAR BASE DE DADES</button>
      <button type="button" @click="this.$router.push('/ControlPannelRoot')" style="width:13vw;"> NO, TORNAR ENRERE</button>
    <br><br><br>
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
  </style>
  
