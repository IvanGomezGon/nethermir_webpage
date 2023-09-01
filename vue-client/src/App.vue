<template>
<DarkModeSwitch />
<router-view />
</template>
<script>
// @ is an alias to /src
import DarkModeSwitch from "@/components/DarkModeSwitch.vue";
export default {
    name: "App.vue",
    components: {
        DarkModeSwitch,
    },
};
</script>