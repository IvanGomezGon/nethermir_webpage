<template>
<div class="flex-container" v-if="render">
    <div class="inner-element" style="width: 50vw">
        <RestartDatabase />
    </div>
</div>
</template>

<script>
// @ is an alias to /src
import RestartDatabase from "@/components/RestartDatabase.vue";

export default {
    name: "RestartDatabaseRoot",
    data: () => {
        return {
            render: false,
        };
    },
    components: {
        RestartDatabase,
    },
    // TODO: Change this for Router Navigation guards
    // https://stackoverflow.com/questions/69148784/stop-vue-page-from-loading-till-data-fetch-is-loaded
    beforeCreate: function () {
        fetch(`${process.env.VUE_APP_FETCH_URL}checkCookie`, {
            credentials: process.env.VUE_APP_FETCH_CREDENTIALS
        }).then((response) => {
            response.text().then((text) => {
                if (text != "root") {
                    this.$router.push("/");
                } else {
                    this.render = true;
                }
            });
        });
    },
};
</script>
