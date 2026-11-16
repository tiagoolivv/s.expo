#!/usr/bin/env node
// PreToolUse gate. Reads the hook event from stdin and blocks the tool call
// (exit 2, reason on stderr) when it matches a rule in s-expo-guard-rules.mjs.
// Any failure to parse the event lets the call through: a broken gate must not
// stop all work, and the rules are pinned by their own tests.
import process from 'node:process';

import { decide } from './s-expo-guard-rules.mjs';

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
  const decision = decide(event, projectDir);
  if (!decision.allow) {
    process.stderr.write(`s-expo guard: blocked. ${decision.reason}\n`);
    process.exit(2);
  }
  process.exit(0);
});
