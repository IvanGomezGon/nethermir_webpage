<template>
    <div class="flex-container">
        <div class="inner-element" style="width:50vw; height: 30vh;">
            <RestartDatabase/>
        </div>
    </div>
  </template>
  
  <script>
  // @ is an alias to /src
  import RestartDatabase from '@/components/RestartDatabase.vue'
  
  export default {
    name: 'RestartDatabaseRoot',
    components: {
        RestartDatabase
    }
  }
  </script>