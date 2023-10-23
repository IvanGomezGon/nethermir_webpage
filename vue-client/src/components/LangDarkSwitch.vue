<template>
    <div >
        <DarkModeSwitch />
        <LanguageSwitch />


    </div>
</template>


<script>
import DarkModeSwitch from "@/components/DarkModeSwitch.vue";
import LanguageSwitch from "@/components/LanguageSwitch.vue";
export default {
    name: "App.vue",
    components: {
        DarkModeSwitch,
        LanguageSwitch,

    },
};

</script>