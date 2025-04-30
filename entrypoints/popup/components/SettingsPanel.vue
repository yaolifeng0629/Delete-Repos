<template>
    <div class="settings-panel">
        <h2 class="settings-title">{{ t('settings') }}</h2>

        <div class="settings-section">
            <h3>{{ t('languageSettings') }}</h3>
            <div class="settings-item">
                <label for="language-select">{{ t('selectLanguage') }}</label>
                <select
                    id="language-select"
                    v-model="selectedLanguage"
                    class="settings-select"
                >
                    <option v-for="(name, code) in SUPPORTED_LANGUAGES" :key="code" :value="code">
                        {{ name }}
                    </option>
                </select>
            </div>
        </div>

        <div class="settings-section">
            <h3>{{ t('tokenSettings') }}</h3>

            <div class="settings-item">
                <label for="github-token">{{ t('githubToken') }}</label>
                <input
                    type="password"
                    id="github-token"
                    v-model="githubTokenInput"
                    class="settings-input"
                />
            </div>

            <div class="settings-item">
                <label for="gitee-token">{{ t('giteeToken') }}</label>
                <input
                    type="password"
                    id="gitee-token"
                    v-model="giteeTokenInput"
                    class="settings-input"
                />
            </div>
        </div>

        <div class="settings-actions">
            <button @click="$emit('close')" class="cancel-button">{{ t('cancel') }}</button>
            <button @click="saveSettings" class="save-button">{{ t('save') }}</button>
        </div>

        <div v-if="saveMessage" class="save-message">
            {{ saveMessage }}
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useTranslation, SUPPORTED_LANGUAGES } from '../../../utils/i18n';
import { getStorageWithExpiry, setStorageWithExpiry } from '../../../utils/storage';

const { t, currentLanguage, changeLanguage } = useTranslation();

const props = defineProps({
    githubToken: {
        type: String,
        default: '',
    },
    giteeToken: {
        type: String,
        default: '',
    },
});

const emit = defineEmits(['update:githubToken', 'update:giteeToken', 'close']);

// 表单数据
const selectedLanguage = ref(currentLanguage.value);
const githubTokenInput = ref(props.githubToken);
const giteeTokenInput = ref(props.giteeToken);
const saveMessage = ref('');

// 保存设置
const saveSettings = async () => {
    // 保存语言设置
    if (selectedLanguage.value !== currentLanguage.value) {
        await changeLanguage(selectedLanguage.value);
    }

    // 如果 token 有变更，保存并发送到父组件
    if (githubTokenInput.value !== props.githubToken) {
        emit('update:githubToken', githubTokenInput.value);
        if (githubTokenInput.value) {
            setStorageWithExpiry('del-repos-github-token', githubTokenInput.value, 30 * 24 * 60 * 60 * 1000); // 30天
        } else {
            localStorage.removeItem('del-repos-github-token');
        }
    }

    if (giteeTokenInput.value !== props.giteeToken) {
        emit('update:giteeToken', giteeTokenInput.value);
        if (giteeTokenInput.value) {
            setStorageWithExpiry('del-repos-gitee-token', giteeTokenInput.value, 30 * 24 * 60 * 60 * 1000); // 30天
        } else {
            localStorage.removeItem('del-repos-gitee-token');
        }
    }

    // 显示保存成功消息
    saveMessage.value = t('saveSuccess');
    setTimeout(() => {
        saveMessage.value = '';
    }, 2000);
};

// 组件挂载时加载令牌
onMounted(() => {
    // 令牌已通过属性传入，不需要在这里重新加载
});
</script>

<style scoped>
.settings-panel {
    background-color: var(--card-bg);
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    width: 500px;
    margin: 0 auto;
    position: relative;
}

.settings-title {
    font-size: 1.2rem;
    margin-bottom: 16px;
    color: var(--text-color);
    text-align: center;
}

.settings-section {
    margin-bottom: 20px;
}

.settings-section h3 {
    font-size: 1rem;
    margin-bottom: 10px;
    color: var(--text-color);
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 5px;
}

.settings-item {
    margin-bottom: 12px;
}

.settings-item label {
    display: block;
    margin-bottom: 5px;
    font-size: 0.9rem;
    color: var(--text-secondary);
}

.settings-input, .settings-select {
    width: 100%;
    padding: 8px 10px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    font-size: 0.9rem;
}

.settings-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

.cancel-button {
    padding: 8px 16px;
    background-color: var(--bg-color);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    font-size: 0.9rem;
    cursor: pointer;
}

.save-button {
    padding: 8px 16px;
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 0.9rem;
    cursor: pointer;
}

.save-message {
    position: absolute;
    bottom: 16px;
    left: 0;
    right: 0;
    text-align: center;
    color: var(--success-color);
    font-size: 0.9rem;
    animation: fadeIn 0.3s;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
</style>
