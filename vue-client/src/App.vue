<template>
  <router-view/>
</template>

<style>
.logo {
    height: 100px;
  }
    body {
    font-family: 'Source Sans Pro', 'Lucida Grande', sans-serif;
    margin: 0px;
    background-image:url(assets/columnes.svg);
    background-size:cover;
    }   
    table{
  border-spacing:0px;
  border: 5px solid rgb(32, 102, 0);
  margin: auto;
}

th, td {
  border-bottom: 1px solid #ddd;
  padding-right:10px;
  padding-left:10px;
}
th {
  background-color: rgb(32, 102, 0);
  height: 30px;
  color: white;
}
tr:hover {background-color: rgb(147, 196, 147);}
tr.userTable:hover {background-color:white;}
.flex-container{
    display: -webkit-box;  /* OLD - iOS 6-, Safari 3.1-6, BB7 */
    display: -ms-flexbox;  /* TWEENER - IE 10 */
    display: -webkit-flex; /* NEW - Safari 6.1+. iOS 7.1+, BB10 */
    display: flex;         /* NEW, Spec - Firefox, Chrome, Opera */  
    justify-content: center;
    align-items: center; 
    text-align: center; 
    height: 100vh;
  }
.header {
    background-color: white;
    top: 0;
    width: 100%;
    position: absolute;
    display: flex;
    padding-bottom: 5px;
    border-bottom: 5px solid rgb(32, 102, 0);
    align-items: center;
}
.header_element {
    margin-left: 10px;
    margin-right: 10px;
    font-weight: bold;
    text-decoration:none;
    color: black;
}

a.header_element:hover{
    border-bottom: 2px solid rgb(32, 102, 0);
}
.push {
    margin-left: auto;
}
  .inner-element{
    border: 5px solid rgb(32, 102, 0);
    border-radius: 15px;
    width: 500px;
    margin:20px;
    background-color: white;

    
  }
  button{
    transition-duration: 0.3s;
    background-color: rgb(32, 102, 0);
    width: 22vw;
    height: 50px;
    border: 3px solid rgb(32, 102, 0); 
    border-radius: 15px ;
    font-size: 15px;
    color: white;
  }
  button:hover{
    background-color: rgb(255, 255, 255);
    color: rgb(32, 102, 0);
  }
  button:disabled{
    background-color: rgb(181, 181, 181);
  }
  button:disabled:hover{
    background-color: rgb(181, 181, 181);
    color: white;
  }
  input, select{
    width: 100%;
    padding-top: 5px;
    border-width: 0px;
    outline: none;
    font-size: 15px;
  }
  select { height:100%}
  fieldset {
    text-align: left;
    margin: auto;
    height: 50px;
    width: 400px;
    border-radius: 3px;
    font-size: 15px;
  }
  fieldset:focus-within{
    border-color: green;
  }
  

  #assignatura,  #curs {
    width: 175px;
    margin-right: 10px;
    margin-left: 10px;
    display:inline;
  }
  .rootControl {
    width:80vw; 
    margin-top:150px;
    padding:30px;
  }
  .logout{
    background-color: red; 
    color: white; 
    width:90px; 
    font-weight: bold;
    margin-right: 10px;
    border-color: rgba(255, 0, 0, 0.822);
    border-width: 3px; 
}
.logout:hover{
    background-color: white;
    color: red;
}

</style>
