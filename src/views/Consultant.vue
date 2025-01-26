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
            messageResponse: {} as MessageData,
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
            accessToken: '',
            imageList: [] as string[],
            sneakerToShow: null as number | null,
            parsedMatchedObjects: [],
            swipedIndex: 0,
            startX: 0,
            currentX: 0,
            startY: 0,
            currentY: 0,
            swipeDirection: '',
            isCardShown: true,
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
        onTouchStartY(event: TouchEvent, index: number) {
            const target = event.target as Element | null;
            if (target && target.closest('.full-prompt')) {
                return;
            }
            this.startY = event.touches[0].clientY;
            this.currentY = this.startY;
            this.swipedIndex = index;
            this.swipeDirection = '';
        },
        onTouchMoveY(event: TouchEvent) {
            const target = event.target as Element | null;
            if (target && target.closest('.full-prompt')) {
                return;
            }
            this.currentY = event.touches[0].clientY;
            const deltaY = this.currentY - this.startY;
            const swipeContent = document.getElementById(this.swipedIndex.toString());
            if (swipeContent && this.isCardShown) {
                this.isCardShown = false
                swipeContent.style.transition = "transform 0.3s ease-out";
                swipeContent.style.transform = `translateY(${deltaY}%)`;
                swipeContent.style.position = `relative`;
            }
        },
        onTouchEndY(event: Event, index: number) {
            const target = event.target as Element | null;
            if (target && target.closest('.full-prompt')) {
                return;
            }
            const deltaY = this.currentY - this.startY;
            const swipeContent = document.getElementById(index.toString());

            if (swipeContent) {
                // swipe up
                if (deltaY < -50) {
                    this.swipeDirection = "up";
                    swipeContent.style.transition = "transform 0.3s ease-out";
                    swipeContent.style.transform = `translateY(${-100}%)`;
                    setTimeout(() => {
                        swipeContent.style.position = `absolute`;
                        this.onSwipeUp(index);
                    }, 200);
                } else {
                    this.isCardShown = false
                    swipeContent.style.transition = "transform 0.3s ease-out";
                    swipeContent.style.transform = `translateY(${0}%)`;
                    swipeContent.style.position = `relative`;
                }
            }
        },
        onSwipeUp(index: number) {
            this.isCardShown = true
        },
        onTouchStartX(event: TouchEvent, index: number) {
            this.startX = event.touches[0].clientX;
            this.currentX = this.startX;
            this.swipedIndex = index;
            this.swipeDirection = '';
        },
        onTouchMoveX(event: TouchEvent) {
            this.currentX = event.touches[0].clientX;
            const deltaX = this.currentX - this.startX;
            const swipeContent = document.getElementById(this.swipedIndex.toString());
            if (swipeContent) {
                swipeContent.style.transform = `translateX(${deltaX}px)`;
            }
        },
        onTouchEndX(event: Event, index: number) {
            const deltaX = this.currentX - this.startX;
            const swipeContent = document.getElementById(index.toString());

            if (swipeContent) {
                const isOdd = index % 2 === 0;

                if (deltaX < -50 && isOdd) {
                    this.swipeDirection = "left";
                    swipeContent.style.transition = "transform 0.3s ease-out";
                    swipeContent.style.transform = "translateX(-100%)";
                    setTimeout(() => {
                        this.onSwipeLeft(index);
                        this.resetSwipe(swipeContent);
                    }, 300);
                } else if (deltaX > 50 && !isOdd) {
                    this.swipeDirection = "right";
                    swipeContent.style.transition = "transform 0.3s ease-out";
                    swipeContent.style.transform = "translateX(100%)";
                    setTimeout(() => {
                        this.onSwipeRight(index);
                        this.resetSwipe(swipeContent);
                    }, 300);
                } else {
                    // Invalid swipe, reset position
                    swipeContent.style.transition = "transform 0.3s ease-out";
                    swipeContent.style.transform = "translateX(0)";
                }
            }
        },
        async getAccessToken() {
            const privateKey = import.meta.env.VITE_PRIVATE_KEY.replace(/\\n/g, '\n');
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

            const data = await response.json();

            this.accessToken = data.access_token
        },
        parseMatchedObjects() {
            this.parsedMatchedObjects = []
            Object.keys(this.messageResponse.message.additional).forEach(key => {
                const group = this.messageResponse.message.additional[key];
                (this.parsedMatchedObjects as any[]).push(group);
            });
        },
        async downloadFile() {
            this.imageList = []
            const bucketName = import.meta.env.VITE_BUCKET_NAME;
            const promises: Promise<string>[] = [];

            Object.keys(this.messageResponse.message.additional).forEach(key => {
                const group = this.messageResponse.message.additional[key];
                group.forEach((item: { image_uri?: string }) => {
                    if (item && item.image_uri) {
                        const fileName = item.image_uri;
                        const reworkedFileName = fileName.substring(fileName.lastIndexOf('/') + 1);

                        promises.push(
                            downloadImg(this.accessToken, bucketName, reworkedFileName)
                                .then(response => {
                                    if (response === null) {
                                        return 'https://storage.googleapis.com/dbassistant/createddesigns/20250109151436.jpg';
                                    }
                                    return URL.createObjectURL(response);
                                })
                        );
                    }
                });
            });

            try {
                const results = await Promise.all(promises);
                this.imageList = results.filter(result => result !== null && result !== undefined);
                // this.backgroundImageUrl = this.imageList[0];
            } catch (error) {
                console.error('Error downloading files:', error);
            }
        },
        generateUpdatedPrompt(showMatch: boolean) {
            let updatedPrompt = this.processedPrompt.map(item => {
                if (typeof item === 'object') {
                    return item.selected;
                }
                return item;
            }).join('');

            if (!showMatch) {
                return 'Can you create a design based on the following prompt? - ' + updatedPrompt;
            } else {
                return 'Show me matched design for this sneakers - ' + updatedPrompt;
            }
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
            this.sneakerToShow = null
            newMessage(messageData).then((response) => {
                this.isFormDisabled = false;
                this.messageResponse = response
                if (response.message.type === 'create') {
                    this.backgroundImageUrl = response.message.additional.designUrl;
                    this.extractObjects(response);
                }

                if (response.message.type === 'match') {
                    this.downloadFile();
                    this.parseMatchedObjects();
                }

                this.displayMessage(response, "assistant");
            }).catch(error => {
                console.log(error);
                this.isFormDisabled = false;
            })
        },
        sendReworkedPromptAsContent(showMatch: boolean) {
            const updatedPrompt = this.generateUpdatedPrompt(showMatch);
            this.content = updatedPrompt
            this.sendMessage()
        },
        getOptions(): string[] {
            if (this.openDropdown !== null && this.processedPrompt[this.openDropdown] && typeof this.processedPrompt[this.openDropdown] === 'object') {
                const item = this.processedPrompt[this.openDropdown] as { key: string; values: string[]; selected: string };
                return item.values;
            }
            return [];
        },
        showSneaker(index: number) {
            this.sneakerToShow = index
            // this.backgroundImageUrl = this.imageList[this.sneakerToShow];
            this.swipedIndex = 0;
        },
        showAllSneakers() {
            this.sneakerToShow = null
            this.swipedIndex = 0;
        },
        onSwipeLeft(index: number) {
            const randomIndex =
                Math.floor(Math.random() * (this.parsedMatchedObjects.length - 4)) + 4;

            const buff = this.parsedMatchedObjects[index];
            this.parsedMatchedObjects[index] = this.parsedMatchedObjects[randomIndex];
            this.parsedMatchedObjects[randomIndex] = buff;

            const buffImg = this.imageList[index];
            this.imageList[index] = this.imageList[randomIndex];
            this.imageList[randomIndex] = buffImg;

            this.swipedIndex = 0;
        },
        onSwipeRight(index: number) {
            const randomIndex =
                Math.floor(Math.random() * (this.parsedMatchedObjects.length - 4)) + 4;

            const buff = this.parsedMatchedObjects[index];
            this.parsedMatchedObjects[index] = this.parsedMatchedObjects[randomIndex];
            this.parsedMatchedObjects[randomIndex] = buff;

            const buffImg = this.imageList[index];
            this.imageList[index] = this.imageList[randomIndex];
            this.imageList[randomIndex] = buffImg;

            this.swipedIndex = 0;
        },
        resetSwipe(swipeContent: HTMLElement) {
            swipeContent.style.transition = "";
            swipeContent.style.transform = "";
            this.swipeDirection = '';
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
        },
        isMessageTypeCreate() {
            return this.messageResponse?.message?.type === 'create'
        },
        isMessageTypeMatch() {
            return this.messageResponse?.message?.type === 'match'
        }
    }
};
</script>

<template>
    <div class="consultant" :style="{ height: `${viewportHeight}px` }">
        <div class="consultant__body">
            <div class="consultant__header">
                <EButton :title="'Design it yourself!'" :class="{ 'consultant__btn-show-card': true }"
                    @touchstart="onTouchStartY($event, 0.1)" @touchmove="onTouchMoveY($event)"
                    @touchend="onTouchEndY($event, 0.1)" />
                <div class="consultant__profile-icon"></div>
                <div class="consultant__profile-burger">
                    <span></span>
                </div>
            </div>
            <div :id="0.1.toString()" :class="[{ consultant__design: true }, {
                'swiping-top': swipedIndex === 0.1 && swipeDirection === 'top',
                'swiping-down': swipedIndex === 0.1 && swipeDirection === 'down'
            }]" @touchstart.stop="onTouchStartY($event, 0.1)" @touchmove.stop="onTouchMoveY($event)"
                @touchend.stop="onTouchEndY($event, 0.1)">
                <div class="consultant__sneakers">
                    <div class="">
                        <div class="consultant__sneakers-img"
                            :style="{ backgroundImage: `url(${backgroundImageUrl})` }">
                        </div>
                        <div v-if="isMessageTypeCreate"
                            :class="isFormDisabled ? 'consultant__settings disabled' : 'consultant__settings'">
                            <div :class="openDropdown === null ? 'full-prompt' : 'full-prompt full-prompt--scroll-disabled'"
                                ref="fullPrompt">
                                <template v-for="(item, index) in processedPrompt" :key="index">
                                    <span v-if="typeof item === 'string'">{{ item }}</span>
                                    <span v-else class="dropdown-placeholder" @click="toggleDropdown(index)">
                                        {{ item.selected }}
                                    </span>
                                </template>
                            </div>
                            <div class="consultant__settings-buttons">
                                <EButton :title="'Find sneakers'" :class="{ 'consultant__btn-find': true }"
                                    @click="sendReworkedPromptAsContent(true)" :is-form-disabled="isFormDisabled" />
                                <EButton :title="'Generate'" :class="{ 'consultant__btn-generate': true }"
                                    @click="sendReworkedPromptAsContent(false)" :is-form-disabled="isFormDisabled" />
                            </div>
                        </div>
                        <div :class="isFormDisabled ? 'consultant__match match-consultant disabled' : 'consultant__match match-consultant'"
                            v-if="isMessageTypeMatch && parsedMatchedObjects.length > 0">
                            <div class="match-consultant__list" v-if="sneakerToShow === null">
                                <div class="match-consultant__item"
                                    v-for="(item, index) in parsedMatchedObjects.slice(0, 4)" :key="index">
                                    <div class="swipe-content" :id="index.toString()" :class="{
                                        'swiping-left': swipedIndex === index && swipeDirection === 'left',
                                        'swiping-right': swipedIndex === index && swipeDirection === 'right'
                                    }" @touchstart.stop="onTouchStartX($event, index)"
                                        @touchmove.stop="onTouchMoveX($event)"
                                        @touchend.stop="onTouchEndX($event, index)">
                                        <div class="match-consultant__img"
                                            :style="{ backgroundImage: `url(${imageList[index]})` }">
                                        </div>
                                        <EButton :title="'Show details'" :class="{ 'consultant__btn-match': true }"
                                            @click="showSneaker(index)" />
                                    </div>
                                </div>
                            </div>
                            <div class="match-consultant__selected selected-match" v-if="sneakerToShow !== null">
                                <div class="selected-match__img-wrapper">
                                    <div class="selected-match__img"
                                        :style="{ backgroundImage: `url(${imageList[sneakerToShow]})` }"></div>
                                    <div class="selected-match__favorite"></div>
                                    <div class="selected-match__arrow" @click="showAllSneakers"></div>
                                </div>
                                <div class="selected-match__info">
                                    <div class="selected-match__brand">{{
                                        (parsedMatchedObjects[sneakerToShow][5] as any).brand }}</div>
                                    <div class="selected-match__name">{{
                                        (parsedMatchedObjects[sneakerToShow][2] as any).display_name }}
                                    </div>
                                    <div class="selected-match__price">{{
                                        (parsedMatchedObjects[sneakerToShow][4] as any).price.replace(/^[^\d]+/, '') }}
                                        €
                                    </div>
                                </div>
                                <div class="selected-match__shop">{{ (parsedMatchedObjects[sneakerToShow][6] as
                                    any).shop
                                    }}</div>
                                <a :href="`${(parsedMatchedObjects[sneakerToShow][7] as any).affLink}`"
                                    class="selected-match__btn" target="_blank" rel="noopener noreferrer">Shop Now</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="chat-container">
                <div :class="!isCardShown ? 'chat-box' : 'chat-box chat-box--margin-top'">
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
.consultant__profile-burger {
    position: absolute;
    width: 20px;
    height: 14px;
    top: 50%;
    transform: translateY(-50%);
    left: 17px;
    z-index: 1000;
    border: none;
}

.consultant__profile-burger::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 2px;
    background-color: #333333;
    bottom: 0;
    z-index: 1000;
}

.consultant__profile-burger span {
    position: absolute;
    width: 20px;
    height: 2px;
    background-color: #333333;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1000;
}

.consultant__profile-burger::before {
    content: '';
    position: absolute;
    width: 20px;
    height: 2px;
    background-color: #333333;
    top: 0px;
    z-index: 1000;
}

.consultant__profile-icon {
    position: absolute;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #fff;
    top: 50%;
    transform: translateY(-50%);
    right: 17px;
    z-index: 1000;
}

.consultant__header {
    background-color: #F3F3F3;
    padding: 17px 24px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    border-bottom: 1px solid #DADADA;
    border-bottom-right-radius: 20px;
    border-bottom-left-radius: 20px;
}

.consultant__header::after {
    content: '';
    width: 56px;
    border: 2px solid #CACACA;
    position: absolute;
    bottom: 6px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 3px;
}

.consultant__design {
    transform: translateY(-100%);
    position: absolute;
}

.selected-match__btn {
    display: block;
    border: none;
    background-color: #F70067;
    width: 100%;
    padding: 11px;
    border-radius: 10px;
    color: #fff;
    position: relative;
    text-decoration: none;
    text-align: center;
}

.selected-match__btn::after {
    content: '';
    position: absolute;
    width: 25px;
    height: 25px;
    background-image: url('/consultant/shop.svg');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    top: 50%;
    transform: translateY(-50%);
    left: 30%;
}

.consultant__settings-buttons {
    display: flex;
    gap: 8px;
}

.swipe-content {
    transition: transform 0.3s ease-out;
    will-change: transform;
}

.swiping-top {
    transform: translateY(-100%);
    position: absolute;
}

.swiping-down {
    transform: translateY(0%);
    position: relative;
}

.swiping-left {
    transform: translateX(-100%);
}

.swiping-right {
    transform: translateX(100%);
}

.selected-match__img-wrapper {
    position: relative;
}

.selected-match__info {
    margin-bottom: 10px;
}

.selected-match__shop {
    margin-bottom: 10px;
    font-size: 14px;
}

.selected-match__brand {
    font-weight: 700;
}

.selected-match__img {
    width: 100%;
    height: 214px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    border: 1px solid #F70067;
    border-radius: 20px;
    margin-bottom: 16px;
}

.selected-match__favorite {
    content: '';
    width: 30px;
    height: 30px;
    background-image: url('/consultant/favorite.svg');
    position: absolute;
    top: 16px;
    right: 16px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
}

.selected-match__arrow {
    content: '';
    width: 30px;
    height: 30px;
    background-image: url('/consultant/left-arrow.svg');
    position: absolute;
    top: 16px;
    left: 16px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
}

.consultant__match {
    max-height: 500px;
    overflow-y: scroll;
    overflow-x: hidden;
    padding: 17px;
}

.match-consultant__img {
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

@media (max-width: 391px) {
    .match-consultant__img {
        width: 150px;
        height: 120px;
    }
}

@media (max-width: 351px) {
    .match-consultant__img {
        width: 130px;
        height: 100px;
    }
}

.match-consultant__list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 18px;
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
    margin: 8px 16px 16px 16px;
    border-radius: 20px;
    border: 1px solid #F3ECE4;
    gap: 10px;
    padding: 12px;
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

.chat-box--margin-top {
    margin-top: 70px;
}
</style>