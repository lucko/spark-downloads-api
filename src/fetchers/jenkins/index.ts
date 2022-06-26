import { fetchData as fetchChangeLog, JenkinsChangelogData } from './changelog';
import { fetchData as fetchLatest, JenkinsLatestBuildData } from './latest';

export type JenkinsData = JenkinsLatestBuildData & JenkinsChangelogData;

export async function fetchData(): Promise<JenkinsData> {
  const latest = fetchLatest();
  const changeLog = fetchChangeLog();

  return {
    ...(await latest),
    ...(await changeLog),
  };
}
