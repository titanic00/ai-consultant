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
        <!-- Header for the screen sizes below 899px -->
        <header class="startpage__header header-startpage header--below-899">
            <div class="header-startpage__name">EIDOS</div>
            <div class="header-startpage__text">visual shopping assistant</div>
        </header>
        <div class="startpage__info">
            <!-- Header for the screen sizes above 899px -->
            <header class="startpage__header header-startpage header--above-899">
                <div class="header-startpage__name">EIDOS</div>
                <div class="header-startpage__text">visual shopping assistant</div>
            </header>
            <div class="startpage__content">
                <h1 class="startpage__title">Struggling to find products that match your style?</h1>
                <h2 class="startpage__undertitle">EIDOS is your personal shopping assistant to discover exactly what you
                    want — effortlessly and smarter</h2>
            </div>
            <div class="startpage__form">
                <EInput :class="{ 'startpage__input-email': true }" :placeholder="'Your email'" />
                <EButton :class="{ 'startpage__btn-demo': true }" :title="'Join the waitlist'" />
                <EButton :class="{ 'startpage__btn-impressum': true }" :title="'Imprint'" data-bs-toggle="modal"
                    data-bs-target="#impressumModal" />
            </div>
        </div>
        <div class="startpage__body-visuals">
            <MessageList class="landing__messages-list" :messages="messageData" :is-animated="true"
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
.landing__messages-list {
    width: 100%;
}

.startpage__form {
    display: flex;
    flex-direction: column;
    gap: clamp(10px, 2vw, 20px);
}

.header-startpage__name {
    font-weight: 600;
    font-size: clamp(22px, 5vw, 36px);
    line-height: clamp(22px, 2vw, 30px);
    color: #9b4dda;
}

.header-startpage__text {
    font-size: clamp(16px, 3vw, 26px);
}

.startpage__content {
    margin: clamp(50px, 8vh, 150px) 0px;
    flex: 1 1 100%;
}

.startpage__title {
    font-weight: 400;
    font-size: clamp(26px, 5vw, 62px);
    line-height: clamp(32px, 6vw, 72px);
    max-width: 700px;
    margin-bottom: clamp(70px, 2vh, 120px);
}

.startpage__undertitle {
    margin-top: 24px;
    font-weight: 600;
    font-size: clamp(20px, 2vw, 34px);
    line-height: clamp(32px, 4vh, 38px);
}

.startpage__form-text {
    font-weight: 400;
    font-size: clamp(18px, 2vh, 26px);
    line-height: clamp(22px, 3vh, 28px);
}

.startpage__body-visuals {
    background-image: url('/startpage/right-visual-bg.jpeg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    width: 100%;
    flex: 1 1 50%;
    overflow-y: scroll;
    min-height: 100%;
    border-top-right-radius: 24px;
    border-bottom-right-radius: 24px;
}

.startpage__body {
    display: flex;
    justify-content: space-between;
    padding: clamp(20px, 3vw, 40px) 12px 12px clamp(20px, 3vw, 40px);
    gap: clamp(20px, 2vw, 40px);
    height: 100vh;
}

.startpage__info {
    flex: 1 1 50%;
    display: flex;
    flex-direction: column;
}

.startpage__header {
    gap: clamp(5px, 1vw, 10px);
}

.header-startpage {
    display: flex;
    flex-direction: column;
}

.header--below-899 {
    display: none;
}

@media screen and (max-width: 899px) {
    .header--below-899 {
        display: block;
    }

    .header--above-899 {
        display: none;
    }

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
