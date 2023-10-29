<template>
    <SubHeader :titleName="$t('users')"></SubHeader>
    <main class="pt-10 bg-slate-200 dark:bg-grey-700 min-h-[calc(100vh-150px)] pb-8">
        <div class=" md:mx-[70px] md:px-[70px] mx-[20px]">
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
