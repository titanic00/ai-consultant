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
        <!-- the difference between these blocks is in the path to the image in JSON -->
        <!-- <div :class="`${messageStyle}__img`" v-if="messageData.message.type === 'create'">
            <img :src="messageData.message.additional.designUrl" alt="Generated Product Design" />
        </div> -->
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
    padding: 8px;
    background-color: #9b4dda;
    color: #fff;
    border-radius: 12px;
    max-width: 60%;
    word-wrap: break-word;
    margin: 12px;
    font-size: 18px;
    font-weight: 400;
    line-height: 27px;
}

@media (max-width: 767px) {
    .landing-example-messages {
        font-size: 16px;
        line-height: 27px;
    }
}

@media (min-width: 2561px) {
    .landing-example-messages {
        font-size: 36px;
        line-height: 44px;
        padding: 20px;
    }

    .landing-example-messages__img img {
        width: 500px;
        height: 500px;
    }
}

.landing-example-messages.user {
    text-align: right;
    margin-left: auto;
    max-width: 60%;
}

.landing-example-messages.assistant {
    text-align: left;
    margin-right: auto;
    max-width: 60%;
}

.landing-example-messages .message-block {
    max-width: 90%;
    overflow-wrap: break-word;
    word-wrap: break-word;
    word-break: break-word;
    hyphens: auto;
    padding: 12px;
    border-radius: 12px;
}

/* Consultant.vue */
/* ------------------------------------------------------------------------------ */

.consultant-message {
    padding: 5px;
    margin: 5px 0;
    display: flex;
}

.consultant-message.user {
    justify-content: flex-end;
}

.consultant-message.assistant {
    justify-content: flex-start;
}

.consultant-message .message-block {
    display: inline-block;
    max-width: 75%;
    overflow-wrap: break-word;
    word-wrap: break-word;
    word-break: break-word;
    hyphens: auto;
    padding: 10px;
    border-radius: 10px;
    font-size: 14px;
    line-height: 18px;
}

.consultant-message.user .message-block {
    background-color: #d1f7ff;
}

.consultant-message.assistant .message-block {
    background-color: #f0f0f0;
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
