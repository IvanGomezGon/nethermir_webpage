<template>
    <div>
        <select v-model="language"
            class="hover:bg-gray-200 active:hover:bg-gray-300 active:bg-gray-200 dark:hover:bg-gray-700 dark:active:bg-gray-700 dark:active:hover:bg-gray-600 font-bold absolute top-3 right-[99px] md:right-[52px] p-[8.6px]   bg-gray-50 border border-bg-gray-50 text-grey-700 text-sm rounded-l-lg focus:ring-emerald-500 focus:border-emerald-500 block  dark:bg-grey-400 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500">
            <option v-for="locale in this.$i18n.availableLocales" > 
                <span>{{ locale }}</span>
            </option>
        </select>
    </div>

</template>


<script>
export default {
    data: function () {
        return {
            language: this.$i18n.locale
        }
    },
    watch: {
        language(newVal){
            this.$i18n.locale = newVal;
        },
        '$i18n.locale': function(newVal) {
        localStorage.setItem('last-locale', newVal)
        }
    }
}
</script>