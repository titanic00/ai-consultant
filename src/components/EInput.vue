<script lang="ts">
export default {
    props: {
        modelValue: String,
        isFormDisabled: Boolean,
        placeholder: String
    },
    emits: ['update:modelValue'],
    methods: {
        onInput(event: Event) {
            const inputElement = event.target as HTMLInputElement;
            const inputValue = inputElement.value;
            this.$emit('update:modelValue', inputValue);
        }
    }
}
</script>

<template>
    <div class="einput__body">
        <input type="text" :value="modelValue" @input="onInput($event)" :placeholder="placeholder"
            :class="isFormDisabled ? 'disabled' : ''" />
    </div>
</template>

<style scoped>
.consultant__input {
    flex: 1 1 100%;
}

.consultant__input input {
    width: 100%;
    padding: 9.5px;
    margin-right: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
}

.consultant__input input::placeholder {
    font-size: 14px;
}

.startpage__input-email input {
    display: block;
    width: 100%;
    padding: clamp(6px, 1vw, 12px);
    border-radius: 12px;
    text-align: center;
    border: 1px solid #C7B6B6;
    font-size: 18px;
}

.startpage__input-email input::placeholder {
    font-size: 18px;
    font-weight: 500;
    line-height: 27px;
    color: #C7B6B6;
    text-align: center;
}

@media (min-width: 2561px) {
    .startpage__input-email input {
        padding: 16px;
    }

    .startpage__input-email input::placeholder {
        font-size: 27px;
        line-height: 36px;
    }
}
</style>
