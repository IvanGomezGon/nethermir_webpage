<template>
    <LoginForm />
</template>

<script>
// @ is an alias to /src
import LoginForm from "@/components/LoginForm.vue";
import DarkModeSwitch from "@/components/DarkModeSwitch.vue";
export default {
    name: "Login",
    components: {
        LoginForm,
        DarkModeSwitch,
    },
};
</script>
