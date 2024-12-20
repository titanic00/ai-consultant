<script lang="ts">

export default {
    props: ['message']
}
</script>

<template>
    <div class="message-item__body">
        <div :class="`message ${message.type}`">{{ message.content }}</div>
    </div>
</template>

<style scoped>
.message {
    padding: 5px;
    margin: 5px 0;
}

.message.user {
    background-color: #d1f7ff;
    text-align: right;
}

.message.assistant {
    text-align: left;
    background-color: #f0f0f0;
    border-radius: 10px;
    padding: 10px;
    margin: 5px 0;
}
</style>
