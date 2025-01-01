<script lang="ts">
export default {
    props: ['messageData', 'messageStyle']
}
</script>

<template>
    <div class="message-item__body">
        <div :class="`${messageStyle} ${messageData.sender}`">
            <div class="message-block">
                {{ messageData.message.content }}
            </div>
        </div>
        <!-- the difference between these blocks is in the path to the image in the JSON -->
        <div :class="`${messageStyle}__img`" v-if="messageData.message.type === 'create'">
            <img :src="messageData.message.additional.designUrl" alt="Generated Product Design" />
        </div>
        <div :class="`${messageStyle}__img`" v-for="match in messageData.message.additional" :key="match.id"
            :match="match" v-if="messageData.message.type === 'match'">
            <img class="message-additional__img" :src="match[4].image_url" alt="Matched Design Product Image">
        </div>
    </div>
</template>

<style scoped>
/* Startpage.vue */
/* ------------------------------------------------------------------------------ */
.landing-example-messages {
    padding: clamp(3px, 0.5vw, 10px);
    background-color: #9b4dda;
    color: #fff;
    border-radius: 10px;
    max-width: 70%;
    word-wrap: break-word;
    margin: clamp(10px, 5vw, 30px);
    font-size: clamp(15px, 3vw, 18px);
    font-weight: 400;
    line-height: clamp(20px, 2.5vh, 34px);
}

.landing-example-messages.user {
    text-align: right;
    margin-left: auto;
}

.landing-example-messages.assistant {
    text-align: left;
    margin-right: auto;
}

.landing-example-messages .message-block {
    max-width: 90%;
    overflow-wrap: break-word;
    word-wrap: break-word;
    word-break: break-word;
    hyphens: auto;
    padding: 10px;
    border-radius: 10px;
    word-break: break-word;
}

/* Consultant.vue */
/* ------------------------------------------------------------------------------ */

.consultant-message .message-block {
    max-width: 90%;
    overflow-wrap: break-word;
    word-wrap: break-word;
    word-break: break-word;
    hyphens: auto;
    padding: 10px;
    border-radius: 10px;
    word-break: break-word;
    line-height: 20px;
}

.consultant-message {
    padding: 5px;
    margin: 5px 0;
}

.consultant-message.user {
    background-color: #d1f7ff;
    text-align: right;
}

.consultant-message.assistant {
    text-align: left;
    background-color: #f0f0f0;
    border-radius: 10px;
    padding: 10px;
    margin: 5px 0;
}

.consultant-message__img img {
    width: 200px;
    height: 200px;
}

/* Base styles */
/* ------------------------------------------------------------------------------ */

a {
    overflow-wrap: break-word;
    word-wrap: break-word;
    word-break: break-word;
    hyphens: auto;
}
</style>
