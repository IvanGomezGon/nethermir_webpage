<template>
    <header class="bg-slate-200	 dark:bg-grey-700 border-b-2 border-gray-300">
        <div class="mx-auto w-full  py-6 md:pl-[140px] pl-[20px]">
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
