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
            viewportHeight: window.innerHeight,
            extractedObjects: [] as { key: string; values: string[]; selected: string }[],
            selectedValues: [] as string[],
            reworkedPrompt: '',
            openDropdown: null as number | null,
            fullPrompt: '',
            processedPrompt: [] as Array<string | { key: string; values: string[]; selected: string }>
        }
    },
    // test message: Mach mir ein Sneakerdesign, die sollen rot und im Retrostil sein, die Marke ist Balenciaga
    mounted() {
        this.adjustViewportHeight();
        window.addEventListener('resize', this.adjustViewportHeight);

        newThread().then((response) => {
            sessionStorage.setItem("thread_id", response.threadId);
            this.displayMessage(response, "assistant");
        });
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.adjustViewportHeight);
    },
    methods: {
        generateUpdatedPrompt() {
            let updatedPrompt = this.processedPrompt.map(item => {
                if (typeof item === 'object') {
                    return item.selected;
                }
                return item;
            }).join('');

            return 'Can you create a design based on the following prompt? - ' + updatedPrompt;
        },
        toggleDropdown(index: number) {
            this.openDropdown = this.openDropdown === index ? null : index;
        },
        selectOption(index: number, option: string) {
            if (typeof this.processedPrompt[index] === 'object') {
                (this.processedPrompt[index] as unknown as { selected: string }).selected = option;
            }
            setTimeout(() => {
                this.openDropdown = null;
            }, 100);
        },
        adjustViewportHeight() {
            this.viewportHeight = window.innerHeight;
        },
        extractObjects(jsonData: MessageData) {
            this.processedPrompt = []
            this.fullPrompt = ''
            this.selectedValues = []

            const reworkedPrompt = jsonData.message.additional.reworkedPrompt;
            this.reworkedPrompt = reworkedPrompt;
            const pattern = /(\{.*?\})|([^{}]+)/g;
            const matches = reworkedPrompt.match(pattern);

            if (matches) {
                this.processedPrompt = matches.map((match: string) => {
                    if (match.startsWith('{') && match.endsWith('}')) {
                        const obj = JSON.parse(match.replace(/'/g, '"'));
                        const key = Object.keys(obj)[0];
                        const values = obj[key];
                        return { key, values, selected: values[0] };
                    }
                    return match;
                });
                this.extractedObjects = this.processedPrompt.filter(item => typeof item === 'object') as unknown as { key: string, values: string[], selected: string }[];
            }
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

                if (response.message.additional.reworkedPrompt !== '' && Object.keys(response.message.additional).length !== 0) {
                    this.reworkedPrompt = response.message.additional.reworkedPrompt;
                    this.extractObjects(response);
                }
                this.displayMessage(response, "assistant");
            }).catch(error => {
                this.isFormDisabled = false;
            })
        },
        sendReworkedPromptAsContent() {
            const updatedPrompt = this.generateUpdatedPrompt();
            this.content = updatedPrompt
            this.sendMessage()
        }
    }
};
</script>

<template>
    <div class="consultant" :style="{ height: `${viewportHeight}px` }">
        <div class="consultant__body">
            <div class="consultant__design">
                <div class="consultant__sneakers-img" :style="{ backgroundImage: `url('${backgroundImageUrl}')` }">
                </div>
                <div class="consultant__settings" v-if="extractedObjects.length !== 0">
                    <div class="full-prompt">
                        <template v-for="(item, index) in processedPrompt" :key="index">
                            <span v-if="typeof item === 'string'">{{ item }}</span>
                            <span v-else class="dropdown-placeholder" @click="toggleDropdown(index)">
                                {{ item.selected }}
                                <div class="select-items" v-show="openDropdown === index">
                                    <div v-for="option in item.values" :key="option"
                                        @click="selectOption(index, option)">
                                        {{ option }}
                                    </div>
                                </div>
                            </span>
                        </template>
                    </div>
                    <EButton :title="'Generate'" :class="{ 'consultant__btn-generate': true }"
                        @click="sendReworkedPromptAsContent" :is-form-disabled="isFormDisabled" />
                </div>
            </div>
            <div class="chat-container">
                <div class="chat-box">
                    <MessageList :messages="messages" :message-style="'consultant-message'" />
                </div>
                <div class="consultant__form">
                    <EInput :class="{ 'consultant__input': true }" :is-form-disabled="isFormDisabled" v-model="content"
                        :placeholder="'Type a message...'" />
                    <EButton :class="{ 'consultant__btn-send': true }" :title="'Send'" @click="sendMessage"
                        :is-form-disabled="isFormDisabled || content.length == 0" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.dropdown-placeholder {
    position: relative;
    display: inline-block;
    background-color: #583120;
    color: #F3D0EE;
    padding: 4px 30px 4px 12px;
    border-radius: 15px;
    cursor: pointer;
    margin-bottom: 1px;
}

.dropdown-placeholder::after {
    content: '';
    background-image: url('/consultant/down-arrow.png');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    position: absolute;
    width: 14px;
    height: 14px;
    right: 10px;
    bottom: 8px;
    display: block;
}

.dropdown-placeholder .select-items {
    position: absolute;
    top: 100%;
    left: 0;
    border: 1px solid #ddd;
    border-radius: 10px 10px 4px 4px;
    z-index: 100;
    background-color: #583120;
}

.dropdown-placeholder .select-items div {
    padding: 5px 10px;
    cursor: pointer;
    color: #F3D0EE;
}

.dropdown-placeholder .select-items div:hover {}

.consultant__selects {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
}

.custom-select {
    position: relative;
}

.select-items {
    position: absolute;
    background-color: #f9f9f9;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 99;
    border: 1px solid #ddd;
    border-radius: 0 0 4px 4px;
    max-height: 200px;
    overflow-y: auto;
}

.select-items div {
    padding: 8px;
    cursor: pointer;
}

.select-items div:hover {
    background-color: #7a7a7a;
}

.consultant__settings {
    background-color: #fff;
    width: 100%;
    height: auto;
    margin: 0px auto;
    border-radius: 10px;
    border: 1px solid #EEABE4;
    gap: 10px;
    padding: 10px;
    display: flex;
    flex-direction: column;
}

.consultant {
    display: flex;
    flex-direction: column;
}

.consultant__design {
    /* background-color: #F3ECE4; */
}

.consultant__sneakers-img {
    height: 300px;
    width: 100%;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    flex-shrink: 0;
    position: relative;
    background-color: #eeeeee;
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
    padding: 10px;
}

.chat-container {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    background-color: white;
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
