<template>
    <div class="flex items-center overflow-x-auto shadow-md rounded-lg">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-grey-400 uppercase bg-gray-50 dark:bg-grey-400 dark:text-gray-400">
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
                    class="bg-white border-b dark:bg-grey-600 -700 dark:border-grey-400 hover:bg-gray-50 dark:hover:bg-grey-500">
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
        async getData() {
            let response = await fetch(`${process.env.VUE_APP_FETCH_URL}subjects`)
            response.json().then((json) => {
                console.log(json);
                this.data = json;
            });
        },

        eliminateSubject(subjectID) {
            fetch(`${process.env.VUE_APP_FETCH_URL}eliminateSubject?subjectID=${subjectID}`, {
                method: 'DELETE',
                credentials: process.env.VUE_APP_FETCH_CREDENTIALS,
            }).then();
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