// The harness lives in .agents/; .claude/ only links each item into it, one
// link per skill, agent and rule (some tools and harness-score do not follow a
// linked directory). This pins that every item has its link and every link
// still points at an item, so adding a skill without its adapter link fails.
import assert from 'node:assert/strict';
import { existsSync, lstatSync, readdirSync, readlinkSync } from 'node:fs';
import { join, resolve } from 'node:path';
import process from 'node:process';
// eslint-disable-next-line test/no-import-node-test
import { describe, it } from 'node:test';

const ROOT = resolve(import.meta.dirname, '..', '..');
const KINDS = ['skills', 'agents', 'rules'];

function items(dir) {
  return readdirSync(dir).filter(name => !name.startsWith('.')).sort();
}

describe('.claude adapter links', () => {
  for (const kind of KINDS) {
    const source = join(ROOT, '.agents', kind);
    const adapter = join(ROOT, '.claude', kind);

    it(`links every .agents/${kind} item and nothing else`, () => {
      assert.deepEqual(items(adapter), items(source));
    });

    it(`resolves every .claude/${kind} link into .agents/${kind}`, () => {
      for (const name of items(adapter)) {
        const link = join(adapter, name);
        assert.ok(lstatSync(link).isSymbolicLink(), `${link} must be a link, not a copy`);
        assert.equal(readlinkSync(link), `../../.agents/${kind}/${name}`);
        assert.ok(existsSync(link), `${link} is dangling`);
      }
    });
  }

  it('runs from the repository root', () => {
    assert.ok(existsSync(join(ROOT, 'AGENTS.md')), `unexpected root ${ROOT} (cwd ${process.cwd()})`);
  });
});
