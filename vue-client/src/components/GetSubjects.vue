<template>
    <SubHeader :titleName="'Base de dades - Assignatures'"></SubHeader>
    <main class="pt-10 bg-slate-200 dark:bg-grey-700 min-h-[calc(100vh-150px)] pb-8">
        <div class="xl:w-3/4 md:w-full sm:w-full w-full mx-auto px-8 xl:px-0 ">
            <FormSubjects @added="fetch = !fetch"></FormSubjects>
            <TableSubjects :fetch="fetch"></TableSubjects>
        </div>
    </main>
</template>

<script>
import TableSubjects from "@/components/TableSubjects.vue";
import FormSubjects from "@/components/FormSubjects.vue";
import SubHeader from "@/components/SubHeader.vue";
export default {
    name: "GetSubjects",
    data: () => {
        return {
            fetch: false,
        }
    },
    components: {
        TableSubjects,
        FormSubjects,
        SubHeader,
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped></style>
