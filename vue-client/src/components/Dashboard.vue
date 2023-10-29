<template>
    <SubHeader :titleName="$t('dashboard')"></SubHeader>
    <main class="pt-10 bg-slate-200 dark:bg-grey-700 h-[calc(100vh-150px)]">
        <div class=" xl:w-11/12 md:w-full sm:w-full w-full mx-auto px-8 xl:px-0">
            <TableGroups></TableGroups>
        </div>
    </main>
</template>

<script>
import SubHeader from "@/components/SubHeader.vue";
export default {
    name: "Dashboard",
    components: {
        SubHeader,
    },
};
</script>

