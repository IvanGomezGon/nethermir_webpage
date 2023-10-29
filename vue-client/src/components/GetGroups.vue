<template>
    <SubHeader :titleName="$t('groups')"></SubHeader>
    <main class="pt-10 bg-slate-200 dark:bg-grey-700 min-h-[calc(100vh-150px)] pb-8">
        <div class="md:mx-[70px] md:px-[70px] mx-[20px]">
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
