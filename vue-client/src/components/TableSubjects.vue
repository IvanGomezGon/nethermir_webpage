<template>
    <div class="border-gray-300 border-t-2 pt-8 ">

    </div>
    <div class="pb-8 ml-auto ">
        <button type="button" @click="getData()" class="mr-4 bg-emerald-600 hover:bg-emerald-700 hover:active:bg-emerald-800 active:bg-emerald-700 text-white font-medium rounded-lg text-sm p-2.5 ">
            <div class="flex space-x-2 items-center justify-between">
                <svg class="w-[12px] h-[12px] text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 1v5h-5M2 19v-5h5m10-4a8 8 0 0 1-14.947 3.97M1 10a8 8 0 0 1 14.947-3.97"/>
                </svg>
                <p> {{$t('updateTable')}}</p>
            </div>
        </button>
        <div class="contents">
            <button id="dropdownDefaultButton" @click="dropdownShow = !dropdownShow" data-dropdown-toggle="dropdown" class="w-[185px] bg-emerald-600 hover:bg-emerald-700 hover:active:bg-emerald-800 active:bg-emerald-700 text-white text-center inline-flex items-center font-medium rounded-lg text-sm p-2.5 block" type="button">
                <span v-if="selectedAction != -1" class="mr-2 text-primary-800 bg-primary-200 inline-flex items-center justify-center w-4 h-4 mr-1 text-xs font-semibold rounded-full text-center">
                    {{getNumActiveRows()}}
                </span>
                <span :class="selectedAction == selectAction ?'mr-auto ml-auto' : 'mr-auto'">
                    {{ getSelectedAction() }} 
                </span>
                <svg class="w-2.5 h-2.5 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                </svg>
            </button>
            <button :disabled="getNumActiveRows()==0 || selectedAction == -1" type="button" @click="executeAction()" :class="(getNumActiveRows()== 0 || selectedAction == -1 ? 'dark:bg-grey-400 dark:text-grey-300 bg-gray-400 text-gray-300 ' : 'bg-emerald-600 hover:bg-emerald-700 hover:active:bg-emerald-800 active:bg-emerald-700 text-white ') + 'ml-4 font-medium rounded-lg text-sm p-2.5 '">
                {{$t('execute')}}
            </button>
            <div id="dropdown" v-if="dropdownShow == true" class="mt-1 w-[185px] ml-[159px] z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-grey-400 absolute border dark:border-grey-300 border-gray-300 ">
                <ul class="py-2 text-sm text-gray-700 dark:text-gray-200 " aria-labelledby="dropdownDefaultButton">
                <li @click="selectedAction=0; dropdownShow = false">
                    <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-grey-300 dark:hover:text-white">{{ $t("activate") }}</a>
                </li>
                <li  @click="selectedAction=1; dropdownShow = false">
                    <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-grey-300 dark:hover:text-white">{{ $t("desactivate") }}</a>
                </li>
                <li  @click="selectedAction=2; dropdownShow = false">
                    <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-grey-300 dark:hover:text-white">{{ $t("delete") }}</a>
                </li>
                </ul>
            </div>  
        </div>
    </div>

    <div class="flex items-center overflow-x-auto shadow-md rounded-lg">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-grey-400 uppercase bg-gray-50 dark:bg-grey-400 dark:text-gray-400" @click="areAllActive()">
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
                        {{$t('course')}} id
                    </th>
                    <th scope="col" class="px-6 py-3">
                        {{$t('name')}}
                    </th>
                    <th scope="col" class="px-6 py-3">
                        {{$t('isActive')}}
                    </th>
                    <th scope="col" class="px-6 py-3">
                        <span class="sr-only">{{$t('activateDesactivate')}}</span>
                    </th>
                    <th scope="col" class="px-6 py-3">
                        <span class="sr-only">{{$t('delete')}}</span>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(subject, index) in data" @click="active[index] = !active[index]"
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
                        {{ subject.idsubject < 10 ? "0" + subject.idsubject : subject.idsubject }}
                    </th>
                    <td class="px-6 py-4 dark:text-white">
                        {{ subject.subject_name }}
                    </td>
                    <td class="px-6 py-4 dark:text-white">
                        {{ subject.active ? $t("true") : $t("false") }}
                    </td>
                    <td class="px-6 py-4 text-right dark:text-white">
                        <a href="#" @click="!subject.active ? activateSubject(subject.idsubject.toString()) : deactiveSubject(subject.idsubject.toString())"
                            class="font-medium text-green-600 hover:underline dark:text-green-600">{{ subject.active ? $t('desactivate') : $t('activate') }}</a>
                    </td>
                    <td class="px-6 py-4 text-right dark:text-white">
                        <a href="#" @click="deleteSubject(subject.idsubject.toString())"
                            class="font-medium text-green-600 hover:underline dark:text-green-600">{{$t('delete')}}</a>
                    </td>
                </tr>

            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    name: "TableSubjects",
    data: function () {
        return {
            data: "",
            active:[],
            selectedAction: -1,
            dropdownShow: false,
        };
    },
    props: {fetch},
    mounted: function () {
        this.getData();
    },
    watch: {
        fetch(){
            this.getData();
        },
        
    },
    methods: {
        getSelectedAction() {
            if (this.selectedAction == -1){
                return this.$t("selectAction")
            }else if (this.selectedAction == 0){
                return `${this.$t("activate")} ${this.$t("elements")}`
            }else if (this.selectedAction == 1){
                return `${this.$t("desactivate")} ${this.$t("elements")}`
            }else if (this.selectedAction == 2){
                return `${this.$t("delete")} ${this.$t("elements")}`
            }
        },
        async getData() {
            let response = await fetch(`${process.env.VUE_APP_FETCH_URL}subjects`)
            response.json().then((json) => {
                console.log(json);
                this.data = json;
                this.active.length=this.data.length;
                this.active.fill(false);
                
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
                this.data.forEach((subject, i) => {
                    if(this.active[i]){
                        deleteElements.push(subject.idsubject)
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
            if (this.selectedAction == 0){
                this.activateSubject()
            }   
            else if (this.selectedAction == 1){
                this.deactiveSubject()
            }
            else if (this.selectedAction == 2){
                this.deleteSubject()
            }
        },
        
        async activateSubject(subjectsID = null) {
            subjectsID = subjectsID == null ? await this.getActivatedRows() : subjectsID
            console.log("Elements to activate: ", subjectsID)
            fetch(`${process.env.VUE_APP_FETCH_URL}activateSubject`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({subjectIDs: subjectsID}),
                    credentials: process.env.VUE_APP_FETCH_CREDENTIALS,
            }).then(data => {this.getData()});
        },

        async deactiveSubject(subjectsID = null) {
            subjectsID = subjectsID == null ? await this.getActivatedRows() : subjectsID
            console.log("Elements to deactivate: ", subjectsID)
            fetch(`${process.env.VUE_APP_FETCH_URL}deactivateSubject`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({subjectIDs: subjectsID}),
                    credentials: process.env.VUE_APP_FETCH_CREDENTIALS,
            }).then(data => {this.getData()});
        },

        async deleteSubject(subjectsID = null) {
            console.log(subjectsID)
            subjectsID = subjectsID == null ? await this.getActivatedRows() : subjectsID
            console.log("Elements to delete: ", subjectsID)
            fetch(`${process.env.VUE_APP_FETCH_URL}subject?subjectIDs=${subjectsID}`, {
                method: 'DELETE',
                credentials: process.env.VUE_APP_FETCH_CREDENTIALS,
            }).then(data => {this.getData()});
        },


    },
};
</script>