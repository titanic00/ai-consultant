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
        <MessageItem v-for="message in messages" :key="message.id" :message="message" />
    </div>
</template>

<style scoped></style>
