<template>
    <nav class="bg-emerald-700">
        <div class="mx-auto w-full xl:w-3/4">
            <div class="flex h-16 items-center justify-between">
                <div class="flex items-center ml-8 xl:ml-0">
                    <div class="flex-shrink-0">
                        <img class="h-8 invert" src="../assets/logo_uab_small.svg" alt="UAB Logo" @click="logOut()">
                    </div>

                    <div class="hidden md:block">
                        <div class="ml-10 flex items-baseline xl:space-x-4 lg:space-x-2  space-x-0">
                            <div v-for="(path, index) in paths">
                                <a href="#" @click="this.$router.push(`/controlPannelRoot/${path}`); current = index"
                                    :class="current == index ? 'bg-grey-700 text-white rounded-md px-3 py-2 text-sm font-medium' : 'text-gray-200 hover:bg-gray-700 active:bg-gray-700 active:hover:bg-gray-800 hover:text-white active:text-white rounded-md px-3 py-2 text-sm font-medium'">{{
                                        path
                                    }}</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="hidden md:block mr-20 xl:mr-0">
                    <div class="ml-4 flex items-center">
                        <!-- Profile dropdown -->
                        <div class="relative  ">
                            <div>
                                <button type="button" @click="logOut()"
                                    class=" float-right text-white bg-red-600 hover:bg-red-700 active:bg-red-700 hover:active:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 ">
                                    <div class="flex space-x-2 items-center justify-between">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="hidden md:block" width="16"
                                            height="16" viewBox="0 0 24 24" stroke-width="3" stroke="#ffffff" fill="none"
                                            stroke-linecap="round" stroke-linejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <path
                                                d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                                            <path d="M9 12h12l-3 -3" />
                                            <path d="M18 15l3 -3" />
                                        </svg>
                                        <div class="lmd:block hidden">
                                            <p class=" lg:hidden block"> Sortir</p>
                                        </div>
                                        <p class=" lg:block hidden"> Tancar sessió</p>
                                    </div>
                                </button>
                                <button type="button" @click="$emit('deleteDB')"
                                    class="text-white bg-red-600 hover:bg-red-700 active:bg-red-700 hover:active:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 ">
                                    <div class="flex space-x-2 items-center justify-between">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="hidden md:block" width="16"
                                            height="16" viewBox="0 0 24 24" stroke-width="3" stroke="#ffffff" fill="none"
                                            stroke-linecap="round" stroke-linejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <path
                                                d="M4 6c0 1.657 3.582 3 8 3s8 -1.343 8 -3s-3.582 -3 -8 -3s-8 1.343 -8 3" />
                                            <path d="M4 6v6c0 1.657 3.582 3 8 3c.537 0 1.062 -.02 1.57 -.058" />
                                            <path d="M20 13.5v-7.5" />
                                            <path d="M4 12v6c0 1.657 3.582 3 8 3c.384 0 .762 -.01 1.132 -.03" />
                                            <path d="M22 22l-5 -5" />
                                            <path d="M17 22l5 -5" />
                                        </svg>
                                        <div class="mmd:block hidden">
                                            <p class=" lg:hidden block"> Eliminar DB</p>
                                        </div>
                                        <p class=" lg:block hidden "> Eliminar base de dades</p>

                                    </div>
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
                <div class="mr-[72px] flex md:hidden" @click="toggleMobile()">
                    <!-- Mobile menu button -->
                    <button type="button"
                        class="text-white hover:bg-gray-600 active:bg-gray-600 active:hover:bg-gray-700 rounded-lg text-sm p-2.5 w-10 h-10 inline-flex items-center justify-center">
                        <span class="sr-only">Open main menu</span>
                        <!-- Menu open: "hidden", Menu closed: "block" -->
                        <svg class="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                            aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                        <!-- Menu open: "block", Menu closed: "hidden" -->
                        <svg class="hidden h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                            aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <!-- Mobile menu, show/hide based on menu state. -->
        <div :class="'md:hidden transition-max-height duration-500 ease-in-out ' + (mobileDropdown ? 'h-[320px]' : 'h-2 overflow-hidden ')"
            id="mobile-menu">
            <div class="space-y-1 px-8 pb-3 pt-2 sm:px-3">
                <div v-for="(path, index) in paths" v-if="mobileDrowdownFinished" class="overflow-hidden">
                    <a href="#" @click="this.$router.push(`/controlPannelRoot/${path}`); current = index"
                        :class="(current == index ? 'bg-grey-700 ' : '') + 'text-gray-200 hover:bg-gray-700 active:bg-gray-700 active:hover:bg-gray-800 hover:text-white active:text-white block rounded-md px-3 py-2 text-base font-medium'">{{
                            path }}</a>
                </div>
                <a href="#"
                    class="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-grey-400 hover:text-white">Eliminar
                    base de dades</a>
                <a href="#"
                    class="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-grey-400 hover:text-white">Tancar
                    sessió</a>

            </div>
        </div>
    </nav>
</template>

<script>
import { useRoute } from 'vue-router';

export default {
    name: "HeaderRoot",
    data: function () {
        return {
            current: -1,
            mobileDropdown: 0,
            mobileDrowdownFinished: 0,
            route: '',
            paths: ['Dashboard', 'Proxmox', 'Grups', 'Usuaris', 'Assignatures'],
        }
    },
    created: function () {
        this.route = useRoute()
        if (this.route.path == `/controlPannelRoot`) {
            this.current = 0
        }
        this.paths.forEach((path, i) => {
            if (this.route.path == `/controlPannelRoot/${path}`) {
                this.current = i
            }
        })

    },
    methods: {
        logOut() {
            fetch(`${process.env.VUE_APP_FETCH_URL}eliminateCookie`, {
                credentials: process.env.VUE_APP_FETCH_CREDENTIALS,
            }).then();
            this.$router.push("/");
        },
        toggleMobile() {
            this.mobileDropdown = !this.mobileDropdown; 
            setTimeout(() => {console.log("hi"); this.mobileDrowdownFinished = !this.mobileDrowdownFinished}, 50)
        }
    },
};
</script>

<style></style>
