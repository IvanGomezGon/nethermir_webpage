<template>
    <SubHeader :titleName="'Base de dades - Grups'"></SubHeader>
    <main class="pt-10 bg-white dark:bg-grey h-[calc(100vh-148px)]">
        <div class="xl:w-3/4 md:w-full sm:w-full w-full mx-auto">
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
