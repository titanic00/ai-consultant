<script lang="ts">
import MessageForm from '@/components/MessageForm.vue';
import MessageList from '@/components/MessageList.vue';


export default {
    components: { MessageList, MessageForm },
    data() {
        return {
            messages: [
                {
                    content: 'Test message',
                    type: 'assistant'
                }
            ]
        }
    },
    methods: {}
}
</script>

<template>
    <div class="consultant__body">
        <div class="chat-container">
            <div class="chat-box">
                <MessageList :messages="messages" />
            </div>
            <MessageForm />
        </div>
    </div>
</template>

<style scoped>
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f7f7f7;
}

.chat-container {
    width: 100%;
    max-width: 600px;
    margin: 50px auto;
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.chat-box {
    height: 300px;
    overflow-y: scroll;
    border-bottom: 1px solid #ccc;
    margin-bottom: 20px;
    padding: 10px;
}
</style>
