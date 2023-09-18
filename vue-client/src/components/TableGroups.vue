<template>
                
    <div class="pb-8 ">
        <button :disabled="getElements()==0" type="button" @click="deleteElements()" :class="(getElements()== 0 ? 'bg-grey-400 text-grey-300 ' : 'bg-emerald-600 hover:bg-emerald-700 hover:active:bg-emerald-800 active:bg-emerald-700 text-white ') + 'font-medium rounded-lg text-sm p-2.5 ml-auto block'">
            Eliminar elements
            <span :class="(getElements()== 0 ? 'text-grey-500 bg-grey-300 ' : ' text-primary-800 bg-primary-200 ') + 'inline-flex items-center justify-center w-4 h-4 ml-2 text-xs font-semibold rounded-full'">
                {{getElements()}}
            </span>
        </button>
    </div>
         
    <div class="flex items-center overflow-x-auto shadow-md rounded-lg">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-grey-400 uppercase bg-gray-50 dark:bg-grey-400 dark:text-gray-400" @click="getAllActive()">
                <tr>
                    <th scope="col" class="px-6 py-3">
                        <div class="flex items-start">
                                <div class="flex items-center h-5">
                                    <input type="checkbox" :checked="this.active.every(v => v == true)"
                                        class="w-4 h-4 border border-gray-300 rounded accent-slate-500">
                                </div>
                        </div>
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Identificador
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Assignatura
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Grup
                    </th>
                    <th scope="col" class="px-6 py-3">
                        VLAN
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Port UDP
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Està actiu?
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Hora d'inici
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Hora final
                    </th>
                    <th scope="col" class="px-6 py-3">
                        <span class="sr-only">Edit</span>
                    </th>

                </tr>
            </thead>
            <tbody>
                <tr v-for="(group, index) in data" @click="active[index] = !active[index]"
                :class="(active[index] ? 'bg-gray-200 dark:bg-grey-200 border-b border-white dark:border-grey-600':'bg-white dark:bg-grey-600 hover:bg-gray-50 dark:hover:bg-grey-500 border-b dark:border-grey-400') ">
                    <td class="px-6 py-4 text-right">
                        <div class="flex items-center justify-between">
                            <div class="flex items-start">
                                <div class="flex items-center h-5">
                                    <input type="checkbox" :checked=active[index]
                                        class="w-4 h-4 border border-gray-300 rounded bg-gray-50 accent-slate-500">
                                </div>
                            </div>
                        </div>
                    </td>
                    <th scope="row" class="px-6 py-4 font-medium text-grey-700 whitespace-nowrap dark:text-white">
                        {{ group.name }}
                    </th>
                    <td class="px-6 py-4 text-grey-700 whitespace-nowrap dark:text-white">
                        {{ ((group.idgroup - (group.idgroup % 100)) / 100 < 10 ? "0" : "") + (group.idgroup -
                            (group.idgroup % 100)) / 100 }} </td>
                    <td class="px-6 py-4 text-grey-700 whitespace-nowrap dark:text-white">
                        {{ (group.idgroup % 100 < 10 ? "0" : "") + (group.idgroup % 100) }} </td>
                    <td class="px-6 py-4 text-grey-700 whitespace-nowrap dark:text-white">
                        {{ group.idgroup }}
                    </td>
                    <td class="px-6 py-4 text-grey-700 whitespace-nowrap dark:text-white">
                        {{ group.vlan_id + 65434 }}
                    </td>
                    <td class="px-6 py-4 text-grey-700 whitespace-nowrap dark:text-white">
                        {{ group.active == '0' ? 'Cert' : 'Fals' }}
                    </td>
                    <td class="px-6 py-4 text-grey-700 whitespace-nowrap dark:text-white">
                        {{ group.starting_time }}
                    </td>
                    <td class="px-6 py-4 text-grey-700 whitespace-nowrap dark:text-white">
                        {{ getFinishHour(group.starting_time, group.renovated_hours) }}
                    </td>
                    <td class="px-6 py-4 text-right">
                        <a href="#" @click="eliminateGroup(group.idgroup)"
                            class="font-medium text-emerald-600 dark:text-emerald-500 hover:underline">Eliminar</a>
                    </td>

                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    name: "GetGroups",
    data: function () {
        return {
            data: "",
            active:[],
        };
    },
    mounted: function () {
        this.getData();

    },
    beforeUnmount() {
        console.log("beforeUnmount")
        clearInterval(this.interval)
    },
    methods: {
        getElements(){
            let sum = this.active.reduce((partialSum, a) => partialSum + a, 0);
            return sum
        },
        getAllActive(){
            if (this.active.every(v => v == true)){
                this.active.fill(false)
            }else{
                this.active.fill(true)
            }
            
        },
        getFinishHour(startHour, hours){
            if (startHour){
                let finishHour = (parseInt(startHour.slice(0,2)) + hours) % 24 + startHour.slice(2)
                if (finishHour.length == 6){
                    finishHour = '00' + finishHour
                } else if (finishHour.length == 7){
                    finishHour = '0' + finishHour
                }
                return finishHour
            }
        },
        async getData() {
            let response = await fetch(`${process.env.VUE_APP_FETCH_URL}groups`, {
                credentials: process.env.VUE_APP_FETCH_CREDENTIALS,
            })
            response.json().then((json) => {
                console.log(json);
                this.data = json;
                this.active.length=this.data.length
                this.active.fill(false)
            });
        },
        eliminateGroup(id) {
            fetch(`${process.env.VUE_APP_FETCH_URL}group?groupID=${id}`, {
                method: 'DELETE',
                credentials: process.env.VUE_APP_FETCH_CREDENTIALS,
            }).then();
        },
    },
};
</script>

<style scoped></style>
