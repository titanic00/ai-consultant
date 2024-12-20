<script lang="ts">
import EButton from './EButton.vue';


export default {
    components: { EButton }
}
</script>

<template>
    <div class="message-form__body">
        <input type="text" id="user-input" placeholder="Type a message..." />
        <EButton />
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
