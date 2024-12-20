<script lang="ts">
import MessageItem from './MessageItem.vue';


export default {
    components: { MessageItem },
    props: [
        'messages'
    ]
}
</script>

<template>
    <div class="message-list__body">
        <MessageItem v-for="messageData in messages" :key="messageData.id" :messageData="messageData" />
    </div>
</template>

<style scoped></style>
