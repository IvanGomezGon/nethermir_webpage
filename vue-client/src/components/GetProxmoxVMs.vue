<template>
    <SubHeader :titleName="'Proxmox Màquines virtuals'"></SubHeader>
    <main class="pt-10 bg-white dark:bg-grey h-[calc(100vh-148px)]">
        <div class="xl:w-3/4 md:w-full sm:w-full w-full mx-auto">
            <ServersProxmoxVMs></ServersProxmoxVMs>
            <TableProxmoxVMs></TableProxmoxVMs>
        </div>
    </main>
</template>

<script>
import ServersProxmoxVMs from "@/components/ServersProxmoxVMs.vue";
import TableProxmoxVMs from "@/components/TableProxmoxVMs.vue";
import SubHeader from "@/components/SubHeader.vue";

export default {
    name: "GetProxmoxVMs",
    components: {
        TableProxmoxVMs,
        ServersProxmoxVMs,
        SubHeader,
    },
};
</script>

<style scoped></style>
