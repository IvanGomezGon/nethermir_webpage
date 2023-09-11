<template>
    <SubHeader :titleName="'Base de dades - Grups'"></SubHeader>
    <main class="pt-10 bg-slate-200 dark:bg-grey-700 min-h-[calc(100vh-150px)] pb-8">
        <div class="xl:w-3/4 md:w-full sm:w-full w-full mx-auto px-8 xl:px-0">
            <TableGroups></TableGroups>
        </div>
    </main>
</template>

<script>
import TableGroups from "@/components/TableGroups.vue";
import SubHeader from "@/components/SubHeader.vue";

export default {
    name: "GetGroups",
    components: {
        TableGroups,
        SubHeader,
    },
};
</script>

<style scoped></style>
