<template>
    <SubHeader :titleName="$t('courses')"></SubHeader>
    <main class="pt-10 bg-slate-200 dark:bg-grey-700 min-h-[calc(100vh-150px)] pb-8">
        <div class="md:mx-[70px] md:px-[70px] mx-[20px]">
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
