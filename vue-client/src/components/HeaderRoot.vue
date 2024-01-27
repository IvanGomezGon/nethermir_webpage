<template>
    <nav class="bg-emerald-700">
        
        <div class="mx-auto w-full ">
            <div class="flex h-16 items-center justify-between">
                <div class="">
                    <div class="mr-[20px] flex " @click="toggleMobile()">
                    <!-- Mobile menu button -->
                    <button type="button"
                        class="absolute left-[20px] top-3 hover:bg-gray-200 active:hover:bg-gray-300 active:bg-gray-200 dark:hover:bg-grey-500 dark:active:bg-grey-500 dark:active:hover:bg-grey-600 p-[7px] bg-gray-50 border border-bg-gray-50 text-grey-700 text-sm rounded-lg dark:bg-grey-400 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
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
                    <div class="flex-shrink-0  ml-[70px]">
                        <img class="h-[23px] " src="../assets/logo_uab_small.png" alt="UAB Logo" @click="logOut()">
                    </div>
                </div>
                <div class="hidden md:block mr-[120px] ">
                    <div class="ml-2 flex items-center">
                        <!-- Profile dropdown -->
                        <div class="relative">
                            <div>
                                <button type="button" @click="logOut()"
                                    class=" float-right text-white bg-red-600 hover:bg-red-700 active:bg-red-700 hover:active:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 ">
                                    <div class="flex space-x-2 items-center justify-between ">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="hidden md:block" width="16"
                                            height="16" viewBox="0 0 24 24" stroke-width="3" stroke="#ffffff" fill="none"
                                            stroke-linecap="round" stroke-linejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <path
                                                d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                                            <path d="M9 12h12l-3 -3" />
                                            <path d="M18 15l3 -3" />
                                        </svg>
                                        <p>{{ $t("signOut") }}</p>
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
                                        <p> {{ $t("deleteDatabase") }}</p>
                                    </div>
                                </button>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>

        <!-- Mobile menu, show/hide based on menu state. -->
        <div :class="'md:hidden transition-max-height duration-500 ease-in-out ' + (mobileDropdown ? 'h-[320px]' : 'h-0 overflow-hidden ')"
            id="mobile-menu">
            <div class="space-y-1 pb-3 pt-2 px-3">
                <div v-for="(pathName, index) in pathNames" v-if="mobileDrowdownFinished" class="overflow-hidden" @click="toggleMobile()">
                    <a href="#" @click="this.$router.push(`/controlPannelRoot/${paths[index]}`); current = index"
                        :class="(current == index ? 'bg-grey-600 ' : '') + 'text-gray-200 hover:bg-grey-300 active:bg-grey-300 active:hover:bg-grey-400 hover:text-white active:text-white block rounded-md px-3 py-2 text-base font-medium'">{{
                            pathName }}</a>
                </div>
                <div class="px-3 h-[1px] border-t border-bg-gray-50" v-if="mobileDrowdownFinished"></div>
                <a href="#" @click="$emit('deleteDB')" v-if="mobileDrowdownFinished"
                    class="block rounded-md px-3 py-2 text-base font-medium text-gray-200 hover:bg-grey-300 active:bg-grey-300 active:hover:bg-grey-400 hover:text-white">
                    {{ $t("deleteDatabase") }}
                </a>
                <a href="#" v-if="mobileDrowdownFinished" @click="logOut()"
                    class="block rounded-md px-3 py-2 text-base font-medium text-gray-200 hover:bg-grey-300 active:bg-grey-300 active:hover:bg-grey-400 hover:text-white">
                    {{ $t("signOut") }}
                </a>

            </div>
        </div>
    </nav>
    <div :class="'shadow-xl shadow-gray-700 hidden md:block bg-emerald-700 z-50 h-[calc(100vh-4rem)] absolute transition-max-width duration-500 ease-in-out border-t-2 dark:border-t-grey-700 border-t-slate-200 border-radius-10 rounded-r-2xl ' + (mobileDropdown ? 'w-[320px]' : 'w-0 overflow-hidden ')"
            id="mobile-menu">
            <div class="space-y-1 pl-5 pr-3 pb-3 pt-2 sm:px-3">
                <div v-for="(pathName, index) in pathNames" v-if="mobileDrowdownFinished" class="overflow-hidden" @click="toggleMobile()">
                    <a href="#" @click="this.$router.push(`/controlPannelRoot/${paths[index]}`); current = index"
                        :class="(current == index ? 'dark:bg-grey-600 bg-grey-500 ' : 'hover:bg-grey-300 active:bg-grey-300 active:hover:bg-grey-400 hover:text-white ') + 'w-[295px] text-clip text-gray-200 active:text-white block rounded-md px-3 py-2 text-base font-medium'">{{
                            pathName }}</a>
                </div>
            </div>
        </div>
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
            paths: ["proxmox", "groups", "users", "courses"],
            pathNames: [this.$t("proxmox"), this.$t("groups"), this.$t("users"), this.$t("courses")],
        }
    },
    watch:{
        '$i18n.locale'(newVal){
            this.pathNames = [this.$t("proxmox"), this.$t("groups"), this.$t("users"), this.$t("courses")];
        },
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
            fetch(`${process.env.VUE_APP_FETCH_URL}cookie`, {
                method: 'DELETE',
                credentials: process.env.VUE_APP_FETCH_CREDENTIALS,
            }).then();
            this.$router.push("/");
        },
        toggleMobile() {
            this.mobileDropdown = !this.mobileDropdown; 
            setTimeout(() => {this.mobileDrowdownFinished = !this.mobileDrowdownFinished}, 50)
        }
    },
};
</script>

<style></style>
