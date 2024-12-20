<script lang="ts">
import MessageForm from '@/components/MessageForm.vue';
import MessageList from '@/components/MessageList.vue';
import axios from 'axios';


export default {
    components: { MessageList, MessageForm },
    data() {
        return {
            messages: [{}]
        }
    },
    mounted() {
        // chat initialisation: creating threadId
        axios.post("https://us-central1-startupcloudvision.cloudfunctions.net/main/newThread").then((response) => {
            sessionStorage.setItem("thread_id", response.data.threadId);
            this.displayMessage(response.data.message.content, "assistant");
        })
    },
    methods: {
        displayMessage(content: string, type: string) {
            this.messages.push({ content: content, type: type })
        },
        sendMessage(message: string) {
            this.displayMessage(message, 'user')
            const threadId = sessionStorage.getItem("thread_id");
            const body = JSON.stringify({
                threadId: threadId,
                message: {
                    content: message,
                    additional: "",
                    messageType: "userInput"
                }
            })

            axios.post("https://us-central1-startupcloudvision.cloudfunctions.net/main/newMessage", body, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => {
                this.displayMessage(response.data.message.content, "assistant");
            })
        }
    },
}
</script>

<template>
    <div class="consultant__body">
        <div class="chat-container">
            <div class="chat-box">
                <MessageList :messages="messages" />
            </div>
            <MessageForm @click="sendMessage" />
        </div>
    </div>
</template>

<style scoped>
.consultant__body {
    font-family: Arial, sans-serif;
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
