<template>
    <header class="header">
        <div class="logo">
            <img src="/icons/icon-128.png" alt="Delete Repos" />
            <h1> Delete Repos </h1>
        </div>
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
    </header>
</template>

<script setup>
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

defineEmits(['changePlatform']);
</script>
<style scoped>
.header {
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    color: white;
    padding: 10px 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo {
    display: flex;
    align-items: center;
    gap: 8px;
}

.logo img {
    width: 24px;
    height: 24px;
}

.logo h1 {
    font-size: 1.3rem;
    margin: 0;
    font-weight: 500;
}

.platform-selector {
    display: flex;
    gap: 6px;
}

.platform-selector button {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 4px;
    padding: 6px 10px;
    color: white;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.9rem;
    position: relative;
}

.platform-selector button:hover {
    background: rgba(255, 255, 255, 0.2);
}

.platform-selector button.active {
    background: rgba(255, 255, 255, 0.25);
    font-weight: 500;
}

.status-icon {
    color: #4cd964;
    font-size: 0.7rem;
    margin-left: 4px;
}
</style>
