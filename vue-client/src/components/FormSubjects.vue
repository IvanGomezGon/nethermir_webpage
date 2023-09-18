<template>
    <section class="pb-8">
        <div class="">
            <h2 class="mb-4 text-xl font-bold text-grey-700 dark:text-white">Afegir una nova assignatura</h2>

            <div class="grid gap-4 sm:grid-cols-5 sm:gap-6 absolute">
                <div class="w-full" >
                    <div for="curs" class="block mb-2 text-sm font-medium text-grey-700 dark:text-white">Curs</div>
                    <input type="text" name="curs" id="curs" v-model="curs"
                        class="outline-0 bg-gray-50 border border-gray-300 text-grey-700 text-sm rounded-lg  focus:border-primary-600 block w-full p-2.5 dark:bg-grey-400 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark: dark:focus:border-primary-500"
                        placeholder="2022-1" required="">
                </div>
                <div class="w-full">
                    <div for="assignatura"
                        class="block mb-2 text-sm font-medium text-grey-700 dark:text-white">Assignatura</div>
                    <input type="text" name="assignatura" id="assignatura" v-model="assignatura"
                        class="outline-0 bg-gray-50 border border-gray-300 text-grey-700 text-sm rounded-lg  focus:border-primary-600 block w-full p-2.5 dark:bg-grey-400 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark: dark:focus:border-primary-500"
                        placeholder="FX" required="">
                </div>
                <div class="w-full">
                    <div for="assignaturaID" class="block mb-2 text-sm font-medium text-grey-700 dark:text-white">Assignatura
                        ID</div>
                    <input type="number" name="assignaturaID" id="assignaturaID" v-model="vmTemplateID"
                        class="outline-0 bg-gray-50 border border-gray-300 text-grey-700 text-sm rounded-lg  focus:border-primary-600 block w-full p-2.5 dark:bg-grey-400 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark: dark:focus:border-primary-500"
                        min="01" placeholder="01" required="">
                </div>
                <div class="text-center">
                    <div for="addAsignatura" class="block mb-2 text-sm font-medium text-opacity-0">
                        <h1 class="text-opacity-0"> ㅤ </h1>
                    </div>
                    <button type="button" @click="addSubject()"
                        class="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-700 hover:active:bg-emerald-800 font-medium rounded-lg text-sm block px-5 p-2.5 text-white">
                        Afegir assignatura
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
            fetch(`${process.env.VUE_APP_FETCH_URL}subject`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({subjectName: this.assignatura + "-" + this.curs, subjectID: this.vmTemplateID}),
                credentials: process.env.VUE_APP_FETCH_CREDENTIALS,
            }).then();
        },
    },
};
</script>