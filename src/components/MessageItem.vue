<script lang="ts">

export default {
    props: ['messageData']
}
</script>

<template>
    <div class="message-item__body">
        <div :class="`message ${messageData.sender}`">
            {{ messageData.message.content }}
            <div class="message-item__link" v-if="messageData.message.type === 'create'">
                <a :href="messageData.message.additional.designUrl" target="_blank">{{
                    messageData.message.additional.designUrl }}</a>
            </div>
            <div class="" v-if="messageData.message.type === 'match'">
                <div class="" v-for="match in messageData.message.additional" :key="match.id" :match="match">
                    <img class="message-additional__img" :src="match[4].image_url" alt="Matched Design Product Image">
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.message {
    padding: 5px;
    margin: 5px 0;
}

.message.user {
    background-color: #d1f7ff;
    text-align: right;
}

.message.assistant {
    text-align: left;
    background-color: #f0f0f0;
    border-radius: 10px;
    padding: 10px;
    margin: 5px 0;
}

.message-additional__img {
    width: 200px;
    height: 200px;
}

a {
    overflow-wrap: break-word;
    word-wrap: break-word;
    word-break: break-word;
    hyphens: auto;
}
</style>
