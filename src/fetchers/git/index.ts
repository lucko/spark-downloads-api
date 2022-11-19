import { fetchData as fetchChangelog, GitChangelogData } from './changelog';

export type GitData = GitChangelogData;

export async function fetchData(): Promise<GitData> {
  const changelog = fetchChangelog();

  return {
    ...(await changelog),
  };
}
