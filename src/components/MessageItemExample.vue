<script lang="ts">

export default {
    props: ['messageData', 'messageStyle']
}
</script>

<template>
    <div class="message-item__body">
        <div :class="`${messageStyle} ${messageData.sender}`">
            <!-- show static image from MessageDataLanding source -->
            <div class="message-item__example-png">
                <img class="message-additional__img" :src="messageData.message.additional.image_url"
                    alt="Matched Design Product Image">
            </div>
        </div>
    </div>
</template>

<style scoped>
.landing-example-messages {
    margin: 30px;
}

.landing-example-messages img {
    border-radius: 10px;
    width: 250px;
    height: 250px;
}

@media (min-width: 2561px) {
    .message-item__example-png img {
        width: 500px;
        height: 500px;
    }
}

.landing-example-messages.user {
    text-align: right;
}

.landing-example-messages.assistant {
    text-align: left;
}
</style>
