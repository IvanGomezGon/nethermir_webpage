<template>
    <section class="bg-[url('./columnes.svg')] bg-cover h-screen">
        <div class="absolute top-6 left-6">
            <img class="h-10 mr-2" src="../assets/logo_uab.png" alt="logo">
        </div>
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 ">
            <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Inici de sessió
                    </h1>
                    <form class="space-y-4 md:space-y-6" action="#">
                        <div>
                            <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Usuari</label>


                                <input type="text" id="website-admin" v-model="usuari"
                                    class="rounded-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="FX-2022-1-100" required="">

                        </div>
                        <div>
                            <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contrasenya</label>
                            <div class="flex">
                                <input :type="passwordType ? 'password' : 'text'" name="password" id="password" v-model="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="">
                  

                            </div>


                        </div>
                        <div class="flex items-center justify-between">
                            <div class="flex items-start">
                                <div class="flex items-center h-5">
                                    <input id="remember" aria-describedby="remember" type="checkbox"
                                        @click="passwordType = (passwordType + 1) % 2"
                                        class="w-4 h-4 border border-gray-300 rounded bg-gray-50">
                                </div>
                                <div class="ml-3 text-sm">
                                    <label for="remember" class="text-gray-500">Mostrar contrasenya</label>
                                </div>
                            </div>
                        </div>
                        <button type="button" @click="checkLogin()"
                            class="w-full text-white bg-primary-600 hover:bg-primary-700  font-medium rounded-lg text-sm px-5 py-2.5 text-center ">Iniciar
                            sessió</button>
                        <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                            No tens un compte encara?
                            <router-link to="/register"
                                class="font-medium text-primary-600 hover:underline dark:text-primary-500">Registrat!</router-link>

                        </p>
                    </form>
                </div>
            </div>
        </div>
    </section>
</template>

  
<script>
export default {
    name: 'Login',
    data: function () {
        return {

            feedback: "",
            usuari: "",
            password: "",
            errors: [],
            passwordType: 1,
        }
    },

    methods: {
        checkLogin() {
            this.feedback = ""
            this.errors = [];
            if (!this.usuari) {
                this.errors.push('Usuari obligatori');
            }
            if (!this.password) {
                this.errors.push('Contrasenya obligatoria');
            }
            if (!this.errors.length) {
                this.login()
            }
        },
        login() {
            this.feedback = "Processant inici de sessió..."

            fetch(`${process.env.VUE_APP_FETCH_URL}login?user=${this.usuari}&pass=${this.password}`, {
                credentials: process.env.VUE_APP_FETCH_CREDENTIALS
            }).then(x => {
                x.text().then(y => {
                    if (y == "root") {
                        this.$router.push('/controlPannelRoot')
                    } else if (y == 'user') {
                        this.$router.push('/controlPannelUser')
                    } else {
                        this.feedback = ""
                        this.errors.push(y)
                    }
                })
            })
        }
    }
}
</script>

  <!-- Add "scoped" attribute to limit CSS to this component only -->
  
<style scoped></style>
