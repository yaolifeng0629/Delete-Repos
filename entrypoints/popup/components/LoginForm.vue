<template>
    <div class="login-form">
        <h2>请输入{{ platform === 'github' ? 'GitHub' : 'Gitee' }}的访问令牌</h2>
        <div class="token-info">
            <p>
                您可以在
                <a
                    :href="
                        platform === 'github'
                            ? 'https://github.com/settings/tokens/new?scopes=delete_repo,project,repo&description=deleteRepos'
                            : 'https://gitee.com/profile/personal_access_tokens/new'
                    "
                    target="_blank"
                    >这里</a
                >
                创建访问令牌
            </p>
        </div>
        <div class="form-group">
            <input
                type="password"
                :value="currentToken"
                @input="$emit('update:currentToken', $event.target.value)"
                placeholder="输入Token..."
                class="token-input"
            />
            <button @click="$emit('login')" class="login-button" :disabled="loading">
                <i v-if="loading" class="fas fa-spinner fa-spin"></i>
                <span v-else>登录</span>
            </button>
        </div>
        <div v-if="loginError" class="error-message">
            {{ loginError }}
        </div>
    </div>
</template>

<script setup>
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
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
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
}

.login-button:hover {
  background-color: var(--secondary-color);
}

.login-button:disabled {
  background-color: #b8c1c8;
  cursor: not-allowed;
}

.error-message {
  color: var(--danger-color);
  font-size: 0.85rem;
  margin-top: 6px;
}
</style>
