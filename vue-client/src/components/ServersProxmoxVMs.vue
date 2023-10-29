<template>
    <section class="">
        <div class="pb-8  max-w-2xl">
            <form action="#">
                <div class="grid gap-4 sm:grid-cols-2 sm:gap-">
                    <div>
                        <div for="category" class="block mb-2 text-sm font-medium text-grey-700 dark:text-white">
                            {{ $t("numServer") }}   
                        </div>
                        <select id="category" v-model="server"
                            class="bg-gray-50 border border-gray-300 text-grey-700 text-sm rounded-lg  focus:border-primary-500 block w-full p-2.5 dark:bg-grey-400 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark: dark:focus:border-primary-500">
                            <option value=0>Nethermir1</option>
                            <option value=1>Nethermir2</option>
                            <option value=2>Nethermir3</option>

                        </select>
                    </div>
                </div>
            </form>
        </div>
    </section>
</template>

<script>
export default {
    name: "ServersProxmoxVMs",
    data: function () {
        return {
            server: 0,
        };
    },
    watch: {
        server(){
            this.$emit('changeServer', this.server)
        }
    }
};
</script>