import fs from 'fs';
import git from 'isomorphic-git';
import http from 'isomorphic-git/http/node';
import path from 'path';

export interface GitChangelogData {
  changelog?: ChangelogEntry[];
}

export interface ChangelogEntry {
  version: string;
  timestamp: number;
  title: string;
  commit: string;
}

let cloned = false;

export async function fetchData(): Promise<GitChangelogData> {
  const dir = path.join(process.cwd(), 'spark-git');
  const url = 'https://github.com/lucko/spark';

  if (!cloned) {
    await git.clone({
      fs,
      http,
      dir,
      url,
      noCheckout: true,
    });
    cloned = true;
  } else {
    await git.fetch({
      fs,
      http,
      dir,
    });
  }

  const commitsToTag = await getCommitsToTag(dir);

  let minor: string | null = null;
  let patch = 0;

  const changelog: ChangelogEntry[] = [];

  const commits = await git.log({ fs, dir, ref: 'origin/master' });
  for (const commit of commits.reverse()) {
    const tag = commitsToTag[commit.oid];
    if (tag) {
      minor = tag;
      patch = 0;
    }

    const msg = commit.commit.message.split('\n')[0].trim();
    const version = minor ? `${minor}.${patch}` : `build ${patch + 1}`;

    changelog.push({
      version,
      timestamp: commit.commit.committer.timestamp,
      title: msg,
      commit: commit.oid,
    });
    patch++;
  }

  changelog.reverse();

  return {
    changelog,
  };
}

async function getCommitsToTag(dir: string) {
  const tags = await git.listTags({ fs, dir });
  const commitsToTag: Record<string, string> = {};
  for (const tagName of tags) {
    const ref = await git.resolveRef({ fs, dir, ref: tagName });
    const tag = await git.readTag({ fs, dir, oid: ref });
    if (tag.tag.type === 'commit') {
      commitsToTag[tag.tag.object] = tag.tag.tag;
    }
  }
  return commitsToTag;
}

/*
(async function () {
    await fetchData();
}());
*/
