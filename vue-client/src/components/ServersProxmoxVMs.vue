<template>
    <section class="bg-white dark:bg-gray-900">
        <div class="pb-8  max-w-2xl">
            <form action="#">
                <div class="grid gap-4 sm:grid-cols-2 sm:gap-">
                    <div>
                        <label for="category"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Servidor Proxmox</label>
                        <select id="category"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                            <option selected="Nethermir1">Nethermir1</option>
                            <option value="Nethermir2">Nethermir2</option>
                            <option value="Nethermir3">Nethermir3</option>

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
        };
    },
};
</script>