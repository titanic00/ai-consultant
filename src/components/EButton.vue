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
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
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
    padding: 12px;
    cursor: pointer;
    border: none;
    background-color: transparent;
    text-decoration: underline;
}

.startpage__btn-impressum button:hover {
    color: #7e7373;
}
</style>
