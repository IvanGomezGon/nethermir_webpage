<template>
    <header class="bg-slate-200	 dark:bg-grey-700 border-b-2 border-gray-300">
        <div class="mx-auto w-full xl:w-3/4 py-6 pl-8 xl:pl-0">
            <h1 class="text-3xl font-bold tracking-tight text-grey-700 dark:text-white">{{titleName}}</h1>
        </div>
    </header>
</template>

<script>
export default {
    name: "SubHeader",
    props: {titleName:""},
};
</script>

<style scoped></style>
