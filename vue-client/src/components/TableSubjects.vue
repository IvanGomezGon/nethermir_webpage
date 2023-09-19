<template>
    <div class="border-gray-300 border-t-2 pt-8 ">

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
        <button :disabled="getElements()==0" type="button" @click="deleteElements()" :class="(getElements()== 0 ? 'dark:bg-grey-400 dark:text-grey-300 bg-gray-400 text-gray-300 ' : 'bg-emerald-600 hover:bg-emerald-700 hover:active:bg-emerald-800 active:bg-emerald-700 text-white ') + 'font-medium rounded-lg text-sm p-2.5'">
            <span :class="(getElements()== 0 ? 'dark:text-grey-500 dark:bg-grey-300 text-gray-400 bg-gray-500 ' : ' text-primary-800 bg-primary-200 ') + 'inline-flex items-center justify-center w-4 h-4 mr-1 text-xs font-semibold rounded-full'">
                {{getElements()}}
            </span>
            Eliminar elements
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
                                        class="w-4 h-4 border border-gray-300 rounded bg-gray-50 accent-slate-500">
                                </div>
                        </div>
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Assignatura id
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Nom
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Està activa?
                    </th>
                    <th scope="col" class="px-6 py-3">
                        <span class="sr-only">Activar/Desactivar</span>
                    </th>
                    <th scope="col" class="px-6 py-3">
                        <span class="sr-only">Eliminar</span>
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
                        {{ subject.active ? "Cert" : "Fals" }}
                    </td>
                    <td class="px-6 py-4 text-right dark:text-white">
                        <a href="#" @click="activateSubject(subject.idsubject)"
                            class="font-medium text-green-600 hover:underline dark:text-green-600">{{ subject.active ? "Desactivar" : "Activar" }}</a>
                    </td>
                    <td class="px-6 py-4 text-right dark:text-white">
                        <a href="#" @click="eliminateSubject(subject.idsubject)"
                            class="font-medium text-green-600 hover:underline dark:text-green-600">Eliminar</a>
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
        };
    },
    mounted: function () {
        this.getData();
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
        async getData() {
            let response = await fetch(`${process.env.VUE_APP_FETCH_URL}subjects`)
            response.json().then((json) => {
                console.log(json);
                this.data = json;
                this.active.length=this.data.length
                this.active.fill(false)
            });
        },

        eliminateSubject(subjectsID) {
            console.log("Elements to delete: ", subjectsID)
            fetch(`${process.env.VUE_APP_FETCH_URL}subject?subjectID=${subjectsID}`, {
                method: 'DELETE',
                credentials: process.env.VUE_APP_FETCH_CREDENTIALS,
            }).then();
        },
        deleteElements() {
            let deleteElements = []
            this.data.forEach((subject, i) => {
                if(this.active[i]){
                    deleteElements.push(subject.idsubject)
                }
            }) 
            if (deleteElements.length > 0){
                this.eliminateSubject(deleteElements.join(','))
            }
        },
        activateSubject(subjectID) {
            fetch(`${process.env.VUE_APP_FETCH_URL}activateSubject`, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({subjectID: subjectID}),
                    credentials: process.env.VUE_APP_FETCH_CREDENTIALS,
            }).then();
        },
    },
};
</script>