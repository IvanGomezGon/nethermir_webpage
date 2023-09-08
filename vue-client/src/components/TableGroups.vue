<template>
    <div class="flex items-center overflow-x-auto shadow-md rounded-lg ">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-grey-400 uppercase bg-gray-50 dark:bg-grey-400 dark:text-gray-400">
                <tr>
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
                        <span class="sr-only">Edit</span>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="group in data"
                    class="bg-white border-b dark:bg-grey-600 -700 dark:border-grey-400 hover:bg-gray-50 dark:hover:bg-grey-500">
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
        getData() {
            let p = new Promise((resolve, reject) => {
                fetch(`${process.env.VUE_APP_FETCH_URL}getGroups`, {
                    credentials: process.env.VUE_APP_FETCH_CREDENTIALS,
                }).then(resolve);
            });
            p.then((response) => {
                response.json().then((json) => {
                    console.log(json);
                    this.data = json;
                });
            });
        },
        eliminateGroup(id) {
            fetch(`${process.env.VUE_APP_FETCH_URL}eliminateGroup?id=${id}`, {
                credentials: process.env.VUE_APP_FETCH_CREDENTIALS,
            }).then();
        },
    },
};
</script>

<style scoped></style>
