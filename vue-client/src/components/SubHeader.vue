<template>
    <header class="bg-slate-200	 dark:bg-gray-900 border-b-2 border-gray-300">
        <div class="mx-auto w-3/4 py-6">
            <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{{titleName}}</h1>
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
