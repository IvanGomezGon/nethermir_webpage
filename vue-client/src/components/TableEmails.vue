<template>
    <div class="pb-8 ml-auto">
        <button type="button" @click="getData()" class="mr-4 bg-emerald-600 hover:bg-emerald-700 hover:active:bg-emerald-800 active:bg-emerald-700 text-white font-medium rounded-lg text-sm p-2.5">
            <div class="flex space-x-2 items-center justify-between">
                <svg class="w-[12px] h-[12px] text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 1v5h-5M2 19v-5h5m10-4a8 8 0 0 1-14.947 3.97M1 10a8 8 0 0 1 14.947-3.97"/>
                </svg>
                <p> {{$t('updateTable')}} </p>
            </div>
        </button>
        <button :disabled="getElements()==0" type="button" @click="deleteElements()" :class="(getElements()== 0 ? 'dark:bg-grey-400 dark:text-grey-300 bg-gray-400 text-gray-300 ' : 'bg-emerald-600 hover:bg-emerald-700 hover:active:bg-emerald-800 active:bg-emerald-700 text-white ') + 'font-medium rounded-lg text-sm p-2.5'">
            <span :class="(getElements()== 0 ? 'dark:text-grey-500 dark:bg-grey-300 text-gray-400 bg-gray-500 ' : ' text-primary-800 bg-primary-200 ') + 'inline-flex items-center justify-center w-4 h-4 mr-1 text-xs font-semibold rounded-full'">
                {{getElements()}}
            </span>
            {{$t('deleteElements')}}
        </button>
    </div>

    <div class="flex items-center relative overflow-x-auto shadow-md rounded-lg">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-grey-400 uppercase bg-gray-50 dark:bg-grey-400 dark:text-gray-400"  @click="getAllActive()">
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
                        {{$t('user')}} id
                    </th>
                    <th scope="col" class="px-6 py-3">
                        {{$t('email')}}
                    </th>
                    <th scope="col" class="px-6 py-3">
                        {{$t('groupName')}}
                    </th>
                    <th scope="col" class="px-6 py-3">
                        <span class="sr-only">Edit</span>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(email, index) in data" @click="active[index] = !active[index]"
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
                        {{ email.email_id }}
                    </th>
                    <td class="px-6 py-4 text-grey-700 whitespace-nowrap dark:text-white">
                        {{ email.email }}
                    </td>
                    <td class="px-6 py-4 text-grey-700 whitespace-nowrap dark:text-white">
                        {{ email.group_name }}
                    </td>

                    <td class="px-6 py-4 text-right">
                        <a href="#" @click="deleteEmail(email.email_id)"
                            class="font-medium text-emerald-600 dark:text-emerald-500 hover:underline">Eliminar</a>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    name: "GetEmails",
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
            let response = await fetch(`${process.env.VUE_APP_FETCH_URL}emails`, {
                credentials: process.env.VUE_APP_FETCH_CREDENTIALS,
            })
            response.json().then((json) => {
                console.log(json);
                this.data = json;
                this.active.length=this.data.length
                this.active.fill(false)
            });
        },
        deleteElements() {
            let deleteElements = []
            this.data.forEach((email, i) => {
                if(this.active[i]){
                    deleteElements.push(email.email_id)
                }
            }) 
            if (deleteElements.length > 0){
                this.deleteEmail(deleteElements.join(','))
            }
        },
        deleteEmail(emailsID) {
            console.log("delete Emails", emailsID)
            fetch(`${process.env.VUE_APP_FETCH_URL}email?emailID=${emailsID}`, {
                method: 'DELETE',
                credentials: process.env.VUE_APP_FETCH_CREDENTIALS,
            }).then(data => {this.getData()});
        },
    },
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped></style>
