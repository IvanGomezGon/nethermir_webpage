<template>
    <div class="flex items-center relative overflow-x-auto shadow-md rounded-lg">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-grey-400 uppercase bg-gray-50 dark:bg-grey-400 dark:text-gray-400">
                <tr>
                    <th scope="col" class="px-6 py-3">
                        Usuari id
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Email
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Nom del grup
                    </th>

                    <th scope="col" class="px-6 py-3">
                        <span class="sr-only">Edit</span>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="email in data"
                    class="bg-white border-b dark:bg-grey-600 -700 dark:border-grey-400 hover:bg-gray-50 dark:hover:bg-grey-500">
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
                        <a href="#" @click="eliminateEmail(email.email_id)"
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
        };
    },
    mounted: function () {
        this.getData();
        this.interval = setInterval(() => {
            this.getData();
        }, 2000);
    },
    beforeUnmount() {
        clearInterval(this.interval)
    },
    methods: {
        getData() {
            let p = new Promise((resolve, reject) => {
                fetch(`${process.env.VUE_APP_FETCH_URL}getEmails`, {
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
        eliminateEmail(id) {
            fetch(`${process.env.VUE_APP_FETCH_URL}eliminateEmail?id=${id}`, {
                credentials: process.env.VUE_APP_FETCH_CREDENTIALS,
            }).then();
        },
    },
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped></style>
