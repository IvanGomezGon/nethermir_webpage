<template>
    <section class="bg-[url('./columnes.svg')] bg-cover h-screen">
        <div class="absolute top-6 left-6">
            <img class="h-10 mr-2" src="../assets/logo_uab.png" alt="logo">
        </div>
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-light_grey dark:border-lighter_grey">
                <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 class="text-xl font-bold leading-tight tracking-tight text-grey md:text-2xl dark:text-white">
                        Registre de grup
                    </h1>
                    <form>
                        <div class="grid gap-6 mb-4 md:grid-cols-2">

                            <div>
                                <div for="countries"
                                    class="block  text-sm font-medium text-grey dark:text-white">Curs</div>
                                <select id="countries"
                                    class="bg-gray-50 border border-gray-300 text-grey text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 dark:bg-lighter_grey dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500">
                                    <option v-for="year in years()" :value="year"> {{ year }}</option>
                                </select>
                            </div>
                            <div>
                                <div for="countries"
                                    class="block  text-sm font-medium text-grey dark:text-white">Assignatura</div>
                                <select id="countries"
                                    class="bg-gray-50 border border-gray-300 text-grey text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 dark:bg-lighter_grey dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500">
                                    <option v-for="subject in subjects()" :value="subject">{{ subject }}</option>
                                </select>
                            </div>

                        </div>

                        <div class="space-y-2 md:space-y-2">

                            <div>
                                <div for="countries" class="block  text-sm font-medium text-grey dark:text-white">Num
                                    d'integrants</div>
                                <select id="countries" v-model="numIntegrants"
                                    class="bg-gray-50 border border-gray-300 text-grey text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 dark:bg-lighter_grey dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                </select>
                            </div>

                            <div v-if="numIntegrants"
                                class="block  text-sm font-medium text-grey dark:text-white">Adreces de correu</div>
                            <div v-for="index in parseInt(numIntegrants)" :key="index">
                                <input type="email" id="email" v-model="emails[index-1]"
                                    class="outline-0 bg-gray-50 border border-gray-300 text-grey text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 dark:bg-lighter_grey dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500"
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
