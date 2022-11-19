import { fetchData as fetchGitData, GitData } from './fetchers/git';
import { fetchData as fetchJenkinsData, JenkinsData } from './fetchers/jenkins';

/**
 * Manages data served by the API.
 */
export class DataManager {
  jenkins?: JenkinsData;
  git?: GitData;

  setup: Promise<void>;

  constructor() {
    this.setup = this.refresh().then(() => {
      console.log('Finished initial data fetch');

      setInterval(async () => {
        await this.refreshJenkins();
        await this.refreshGit();
      }, 120000); // 2 min
    });
  }

  async awaitInitialFetch() {
    await this.setup;
  }

  refresh(): Promise<any> {
    return Promise.all([this.refreshJenkins(), this.refreshGit()]);
  }

  async refreshJenkins() {
    this.jenkins = (await fetch(fetchJenkinsData)) || this.jenkins;
  }

  async refreshGit() {
    this.git = (await fetch(fetchGitData)) || this.git;
  }
}

async function fetch<T>(func: () => Promise<T>): Promise<T | undefined> {
  try {
    const data = await func();
    return data;
  } catch (err) {
    console.error('Error fetching data', err);
  }
}
