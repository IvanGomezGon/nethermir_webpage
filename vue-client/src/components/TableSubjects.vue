<template>
    <div class="flex justify-center items-center overflow-x-auto shadow-md sm:rounded-lg">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
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
                <tr v-for="subject in data"
                    class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {{ subject.idsubject < 10 ? "0" + subject.idsubject : subject.idsubject }}
                    </th>
                    <td class="px-6 py-4">
                        {{ subject.subject_name }}
                    </td>
                    <td class="px-6 py-4">
                        {{ subject.active ? "Cert" : "Fals" }}
                    </td>
                    <td class="px-6 py-4 text-right">
                        <a href="#" @click="activateSubject(subject.idsubject)"
                            class="font-medium text-green-600 hover:underline dark:text-green-600">{{ subject.active ? "Desactivar" : "Activar" }}</a>
                    </td>
                    <td class="px-6 py-4 text-right">
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
                fetch(`${process.env.VUE_APP_FETCH_URL}getSubjects`).then(resolve);
            });
            p.then((response) => {
                response.json().then((json) => {
                    console.log(json);
                    this.data = json;
                });
            });
        },
        eliminateSubject(id) {
            fetch(`${process.env.VUE_APP_FETCH_URL}eliminateSubject?id=${id}`, {
                credentials: process.env.VUE_APP_FETCH_CREDENTIALS
            }).then();
        },
        activateSubject(id) {
            fetch(`${process.env.VUE_APP_FETCH_URL}activateSubject?id=${id}`, {
                credentials: process.env.VUE_APP_FETCH_CREDENTIALS
            }).then();
        },
    },
};
</script>