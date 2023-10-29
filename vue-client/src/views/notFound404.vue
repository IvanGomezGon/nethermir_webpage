<template>
    <nav class="bg-emerald-700">
        <div class="mx-auto w-full ">
            <div class="flex h-16 items-center justify-between">
                <div class="flex items-center ml-8 xl:ml-0">
                    <div class="flex-shrink-0">
                        <img class="h-8 " src="../assets/logo_uab_small.png" alt="UAB Logo" @click="logOut()">
                    </div>
                </div>
            </div>
        </div>


    </nav>

    <section class="bg-slate-200 dark:bg-grey-700 h-[100vh]">
        <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
            <div class="mx-auto  text-center">
                <h1
                    class="mb-4 mt-20 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">
                    {{ $t("404notFoundBig") }}</h1>
                <p class="mt-8 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
                    {{ $t("404notFoundMedium") }}
                </p>
                <p class="mt-2 text-lg font-light text-gray-500 dark:text-gray-400">
                    {{ $t("404notFoundSmall") }}    
                </p>
                <a href="#" @click="logOut()"
                    class="inline-flex text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-6">
                    {{ $t("404notFoundSmallLink") }} 
                </a>
        </div>
    </div>
</section>
</template>

<script>
export default {
    name: "notFound404",
    data: function () {
        return {
        }
    },
    methods: {
        logOut() {
            fetch(`${process.env.VUE_APP_FETCH_URL}cookie`, {
                method: 'DELETE',
                credentials: process.env.VUE_APP_FETCH_CREDENTIALS,
            }).then();
            this.$router.push("/");
        },
    },
};
</script>
