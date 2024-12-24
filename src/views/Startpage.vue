<script lang="ts">
import { messageData } from '@/assets/MessageDataLanding.ts';
import EButton from '@/components/EButton.vue';
import EInput from '@/components/EInput.vue';
import MessageList from '@/components/MessageList.vue';
import { impressum } from '@/assets/impressum';


export default {
    components: { EButton, EInput, MessageList },
    data() {
        return {
            messageData: messageData,
            impressum: impressum
        }
    }
}
</script>

<template>
    <div class="startpage__body">

        <div class="startpage__info">
            <header class="startpage__header header-startpage">
                <div class="header-startpage__name">EIDOS</div>
                <div class="header-startpage__text">visual shopping assistant</div>
            </header>
            <div class="startpage__content">
                <h1 class="startpage__title">Struggling to find products that match your style?</h1>
                <h2 class="startpage__undertitle">EIDOS is your personal shopping assistant to discover exactly what you
                    want — effortlessly and smarter</h2>
            </div>
            <div class="startpage__form">
                <h3 class="startpage__form-text">Be the first to redefine online shopping with EIDOS!​</h3>
                <EInput :class="{ 'startpage__input-email': true }" :placeholder="'Your email'" />
                <EButton :class="{ 'startpage__btn-demo': true }" :title="'Join the waitlist'" />
                <EButton :class="{ 'startpage__btn-impressum': true }" :title="'Imprint'" data-bs-toggle="modal"
                    data-bs-target="#impressumModal" />
            </div>
        </div>
        <div class="startpage__body-visuals">
            <MessageList class="langin__messages-list" :messages="messageData" :is-animated="true"
                :message-style="'landing-example-messages'" />
        </div>
    </div>
    <div class="modal fade" id="impressumModal" tabindex="-1" aria-labelledby="impressumModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="impressumModalLabel">Impressum</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <!-- Render impressum.ts -->
                    <div v-html="impressum"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.langin__messages-list {
    width: 100%;
}

.startpage__form {
    display: flex;
    flex-direction: column;
    gap: 12px
}

.header-startpage__name {
    font-weight: 600;
    font-size: clamp(18px, 5vw, 28px);
    line-height: clamp(20px, 1vw, 26.4px);
}

.header-startpage__text {
    font-size: clamp(12px, 3vw, 16px);
}

.startpage__content {
    margin: clamp(80px, 10vh, 185px) 0px;
    flex: 1 1 100%;
}

.startpage__title {
    font-weight: 400;
    font-size: clamp(24px, 4vw, 48px);
    line-height: clamp(28px, 5vw, 57.6px);
    max-width: 700px;
}

.startpage__undertitle {
    margin-top: 24px;
    font-weight: 400;
    font-size: clamp(18px, 1.5vw, 24px);
    line-height: 23.4px;
}

.startpage__form-text {
    font-weight: 400;
    font-size: clamp(16px, 1vh, 18px);
    line-height: 23.4px;
}

.startpage__body-visuals {
    background-image: url('/startpage/right-visual-bg.jpeg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    width: 100%;
    height: 100%;
    border-top-right-radius: 24px;
    border-bottom-right-radius: 24px;
}

.startpage__body {
    display: flex;
    justify-content: space-between;
    padding: 12px;
    gap: clamp(15px, 1vw, 38px);
    height: 100vh;
}

.startpage__info {
    flex: 1 1 50%;
    display: flex;
    flex-direction: column;
}

.startpage__body-visuals {
    flex: 1 1 50%;
    overflow-y: scroll;
    min-height: 100%;
}

.startpage__header {
    gap: 5px
}

.header-startpage {
    display: flex;
    flex-direction: column;
}

@media screen and (max-width: 899px) {
    .startpage__body {
        display: flex;
        flex-direction: column;
    }

    .startpage__info {
        order: 2;
    }

    .startpage__body-visuals {
        order: 1
    }

    .startpage__content {
        margin-top: 15px;
    }
}
</style>
