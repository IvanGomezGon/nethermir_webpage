<template>
    <div class="border-gray-300 border-t-2 pt-8">
    </div>
    <div class="pb-8 ml-auto ">
        <button type="button" @click="getData()" class="mr-4 bg-emerald-600 hover:bg-emerald-700 hover:active:bg-emerald-800 active:bg-emerald-700 text-white font-medium rounded-lg text-sm p-2.5 ">
            <div class="flex space-x-2 items-center justify-between">
                <svg class="w-[12px] h-[12px] text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 1v5h-5M2 19v-5h5m10-4a8 8 0 0 1-14.947 3.97M1 10a8 8 0 0 1 14.947-3.97"/>
                </svg>
                <p>  {{ $t("updateTable") }}</p>
            </div>
        </button>
        <div class="contents">
            <button id="dropdownDefaultButton" @click="dropdownShow = !dropdownShow" data-dropdown-toggle="dropdown" class="w-[185px] bg-emerald-600 hover:bg-emerald-700 hover:active:bg-emerald-800 active:bg-emerald-700 text-white text-center inline-flex items-center font-medium rounded-lg text-sm p-2.5 block" type="button">
                <span v-if="selectedAction != selectAction" class="mr-2 text-primary-800 bg-primary-200 inline-flex items-center justify-center w-4 h-4 mr-1 text-xs font-semibold rounded-full text-center">
                    {{getNumActiveRows()}}
                </span>
                <span class="mr-auto ml-auto">
                    {{ selectedAction }} {{ selectedAction != selectAction ? $t("machines") : '' }} 
                </span>
                <svg class="w-2.5 h-2.5 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                </svg>
            </button>
            <button :disabled="getNumActiveRows()==0 || selectedAction != selectAction" type="button" @click="executeAction()" :class="(getNumActiveRows()== 0 || selectedAction != selectAction ? 'dark:bg-grey-400 dark:text-grey-300 bg-gray-400 text-gray-300 ' : 'bg-emerald-600 hover:bg-emerald-700 hover:active:bg-emerald-800 active:bg-emerald-700 text-white ') + 'ml-4 font-medium rounded-lg text-sm p-2.5 '">
            {{ $t("execute") }}
        </button>
            <div id="dropdown" v-if="dropdownShow == true" class="mt-1 w-[185px] ml-[159px] z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-grey-400 absolute border dark:border-grey-300 border-gray-300 ">
                <ul class="py-2 text-sm text-gray-700 dark:text-gray-200 " aria-labelledby="dropdownDefaultButton">
                <li @click="selectedAction=$t('turnOn'); dropdownShow = false">
                    <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-grey-300 dark:hover:text-white">{{ $t("turnOn") }}</a>
                </li>
                <li  @click="selectedAction=$t('turnOff'); dropdownShow = false">
                    <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-grey-300 dark:hover:text-white">{{ $t("turnOff") }}</a>
                </li>
                <li  @click="selectedAction=$t('resume'); dropdownShow = false">
                    <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-grey-300 dark:hover:text-white">{{ $t("resume") }}</a>
                </li>
                <li  @click="selectedAction=$t('pause'); dropdownShow = false">
                    <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-grey-300 dark:hover:text-white">{{ $t("pause") }}</a>
                </li>
                </ul>
            </div>  
        </div>
    </div>
    <div class="flex items-center overflow-x-auto shadow-md rounded-lg">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-grey-400 uppercase bg-gray-100 dark:bg-grey-400 dark:text-gray-400" @click="areAllActive()">
                <tr>
                    <th scope="col" class="px-6 py-3">
                        <div class="flex items-start">
                                <div class="flex items-center h-5">
                                    <input type="checkbox" :checked="active.every(v => v == true)"
                                        class="w-4 h-4 border border-gray-300 rounded bg-gray-50 accent-slate-500">
                                </div>
                        </div>
                    </th>
                    <th scope="col" class="px-6 py-3">
                        {{ $t("virtualMachine") }} ID
                    </th>
                    <th scope="col" class="px-6 py-3">
                        {{ $t("name") }}
                    </th>
                    <th scope="col" class="px-6 py-3">
                        {{ $t("CPU") }}
                    </th>
                    <th scope="col" class="px-6 py-3">
                        {{ $t("status") }}
                    </th>
                    <th scope="col" class="px-6 py-3">
                        {{ $t("uptime") }}
                    </th>
                    <th scope="col" class="px-6 py-3">
                        <span class="sr-only">{{$t("turnOn")}} / {{$t("turnOff")}}</span>
                    </th>
                    <th scope="col" class="px-6 py-3">
                        <span class="sr-only">{{$t("resume")}} / {{$t("pause")}}</span>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(vm, index) in data" @click="active[index] = vm.template != 1 ? !active[index] : false"
                    :class="((active[index] && vm.template != 1 ? 'bg-gray-200 dark:bg-grey-200 border-b border-white dark:border-grey-600 ' : 'bg-white dark:bg-grey-600 hover:bg-gray-50 dark:hover:bg-grey-500 border-b dark:border-grey-400 ') + getColor(vm.status, vm.cpu, vm.template)) ">
                    <td class="px-6 py-4 text-right">
                        <div class="flex items-center justify-between">
                            <div class="flex items-start">
                                <div class="flex items-center h-5">
                                    <input type="checkbox" :checked="vm.template != 1 ? active[index] : false" :disabled="vm.template == 1"
                                        class="w-4 h-4 border border-gray-300 rounded bg-gray-50 accent-slate-500">
                                </div>
                            </div>
                        </div>
                    </td> 
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
                        {{ vm.template == 1 ? "Template" : vm.status == "stopped" ? $t("stopped")  : vm.cpu < 0.05
                            ? $t("paused") : $t("running") }} </td>
                    <td :class="'px-6 py-4 font-medium whitespace-nowrap'">
                        {{ vm.template == 1 ? "-" : vm.uptime }}
                    </td>
                    <td class="px-6 py-4 text-right">
                        <a href="#" @click="stopActivate(vm.status, vm.vmid.toString())"
                            :class="vm.template == 1 ? 'font-medium dark:text-emerald-800 pointer-events-none text-gray-400' :'font-medium text-emerald-600 dark:text-emerald-500 hover:underline'">{{ vm.status == "stopped" ?
                                $t("turnOn") : $t("turnOff") }}</a>
                    </td>
                    <td class="px-6 py-4 text-right">
                        <a href="#" @click="resumeSuspend(vm.cpu, vm.vmid.toString())" 
                            :class="vm.status == 'stopped' || vm.template == 1 ? 'font-medium dark:text-emerald-800 pointer-events-none	text-gray-400': 'font-medium text-emerald-600 dark:text-emerald-500 hover:underline'">{{ vm.cpu < 0.05
                                ? $t("resume") : $t("pause") }}</a>
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
                active:[],
                selectActionIndex: 0,
                selectAction: this.$t('selectAction'),
                selectedAction: this.$t('selectAction'),
                dropdownShow: false,
            };
        },
        mounted: function () {
            this.getData(true);
            this.active.length=this.data.length
            this.active.fill(false)
            this.interval = setInterval(() => {
                this.getData();
            }, 2000);
        },
        beforeUnmount() {
            clearInterval(this.interval)
        },

        methods: {
            async getData(firstTime = false) {
                let response = await fetch(`${process.env.VUE_APP_FETCH_URL}statusAllVMs?server=${this.server}`, {
                    credentials: process.env.VUE_APP_FETCH_CREDENTIALS
                })
                response.json().then((json) => {
                    console.log(json);
                    this.data = json;
                    if (firstTime){
                        this.active.length=json.length
                        this.active.fill(false)
                    }
                });
            },
            getNumActiveRows(){
            let sum = this.active.reduce((partialSum, a) => partialSum + a, 0);
            return sum
            },

            areAllActive(){
                if (this.active.every(v => v == true)){
                    this.active.fill(false)
                }else{
                    this.active.fill(true)
                }
            },

            getActivatedRows() {
                return new Promise((resolve, reject) => {
                    let deleteElements = []
                    this.data.forEach((vm, i) => {
                        if(this.active[i] && vm.template != 1){
                            deleteElements.push(vm.vmid)
                        }
                    }) 
                    if (deleteElements.length > 0){
                        resolve(deleteElements.join(','))
                    }
                })
            },

            async executeAction() {
                let activatedRows = await this.getNumActiveRows()
                if (activatedRows == 0) {
                    return
                }
                if (this.selectedAction == "Encendre"){
                    this.activateVM()
                }   
                else if (this.selectedAction == "Parar"){
                    this.stopVM()
                }
                else if (this.selectedAction == "Resumir"){
                    this.resumeVM()
                }
                else if (this.selectedAction == "Pausar"){
                    this.suspendVM()
                }
            },

            getColor(status, cpu, template) {
                return template == 1 ? 'dark:text-gray-400 text-gray-500' : status == 'stopped' ? 'text-red-600' : cpu < 0.05 ? 'text-yellow-500' : 'text-green-600';
            },
            stopActivate(status, vmID) {
                if (status == "running") {
                    this.stopVM(vmID);
                } else {
                    this.activateVM(vmID);
                }
            },
            resumeSuspend(cpu, vmID) {
                if (cpu < 0.05) {
                    this.resumeVM(vmID);
                } else {
                    this.suspendVM(vmID);
                }
            },
            async activateVM(vmIDs = null) {
                if (vmIDs == null){
                    vmIDs = await this.getActivatedRows()
                }
                console.log("Machines to activate: ", vmIDs)
                fetch(`${process.env.VUE_APP_FETCH_URL}activateMachine`, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({vmIDs: vmIDs, hours: 4}),
                    credentials: process.env.VUE_APP_FETCH_CREDENTIALS,
                }).then();
            },
            async stopVM(vmIDs = null) {
                if (vmIDs == null){
                    vmIDs = await this.getActivatedRows()
                }
                console.log("Machines to stop: ", vmIDs)
                fetch(`${process.env.VUE_APP_FETCH_URL}stopMachine`, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({vmIDs: vmIDs}),
                    credentials: process.env.VUE_APP_FETCH_CREDENTIALS,
                }).then();
            },
            async resumeVM(vmIDs = null) {
                if (vmIDs == null){
                    vmIDs = await this.getActivatedRows()
                }
                console.log("Machines to resume: ", vmIDs)
                fetch(`${process.env.VUE_APP_FETCH_URL}resumeMachine`, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({vmIDs: vmIDs}),
                    credentials: process.env.VUE_APP_FETCH_CREDENTIALS,
                }).then();
            },
            async suspendVM(vmIDs = null) {
                if (vmIDs == null){
                    vmIDs = await this.getActivatedRows()
                }
                console.log("Machines to suspend: ", vmIDs)
                fetch(`${process.env.VUE_APP_FETCH_URL}suspendMachine`, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({vmIDs: vmIDs}),
                    credentials: process.env.VUE_APP_FETCH_CREDENTIALS,
                }).then();
            },
            getNumActiveRows(){
            let sum = this.active.reduce((partialSum, a) => partialSum + a, 0);
            return sum
        },
        },
    };
    </script>

    <style scoped></style>