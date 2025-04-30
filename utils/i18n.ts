import { ref, computed } from 'vue';
import { getFromStorage, saveToStorage } from './storage';

// 定义语言类型
export type SupportedLanguage = 'zh' | 'en';

// 定义支持的语言
export const SUPPORTED_LANGUAGES: Record<SupportedLanguage, string> = {
  zh: '中文',
  en: 'English',
};

// 默认语言
export const DEFAULT_LANGUAGE: SupportedLanguage = 'zh';

// 定义翻译类型
export type TranslationKey =
  | 'settings' | 'save' | 'cancel' | 'confirm'
  | 'appName'
  | 'enterToken' | 'createTokenHere' | 'inputToken' | 'login' | 'loggingIn'
  | 'searchRepos' | 'allRepos' | 'myRepos' | 'selectAll' | 'deselectAll' | 'logout'
  | 'foundRepos' | 'loadingRepos' | 'noRepos' | 'noDescription' | 'private' | 'public'
  | 'updatedAt' | 'selectedCount' | 'deleteSelected'
  | 'confirmDelete' | 'warning' | 'confirmDeleteRepos' | 'typeConfirm' | 'deleting'
  | 'languageSettings' | 'selectLanguage' | 'tokenSettings' | 'githubToken' | 'giteeToken' | 'saveSuccess';

// 语言翻译
export const translations: Record<SupportedLanguage, Record<TranslationKey, string>> = {
  zh: {
    // 公共部分
    settings: '设置',
    save: '保存',
    cancel: '取消',
    confirm: '确认',

    // TheHeader 组件
    appName: 'Delete Repos',

    // LoginForm 组件
    enterToken: '请输入{platform}的访问令牌',
    createTokenHere: '您可以在这里创建访问令牌',
    inputToken: '输入Token...',
    login: '登录',
    loggingIn: '正在登录...',

    // RepositoryList 组件
    searchRepos: '搜索仓库...',
    allRepos: '所有仓库',
    myRepos: '我的仓库',
    selectAll: '全选',
    deselectAll: '取消全选',
    logout: '退出',
    foundRepos: '共找到 {count} 个仓库',
    loadingRepos: '正在加载仓库...',
    noRepos: '没有找到仓库',
    noDescription: '没有描述',
    private: '私有',
    public: '公开',
    updatedAt: '更新于 {date}',
    selectedCount: '已选择 {count} 个仓库',
    deleteSelected: '删除选定仓库',

    // ConfirmDialog 组件
    confirmDelete: '确认删除',
    warning: '警告：此操作无法撤销！',
    confirmDeleteRepos: '您确定要删除以下 {count} 个仓库吗？',
    typeConfirm: '请输入 "confirm delete" 以确认操作：',
    deleting: '正在删除...',

    // Settings 组件
    languageSettings: '语言设置',
    selectLanguage: '选择语言',
    tokenSettings: 'Token 设置',
    githubToken: 'GitHub Token',
    giteeToken: 'Gitee Token',
    saveSuccess: '设置已保存',
  },
  en: {
    // 公共部分
    settings: 'Settings',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',

    // TheHeader 组件
    appName: 'Delete Repos',

    // LoginForm 组件
    enterToken: 'Enter {platform} access token',
    createTokenHere: 'You can create an access token here',
    inputToken: 'Enter token...',
    login: 'Login',
    loggingIn: 'Logging in...',

    // RepositoryList 组件
    searchRepos: 'Search repositories...',
    allRepos: 'All repositories',
    myRepos: 'My repositories',
    selectAll: 'Select all',
    deselectAll: 'Deselect all',
    logout: 'Logout',
    foundRepos: 'Found {count} repositories',
    loadingRepos: 'Loading repositories...',
    noRepos: 'No repositories found',
    noDescription: 'No description',
    private: 'Private',
    public: 'Public',
    updatedAt: 'Updated at {date}',
    selectedCount: 'Selected {count} repositories',
    deleteSelected: 'Delete selected repositories',

    // ConfirmDialog 组件
    confirmDelete: 'Confirm Delete',
    warning: 'Warning: This action cannot be undone!',
    confirmDeleteRepos: 'Are you sure you want to delete the following {count} repositories?',
    typeConfirm: 'Please type "confirm delete" to confirm this action:',
    deleting: 'Deleting...',

    // Settings 组件
    languageSettings: 'Language Settings',
    selectLanguage: 'Select Language',
    tokenSettings: 'Token Settings',
    githubToken: 'GitHub Token',
    giteeToken: 'Gitee Token',
    saveSuccess: 'Settings saved',
  }
};

// 当前语言
const currentLanguage = ref<SupportedLanguage>(DEFAULT_LANGUAGE);

// 初始化语言设置
export async function initializeLanguage(): Promise<void> {
  const storedLanguage = await getFromStorage<SupportedLanguage>('del-repos-language', DEFAULT_LANGUAGE);
  currentLanguage.value = storedLanguage;
}

// 更改语言
export async function changeLanguage(lang: SupportedLanguage): Promise<void> {
  if (Object.keys(SUPPORTED_LANGUAGES).includes(lang)) {
    currentLanguage.value = lang;
    await saveToStorage('del-repos-language', lang);
  }
}

// 获取翻译文本
export function useTranslation() {
  const t = (key: TranslationKey, params: Record<string, any> = {}) => {
    const translation = translations[currentLanguage.value][key] || key;

    // 替换参数
    return translation.replace(/{([^}]+)}/g, (_: string, p: string) => {
      return params[p] !== undefined ? params[p] : `{${p}}`;
    });
  };

  return {
    t,
    currentLanguage,
    changeLanguage
  };
}
