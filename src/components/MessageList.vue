<script lang="ts">
import type MessageData from '@/models/MessageData';
import { TransitionGroup } from 'vue';
import MessageItem from './MessageItem.vue';
import MessageItemExample from './MessageItemExample.vue';

export default {
    components: { MessageItem, TransitionGroup, MessageItemExample },
    props: ['messages', 'isAnimated', 'messageStyle'],
    data() {
        return {
            animatedMessages: [] as MessageData[]
        };
    },
    mounted() {
        if (this.isAnimated) {
            this.animateMessages()
        }
    },
    methods: {
        animateMessages() {
            this.messages.forEach((message: MessageData, index: number) => {
                setTimeout(() => {
                    this.animatedMessages.push(message)
                    this.animatedMessages[index].id = index
                }, index + 1 * 100 + (index * 1000))
            });
        },
    },
    computed: {
        displayMessages() {
            return this.isAnimated ? this.animatedMessages : this.messages;
        }
    }
};
</script>

<template>
    <Transition-group>
        <div v-for="messageData in displayMessages" :key="messageData.id" :class="{ 'animation': true }">
            <MessageItem :messageData="messageData" :message-style="messageStyle"
                v-if="messageData.message.type !== 'landingExample'" />
            <MessageItemExample v-else :message-data="messageData" :message-style="messageStyle" />
        </div>
    </Transition-group>
</template>

<style scoped>
.animation {
    animation: fade-in 0.5s ease-in-out forwards;
}

@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
