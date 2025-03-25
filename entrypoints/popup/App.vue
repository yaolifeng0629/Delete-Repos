<template>
  <div class="popup-container">
    <TheHeader :platform="platform" :githubLoggedIn="githubLoggedIn" :giteeLoggedIn="giteeLoggedIn" @changePlatform="changePlatform" />

    <main class="main-content">
      <!-- 登录表单 -->
      <LoginForm
        v-if="!isLoggedIn"
        :platform="platform"
        :loading="loading"
        :loginError="loginError"
        :currentToken="currentToken"
        @update:currentToken="updateToken"
        @login="login"
      />

      <!-- 仓库列表 -->
      <RepositoryList
        v-else
        :loading="loading"
        :repos="filteredRepos"
        :selectedRepos="selectedRepos"
        :repoType="repoType"
        :searchQuery="searchQuery"
        @update:repoType="repoType = $event"
        @update:searchQuery="searchQuery = $event"
        @update:selectedRepos="selectedRepos = $event"
        @selectAll="selectAll"
        @deselectAll="deselectAll"
        @logout="logout"
        @confirmDelete="confirmDelete"
      />
    </main>

    <!-- 确认对话框 -->
    <ConfirmDialog
      v-if="showConfirmDialog"
      :selectedRepos="selectedRepos"
      :confirmText="confirmText"
      :deleting="deleting"
      :getRepoById="getRepoById"
      @update:confirmText="confirmText = $event"
      @cancel="cancelDelete"
      @confirm="executeDelete"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, defineAsyncComponent } from 'vue';
import { useStorage } from '@vueuse/core';
import { getRepositories, deleteRepository } from '../../services/apiService';

// 异步加载组件以提高性能
const TheHeader = defineAsyncComponent(() => import('./components/TheHeader.vue'));
const LoginForm = defineAsyncComponent(() => import('./components/LoginForm.vue'));
const RepositoryList = defineAsyncComponent(() => import('./components/RepositoryList.vue'));
const ConfirmDialog = defineAsyncComponent(() => import('./components/ConfirmDialog.vue'));

// 状态管理
const platform = useStorage('del-repos-platform', 'github');
const githubToken = useStorage('del-repos-github-token', '');
const giteeToken = useStorage('del-repos-gitee-token', '');

// 计算属性创建双向绑定的token
const currentToken = computed({
  get: () => platform.value === 'github' ? githubToken.value : giteeToken.value,
  set: (newValue) => updateToken(newValue)
});

const updateToken = (newValue) => {
  if (platform.value === 'github') {
    githubToken.value = newValue;
  } else {
    giteeToken.value = newValue;
  }
};

const githubLoggedIn = ref(false);
const giteeLoggedIn = ref(false);
const isLoggedIn = computed(() => platform.value === 'github' ? githubLoggedIn.value : giteeLoggedIn.value);
const loading = ref(false);
const loginError = ref('');
const repos = ref([]);
const searchQuery = ref('');
const repoType = useStorage('del-repos-repo-type', 'all');
const selectedRepos = ref([]);
const showConfirmDialog = ref(false);
const confirmText = ref('');
const deleting = ref(false);
const deleteResults = ref({
  success: [],
  failed: []
});

// 计算属性
const filteredRepos = computed(() => {
  let result = repos.value;

  // 根据类型筛选
  if (repoType.value === 'owner') {
    result = result.filter(repo => !repo.fork);
  }

  // 根据搜索词筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(repo =>
      repo.name.toLowerCase().includes(query) ||
      (repo.description && repo.description.toLowerCase().includes(query))
    );
  }

  return result;
});

// 平台切换方法
const changePlatform = (newPlatform) => {
  platform.value = newPlatform;
};

// 监听平台切换，加载对应平台的仓库
watch(platform, async (newPlatform) => {
  if ((newPlatform === 'github' && githubLoggedIn.value) ||
      (newPlatform === 'gitee' && giteeLoggedIn.value)) {
    await loadRepositories();
  } else {
    repos.value = [];
  }
});

// 加载仓库
const loadRepositories = async () => {
  loading.value = true;
  try {
    const fetchedRepos = await getRepositories(platform.value, currentToken.value);
    repos.value = fetchedRepos;
  } catch (error) {
    console.error('加载仓库失败:', error);
  } finally {
    loading.value = false;
  }
};

// 方法
const login = async () => {
  if (!currentToken.value) {
    loginError.value = 'Token不能为空';
    return;
  }

  loading.value = true;
  loginError.value = '';

  try {
    const fetchedRepos = await getRepositories(platform.value, currentToken.value);
    repos.value = fetchedRepos;
    if (platform.value === 'github') {
      githubLoggedIn.value = true;
    } else {
      giteeLoggedIn.value = true;
    }
  } catch (error) {
    loginError.value = `登录失败: ${error.message}`;
    console.error('Login error:', error);
    // 登录失败时清除token
    if (platform.value === 'github') {
      githubToken.value = '';
    } else {
      giteeToken.value = '';
    }
  } finally {
    loading.value = false;
  }
};

const logout = () => {
  if (platform.value === 'github') {
    githubLoggedIn.value = false;
    githubToken.value = '';
  } else {
    giteeLoggedIn.value = false;
    giteeToken.value = '';
  }
  repos.value = [];
  selectedRepos.value = [];
};

const selectAll = () => {
  selectedRepos.value = filteredRepos.value.map(repo => repo.id);
};

const deselectAll = () => {
  selectedRepos.value = [];
};

const confirmDelete = () => {
  if (selectedRepos.value.length === 0) return;
  showConfirmDialog.value = true;
  confirmText.value = '';
};

const cancelDelete = () => {
  showConfirmDialog.value = false;
  confirmText.value = '';
};

const getRepoById = (id) => {
  return repos.value.find(repo => repo.id === id) || { name: 'Unknown' };
};

const executeDelete = async () => {
  if (confirmText.value !== 'confirm delete') return;

  deleting.value = true;
  loading.value = true; // 添加全局loading状态
  showConfirmDialog.value = false; // 关闭确认对话框，显示全局loading
  deleteResults.value = {
    success: [],
    failed: []
  };

  try {
    for (const repoId of selectedRepos.value) {
      const repo = getRepoById(repoId);
      try {
        await deleteRepository(platform.value, currentToken.value, repo.owner.login, repo.name);
        // 从本地列表中移除已删除的仓库
        const index = repos.value.findIndex(r => r.id === repoId);
        if (index !== -1) {
          repos.value.splice(index, 1);
        }
        deleteResults.value.success.push(repo.name);
      } catch (error) {
        console.error(`Failed to delete ${repo.name}:`, error);
        deleteResults.value.failed.push({ name: repo.name, error: error.message });
      }
    }

    // 重新获取仓库列表以确保同步
    await loadRepositories();
    selectedRepos.value = [];

  } catch (error) {
    console.error('Delete operation error:', error);
  } finally {
    deleting.value = false;
    loading.value = false; // 删除操作完成后，关闭loading状态
  }
};

// 生命周期钩子
onMounted(async () => {
  // 自动登录
  if (githubToken.value) {
    try {
      loading.value = true;
      platform.value = 'github';
      const fetchedRepos = await getRepositories('github', githubToken.value);
      if (platform.value === 'github') { // 如果用户没有切换平台
        repos.value = fetchedRepos;
        githubLoggedIn.value = true;
      }
    } catch (error) {
      console.error('GitHub Auto login error:', error);
      // 自动登录失败不显示错误，只是不登录
    } finally {
      loading.value = false;
    }
  }

  // 如果当前没有显示仓库且有Gitee令牌，则尝试登录Gitee
  if (repos.value.length === 0 && giteeToken.value) {
    try {
      loading.value = true;
      platform.value = 'gitee';
      const fetchedRepos = await getRepositories('gitee', giteeToken.value);
      repos.value = fetchedRepos;
      giteeLoggedIn.value = true;
    } catch (error) {
      console.error('Gitee Auto login error:', error);
    } finally {
      loading.value = false;
    }
  }
});
</script>

<style>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');

/* 基础样式变量 - 如果已在base.css中定义，可以移除这部分 */
:root {
  --primary-color: #1a73e8;
  --secondary-color: #174ea6;
  --github-color: #24292e;
  --gitee-color: #c71d23;
  --danger-color: #ea4335;
  --success-color: #34a853;
  --bg-color: #f8f9fa;
  --card-bg: #ffffff;
  --text-color: #202124;
  --text-secondary: #5f6368;
  --border-color: #dadce0;
  --hover-bg: #f1f3f4;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: var(--text-color);
  background-color: var(--bg-color);
}

.popup-container {
  width: 500px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 580px;
  position: relative;
}

.main-content {
  flex: 1;
  overflow: auto;
  padding: 10px;
  background-color: var(--bg-color);
}

/* 确保全局样式，如操作栏能被正确应用 */
.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 90;
  background-color: white;
  border-top: 1px solid var(--border-color);
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 -2px 5px rgba(0,0,0,0.05);
}
</style>
