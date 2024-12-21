<script lang="ts">
import EButton from '@/components/EButton.vue';
import EInput from '@/components/EInput.vue';


export default {
    components: { EButton, EInput }
}
</script>

<template>
    <div class="startpage__body">
        <div class="startpage__info">
            <header class="startpage__header header-startpage">
                <div class="header-startpage__logo">
                    <img src="/startpage/logo.svg" alt="logo">
                </div>
                <div class="header-startpage__name">EIDOS</div>
            </header>
            <div class="startpage__content">
                <h1 class="startpage__title">Lost in online Shopping?
                    Let us help you find exactly what you want!
                    <br>
                    EIDOS: Your Personal Shopping Assistant!
                </h1>
                <div class="startpage__undertitle">Experience the Future of Online Shopping:</div>
            </div>
            <div class="startpage__form">
                <EInput :class="{ 'startpage__input-email': true }" :placeholder="'Your email'" />
                <EButton :class="{ 'startpage__btn-demo': true }" :title="'Request a Demo'" />
            </div>
        </div>
        <div class="startpage__body-visuals">
            <div class="startpage__bg-image"></div>
            <div class="info-startpage__play-btn"></div>
        </div>
    </div>
</template>

<style scoped>
.startpage__form {
    display: flex;
    flex-direction: column;
    gap: 12px
}

.header-startpage__name {
    font-weight: 600;
    font-size: 22px;
    line-height: 26.4px;
}

.startpage__content {
    margin: 185px 0px;
}

.startpage__title {
    font-weight: 400;
    font-size: 48px;
    line-height: 57.6px;
    max-width: 700px;
}

.startpage__undertitle {
    margin-top: 24px;
    font-weight: 400;
    font-size: 18px;
    line-height: 23.4px;
}

.startpage__bg-image {
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
    gap: 38px;
    height: 100vh;
}

.startpage__info {
    flex: 1 1 50%;
}

.startpage__body-visuals {
    flex: 1 1 50%;
}

.startpage__header {
    gap: 5px
}

.header-startpage {
    display: flex;
    align-items: center;
}

.header-startpage__logo {
    height: 32px;
    width: 32px;
}
</style>
