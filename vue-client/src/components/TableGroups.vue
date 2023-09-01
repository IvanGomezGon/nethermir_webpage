<template>
    <div class="flex justify-center items-center overflow-x-auto shadow-md sm:rounded-lg ">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
                        Actiu?
                    </th>
                    <th scope="col" class="px-6 py-3">
                        <span class="sr-only">Edit</span>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="group in data"
                    class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {{ group.name }}
                    </th>
                    <td class="px-6 py-4">
                        {{ ((group.idgroup - (group.idgroup % 100)) / 100 < 10 ? "0" : "") + (group.idgroup -
                            (group.idgroup % 100)) / 100 }} </td>
                    <td class="px-6 py-4">
                        {{ (group.idgroup % 100 < 10 ? "0" : "") + (group.idgroup % 100) }} </td>
                    <td class="px-6 py-4">
                        {{ group.idgroup }}
                    </td>
                    <td class="px-6 py-4">
                        {{ group.vlan_id + 65434 }}
                    </td>
                    <td class="px-6 py-4">
                        {{ group.active }}
                    </td>
                    <td class="px-6 py-4 text-right">
                        <a href="#" @click="eliminateGroup(group.idgroup)"
                            class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Eliminar</a>
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
