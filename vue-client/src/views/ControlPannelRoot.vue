<template>
    <div v-if="render">
        <div :class="showModalWarning ? 'blur h-screen ' : 'h-screen'">
            <HeaderRoot @deleteDB="showModalWarning = true;">
            </HeaderRoot>
            <router-view></router-view>
            
        </div>
        <ModalWarning v-if="showModalWarning" @goBack="showModalWarning = false;" @resetDB ="showModalWarning = false;">
        </ModalWarning>
    </div>

</template>

<script>
// @ is an alias to /src
import HeaderRoot from "@/components/HeaderRoot.vue";
import ModalWarning from "@/components/ModalWarning.vue";
export default {
    name: "ControlPannelRoot",
    data: () => {
        return {
            active: "",
            render: false,
            showModalWarning: false,
        };
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
    components: {
        HeaderRoot,
        ModalWarning,
    },
};
</script>
