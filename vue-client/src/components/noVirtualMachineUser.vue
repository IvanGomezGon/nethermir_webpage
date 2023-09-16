<template>
    <section class="">
        <div class="px-4 mx-auto max-w-screen-xl lg:py-6 ">
            <div class="mx-auto  text-center">
                <h1 class="pb-4 mb-4 text-5xl tracking-tight font-extrabold lg:text-7xl text-primary-600 dark:text-primary-500">Màquina virtual no trobada</h1>
                <img src="../assets/VMnotFound.png" class="h-[300px] mx-auto">
                <p class="pt-4 mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">Ets nou aquí? Desplega el teu entorn virtualitzat!</p>
                <p class="mb-8 text-lg font-light text-gray-500 dark:text-gray-400">Fes click al botó inferior per començar el procès. Si ja has creat la teva màquina virtual i encara no pots accedir, contacta al teu professor. </p>
                <a href="#" @click="generateVM()" class="w-full text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-700 hover:active:bg-emerald-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Crear màquina virtual</a>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    methods: {
        generateVM() {
            fetch(`${process.env.VUE_APP_FETCH_URL}machine`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Content-Length': '0'
                },
                credentials: process.env.VUE_APP_FETCH_CREDENTIALS,
                body: null
            }).then();
        },
        
    }
}
</script>