<script lang="ts">
import MessageForm from '@/components/MessageForm.vue';
import MessageList from '@/components/MessageList.vue';
import type MessageData from '@/models/MessageData';
import axios from 'axios';

export default {
    components: { MessageList, MessageForm },
    data() {
        return {
            messages: [] as MessageData[]
        }
    },
    mounted() {
        // Chat initialization: creating threadId
        // Sentences to test the bot:
        // Hallo, mach mir ein Sneaker Design: rote und grüne Farben, sportlich, Brands sind mir egal
        // Bin damit zufrieden, zeig mir matches
        axios.post("https://us-central1-startupcloudvision.cloudfunctions.net/main/newThread").then((response) => {
            sessionStorage.setItem("thread_id", response.data.threadId);
            this.displayMessage(response.data, "assistant");
        });
    },
    methods: {
        displayMessage(messageData: MessageData, sender: string) {
            // format the text: delete sentence that include a link and words like 'follow the link'
            // the link will be pushed at the end of message in MessageItem Component
            if (messageData.message.type === 'create' || messageData.message.type === 'match') {
                const regex = /\s*\[.*?\]\(.*?\)\s*/g;
                messageData.message.content.replace(regex, ' ').trim()
            }
            messageData.sender = sender
            this.messages.push(messageData);
        },
        createMessageData(content: string, contentType: string, sender: string) {
            const threadId = sessionStorage.getItem("thread_id") || "";
            const messageData = {
                message: {
                    additional: {},
                    content: content,
                    type: contentType
                },
                threadId: threadId,
                sender: sender
            };
            this.displayMessage(messageData, "user");

            return messageData;
        },
        sendMessage(content: string) {
            const messageData = this.createMessageData(content, "userInput", "user");
            axios.post("https://us-central1-startupcloudvision.cloudfunctions.net/main/newMessage", messageData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => {
                this.displayMessage(response.data, "assistant");
            });
        }
    }
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
    height: 500px;
    overflow-y: scroll;
    border-bottom: 1px solid #ccc;
    margin-bottom: 20px;
    padding: 10px;
}
</style>
