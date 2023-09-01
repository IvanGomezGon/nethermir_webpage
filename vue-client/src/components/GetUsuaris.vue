<template>
    <SubHeader :titleName="'Base de dades - Usuaris'"></SubHeader>
    <main class="pt-10 bg-white dark:bg-gray-900 h-[calc(100vh-148px)]">
        <div class="xl:w-3/4 md:w-full sm:w-full w-full mx-auto">
            <TableEmails></TableEmails>
        </div>
    </main>
</template>

<script>
import TableEmails from "@/components/TableEmails.vue";
import SubHeader from "@/components/SubHeader.vue";

export default {
    name: "GetEmails",
    components: {
        TableEmails,
        SubHeader,
    },
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped></style>
