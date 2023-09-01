<template>
    <!-- Comment
<div class="flex-container" v-if="register">
    <div class="inner-element" id="register" style="width:auto">
        <br>
        <img src="../assets/logo_uab.png" class="selector" style="height: 100px;">
        <h3>NETHERMIR Registre</h3>
        {{ feedback }}<br>
        <p v-if="errors.length" style="text-align:left; margin-left: 40px; color: #d93025">
            <b>Si us plau, corregeix els següents error(s):</b>
            <p v-for="error in errors">{{ error }}</p>
        </p>
        <div v-if="!registered">
            <div class="register_options">


                <fieldset id="assignatura">
                    <legend> Assignatura: </legend>
                    <select v-model="assignatura">
                        
                    </select> <br>
                </fieldset>
                <br>
                <fieldset id="num">
                    <legend> Número d'integrants: </legend>
                    <select v-model="numIntegrants" @change="this.errors=[];">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                    </select> <br>
                </fieldset>
            </div><br>
            <br>
            <button type="button" @click="checkRegister()" style="width: 426.5px;"> Crear grup</button><br><br>
        </div>
        <router-link to="/">Ja tens un compte? Inicia sessió!</router-link><br><br>
    </div>
</div>
-->
    <section class="bg-[url('./columnes.svg')]">
        <div class="absolute top-6 left-6">
            <img class="h-10 mr-2" src="../assets/logo_uab.png" alt="logo">
        </div>
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div class="w-full bg-white rounded-lg shadow  md:mt-0 sm:max-w-md xl:p-0 ">
                <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
                        Registre de grup
                    </h1>
                    <form>
                        <div class="grid gap-6 mb-4 md:grid-cols-2">

                            <div>
                                <label for="countries"
                                    class="block  text-sm font-medium text-gray-900 dark:text-white">Curs</label>
                                <select id="countries"
                                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <option v-for="year in years()" :value="year"> {{ year }}</option>
                                </select>
                            </div>
                            <div>
                                <label for="countries"
                                    class="block  text-sm font-medium text-gray-900 dark:text-white">Assignatura</label>
                                <select id="countries"
                                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <option v-for="subject in subjects()" :value="subject">{{ subject }}</option>
                                </select>
                            </div>

                        </div>

                        <div class="space-y-2 md:space-y-2">

                            <div>
                                <label for="countries" class="block  text-sm font-medium text-gray-900 dark:text-white">Num
                                    d'integrants</label>
                                <select id="countries" v-model="numIntegrants"
                                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                </select>
                            </div>

                            <label v-if="numIntegrants"
                                class="block  text-sm font-medium text-gray-900 dark:text-white">Adreces de correu</label>
                            <div v-for="index in parseInt(numIntegrants)" :key="index">
                                <input type="email" id="email"
                                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    :placeholder="'usuari' + index + '@uab.cat'" required>
                            </div>

                        </div>
                        <button type="submit"
                            class=" mt-4 w-full text-white bg-primary-600 hover:bg-primary-700  font-medium rounded-lg text-sm px-5 py-2.5 text-center ">
                            Registrar grup
                        </button>
                    </form>
                    <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                        Ja temps un compte?
                        <router-link to="/"
                            class="font-medium text-primary-600 hover:underline dark:text-primary-500">Inicia
                            sessió!</router-link>

                    </p>
                </div>
            </div>
        </div>
    </section>
</template>

  
<script>
export default {
    name: 'Register',
    data: function () {
        return {
            data: "",
            assignatura: "",
            curs: "",
            emails: [],
            errors: [],
            feedback: "",
            registered: false,
            numIntegrants: 0,
        }
    },
    mounted: function () {
        this.getData()
        this.interval = setInterval(() => {
            this.getData()
        }, 10000)
    },
    destroyed() {
        clearInterval(this.interval)
    },
    computed: {

    },
    methods: {
        subjects() {
            let retSubjects = []
            if (this.data) {
                for (var index in this.data) {
                    if (this.data[index]['active'] == 1 && !retSubjects.includes(this.data[index]['subject_name'].slice(0, -7))) {
                        if (this.curs == "") {
                            retSubjects.push(this.data[index]['subject_name'].slice(0, -7))
                        } else if (this.data[index]['subject_name'].slice(-6) == this.curs) {
                            retSubjects.push(this.data[index]['subject_name'].slice(0, -7))
                        }
                    }
                }
            }
            return retSubjects
        },
        years() {
            let retYears = []
            if (this.data) {
                for (var index in this.data) {
                    if (this.data[index]['active'] == 1 && !retYears.includes(this.data[index]['subject_name'].slice(-6))) {
                        if (this.assignatura == "") {
                            retYears.push(this.data[index]['subject_name'].slice(-6))
                        } else if (this.data[index]['subject_name'].slice(0, -7) == this.assignatura) {
                            retYears.push(this.data[index]['subject_name'].slice(-6))
                        }
                    }
                }
            }
            return retYears
        },

        getData() {
            let p = new Promise((resolve, reject) => {
                fetch(`${process.env.VUE_APP_FETCH_URL}getSubjects`).then(resolve)
            })
            p.then(response => {
                response.json().then(json => {
                    this.data = json
                })
            })
        },
        checkRegister() {
            this.errors = [];
            if (!this.assignatura) {
                this.errors.push("El camp 'Assignatura' és obligatori.");
            }
            if (!this.curs) {
                this.errors.push("El camp 'Curs' és obligatori.");
            }
            if (this.emails.length != this.numIntegrants) {
                this.errors.push("El camp 'Email' és obligatori.")
            }
            this.emails.forEach((value, index) => {
                if (!/.+@uab\.cat/.test(value)) {
                    this.errors.push(`L'email ${index + 1} ha de tenir el format:"usuari@uab.cat"`);
                }
            })
            if (!this.errors.length) {
                this.register()
            }
        },
        register() {
            this.feedback = "Processant registre..."
            let emailsString = this.emails.join('xv3dz1g')
            let p = new Promise((resolve, reject) => {
                fetch(`${process.env.VUE_APP_FETCH_URL}register?user=${this.assignatura + '-' + this.curs}&email=${emailsString}`).then(resolve)
            })
            p.then(x => {
                x.text().then(y => {
                    if (y == "Y") {
                        this.feedback = "Registre completat! S'ha enviat un email al teu correu amb les credencials per iniciar sessió"
                        this.registered = true
                    } else {
                        this.feedback = "Registre completat! S'ha enviat un email al teu correu amb les credencials per iniciar sessió"
                        this.errors.push(y)
                    }
                })
            })

        }
    },
}
</script>

  <!-- Add "scoped" attribute to limit CSS to this component only -->
  
<style scoped></style>
