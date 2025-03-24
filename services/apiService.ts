/**
 * API服务 - 处理与GitHub和Gitee平台的API交互
 */

// 仓库类型定义
export interface Repository {
  id: number;
  name: string;
  description: string | null;
  private: boolean;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  owner: {
    login: string;
  };
  fork: boolean;
}

/**
 * 获取GitHub或Gitee仓库列表
 * @param platform 平台名称（github或gitee）
 * @param token 访问令牌
 * @returns 仓库列表
 */
export async function getRepositories(
  platform: string,
  token: string
): Promise<Repository[]> {
  try {
    if (platform === 'github') {
      return await getGithubRepositories(token);
    } else if (platform === 'gitee') {
      return await getGiteeRepositories(token);
    } else {
      throw new Error(`不支持的平台: ${platform}`);
    }
  } catch (error) {
    console.error('获取仓库列表失败:', error);
    throw error;
  }
}

/**
 * 删除GitHub或Gitee仓库
 * @param platform 平台名称（github或gitee）
 * @param token 访问令牌
 * @param owner 仓库所有者
 * @param repo 仓库名称
 */
export async function deleteRepository(
  platform: string,
  token: string,
  owner: string,
  repo: string
): Promise<void> {
  try {
    if (platform === 'github') {
      await deleteGithubRepository(token, owner, repo);
    } else if (platform === 'gitee') {
      await deleteGiteeRepository(token, owner, repo);
    } else {
      throw new Error(`不支持的平台: ${platform}`);
    }
  } catch (error) {
    console.error(`删除仓库 ${owner}/${repo} 失败:`, error);
    throw error;
  }
}

/**
 * 获取GitHub仓库列表
 * @param token GitHub访问令牌
 * @returns 仓库列表
 */
async function getGithubRepositories(token: string): Promise<Repository[]> {
  // GitHub API每页最多100个仓库
  const perPage = 100;
  let page = 1;
  let allRepos: Repository[] = [];
  let hasMoreRepos = true;

  while (hasMoreRepos) {
    const response = await fetch(
      `https://api.github.com/user/repos?per_page=${perPage}&page=${page}`,
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `GitHub API错误 (${response.status}): ${error.message || '未知错误'}`
      );
    }

    const repos = await response.json();
    allRepos = [...allRepos, ...repos];

    // 检查是否还有更多页
    hasMoreRepos = repos.length === perPage;
    page++;
  }

  return allRepos;
}

/**
 * 获取Gitee仓库列表
 * @param token Gitee访问令牌
 * @returns 仓库列表
 */
async function getGiteeRepositories(token: string): Promise<Repository[]> {
  // Gitee API每页最多100个仓库
  const perPage = 100;
  let page = 1;
  let allRepos: Repository[] = [];
  let hasMoreRepos = true;

  while (hasMoreRepos) {
    const response = await fetch(
      `https://gitee.com/api/v5/user/repos?access_token=${token}&per_page=${perPage}&page=${page}`,
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Gitee API错误 (${response.status}): ${error.message || '未知错误'}`
      );
    }

    const repos = await response.json();
    allRepos = [...allRepos, ...repos];

    // 检查是否还有更多页
    hasMoreRepos = repos.length === perPage;
    page++;
  }

  return allRepos;
}

/**
 * 删除GitHub仓库
 * @param token GitHub访问令牌
 * @param owner 仓库所有者
 * @param repo 仓库名称
 */
async function deleteGithubRepository(
  token: string,
  owner: string,
  repo: string
): Promise<void> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  );

  if (!response.ok) {
    // 对于删除操作，GitHub可能返回204 No Content
    if (response.status !== 204) {
      let errorMsg = `GitHub API错误 (${response.status})`;
      try {
        const error = await response.json();
        errorMsg += `: ${error.message || '未知错误'}`;
      } catch {
        // 忽略JSON解析错误
      }
      throw new Error(errorMsg);
    }
  }
}

/**
 * 删除Gitee仓库
 * @param token Gitee访问令牌
 * @param owner 仓库所有者
 * @param repo 仓库名称
 */
async function deleteGiteeRepository(
  token: string,
  owner: string,
  repo: string
): Promise<void> {
  const response = await fetch(
    `https://gitee.com/api/v5/repos/${owner}/${repo}?access_token=${token}`,
    {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
      },
    }
  );

  if (!response.ok) {
    let errorMsg = `Gitee API错误 (${response.status})`;
    try {
      const error = await response.json();
      errorMsg += `: ${error.message || '未知错误'}`;
    } catch {
      // 忽略JSON解析错误
    }
    throw new Error(errorMsg);
  }
}
