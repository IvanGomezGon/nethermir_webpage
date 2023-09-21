<template>
    <noVirtualMachineUser v-if="idVM == -1"></noVirtualMachineUser>
    <WaitingClone v-if="clonning"></WaitingClone>
    <div v-if="idVM > 0 && !clonning" class="flex items-center overflow-x-auto shadow-md rounded-lg">
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
                        Hores
                    </th>
                    <th scope="col" class="px-6 py-3">
                        <span class="sr-only">Iniciar</span>
                    </th>
                    <th scope="col" class="px-6 py-3">
                        <span class="sr-only">Suspendre</span>
                    </th>
                    <th scope="col" class="px-6 py-3">
                        <span class="sr-only">Parar</span>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr
                    :class="getColor(statusVM, cpuVM, template) + ' bg-white border-b dark:bg-grey-600 -700 dark:border-grey-400 hover:bg-gray-50 dark:hover:bg-grey-500'">
                    <th scope="row" :class="'px-6 py-4 font-medium whitespace-nowrap'">
                        {{ idVM }}
                    </th>
                    <td :class="'px-6 py-4 font-medium whitespace-nowrap'">
                        {{ nameVM }}
                    </td>
                    <td :class="'px-6 py-4 font-medium whitespace-nowrap'">
                        {{ template == 1 ? "-" : (cpuVM * 100).toFixed(2) + "%" }}
                    </td>
                    <td :class="'px-6 py-4 font-medium whitespace-nowrap'">
                        {{ template == 1 ? "Template" : statusVM == "stopped" ? "Stopped" : statusVM == "paused" ? "Corrent (Pausat)" : "Corrent" }}
                    </td>
                    <td :class="'px-6 py-4 font-medium whitespace-nowrap'">
                        {{ template == 1 ? "-" : uptimeVM }}
                    </td>
                    <td class="px-6 py-4 text-right">
                        <select id="countries" v-model="hours"
                            class="bg-gray-50 border border-gray-300 text-grey-700 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 dark:bg-grey-400 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                        </select>
                    </td>
                    <td class="px-6 py-4 text-right">
                        <a href="#" @click="activateVM(cpuVM, idVM)"
                            class="font-medium text-emerald-600 dark:text-emerald-500 hover:underline">
                            {{ `${statusVM != "stopped" ? "Extendre" : "Encendre"} ${hours + (hours == 1 ? ' hora' : 'hores')}`}}</a>
                    </td>
                    <td class="px-6 py-4 text-right">
                        <a href="#" @click="suspendResumeVM()"
                            :class="statusVM == 'paused' ? 'font-medium dark:text-emerald-800 pointer-events-none text-gray-400' : 'font-medium text-emerald-600 dark:text-emerald-500 hover:underline'">
                            {{ "Pausar" }}</a>
                    </td>
                    <td class="px-6 py-4 text-right">
                        <a href="#" @click="stopVM()"
                            :class="statusVM == 'stopped' ? 'font-medium dark:text-emerald-800 pointer-events-none text-gray-400' : 'font-medium text-emerald-600 dark:text-emerald-500 hover:underline'">
                            {{ "Parar" }}</a>
                    </td>
                </tr>

            </tbody>
        </table>
    </div>
</template>

<script>
import noVirtualMachineUser from "@/components/noVirtualMachineUser.vue";
import WaitingClone from "@/components/WaitingClone.vue";
export default {
    name: "GetInfoVM",
    data: function () {
        return {
            idVM: 0,
            nameVM: 0,
            cpuVM: 0,
            statusVM: "stopped",
            uptimeVM: 0,
            hours: 1,
            template: 0,
            clonning: 0,
        };
    },
    mounted: function () {
        this.getData();
        this.interval = setInterval(() => {
            this.getData();

        }, 2000);
    },
    destroyed() {
        clearInterval(this.interval)
    },
    methods: {
        async getData() {
            let response = await fetch(`${process.env.VUE_APP_FETCH_URL}statusVM`, {
                credentials: process.env.VUE_APP_FETCH_CREDENTIALS
            })
            response.json().then((json) => {
                if (json == null) { this.idVM = -1; return }
                if (Object.keys(json).length != 0) {
                    this.idVM = json.vmid
                    this.nameVM = json.name
                    this.cpuVM = json.cpu
                    this.statusVM = json.qmpstatus
                    this.uptimeVM = json.uptime = 0
                    this.template = json.template
                    this.clonning = json.lock
                } else {
                    this.idVM = -1;
                }
            });
        },

        activateVM() {
            if (this.hours > 0 && this.hours < 7) {
                fetch(`${process.env.VUE_APP_FETCH_URL}activateMachine`, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ hours: this.hours }),
                    credentials: process.env.VUE_APP_FETCH_CREDENTIALS,
                }).then();
            }
        },
        suspendResumeVM() {
            if (this.statusVM == "paused") {
                fetch(`${process.env.VUE_APP_FETCH_URL}resumeMachine`, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ hours: this.hours }),
                    credentials: process.env.VUE_APP_FETCH_CREDENTIALS,
                }).then();
            } else {
                fetch(`${process.env.VUE_APP_FETCH_URL}suspendMachine`, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Content-Length': '0',
                    },
                    body: JSON.stringify({}),
                    credentials: process.env.VUE_APP_FETCH_CREDENTIALS,
                }).then();
            }
        },
        stopVM() {
            fetch(`${process.env.VUE_APP_FETCH_URL}stopMachine`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Content-Length': '0',
                },
                body: JSON.stringify({}),
                credentials: process.env.VUE_APP_FETCH_CREDENTIALS,
            }).then();
        },
        getColor(status, cpu, template) {
            return template == 1 ? 'dark:text-gray-400 text-gray-600' : status == 'stopped' ? 'text-red-600' : status == 'paused' ? 'text-yellow-500' : 'text-green-600';
        },
    },
    components: {
        noVirtualMachineUser,
        WaitingClone,
    },
};
</script>
