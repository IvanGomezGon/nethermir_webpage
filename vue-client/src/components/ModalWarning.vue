


<template>
    <div id="popup-modal" tabindex="-1"
        class="absolute left-[50vw] top-[50vh] transform -translate-x-1/2 -translate-y-1/2 z-50 p-4 overflow-x-hidden overflow-y-auto max-h-full">
        <div class="relative w-full max-w-md max-h-full">
            <div class="relative bg-white rounded-lg shadow dark:bg-grey-400">
                <button type="button" @click="$emit('goBack')"
                    class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-grey-700 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-grey-500 dark:hover:text-white"
                    data-modal-hide="popup-modal">
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" 
                        viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                    <span class="sr-only">Close modal</span>
                </button>
                <div class="p-6 text-center">
                    <svg class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                        {{ $t("modalWarning") }}<br/>
                        {{ $t("modalWarning2") }}
                        <b>{{ $t("cant") }}</b>
                        {{ $t("modalWarning3") }}
                        <b>{{ $t("permanent") }}</b> 
                        {{ $t("modalWarning4") }}
                    </h3>
                    <button data-modal-hide="popup-modal" type="button" @click="restartDatabase(); $emit('resetDB')"
                        class="text-white bg-red-600 hover:bg-red-800  focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                        {{ $t("yesEliminate") }}
                    </button>
                    <button data-modal-hide="popup-modal" type="button" @click="$emit('goBack')"
                        class="text-gray-500 bg-white hover:bg-gray-100  focus:outline-none rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-grey-700 focus:z-10 dark:bg-grey-400 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-grey-500 dark:focus:ring-gray-600">
                        {{ $t("cancel") }}
                    </button>
                </div>
            </div>
        </div>
</div></template>
    
<script>
export default {
    name: "ModalWarning",
    methods:{
        restartDatabase() {
            fetch(`${process.env.VUE_APP_FETCH_URL}restartDatabase`, {
                method: 'DELETE',
                credentials: process.env.VUE_APP_FETCH_CREDENTIALS,
            }).then();
            this.$router.push("/ControlPannelRoot");
        },
    },
};
</script>
    
    