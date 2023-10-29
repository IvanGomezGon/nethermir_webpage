<template>
    <SubHeader :titleName="$t('dashboard')"></SubHeader>
    <main class="pt-10 bg-slate-200 dark:bg-grey-700 min-h-[calc(100vh-150px)] pb-8">
        <div class="md:mx-[70px] md:px-[70px] mx-[20px]">
            <TableGroup></TableGroup>
        </div>
    </main>
</template>

<script>
import SubHeader from "@/components/SubHeader.vue";
import TableGroup from "@/components/TableGroup.vue";
export default {
    name: "GetInfoVM",
    components: {
        SubHeader,
        TableGroup,
    },
};
</script>
