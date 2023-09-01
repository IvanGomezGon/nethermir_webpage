<template>
    <!-- Comment
<button class="logout corner">Eliminar taula</button>
<h2>Informació Proxmox VMs</h2>
<button type="button" @click="server = 0" :disabled="server == 0">Nethermir1</button>
<button type="button" @click="server = 1" :disabled="server == 1">Nethermir2</button>
<button type="button" @click="server = 2" :disabled="server == 2">Nethermir3</button><br /><br />
<table>
    <colgroup>
        <col style="width: 70px" />
        <col span="6" />
    </colgroup>
    <tr>
        <th>VM id</th>
        <th>Nom</th>
        <th>CPU</th>
        <th>Estat</th>
        <th>Uptime</th>
        <th>Encendre / Parar</th>
        <th>Resumir / Suspendre</th>
    </tr>

    <tr v-for="vm in data" :style="'color: ' + getColor(vm.status, vm.cpu, vm.template)">
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td>
            <button type="button" :disabled="vm.template == 1 || vm.name == 'nethermir-mgmt'" @click=""></button>
        </td>

        <td>
            <button type="button" :disabled="vm.status == 'stopped' || vm.template == 1 || vm.name == 'nethermir-mgmt'" @click=""></button>
        </td>
    </tr>
</table>
-->
    <div class="flex justify-center items-center overflow-x-auto shadow-md sm:rounded-lg">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
                    class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {{ vm.vmid }}
                    </th>
                    <td class="px-6 py-4">
                        {{ vm.name }}
                    </td>
                    <td class="px-6 py-4">
                        {{ vm.template == 1 ? "-" : (vm.cpu * 100).toFixed(2) + "%" }}
                    </td>
                    <td class="px-6 py-4">
                        {{ vm.template == 1 ? "Template" : vm.status == "stopped" ? "Stopped" : vm.cpu < 0.005
                            ? "Corrent (Pausat)" : "Corrent" }} </td>
                    <td class="px-6 py-4">
                        {{ vm.template == 1 ? "-" : vm.uptime }}
                    </td>
                    <td class="px-6 py-4 text-right">
                        <a href="#" @click="stopActivate(vm.status, vm.vmid)"
                            class="font-medium text-blue-600 dark:text-blue-500 hover:underline">{{ vm.status == "stopped" ?
                                "Encendre" : "Parar" }}</a>
                    </td>
                    <td class="px-6 py-4 text-right">
                        <a href="#" @click="resumeSuspend(vm.cpu, vm.vmid)"
                            class="font-medium text-blue-600 dark:text-blue-500 hover:underline">{{ vm.cpu < 0.005
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
        data: function () {
            return {
                data: "",
                server: 0,
            };
        },
        mounted: function () {
            this.getData();
            this.interval = setInterval(() => {
                //this.getData();
            }, 2000);
        },
        destroyed() {
            clearInterval(this.interval)
        },
        methods: {
            getData() {
                let p = new Promise((resolve, reject) => {
                    fetch(`${process.env.VUE_APP_FETCH_URL}getNodes?server=${this.server}`, {
                        credentials: process.env.VUE_APP_FETCH_CREDENTIALS
                    }).then(resolve);
                });
                p.then((response) => {
                    response.json().then((json) => {
                        console.log(json);
                        this.data = json;
                    });
                });
            },
            getColor(status, cpu, template) {
                return template == 1 ? "dimgrey" : status == "stopped" ? "red" : cpu < 0.005 ? "orange" : "green";
            },
            stopActivate(status, id) {
                if (status == "running") {
                    this.stopVM(id);
                } else {
                    this.activateVM(id);
                }
            },
            resumeSuspend(cpu, id) {
                if (cpu < 0.005) {
                    this.resumeVM(id);
                } else {
                    this.suspendVM(id);
                }
            },
            activateVM(id) {
                fetch(`${process.env.VUE_APP_FETCH_URL}activateMachine?id=${id}&hours=4`, {
                    credentials: process.env.VUE_APP_FETCH_CREDENTIALS
                }).then();
            },
            stopVM(id) {
                fetch(`${process.env.VUE_APP_FETCH_URL}stopMachine?id=${id}`, {
                    credentials: process.env.VUE_APP_FETCH_CREDENTIALS
                }).then();
            },
            resumeVM(id) {
                console.log("yay");
                fetch(`${process.env.VUE_APP_FETCH_URL}resumeMachine?id=${id}`, {
                    credentials: process.env.VUE_APP_FETCH_CREDENTIALS
                }).then();
            },
            suspendVM(id) {
                fetch(`${process.env.VUE_APP_FETCH_URL}suspendMachine?id=${id}`, {
                    credentials: process.env.VUE_APP_FETCH_CREDENTIALS
                }).then();
            },
        },
    };
    </script>

    <style scoped></style>