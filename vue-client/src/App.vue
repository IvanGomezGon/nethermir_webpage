<template>
<DarkModeSwitch />
<router-view :style="isDark? 'input:-webkit-autofill:active {}' : ''"/>
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

<script setup>
import { useDark } from '@vueuse/core'

const isDark = useDark();
const getColor = () => { return isDark.value ? '#ffffff' : '#000000' };
</script>

<style>
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active,
input:-webkit-autofill:visited,
input:-webkit-autofill:target{
    -webkit-background-clip: text;
    -webkit-text-fill-color: v-bind(getColor());
    transition: background-color 5000s ease-in-out 0s;

}
a, img {
   
    -webkit-user-drag: none;
    user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
}
</style>