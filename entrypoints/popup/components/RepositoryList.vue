<template>
    <div class="repos-container">
        <div class="tools-bar">
            <div class="search-bar">
                <input
                    type="text"
                    :value="searchQuery"
                    @input="$emit('update:searchQuery', $event.target.value)"
                    placeholder="搜索仓库..."
                    class="search-input"
                />
                <select
                    :value="repoType"
                    @change="$emit('update:repoType', $event.target.value)"
                    class="repo-type-select"
                >
                    <option value="all">所有仓库</option>
                    <option value="owner">我的仓库</option>
                </select>
            </div>
            <div class="selection-tools">
                <button @click="$emit('selectAll')" class="tool-button">全选</button>
                <button @click="$emit('deselectAll')" class="tool-button">取消全选</button>
                <button @click="$emit('logout')" class="tool-button logout-button">
                    <i class="fas fa-sign-out-alt"></i>
                </button>
            </div>
        </div>

        <div class="repos-stats">共找到 <span class="repos-count">{{ repos.length }}</span> 个仓库</div>

        <div v-if="loading" class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            <span>正在加载仓库...</span>
        </div>

        <div v-else-if="repos.length === 0" class="no-repos">
            <i class="fas fa-folder-open"></i>
            <span>没有找到仓库</span>
        </div>

        <div v-else class="repos-list">
            <div
                v-for="repo in repos"
                :key="repo.id"
                class="repo-item"
                :class="{ 'repo-selected': selectedRepos.includes(repo.id) }"
            >
                <div class="repo-checkbox">
                    <input
                        type="checkbox"
                        :id="`repo-${repo.id}`"
                        :checked="selectedRepos.includes(repo.id)"
                        @change="updateSelection(repo.id, $event.target.checked)"
                    />
                </div>
                <div class="repo-info">
                    <label :for="`repo-${repo.id}`" class="repo-name">
                        {{ repo.name }}
                        <a :href="repo.html_url" target="_blank" class="repo-link">
                            <i class="fas fa-external-link-alt"></i>
                        </a>
                    </label>
                    <div class="repo-desc">{{ repo.description || '没有描述' }}</div>
                    <div class="repo-meta">
                        <span class="repo-visibility" :class="repo.private ? 'private' : 'public'">
                            <i :class="repo.private ? 'fas fa-lock' : 'fas fa-globe'"></i>
                            {{ repo.private ? '私有' : '公开' }}
                        </span>
                        <span class="repo-stars">
                            <i class="fas fa-star"></i>
                            {{ repo.stargazers_count || 0 }}
                        </span>
                        <span class="repo-forks">
                            <i class="fas fa-code-branch"></i>
                            {{ repo.forks_count || 0 }}
                        </span>
                        <span class="repo-updated">
                            <i class="fas fa-clock"></i>
                            更新于 {{ formatDate(repo.updated_at) }}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <div class="action-bar">
            <div class="selection-info"> 已选择 {{ selectedRepos.length }} 个仓库 </div>
            <button @click="$emit('confirmDelete')" class="delete-button" :disabled="selectedRepos.length === 0">
                <i class="fas fa-trash-alt"></i>
                删除选定仓库
            </button>
        </div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    loading: {
        type: Boolean,
        default: false,
    },
    repos: {
        type: Array,
        default: () => [],
    },
    selectedRepos: {
        type: Array,
        default: () => [],
    },
    searchQuery: {
        type: String,
        default: '',
    },
    repoType: {
        type: String,
        default: 'all',
    },
});

const emit = defineEmits([
    'update:selectedRepos',
    'update:searchQuery',
    'update:repoType',
    'selectAll',
    'deselectAll',
    'logout',
    'confirmDelete',
]);

// 更新选择状态
const updateSelection = (repoId, isChecked) => {
    const newSelection = [...props.selectedRepos];
    if (isChecked) {
        if (!newSelection.includes(repoId)) {
            newSelection.push(repoId);
        }
    } else {
        const index = newSelection.indexOf(repoId);
        if (index !== -1) {
            newSelection.splice(index, 1);
        }
    }
    emit('update:selectedRepos', newSelection);
};

// 格式化日期
const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};
</script>
<style scoped>
.repos-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  padding-bottom: 50px;
}

.tools-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  gap: 6px;
  flex-wrap: wrap;
}

.search-bar {
  display: flex;
  gap: 6px;
  flex: 1;
}

.search-input {
  flex: 1;
  padding: 6px 10px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 0.85rem;
}

.repo-type-select {
  padding: 6px 10px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: white;
  font-size: 0.85rem;
}

.selection-tools {
  display: flex;
  gap: 6px;
}

.tool-button {
  padding: 6px 10px;
  background-color: white;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: background-color 0.2s;
}

.tool-button:hover {
  background-color: var(--hover-bg);
}

.logout-button {
  background-color: var(--danger-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.logout-button:hover {
  background-color: #d32f2f;
}

.repos-stats {
  margin-bottom: 12px;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.repos-count {
  font-weight: bold;
  color: var(--primary-color);
}

.loading, .no-repos {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 150px;
  color: var(--text-secondary);
  font-size: 0.9rem;
  gap: 12px;
}

.loading i, .no-repos i {
  font-size: 1.8rem;
  opacity: 0.7;
}

.repos-list {
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
}

.repo-item {
  background-color: white;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  padding: 10px 12px;
  display: flex;
  margin: 10px 0;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.repo-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  border-color: var(--primary-color);
}

.repo-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background-color: transparent;
  transition: background-color 0.2s;
}

.repo-item:hover::before {
  background-color: var(--primary-color);
}

.repo-selected {
  background-color: rgba(26, 115, 232, 0.05);
  border-color: var(--primary-color);
}

.repo-selected::before {
  background-color: var(--primary-color);
}

.repo-checkbox {
  padding-top: 2px;
  margin-right: 10px;
}

.repo-checkbox input {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: var(--primary-color);
}

.repo-info {
  flex: 1;
}

.repo-name {
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  color: var(--primary-color);
}

.repo-link {
  color: var(--text-secondary);
  font-size: 0.75rem;
  text-decoration: none;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.repo-link:hover {
  opacity: 1;
}

.repo-desc {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin: 4px 0;
  text-align: left;
}

.repo-meta {
  display: flex;
  gap: 12px;
  margin-top: 8px;
  font-size: 0.75rem;
  color: var(--text-secondary);
  flex-wrap: wrap;
}

.repo-meta span {
  display: flex;
  align-items: center;
  gap: 3px;
}

.repo-visibility.private {
  color: #f50057;
}

.repo-visibility.public {
  color: #00c853;
}

.action-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px;
  background-color: white;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 90;
  box-shadow: 0 -2px 5px rgba(0,0,0,0.05);
}

.selection-info {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.delete-button {
  background-color: var(--danger-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.delete-button:hover {
  background-color: #d32f2f;
}

.delete-button:disabled {
  background-color: #b8c1c8;
  cursor: not-allowed;
}
</style>
