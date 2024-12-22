<script lang="ts">
import { newMessage, newThread } from '@/api/MessageClient';
import EButton from '@/components/EButton.vue';
import EInput from '@/components/EInput.vue';
import MessageList from '@/components/MessageList.vue';
import type MessageData from '@/models/MessageData';

export default {
    components: { MessageList, EButton, EInput },
    data() {
        return {
            messages: [] as MessageData[],
            isFormDisabled: false,
            content: ""
        }
    },
    mounted() {
        // Chat initialization: creating threadId
        // Sentences to test the bot:
        // Hallo, mach mir ein Sneaker Design: rote und grüne Farben, sportlich, Brands sind mir egal
        // Bin damit zufrieden, zeig mir matches
        newThread().then((response) => {
            sessionStorage.setItem("thread_id", response.threadId);
            this.displayMessage(response, "assistant");
        });
    },
    methods: {
        displayMessage(messageData: MessageData, sender: string) {
            // format the text: delete sentence that include a link and words like 'follow the link'
            // the link will be pushed at the end of message in MessageItem Component
            if (messageData.message.type === 'create' || messageData.message.type === 'match') {
                const regex = /(?<=[.!?]\s|^)[^.!?]*\[.*?\]\(https?:\/\/[^\s]+\)[^.!?]*[.!?]/g;
                messageData.message.content.replace(regex, ' ').trim()
            }
            messageData.sender = sender
            messageData.id = this.messages.length + 1
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
        sendMessage() {
            this.isFormDisabled = true
            const messageData = this.createMessageData(this.content, "userInput", "user");
            newMessage(messageData).then((response) => {
                this.isFormDisabled = false
                this.displayMessage(response, "assistant");
            });
        }
    }
}
</script>

<template>
    <div class="consultant__body">
        <div class="chat-container">
            <div class="chat-box">
                <MessageList :messages="messages" :message-style="'consultant-message'" />
            </div>
            <div class="consultant__form">
                <EInput :class="{ 'consultant__input': true }" :is-form-disabled="isFormDisabled"
                    v-model:input="content" :placeholder="'Type a message...'" />
                <EButton :class="{ 'consultant__btn-send': true }" :title="'Send'" @click="sendMessage"
                    :is-form-disabled="isFormDisabled" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.consultant__form {
    display: flex;
    gap: 15px
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
