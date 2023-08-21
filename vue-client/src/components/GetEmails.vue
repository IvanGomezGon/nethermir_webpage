<template>
<button class="logout corner">Eliminar taula</button>
<h2>Informació Usuaris</h2>
<table>
    <tr>
        <th>Usuari id</th>
        <th>Email</th>
        <th>Nom del grup</th>
        <th>Eliminar</th>
    </tr>

    <tr v-for="email in data">
        <td>{{ email.email_id }}</td>
        <td>{{ email.email }}</td>
        <td>{{ email.group_name }}</td>
        <td><button type="button" @click="eliminateEmail(email.email_id)">Eliminar</button></td>
    </tr>
</table>
</template>

<script>
export default {
    name: "GetEmails",
    data: function () {
        return {
            data: "",
        };
    },
    props: ["user", "password"],
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
