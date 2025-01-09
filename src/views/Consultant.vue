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
            content: "",
            backgroundImageUrl: 'https://storage.googleapis.com/dbassistant/createddesigns/20250109151436.jpg',
            viewportHeight: window.innerHeight // Dynamic height calculation
        }
    },
    mounted() {
        // Adjust height on mount and on window resize
        this.adjustViewportHeight();
        window.addEventListener('resize', this.adjustViewportHeight);

        newThread().then((response) => {
            sessionStorage.setItem("thread_id", response.threadId);
            this.displayMessage(response, "assistant");
        });
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.adjustViewportHeight);
    },
    methods: {
        adjustViewportHeight() {
            // Dynamically adjust to avoid keyboard overlap issues
            this.viewportHeight = window.innerHeight;
        },
        displayMessage(messageData: MessageData, sender: string) {
            messageData.sender = sender;
            messageData.id = this.messages.length + 1;
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
            this.isFormDisabled = true;
            const messageData = this.createMessageData(this.content, "userInput", "user");
            this.content = "";
            newMessage(messageData).then((response) => {
                this.isFormDisabled = false;
                if (response.message.additional.designUrl !== '' && Object.keys(response.message.additional).length !== 0) {
                    this.backgroundImageUrl = response.message.additional.designUrl;
                }
                this.displayMessage(response, "assistant");
            });
        }
    }
};
</script>

<template>
    <div class="consultant" :style="{ height: `${viewportHeight}px` }">
        <div class="consultant__body">
            <div class="consultant__design" :style="{ backgroundImage: `url('${backgroundImageUrl}')` }"></div>
            <div class="chat-container">
                <div class="chat-box">
                    <MessageList :messages="messages" :message-style="'consultant-message'" />
                </div>
                <div class="consultant__form">
                    <EInput :class="{ 'consultant__input': true }" :is-form-disabled="isFormDisabled" v-model="content"
                        :placeholder="'Type a message...'" />
                    <EButton :class="{ 'consultant__btn-send': true }" :title="'Send'" @click="sendMessage"
                        :is-form-disabled="isFormDisabled" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.consultant {
    display: flex;
    flex-direction: column;
}

.consultant__redesign {}

.consultant__design {
    background-color: #f6f6f6;
    height: 300px;
    width: 100%;
    background-size: cover;
    background-position: center;
    flex-shrink: 0;
    position: relative;
}

.consultant__body {
    display: flex;
    flex-direction: column;
    height: 100%;
    margin: 0 auto;
    max-width: 600px;
    background-color: #fff;
    overflow: hidden;
}

.consultant__form {
    display: flex;
    gap: 15px;
    flex-shrink: 0;
    padding: 10px 0;
}

.chat-container {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    background-color: white;
    padding: 15px;
    border-radius: 0px 0px 8px 8px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.chat-box {
    overflow-y: auto;
    flex-grow: 1;
    border-bottom: 1px solid #ccc;
    margin-bottom: 15px;
    height: auto;
}
</style>
