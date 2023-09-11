<template>
    <SubHeader :titleName="'Proxmox Màquines virtuals'"></SubHeader>
    <main class="pt-10 bg-slate-200 dark:bg-grey-700 min-h-[calc(100vh-150px)] pb-8">
        <div class="xl:w-3/4 md:w-full sm:w-full w-full mx-auto px-8 xl:px-0">
            <ServersProxmoxVMs @changeServer="(n) => server = n"></ServersProxmoxVMs>
            <TableProxmoxVMs :server="server"></TableProxmoxVMs>
        </div>
    </main>
</template>

<script>
import ServersProxmoxVMs from "@/components/ServersProxmoxVMs.vue";
import TableProxmoxVMs from "@/components/TableProxmoxVMs.vue";
import SubHeader from "@/components/SubHeader.vue";

export default {
    name: "GetProxmoxVMs",
    data: function () {
        return {
            server: 1,
        };
    },
    components: {
        TableProxmoxVMs,
        ServersProxmoxVMs,
        SubHeader,
    },
};
</script>

<style scoped></style>
