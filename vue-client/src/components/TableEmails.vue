<template>
    <div class="flex justify-center items-center relative overflow-x-auto shadow-md sm:rounded-lg">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-lighter_grey uppercase bg-gray-50 dark:bg-lighter_grey dark:text-gray-400">
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
                    class="bg-white border-b dark:bg-light_grey dark:border-lighter_grey hover:bg-gray-50 dark:hover:bg-gray-600">
                    <th scope="row" class="px-6 py-4 font-medium text-grey whitespace-nowrap dark:text-white">
                        {{ email.email_id }}
                    </th>
                    <td class="px-6 py-4">
                        {{ email.email }}
                    </td>
                    <td class="px-6 py-4">
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
            //this.getData();
        }, 2000);
    },
    destroyed() {
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
