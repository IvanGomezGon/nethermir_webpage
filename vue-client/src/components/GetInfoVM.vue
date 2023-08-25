<template>
<button class="corner" @click="generateVM()">Generar Màquina Virtual</button>
<h2>Informació VM</h2>
<table>
    <tr>
        <th>VM id</th>
        <th>Nom</th>
        <th>CPU</th>
        <th>Estat</th>
        <th>Uptime</th>
        <th>Encendre VM</th>
        <th>Resumir VM</th>
        <th>Suspendre VM</th>
    </tr>

    <tr class="userTable" :style="'color: ' + getColor(statusVM, cpuVM)">
        <td>{{ idVM }}</td>
        <td>{{ nameVM }}</td>
        <td>{{ (cpuVM * 100).toFixed(2) + "%" }}</td>
        <td>{{ statusVM == "stopped" ? "Stopped" : cpuVM < 0.005 ? "Corrent (Pausat)" : "Corrent" }}</td>
        <td>{{ uptimeVM }}</td>
        <td><button type="button" @click="activateVM()" style="width: 11vw" :disabled="statusVM != 'stopped'">Start</button></td>
        <td style="display: flex; justify-content: center; align-items: center">
            <fieldset style="width: 10vw">
                <legend>Hores:</legend>
                <input type="number" v-model="hours" min="1" max="6" style="width: 10vw" />
            </fieldset>
            <button type="button" @click="resumeVM()" style="width: 11vw" :disabled="statusVM == 'stopped' || cpuVM > 0.005">Resume</button>
        </td>
        <td><button type="button" @click="suspendVM()" style="width: 11vw" :disabled="statusVM == 'stopped' || cpuVM < 0.005">Suspend</button></td>
    </tr>
</table>
</template>

<script>
export default {
    name: "GetInfoVM",
    data: function () {
        return {
            idVM: 0,
            nameVM: 0,
            cpuVM: 0,
            statusVM: "stopped", 
            uptimeVM: 0,
            hours: 4,
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
                fetch(`${process.env.VUE_APP_FETCH_URL}getNode`, {
                    credentials: process.env.VUE_APP_FETCH_CREDENTIALS
                }).then(resolve);
            });
            p.then((response) => {
                response.json().then((json) => {
                    if (json != null) {
                        this.idVM = json.vmid 
                        this.nameVM = json.name 
                        this.cpuVM = json.cpu
                        this.statusVM = json.status 
                        this.uptimeVM = json.uptime = 0
                    }
                });
            });
        },
        generateVM() {
            fetch(`${process.env.VUE_APP_FETCH_URL}generateMachine`, {
                credentials: process.env.VUE_APP_FETCH_CREDENTIALS
            }).then();
        },
        activateVM(id) {
            fetch(`${process.env.VUE_APP_FETCH_URL}activateMachine`, {
                credentials: process.env.VUE_APP_FETCH_CREDENTIALS
            }).then();
        },
        resumeVM() {
            if (this.hours > 0 && this.hours < 7) {
                fetch(`${process.env.VUE_APP_FETCH_URL}resumeMachine?hours=${this.hours}`, {
                    credentials: process.env.VUE_APP_FETCH_CREDENTIALS
                }).then();
            }
        },
        suspendVM() {
            fetch(`${process.env.VUE_APP_FETCH_URL}suspendMachine`, {
                credentials: process.env.VUE_APP_FETCH_CREDENTIALS
            }).then();
        },
        getColor(status, cpu) {
            return status == "stopped" ? "red" : cpu < 0.005 ? "orange" : "green";
        },
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped></style>
