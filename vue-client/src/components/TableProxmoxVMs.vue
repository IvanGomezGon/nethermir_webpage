<template>
    <div class="border-gray-300 border-t-2 pt-8">
    </div>
    <div class="pb-8 ml-auto">
        <button type="button" @click="getData()" class="mr-4 bg-emerald-600 hover:bg-emerald-700 hover:active:bg-emerald-800 active:bg-emerald-700 text-white font-medium rounded-lg text-sm p-2.5">
            <div class="flex space-x-2 items-center justify-between">
                <svg class="w-[12px] h-[12px] text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 1v5h-5M2 19v-5h5m10-4a8 8 0 0 1-14.947 3.97M1 10a8 8 0 0 1 14.947-3.97"/>
                </svg>
                <p> Actualitzar taula</p>
            </div>
        </button>
    </div>
    <div class="flex items-center overflow-x-auto shadow-md rounded-lg">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-grey-400 uppercase bg-gray-100 dark:bg-grey-400 dark:text-gray-400">
                <tr>
                    <th scope="col" class="px-6 py-3">
                        Virtual Machine id
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Nom
                    </th>
                    <th scope="col" class="px-6 py-3">
                        CPU
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Estat
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Uptime
                    </th>
                    <th scope="col" class="px-6 py-3">
                        <span class="sr-only">Encendre / Parar</span>
                    </th>
                    <th scope="col" class="px-6 py-3">
                        <span class="sr-only">Resumir / Suspendre</span>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="vm in data" 
                    :class="getColor(vm.status, vm.cpu, vm.template) + ' bg-white border-b dark:bg-grey-600 dark:border-grey-400 hover:bg-gray-50 dark:hover:bg-grey-500'">
                    <th scope="row" :class="'px-6 py-4 font-medium whitespace-nowrap '">
                        {{ vm.vmid }}
                    </th>
                    <td :class="'px-6 py-4 font-medium whitespace-nowrap '">
                        {{ vm.name }}
                    </td>
                    <td :class="'px-6 py-4 font-medium whitespace-nowrap'">
                        {{ vm.template == 1 ? "-" : (vm.cpu * 100).toFixed(2) + "%" }}
                    </td>
                    <td :class="'px-6 py-4 font-medium whitespace-nowrap'">
                        {{ vm.template == 1 ? "Template" : vm.status == "stopped" ? "Stopped" : vm.cpu < 0.05
                            ? "Corrent (Pausat)" : "Corrent" }} </td>
                    <td :class="'px-6 py-4 font-medium whitespace-nowrap'">
                        {{ vm.template == 1 ? "-" : vm.uptime }}
                    </td>
                    <td class="px-6 py-4 text-right">
                        <a href="#" @click="stopActivate(vm.status, vm.vmid)"
                            :class="vm.template == 1 ? 'font-medium dark:text-emerald-800 pointer-events-none text-gray-400' :'font-medium text-emerald-600 dark:text-emerald-500 hover:underline'">{{ vm.status == "stopped" ?
                                "Encendre" : "Parar" }}</a>
                    </td>
                    <td class="px-6 py-4 text-right">
                        <a href="#" @click="resumeSuspend(vm.cpu, vm.vmid)" 
                            :class="vm.status == 'stopped' || vm.template == 1 ? 'font-medium dark:text-emerald-800 pointer-events-none	text-gray-400': 'font-medium text-emerald-600 dark:text-emerald-500 hover:underline'">{{ vm.cpu < 0.05
                                ? "Resumir" : "Pausar" }}</a>
                    </td>
                </tr>

            </tbody>
        </table>
    </div>
</template>
    <script>
        export default {
        name: "TableProxmoxVMs",
        props: {server: Number},
        data: function () {
            return {
                data: "",
            };
        },
        mounted: function () {
            this.getData();
        },

        methods: {
            async getData() {
                let response = await fetch(`${process.env.VUE_APP_FETCH_URL}statusAllVMs?server=${this.server}`, {
                    credentials: process.env.VUE_APP_FETCH_CREDENTIALS
                })
                response.json().then((json) => {
                    console.log(json);
                    this.data = json;
                });
            },
            getColor(status, cpu, template) {
                return template == 1 ? 'dark:text-gray-400 text-gray-500' : status == 'stopped' ? 'text-red-600' : cpu < 0.05 ? 'text-yellow-500' : 'text-green-600';
            },
            stopActivate(status, id) {
                if (status == "running") {
                    this.stopVM(id);
                } else {
                    this.activateVM(id);
                }
            },
            resumeSuspend(cpu, id) {
                if (cpu < 0.05) {
                    this.resumeVM(id);
                } else {
                    this.suspendVM(id);
                }
            },
            activateVM(id) {
                fetch(`${process.env.VUE_APP_FETCH_URL}activateMachine`, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({vmID: id, hours: 4}),
                    credentials: process.env.VUE_APP_FETCH_CREDENTIALS,
                }).then();
            },
            stopVM(id) {
                fetch(`${process.env.VUE_APP_FETCH_URL}stopMachine`, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({vmID: id}),
                    credentials: process.env.VUE_APP_FETCH_CREDENTIALS,
                }).then();
            },
            resumeVM(id) {
                fetch(`${process.env.VUE_APP_FETCH_URL}resumeMachine`, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({vmID: id}),
                    credentials: process.env.VUE_APP_FETCH_CREDENTIALS,
                }).then();
            },
            suspendVM(id) {
                fetch(`${process.env.VUE_APP_FETCH_URL}suspendMachine`, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({vmID: id}),
                    credentials: process.env.VUE_APP_FETCH_CREDENTIALS,
                }).then();
            },
        },
    };
    </script>

    <style scoped></style>