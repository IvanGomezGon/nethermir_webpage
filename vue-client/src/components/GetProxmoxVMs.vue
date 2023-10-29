<template>
    <SubHeader :titleName="$t('proxmox')"></SubHeader>
    <main class="pt-10 bg-slate-200 dark:bg-grey-700 min-h-[calc(100vh-150px)] pb-8">
        <div class="md:mx-[70px] md:px-[70px] mx-[20px]">
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
