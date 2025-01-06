<script lang="ts">
import { messageData } from '@/assets/MessageDataLanding.ts';
import EButton from '@/components/EButton.vue';
import EInput from '@/components/EInput.vue';
import MessageList from '@/components/MessageList.vue';
import { impressum } from '@/assets/impressum';
import emailjs from '@emailjs/browser';


export default {
    components: { EButton, EInput, MessageList },
    data() {
        return {
            messageData: messageData,
            impressum: impressum,
            email: ''
        }
    },
    methods: {
        sendEmail() {
            if (this.email !== '') {
                emailjs.send('service_bqxgjgz', 'template_64wit4a', {
                    userEmail: this.email,
                }, 'DdBf0xh09O6uBNRuY')
                    .then(() => {
                        this.email = ''
                    })
            }
        },
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
                <EInput :class="{ 'startpage__input-email': true }" :placeholder="'Your email'" v-model="email" />
                <EButton :class="{ 'startpage__btn-demo': true }" :title="'Join the waitlist'" @click="sendEmail" />
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
    gap: 20px;
}

.header-startpage__name {
    font-weight: 600;
    font-size: 28px;
    line-height: 30px;
    color: #9b4dda;
}

.header-startpage__text {
    font-size: 20px;
}

.startpage__content {
    margin: 150px 0px;
    flex: 1 1 100%;
}

@media (max-width: 767px) {
    .startpage__content {
        margin: 80px 0px;
    }
}

.startpage__title {
    font-weight: 400;
    font-size: 42px;
    line-height: 47px;
    max-width: 700px;
    margin-bottom: 120px;
}

.startpage__undertitle {
    margin-top: 24px;
    font-weight: 600;
    font-size: 24px;
    line-height: 34px;
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
    padding: 32px 12px 12px 32px;
    gap: 20px;
    min-height: 100vh;
}

@media (max-width: 1365px) {
    .startpage__body {
        padding: 20px 12px 12px 20px;
    }
}

@media (max-width: 767px) {
    .startpage__body {
        padding: 12px;
    }

    .startpage__title {
        margin-bottom: 80px;
        font-size: 36px;
        line-height: 42px;
    }

    .startpage__undertitle {
        font-size: 20px;
        line-height: 24px;
    }
}

.startpage__info {
    flex: 1 1 50%;
    display: flex;
    flex-direction: column;
}

.header-startpage {
    display: flex;
    flex-direction: column;
}

.header--below-899 {
    display: none;
}

@media (min-width: 2561px) {
    .header-startpage__name {
        font-size: 60px;
        line-height: 50px;
    }

    .header-startpage__text {
        font-size: 34px;
    }

    .startpage__title {
        font-size: 84px;
        line-height: 94px;
        max-width: 1200px;
    }

    .startpage__undertitle {
        font-size: 44px;
        line-height: 48px;
    }
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
