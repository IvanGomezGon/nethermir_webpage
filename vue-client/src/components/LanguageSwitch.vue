<template>
    <div>
        <select v-model="language" style="-webkit-appearance:menulist-button; -moz-appearance:none; padding-left: 4px"
            class="hover:bg-gray-200 active:hover:bg-gray-300 active:bg-gray-200 dark:hover:bg-grey-500 dark:active:bg-grey-500 dark:active:hover:bg-grey-600 font-bold absolute top-3 right-[52px] h-10   bg-gray-50 border border-bg-gray-50 text-grey-700 text-sm rounded-l-lg focus:ring-emerald-500 focus:border-emerald-500 block  dark:bg-grey-400 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500">
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