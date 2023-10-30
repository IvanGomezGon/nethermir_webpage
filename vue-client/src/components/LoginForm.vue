<template>
    <section class="bg-[url('./columnes.svg')] bg-cover h-screen">
        <div class="absolute top-6 left-6 hidden sm:block">
            <img class="h-10 mr-2" src="../assets/logo_uab.png" alt="logo">
        </div>
        <div class="flex-shrink-0 block sm:hidden absolute top-2 left-2">
            <img class="h-[71px]  mr-2 " src="../assets/logo_uab_small.png" alt="UAB Logo">
        </div>
        <div class="absolute top-4 left-[170px] sm:left-[270px]">
            <img class="h-14 mr-2" src="../assets/logo_enginyeria.png" alt="logo">
        </div>
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0 ">
            <div
                class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-grey-600 -700 dark:border-grey-400">
                <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 class="text-xl font-bold leading-tight tracking-tight text-grey-700 md:text-2xl dark:text-white">
                        {{ $t("login") }}
                    </h1>


                    <h2 v-if="errors.length" class="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                        {{ $t("correctErrorsPlease") }}
                    </h2>
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



                    <form class="space-y-4 md:space-y-6" action="#">
                        <div>
                            <div for="email" class="block mb-2 text-sm font-medium text-grey-700 dark:text-white">
                                {{ $t("user") }}
                            </div>


                            <input type="text" v-model="usuari" @keyup.enter="checkLogin()"
                                class="rounded-lg bg-gray-50 border border-gray-300 text-grey-700 focus:ring-emerald-500 focus:border-emerald-500 block flex-1 min-w-0 w-full text-sm p-2.5  dark:bg-grey-400 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white  dark:focus:ring-emerald-500 dark:focus:border-emerald-500 outline-0"
                                placeholder="FX-2022-1-100" required="">

                        </div>
                        <div>
                            <div for="password" class="block mb-2 text-sm font-medium text-grey-700 dark:text-white">
                                {{ $t("password") }}
                            </div>
                            <div class="flex">
                                <input :type="passwordType ? 'password' : 'text'" name="password" id="password" @keyup.enter="checkLogin()"
                                    v-model="password" placeholder="••••••••"
                                    class="bg-gray-50 border border-gray-300 text-grey-700 sm:text-sm rounded-lg  focus:border-primary-600 block w-full p-2.5 dark:bg-grey-400 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500 outline-0"
                                    required="">


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
                                    <div for="remember" class="text-gray-500 select-none" @click="passwordType = (passwordType + 1) % 2">{{ $t("showPassword") }}</div>
                                </div>
                            </div>
                        </div>
                        <button type="button" @click="checkLogin()"
                            class="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-700 hover:active:bg-emerald-800 border border-emerald-800 font-medium rounded-lg text-sm block w-full p-2.5 text-white">
                            {{ $t("makeLogin") }}
                        </button>
                        <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                            {{ $t("dontHaveAccountQuestion") }}
                            <router-link to="/register"
                                class="font-medium text-primary-600 hover:underline dark:text-primary-500">
                                {{ $t("signUpExclamation") }}
                            </router-link>

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
        async login() {
            this.feedback = "Processant inici de sessió..."
            let response = await fetch(`${process.env.VUE_APP_FETCH_URL}login?user=${this.usuari}&password=${this.password}`, {
                credentials: process.env.VUE_APP_FETCH_CREDENTIALS
            })
            if (response == null) {return}
            response.text().then(y => {
                if (y == "root") {
                    this.$router.push('/controlPannelRoot')
                } else if (y == 'user') {
                    this.$router.push('/controlPannelUser')
                } else {
                    this.feedback = ""
                    this.errors.push(`Contrasenya incorrecte. Pots trobar-la al teu compte d'email usuari@uab.cat`)
                }
            })
           
        }
    }

}
</script>

  <!-- Add "scoped" attribute to limit CSS to this component only -->
  
<style scoped></style>
