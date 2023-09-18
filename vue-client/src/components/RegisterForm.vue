<template>
    <section class="bg-[url('./columnes.svg')] bg-cover h-screen">
        <div class="absolute top-6 left-6">
            <img class="h-10 mr-2" src="../assets/logo_uab.png" alt="logo">
        </div>
        <div class="absolute top-4 left-[270px]">
            <img class="h-14 mr-2" src="../assets/logo_enginyeria.png" alt="logo">
        </div>
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div
                class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-grey-600 -700 dark:border-grey-400">
                <div class="p-6 space-y-4  sm:p-8">
                    <h1 class="text-xl font-bold leading-tight tracking-tight text-grey-700 md:text-2xl dark:text-white">
                        Registre de grup
                    </h1>
                    <h2 v-if="errors.length" class="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Si us plau,
                        corregeix els següents errors:</h2>
                    <ul class="max-w-md space-y-1 text-gray-500 list-inside dark:text-gray-400">
                        <li v-for="error in errors" class="flex items-center">
                            <svg class="w-3.5 h-3.5 mr-2 text-red-500 dark:text-red-500 flex-shrink-0" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
                            </svg>
                            {{ error }}
                        </li>
                    </ul>
                    <h3 class="mb-5 text-lg font-normal text-gray-600 dark:text-gray-300">{{ feedback }}</h3>

                    <form v-if="feedback == ''">
                        <div class="grid gap-6 mb-4 md:grid-cols-2">

                            <div>
                                <div for="countries" class="block  text-sm font-medium text-grey-700 dark:text-white">Curs
                                </div>
                                <select id="countries" v-model="curs"
                                    class="bg-gray-50 border border-gray-300 text-grey-700 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 dark:bg-grey-400 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500">
                                    <option v-for="year in years()" :value="year"> {{ year }}</option>
                                </select>
                            </div>
                            <div>
                                <div for="countries" class="block  text-sm font-medium text-grey-700 dark:text-white">
                                    Assignatura</div>
                                <select id="countries" v-model="assignatura"
                                    class="bg-gray-50 border border-gray-300 text-grey-700 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 dark:bg-grey-400 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500">
                                    <option v-for="subject in subjects()" :value="subject">{{ subject }}</option>
                                </select>
                            </div>

                        </div>

                        <div class="space-y-2 md:space-y-2">

                            <div>
                                <div for="countries" class="block  text-sm font-medium text-grey-700 dark:text-white">Num
                                    d'integrants</div>
                                <select id="countries" v-model="numIntegrants"
                                    class="bg-gray-50 border border-gray-300 text-grey-700 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 dark:bg-grey-400 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                </select>
                            </div>

                            <div v-if="numIntegrants" class="block  text-sm font-medium text-grey-700 dark:text-white">
                                Adreces de correu</div>
                            <div v-for="index in parseInt(numIntegrants)" :key="index">
                                <input type="email" id="email" v-model="emails[index - 1]" @keyup.enter="checkRegister()"
                                    class="outline-0 bg-gray-50 border border-gray-300 text-grey-700 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 dark:bg-grey-400 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500"
                                    :placeholder="'usuari' + index + '@uab.cat'" required>
                            </div>

                        </div>
                        <button type="button" @click="checkRegister()"
                            class="mt-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-700 hover:active:bg-emerald-800 border border-emerald-800 font-medium rounded-lg text-sm block w-full p-2.5 text-white">
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
    beforeUnmount() {
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

        async getData() {
            let response = await fetch(`${process.env.VUE_APP_FETCH_URL}subjects`)
            response.json().then(json => {
                this.data = json
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
            if (this.numIntegrants == 0) {
                this.errors.push("El camp 'Num d'Integrants' és obligatori.");
            }
            if (this.emails.length != this.numIntegrants) {
                this.errors.push("El camp 'Adreces de correu' és obligatori.")
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
        async register() {
            console.log("Starting")
            this.feedback = "Processant registre..."
            let emailsString = this.emails.join(',')
            let response = await fetch(`${process.env.VUE_APP_FETCH_URL}register`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({user: this.assignatura + "-" + this.curs, emails: emailsString}),
                credentials: process.env.VUE_APP_FETCH_CREDENTIALS,
            })     
            response.text().then(text => {
                if (text == "success") {
                    console.log("yes")
                    this.feedback = "Registre completat! S'ha enviat un email al teu correu amb les credencials per iniciar sessió"
                    this.registered = true
                } else {
                    this.feedback = ""
                    this.errors.push(text)
                }
            })          
        }
    },
}
</script>

  <!-- Add "scoped" attribute to limit CSS to this component only -->
  
<style scoped></style>
