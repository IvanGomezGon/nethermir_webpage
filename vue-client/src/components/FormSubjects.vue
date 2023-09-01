<template>
    <section class="">
        <div class="pb-8  ">
            <h2 class="mb-4 text-xl font-bold text-grey dark:text-white">Afegir una nova assignatura</h2>

            <div class="grid gap-4 sm:grid-cols-5 sm:gap-6">
                <div class="w-full">
                    <div for="curs" class="block mb-2 text-sm font-medium text-grey dark:text-white">Curs</div>
                    <input type="text" name="curs" id="curs" v-model="curs"
                        class="outline-0 bg-gray-50 border border-gray-300 text-grey text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-lighter_grey dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="2022-1" required="">
                </div>
                <div class="w-full">
                    <div for="assignatura"
                        class="block mb-2 text-sm font-medium text-grey dark:text-white">Assignatura</div>
                    <input type="text" name="assignatura" id="assignatura" v-model="assignatura"
                        class="outline-0 bg-gray-50 border border-gray-300 text-grey text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-lighter_grey dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="FX" required="">
                </div>
                <div class="w-full">
                    <div for="assignaturaID" class="block mb-2 text-sm font-medium text-grey dark:text-white">Assignatura
                        ID</div>
                    <input type="number" name="assignaturaID" id="assignaturaID" v-model="vmTemplateID"
                        class="outline-0 bg-gray-50 border border-gray-300 text-grey text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-lighter_grey dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        min="01" placeholder="01" required="">
                </div>
                <div class="text-center">
                    <div for="addAsignatura" class="block mb-2 text-sm font-medium text-opacity-0">
                        <h1 class="text-opacity-0">.</h1>
                    </div>
                    <button type="button" @click="addSubject()"
                        class="bg-emerald-600 hover:bg-emerald-700 border border-emerald-600 font-medium focus:ring-2 rounded-lg text-sm focus:ring-emerald-500 focus:border-emerald-600 block w-full p-2.5 dark:bg-emerald-600 dark:border-emerald-600 dark:placeholder-gray-400 text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500">
                        Afegir assignatura
                    </button>
                </div>
                <div class="text-center">
                    <div for="addAsignatura" class="block mb-2 text-sm font-medium text-opacity-0">
                        <h1 class="text-opacity-0">.</h1>
                    </div>
                    <button type="button" @click="addSubject()"
                        class="bg-red-600 hover:bg-red-700 border border-red-600 font-medium rounded-lg text-sm focus:ring-2 focus:ring-red-300 block w-full p-2.5 dark:bg-red-600 dark:border-red-800 dark:placeholder-gray-400 text-white dark:hover:bg-red-700 dark:focus:ring-red-900">
                        Eliminar taula
                    </button>
                </div>
            </div>

        </div>
    </section>
</template>

<script>
export default {
    name: "FormSubject",
    data: function () {
        return {
            curs: "",
            assignatura: "",
            vmTemplateID: "",
        };
    },
    methods: {
        addSubject() {
            fetch(`${process.env.VUE_APP_FETCH_URL}addSubject?id=${this.assignatura + "-" + this.curs + "-" + this.vmTemplateID}`, {
                credentials: process.env.VUE_APP_FETCH_CREDENTIALS
            }).then();
        },
    },
};
</script>