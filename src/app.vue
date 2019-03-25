<template>
    <div id="app" class="container">
        {{ message }}
        <p class="text">1111</p>
    </div>
</template>

<script>
export default {
    data() {
        return {
            message: 'tang2'
        }
    }
}
</script>

<style scoped lang="scss">
.container {
    color: pink;
    .text {
        color: red;
    }
}
</style>
