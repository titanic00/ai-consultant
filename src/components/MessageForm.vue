<script lang="ts">
import EButton from './EButton.vue';


export default {
    components: { EButton },
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
        <input type="text" placeholder="Type a message..." v-model="input" />
        <EButton :title="'Send'" @click="handleClick" />
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
</style>
