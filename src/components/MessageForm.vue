<script lang="ts">
import EButton from './EButton.vue';


export default {
    components: { EButton },
    props: ['isFormDisabled'],
    emits: ['click'],
    data() {
        return {
            input: ""
        }
    },
    methods: {
        handleClick() {
            this.$emit('click', this.input)
            this.input = ""
        }
    }
}
</script>

<template>
    <div class="message-form__body">
        <input type="text" placeholder="Type a message..." v-model="input" :disabled="isFormDisabled" />
        <EButton :title="'Send'" @click="handleClick" :class="isFormDisabled ? 'disabled' : ''" />
    </div>
</template>

<style scoped>
input[type="text"] {
    width: 80%;
    padding: 10px;
    margin-right: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.disabled {
    background-color: #d3d3d3;
    color: #808080;
    cursor: not-allowed;
    opacity: 0.6;
    pointer-events: none;
}
</style>
