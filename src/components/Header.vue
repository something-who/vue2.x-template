<template>
    <div class="header">
        <router-link to="/" class="link">home</router-link>
        <router-link to="/trade" class="link">trade</router-link>
        <router-link to="/user" class="link">user</router-link>
    </div>
</template>

<script>
export default {
    name: 'VHeader'
}
</script>

<style lang="scss" scoped>
.header {
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid #333;
    .link {
        float: left;
        display: block;
        padding: 0 20px;
        &.active {
            color:aquamarine;
        }
        &:hover {
            background: pink;
        }
    }
}
</style>