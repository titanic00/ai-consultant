<script lang="ts">

export default {
    props: {
        isFormDisabled: Boolean,
        title: String
    },
    emits: ['click'],
    methods: {
        handleClick() {
            this.$emit('click')
        }
    }
}
</script>

<template>
    <div class="ebutton__body">
        <button @click="handleClick()" :class="isFormDisabled ? 'disabled' : ''">{{ title }}</button>
    </div>
</template>

<style scoped>
/* Consultant.vue */
/* ------------------------------------------------------------------------------ */
.consultant__btn-send button {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background-color: #D4B28A;
    background-image: url('/consultant/button-arrow-up.svg');
    background-position: center;
    background-repeat: no-repeat;
    background-size: 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    position: absolute;
    border-radius: 50%;
    border: none;
    top: 10px;
    left: 88%;
}

.consultant__btn-generate {}

.consultant__btn-generate button {
    width: 100%;
    display: inline-block;
    position: relative;
    background: linear-gradient(90deg, #F70067 0%, #FFA4CA 100%);
    border: none;
    padding: 10px;
    border-radius: 10px;
    color: #FFFFFF;
}

.consultant__btn-generate button::after {
    content: '';
    background-image: url('/consultant/sparkling.svg');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    position: absolute;
    width: 27px;
    height: 24px;
    top: 11px;
    right: 63%;
}

.consultant__btn-match button {
    border: none;
    width: 100%;
    background: #F70067;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    padding: 12.5px 0px;
    color: #FFFFFF;
    position: relative;
    text-align: center;
}

.consultant__btn-match button::after {
    content: '';
    background-image: url('/consultant/right-arrow.svg');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    position: absolute;
    width: 7px;
    height: 13px;
    bottom: 17px;
    right: 16%;
}

/* Startpage.vue */
/* ------------------------------------------------------------------------------ */
.startpage__btn-demo button {
    width: 100%;
    display: block;
    align-items: center;
    background-color: #050505;
    font-weight: 500;
    font-size: 18px;
    line-height: 27px;
    color: #C7B6B6;
    padding: 12px;
    border-radius: 12px;
    border: 1px solid #050505;
    cursor: pointer;
}

.startpage__btn-demo button:hover {
    color: #e2cccc;
}

.ebutton__body.startpage__btn-impressum {
    text-align: center;
}

.startpage__btn-impressum button {
    display: inline-block;
    font-weight: 500;
    font-size: 18px;
    line-height: 27px;
    color: #C7B6B6;
    cursor: pointer;
    border: none;
    background-color: transparent;
    text-decoration: underline;
}

.startpage__btn-impressum button:hover {
    color: #7e7373;
}

@media (min-width: 2561px) {
    .startpage__btn-demo button {
        font-size: 27px;
        padding: 16px;
        line-height: 36px;
    }

    .startpage__btn-impressum button {
        font-size: 27px;
        line-height: 27px;
    }
}
</style>
