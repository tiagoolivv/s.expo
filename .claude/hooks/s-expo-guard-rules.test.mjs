// Hooks run on plain Node with no install step, so their tests use Node's
// built-in runner (pnpm test:hooks) rather than Jest or Vitest.
import assert from 'node:assert/strict';
// eslint-disable-next-line test/no-import-node-test
import { describe, it } from 'node:test';

import { decide, decidePath, decideShell, shouldLint, toRepoPath } from './s-expo-guard-rules.mjs';

const ROOT = '/work/s-expo';

describe('decideShell', () => {
  const blocked = [
    'git push --force origin main',
    'git push -f origin master',
    'git push origin +main',
    'git push -uf origin main',
    'git push --force "main"',
    'git commit "--no-verify" -m wip',
    'echo SECRET=1 > .env.local',
    'printf x | tee -a .env',
    'cat > ios/Podfile <<EOF\nx\nEOF',
    'git push --force-with-lease origin main',
    'git commit -m "x" --no-verify',
    'git push --no-verify',
    'rm -rf /',
    'rm -rf ~',
    'rm -fr .',
    'rm -rf *',
    'eas build --profile production --platform ios',
    'eas build --platform android --profile=production',
    'eas submit --platform ios',
    'git commit --no-verify -m "feat: x"',
    'git commit -F - <<\'EOF\'\nmsg\nEOF\ngit push --no-verify',
  ];
  for (const command of blocked) {
    it(`blocks: ${command}`, () => {
      const decision = decideShell(command);
      assert.equal(decision.allow, false);
      assert.match(decision.reason, /\S/);
    });
  }

  const allowed = [
    'git push -u origin feat/profile',
    'git push --force-with-lease origin feat/profile',
    'git commit -m "feat(home): add title"',
    'rm -rf node_modules',
    'rm -rf ./coverage',
    'eas build --profile preview --platform android',
    'pnpm check-all',
    '',
    // Flags quoted inside a message or a heredoc body are text, not flags.
    'git commit -m "docs: never use --no-verify"',
    'git commit -q -F - <<\'EOF\'\nchore: block --no-verify and git push --force origin main\n\nCo-Authored-By: x\nEOF\ngit log --oneline -1',
    'echo \'rm -rf /\'',
    'cp .env.development.example .env.local.example',
    'cat .env.development.example',
  ];
  for (const command of allowed) {
    it(`allows: ${command || '(empty)'}`, () => {
      assert.deepEqual(decideShell(command), { allow: true });
    });
  }
});

describe('decidePath', () => {
  const blocked = [
    `${ROOT}/ios/Podfile`,
    `${ROOT}/android/app/build.gradle`,
    `${ROOT}/.env`,
    `${ROOT}/.env.local`,
    `${ROOT}/.env.production`,
    `${ROOT}/pnpm-lock.yaml`,
    `${ROOT}/uniwind-types.d.ts`,
    `${ROOT}/tools/crapper/src/crapper/cli.py`,
    `${ROOT}/src/../ios/Podfile`,
    `${ROOT}/./android/x.gradle`,
  ];
  for (const path of blocked) {
    it(`blocks: ${path}`, () => {
      assert.equal(decidePath(path, ROOT).allow, false);
    });
  }

  const allowed = [
    `${ROOT}/.env.development.example`,
    `${ROOT}/src/features/home/home-screen.tsx`,
    `${ROOT}/app.config.ts`,
    `${ROOT}/docs/ios-notes.md`,
    'src/lib/utils.ts',
  ];
  for (const path of allowed) {
    it(`allows: ${path}`, () => {
      assert.deepEqual(decidePath(path, ROOT), { allow: true });
    });
  }
});

describe('decide', () => {
  it('routes Bash events to the shell rules', () => {
    const event = { tool_name: 'Bash', tool_input: { command: 'git push --force origin main' } };
    assert.equal(decide(event, ROOT).allow, false);
  });

  it('routes file events to the path rules', () => {
    const event = { tool_name: 'Edit', tool_input: { file_path: `${ROOT}/ios/Podfile` } };
    assert.equal(decide(event, ROOT).allow, false);
  });

  it('checks the notebook path of NotebookEdit events', () => {
    const event = { tool_name: 'NotebookEdit', tool_input: { notebook_path: `${ROOT}/ios/x.ipynb` } };
    assert.equal(decide(event, ROOT).allow, false);
  });

  it('allows events it has no rule for', () => {
    assert.deepEqual(decide({ tool_name: 'Read', tool_input: {} }, ROOT), { allow: true });
    assert.deepEqual(decide(undefined, ROOT), { allow: true });
  });
});

describe('toRepoPath', () => {
  it('strips the project root and a leading ./', () => {
    assert.equal(toRepoPath(`${ROOT}/src/a.ts`, ROOT), 'src/a.ts');
    assert.equal(toRepoPath('./src/a.ts', ROOT), 'src/a.ts');
    assert.equal(toRepoPath('C:\\work\\s-expo\\src\\a.ts', 'C:\\work\\s-expo\\'), 'src/a.ts');
  });
});

describe('shouldLint', () => {
  it('lints source and config files inside the project', () => {
    assert.equal(shouldLint(`${ROOT}/src/lib/utils.ts`, ROOT), true);
    assert.equal(shouldLint(`${ROOT}/src/translations/en-us.json`, ROOT), true);
    assert.equal(shouldLint(`${ROOT}/app.config.ts`, ROOT), true);
  });

  it('skips files ESLint ignores or cannot read', () => {
    assert.equal(shouldLint(`${ROOT}/docs/workflow.md`, ROOT), false);
    assert.equal(shouldLint(`${ROOT}/tools/dryer/src/dryer/cli.py`, ROOT), false);
    assert.equal(shouldLint(`${ROOT}/coverage/lcov-report/x.js`, ROOT), false);
    assert.equal(shouldLint('/elsewhere/file.ts', ROOT), false);
  });
});
