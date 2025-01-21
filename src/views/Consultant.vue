<script lang="ts">
import { downloadImg, newMessage, newThread } from '@/api/MessageClient';
import EButton from '@/components/EButton.vue';
import EInput from '@/components/EInput.vue';
import MessageList from '@/components/MessageList.vue';
import type MessageData from '@/models/MessageData';
import { KJUR } from 'jsrsasign';

type PromptItem = string | { key: string; values: string[]; selected: string };

export default {
    components: { MessageList, EButton, EInput },
    data() {
        return {
            messages: [] as MessageData[],
            isFormDisabled: false,
            content: "",
            backgroundImageUrl: 'https://storage.googleapis.com/dbassistant/createddesigns/20250109151436.jpg',
            viewportHeight: window.innerHeight,
            extractedObjects: [] as Array<PromptItem>,
            selectedValues: [] as string[],
            reworkedPrompt: '',
            openDropdown: null as number | null,
            fullPrompt: '',
            processedPrompt: [] as Array<PromptItem>,
            accessToken: ''
            // fileName: '138852011-16492.jpg',
        }
    },
    // test message: Erstelle mir ein Sneakerdesign, die sollen rot und im Retrostil sein, Marke ist Balenciaga
    mounted() {
        this.adjustViewportHeight();
        window.addEventListener('resize', this.adjustViewportHeight);

        this.getAccessToken()

        newThread().then((response) => {
            sessionStorage.setItem("thread_id", response.threadId);
            this.displayMessage(response, "assistant");
        });
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.adjustViewportHeight);
    },
    methods: {
        async getAccessToken() {
            const privateKey = import.meta.env.VITE_PRIVATE_KEY;
            const clientEmail = import.meta.env.VITE_CLIENT_EMAIL;

            const header = {
                alg: 'RS256',
                typ: 'JWT'
            };

            const now = Math.floor(Date.now() / 1000);
            const claim = {
                iss: clientEmail,
                scope: 'https://www.googleapis.com/auth/cloud-platform',
                aud: 'https://oauth2.googleapis.com/token',
                exp: now + 3600,
                iat: now
            };

            const sHeader = JSON.stringify(header);
            const sPayload = JSON.stringify(claim);
            const sJWT = KJUR.jws.JWS.sign('RS256', sHeader, sPayload, privateKey);

            const response = await fetch('https://oauth2.googleapis.com/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${sJWT}`
            })

            this.accessToken = await response.json();
        },
        async downloadFile(fileName: string) {
            const bucketName = import.meta.env.VITE_BUCKET_NAME;

            downloadImg(this.accessToken, bucketName, fileName).then((response) => {
                return URL.createObjectURL(response);
            })
        },
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
        },
        getOptions(): string[] {
            if (this.openDropdown !== null && this.processedPrompt[this.openDropdown] && typeof this.processedPrompt[this.openDropdown] === 'object') {
                const item = this.processedPrompt[this.openDropdown] as { key: string; values: string[]; selected: string };
                return item.values;
            }
            return [];
        }
    },
    computed: {
        dropdownStyles() {
            if (this.openDropdown === null) return {};
            const rect = (this.$refs.fullPrompt as HTMLElement)?.children[this.openDropdown]?.getBoundingClientRect();
            if (!rect) return {};
            return {
                top: `${rect.bottom + window.scrollY}px`,
                left: `${rect.left + window.scrollX}px`,
                width: `${rect.width}px`
            };
        }
    }
};
</script>

<template>
    <div class="consultant" :style="{ height: `${viewportHeight}px` }">
        <div class="consultant__body">
            <div class="consultant__design">
                <div class="consultant__sneakers">
                    <div class="consultant__sneakers-img" :style="{ backgroundImage: `url(${backgroundImageUrl})` }">
                    </div>
                    <div class="consultant__settings" v-if="extractedObjects.length !== 0">
                        <div :class="openDropdown === null ? 'full-prompt' : 'full-prompt full-prompt--scroll-disabled'"
                            ref="fullPrompt">
                            <template v-for="(item, index) in processedPrompt" :key="index">
                                <span v-if="typeof item === 'string'">{{ item }}</span>
                                <span v-else class="dropdown-placeholder" @click="toggleDropdown(index)">
                                    {{ item.selected }}
                                </span>
                            </template>
                        </div>
                        <EButton :title="'Generate'" :class="{ 'consultant__btn-generate': true }"
                            @click="sendReworkedPromptAsContent" :is-form-disabled="isFormDisabled" />
                    </div>
                    <!-- <div class="consultant__match match-consultant">
                        <div class="match-consultant__list">
                            <div class="match-consultant__item">
                                <div class="match-consultant__img"></div>
                                <EButton :title="'Show details'" :class="{ 'consultant__btn-match': true }" />
                            </div>
                        </div>
                        <div class="match-consultant__selected">

                        </div>
                    </div> -->
                </div>
            </div>
            <div class="chat-container">
                <div class="chat-box">
                    <MessageList :messages="messages" :message-style="'consultant-message'" />
                </div>
                <div class="consultant__form">
                    <EInput :class="{ 'consultant__input': true }" :is-form-disabled="isFormDisabled" v-model="content"
                        :placeholder="'Any other adjustments or questions'" />
                    <EButton :class="{ 'consultant__btn-send': true }" @click="sendMessage"
                        :is-form-disabled="isFormDisabled || content.length == 0" />
                </div>
            </div>
        </div>
        <div class="select-items-wrapper" v-show="openDropdown !== null">
            <div class="select-items" :style="dropdownStyles">
                <div v-for="option in getOptions()" :key="option" @click="selectOption(openDropdown!, option)">
                    {{ option }}
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.consultant__match {
    max-height: 500px;
    overflow-y: scroll;
}

.match-consultant__img {
    background-image: url('https://storage.googleapis.com/dbassistant/createddesigns/20250109151436.jpg');
    width: 170px;
    height: 127px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    border-top: 1px solid #F70067;
    border-left: 1px solid #F70067;
    border-right: 1px solid #F70067;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
}

.match-consultant__list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 18px;
    padding: 17px;
}

.dropdown-placeholder {
    position: relative;
    display: inline-block;
    background-color: #F3ECE4;
    color: #333333;
    padding: 4px 30px 4px 12px;
    border-radius: 15px;
    cursor: pointer;
    margin-bottom: 1px;
    min-width: 80px;
}

.dropdown-placeholder::after {
    content: '';
    background-image: url('/consultant/down-arrow.svg');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    position: absolute;
    width: 10px;
    height: 10px;
    right: 14px;
    bottom: 11px;
    display: block;
}

.select-items-wrapper {
    position: fixed;
    z-index: 1000;
}

.select-items {
    position: absolute;
    background-color: #F3ECE4 !important;
    border: 1px solid #ddd !important;
    border-radius: 10px 10px 4px 4px !important;
    z-index: 1000 !important;
    max-height: 150px !important;
    min-width: max-content !important;
    overflow-y: auto;
}

.select-items div {
    padding: 5px 10px;
    cursor: pointer;
    color: #333333;
}

.consultant__selects {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
}

.custom-select {
    position: relative;
}

.consultant__sneakers {
    background-color: #F3F3F3;
    padding-bottom: 8px;
    border-bottom-right-radius: 20px;
    border-bottom-left-radius: 20px;
    border-bottom: 1px solid #DADADA;
    position: relative;
}

.consultant__sneakers::after {
    content: '';
    width: 56px;
    border: 2px solid #CACACA;
    position: absolute;
    bottom: 6px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 3px;
}

.full-prompt {
    display: inline-flex;
    flex-wrap: wrap;
    gap: 8px;
    max-height: 100px;
    overflow-y: auto;
    position: relative;
}

.full-prompt--scroll-disabled {
    overflow-y: hidden;
}

.select-items {
    position: absolute;
    background-color: #f9f9f9;
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
    height: auto;
    margin: 0px 16px 8px 16px;
    border-radius: 20px;
    border: 1px solid #F3ECE4;
    gap: 10px;
    padding: 16px;
    display: flex;
    flex-direction: column;
}

.consultant {
    display: flex;
    flex-direction: column;
}

.consultant__sneakers-img {
    height: 220px;
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
    flex-shrink: 0;
    margin: 0px 16px 16px 16px;
    position: relative;
}

.chat-container {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    background-color: white;
    overflow: hidden;
}

.chat-box {
    overflow-y: auto;
    flex-grow: 1;
    margin-bottom: 15px;
    height: auto;
}
</style>