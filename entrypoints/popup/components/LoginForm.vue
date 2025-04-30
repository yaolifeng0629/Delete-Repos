<template>
    <div class="login-form">
        <h2>{{ t('enterToken', { platform: platform === 'github' ? 'GitHub' : 'Gitee' }) }}</h2>
        <div class="token-info">
            <p>
                {{ t('createTokenHere') }}
                <a
                    :href="
                        platform === 'github'
                            ? 'https://github.com/settings/tokens/new?scopes=delete_repo,project,repo&description=deleteRepos'
                            : 'https://gitee.com/profile/personal_access_tokens/new'
                    "
                    target="_blank"
                    >{{ t('createTokenHere') }}</a
                >
            </p>
        </div>
        <div class="form-group">
            <input
                type="password"
                :value="currentToken"
                @input="$emit('update:currentToken', $event.target.value)"
                :placeholder="t('inputToken')"
                class="token-input"
                :disabled="loading"
            />
            <button @click="$emit('login')" class="login-button" :disabled="loading">
                <div v-if="loading" class="flower-loader flower-loader-sm">
                    <div v-for="n in 8" :key="n" class="petal"></div>
                </div>
                <span v-else>{{ t('login') }}</span>
            </button>
        </div>
        <div v-if="loginError" class="error-message">
            {{ loginError }}
        </div>

        <div v-if="loading" class="global-loading">
            <div class="loading-spinner">
                <div class="flower-loader">
                    <div v-for="n in 12" :key="n" class="petal"></div>
                </div>
                <span>{{ t('loggingIn') }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useTranslation } from '../../../utils/i18n';

const { t } = useTranslation();

defineProps({
    platform: {
        type: String,
        required: true,
    },
    loading: {
        type: Boolean,
        default: false,
    },
    loginError: {
        type: String,
        default: '',
    },
    currentToken: {
        type: String,
        default: '',
    },
});

defineEmits(['update:currentToken', 'login']);
</script>
<style scoped>
.login-form {
    background-color: var(--card-bg);
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    max-width: 420px;
    margin: 0 auto;
    margin-top: 20px;
}

.login-form h2 {
    font-size: 1.1rem;
    margin-bottom: 12px;
    color: var(--text-color);
    text-align: center;
}

.token-info {
    background-color: rgba(255, 75, 145, 0.08);
    border-radius: 4px;
    padding: 8px;
    margin-bottom: 12px;
}

.token-info p {
    font-size: 0.85rem;
    color: var(--text-secondary);
}

.token-info a {
    color: var(--primary-color);
    text-decoration: none;
}

.form-group {
    display: flex;
    gap: 6px;
    margin-bottom: 12px;
}

.token-input {
    flex: 1;
    padding: 8px 10px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    font-size: 0.9rem;
}

.login-button {
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background-color 0.2s;
    min-width: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.login-button:hover {
    background-color: var(--secondary-color);
}

.login-button:disabled {
    background-color: #b8c1c8;
    cursor: not-allowed;
}

/* 菊花加载动画 */
.flower-loader {
    position: relative;
    width: 40px;
    height: 40px;
}

.flower-loader-sm {
    width: 20px;
    height: 20px;
}

.flower-loader .petal {
    position: absolute;
    width: 10%;
    height: 30%;
    background-color: currentColor;
    top: 0;
    left: 45%;
    border-radius: 50px;
    transform-origin: center bottom;
    animation: spin 1.2s linear infinite;
}

.flower-loader-sm .petal {
    height: 20%;
}

/* 根据花瓣数量计算旋转角度 */
.flower-loader .petal:nth-child(1) { transform: rotate(0deg); }
.flower-loader .petal:nth-child(2) { transform: rotate(30deg); }
.flower-loader .petal:nth-child(3) { transform: rotate(60deg); }
.flower-loader .petal:nth-child(4) { transform: rotate(90deg); }
.flower-loader .petal:nth-child(5) { transform: rotate(120deg); }
.flower-loader .petal:nth-child(6) { transform: rotate(150deg); }
.flower-loader .petal:nth-child(7) { transform: rotate(180deg); }
.flower-loader .petal:nth-child(8) { transform: rotate(210deg); }
.flower-loader .petal:nth-child(9) { transform: rotate(240deg); }
.flower-loader .petal:nth-child(10) { transform: rotate(270deg); }
.flower-loader .petal:nth-child(11) { transform: rotate(300deg); }
.flower-loader .petal:nth-child(12) { transform: rotate(330deg); }

/* 菊花花瓣动画 */
@keyframes spin {
    0% {
        opacity: 1;
    }
    100% {
        opacity: 0.15;
    }
}

/* 菊花整体旋转 */
.flower-loader {
    animation: rotate 1s linear infinite;
}

@keyframes rotate {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

.error-message {
    color: var(--danger-color);
    font-size: 0.85rem;
    margin-top: 6px;
}

.global-loading {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 50;
    border-radius: 8px;
    backdrop-filter: blur(2px);
}

.loading-spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    color: var(--primary-color);
}

.loading-spinner span {
    font-size: 1rem;
    font-weight: 500;
}
</style>
