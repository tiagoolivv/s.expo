#!/usr/bin/env node
// PostToolUse feedback. After an Edit/Write, runs `eslint --fix` on that one
// file. ESLint is also the formatter here (ESLint Stylistic, no Prettier), so
// this formats and lints in one pass. Errors that --fix cannot resolve go back
// to the agent on stderr with exit 2, so it fixes them while the file is fresh.
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';

import { shouldLint } from './s-expo-guard-rules.mjs';

let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  raw += chunk;
});
process.stdin.on('end', () => {
  let event;
  try {
    event = JSON.parse(raw);
  }
  catch {
    process.exit(0);
  }
  const projectDir = process.env.CLAUDE_PROJECT_DIR || event?.cwd || process.cwd();
  const filePath = event?.tool_input?.file_path;
  const eslint = join(projectDir, 'node_modules', '.bin', 'eslint');
  if (!filePath || !shouldLint(filePath, projectDir) || !existsSync(eslint) || !existsSync(filePath))
    process.exit(0);

  const result = spawnSync(eslint, ['--fix', '--no-warn-ignored', filePath], {
    cwd: projectDir,
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    process.stderr.write(`s-expo lint: ESLint still reports problems in ${filePath} after --fix:\n${result.stdout}${result.stderr}`);
    process.exit(2);
  }
  process.exit(0);
});
