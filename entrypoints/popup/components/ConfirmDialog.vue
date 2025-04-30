<template>
    <div class="confirm-dialog-overlay">
        <div class="confirm-dialog">
            <div class="confirm-dialog-header">
                <h2>{{ t('confirmDelete') }}</h2>
            </div>
            <div class="confirm-dialog-body">
                <p class="warning-text">
                    <i class="fas fa-exclamation-triangle"></i>
                    {{ t('warning') }}
                </p>
                <p>{{ t('confirmDeleteRepos', { count: selectedRepos.length }) }}</p>
                <div class="confirm-repos-list">
                    <div v-for="repoId in selectedRepos" :key="repoId" class="confirm-repo-item">
                        {{ getRepoById(repoId).name }}
                    </div>
                </div>
                <div class="confirm-input">
                    <label for="confirm-text">{{ t('typeConfirm') }}</label>
                    <input
                        type="text"
                        id="confirm-text"
                        :value="confirmText"
                        @input="$emit('update:confirmText', $event.target.value)"
                        placeholder="confirm delete"
                    />
                </div>
            </div>
            <div class="confirm-dialog-footer">
                <button @click="$emit('cancel')" class="cancel-button">{{ t('cancel') }}</button>
                <button
                    @click="$emit('confirm')"
                    class="confirm-button"
                    :disabled="confirmText !== 'confirm delete' || deleting"
                >
                    <i v-if="deleting" class="fas fa-spinner fa-spin"></i>
                    <span v-else>{{ t('confirm') }}</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useTranslation } from '../../../utils/i18n';

const { t } = useTranslation();

const props = defineProps({
    selectedRepos: {
        type: Array,
        required: true,
    },
    confirmText: {
        type: String,
        default: '',
    },
    deleting: {
        type: Boolean,
        default: false,
    },
    getRepoById: {
        type: Function,
        required: true,
    },
});

defineEmits(['update:confirmText', 'cancel', 'confirm']);
</script>
<style scoped>
.confirm-dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.confirm-dialog {
    background-color: white;
    border-radius: 8px;
    width: 90%;
    max-width: 420px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    animation: dialogFadeIn 0.2s ease-out;
}

@keyframes dialogFadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.confirm-dialog-header {
    padding: 12px;
    border-bottom: 1px solid var(--border-color);
}

.confirm-dialog-header h2 {
    font-size: 1.1rem;
    color: var(--text-color);
    margin: 0;
}

.confirm-dialog-body {
    padding: 12px;
    overflow: auto;
    max-height: 60vh;
}

.warning-text {
    color: var(--danger-color);
    font-weight: 500;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
}

.confirm-repos-list {
    max-height: 120px;
    overflow: auto;
    margin: 10px 0;
    padding: 6px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    background-color: var(--bg-color);
}

.confirm-repo-item {
    padding: 3px 6px;
    font-size: 0.85rem;
}

.confirm-repo-item:not(:last-child) {
    border-bottom: 1px solid var(--border-color);
}

.confirm-input {
    margin-top: 12px;
}

.confirm-input label {
    display: block;
    margin-bottom: 6px;
    font-size: 0.85rem;
}

.confirm-input input {
    width: 100%;
    padding: 8px 10px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    font-size: 0.85rem;
}

.confirm-dialog-footer {
    padding: 12px;
    border-top: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 6px;
}

.cancel-button {
    padding: 8px 16px;
    background-color: var(--bg-color);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    font-size: 0.85rem;
    cursor: pointer;
    transition: background-color 0.2s;
}

.cancel-button:hover {
    background-color: var(--hover-bg);
}

.confirm-button {
    padding: 8px 16px;
    background-color: var(--danger-color);
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 0.85rem;
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    gap: 4px;
}

.confirm-button:hover {
    background-color: var(--secondary-color);
}

.confirm-button:disabled {
    background-color: #b8c1c8;
    cursor: not-allowed;
}
</style>
