<template>
    <header class="header">
        <div class="logo">
            <img src="/icons/icon-128.png" alt="Delete Repos" />
            <h1>{{ t('appName') }}</h1>
        </div>
        <div class="actions">
            <div class="platform-selector">
                <button :class="{ active: platform === 'github' }" @click="$emit('changePlatform', 'github')">
                    <i class="fab fa-github"></i> GitHub
                    <i v-if="githubLoggedIn" class="fas fa-check status-icon"></i>
                </button>
                <button :class="{ active: platform === 'gitee' }" @click="$emit('changePlatform', 'gitee')">
                    <i class="fab fa-git-alt"></i> Gitee
                    <i v-if="giteeLoggedIn" class="fas fa-check status-icon"></i>
                </button>
            </div>
            <button class="settings-button" @click="$emit('openSettings')">
                <i class="fas fa-cog"></i>
            </button>
        </div>
    </header>
</template>

<script setup>
import { useTranslation } from '../../../utils/i18n';

const { t } = useTranslation();

defineProps({
    platform: {
        type: String,
        required: true,
    },
    githubLoggedIn: {
        type: Boolean,
        default: false,
    },
    giteeLoggedIn: {
        type: Boolean,
        default: false,
    },
});

defineEmits(['changePlatform', 'openSettings']);
</script>
<style scoped>
.header {
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
    color: white;
    padding: 14px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    position: relative;
    overflow: hidden;
}

.header::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 70%);
    z-index: 1;
    pointer-events: none;
}

.logo {
    display: flex;
    align-items: center;
    gap: 10px;
    position: relative;
    z-index: 2;
}

.logo img {
    width: 28px;
    height: 28px;
    filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.2));
    transition: transform 0.3s ease;
}

.logo img:hover {
    transform: scale(1.05);
}

.logo h1 {
    font-size: 1.4rem;
    margin: 0;
    font-weight: 600;
    letter-spacing: -0.5px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.actions {
    display: flex;
    align-items: center;
    gap: 12px;
    position: relative;
    z-index: 2;
}

.platform-selector {
    display: flex;
    gap: 8px;
}

.platform-selector button {
    background: rgba(255, 255, 255, 0.12);
    border: none;
    border-radius: 6px;
    padding: 8px 12px;
    color: white;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.95rem;
    position: relative;
    font-weight: 400;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.platform-selector button:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
}

.platform-selector button.active {
    background: rgba(255, 255, 255, 0.25);
    font-weight: 500;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

.status-icon {
    color: #4cd964;
    font-size: 0.75rem;
    filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.2));
}

.settings-button {
    background: rgba(255, 255, 255, 0.12);
    border: none;
    border-radius: 6px;
    width: 36px;
    height: 36px;
    color: white;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.settings-button:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px) rotate(15deg);
}

.settings-button i {
    font-size: 1.1rem;
}
</style>
