<template>
    <nav class="bg-emerald-700">
        <div class="mx-auto w-full ">
            <div class="flex h-16 items-center justify-between">
                <div class="flex items-center ml-8 xl:ml-0">
                    <div class="flex-shrink-0">
                        <img class="h-[23px]" src="../assets/logo_uab_small.png" alt="UAB Logo" @click="logOut()">
                    </div>
                </div>
                <div class="mr-[120px]">
                    <div class="ml-4 flex items-center">
                        <!-- Profile dropdown -->
                        <div class="relative  ">
                            <div>
                                <button type="button" @click="logOut()"
                                    class=" float-right text-white bg-red-600 hover:bg-red-700 active:bg-red-700 hover:active:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 ">
                                    <div class="flex space-x-2 items-center justify-between">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16"
                                            height="16" viewBox="0 0 24 24" stroke-width="3" stroke="#ffffff" fill="none"
                                            stroke-linecap="round" stroke-linejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <path
                                                d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                                            <path d="M9 12h12l-3 -3" />
                                            <path d="M18 15l3 -3" />
                                        </svg>
                                        <p> Tancar sessió</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>

        
    </nav>
</template>
<script>
export default {
    name: "HeaderUser",
    data: function () {
        return {
        }
    },
    methods: {
        logOut() {
            fetch(`${process.env.VUE_APP_FETCH_URL}cookie`, {
                method: 'DELETE',
                credentials: process.env.VUE_APP_FETCH_CREDENTIALS,
            }).then();
            this.$router.push("/");
        },
    },
};
</script>

<style></style>
