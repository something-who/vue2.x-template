<template>
    <div class="container">
        <v-header></v-header>
        <router-view></router-view>
    </div>
</template>

<script>
import VHeader from './components/Header.vue'

export default {
    components: {
        VHeader
    }
}
</script>

<style scoped lang="scss">
.container {
}
</style>
