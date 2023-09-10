<template>
    <SubHeader :titleName="'Base de dades - Usuaris'"></SubHeader>
    <main class="pt-10 bg-slate-200 white dark:bg-grey-700 h-[calc(100vh-150px)] ">
        <div class="xl:w-3/4 md:w-full sm:w-full w-full mx-auto px-8 xl:px-0">
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
