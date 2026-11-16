#!/bin/sh
# Runs one of the vendored quality tools in tools/ (crapper, dryer, mutator).
#
#   sh scripts/quality.sh crap   [args…]   CRAP score per function, fails above 10
#   sh scripts/quality.sh dry    [args…]   structural duplication, fails at >= 0.8
#   sh scripts/quality.sh mutate [args…]   mutation testing, fails on a survivor
#
# The tools are Python 3.11+ and each one keeps its own virtualenv in
# tools/<tool>/.venv, created on the first run. macOS still ships Python 3.9 as
# python3, so this looks for a newer interpreter before falling back to it.
# Results land in .metrics/ (git-ignored); see docs/harness.md.
set -eu

ROOT=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)
cd "$ROOT"

find_python() {
  for candidate in python3.13 python3.12 python3.11 \
    /opt/homebrew/bin/python3.13 /opt/homebrew/bin/python3.12 /opt/homebrew/bin/python3.11 \
    /usr/local/bin/python3.12 /usr/local/bin/python3.11 python3; do
    if command -v "$candidate" >/dev/null 2>&1 &&
      "$candidate" -c 'import sys; sys.exit(0 if sys.version_info >= (3, 11) else 1)' 2>/dev/null; then
      echo "$candidate"
      return 0
    fi
  done
  return 1
}

ensure_venv() {
  tool_dir="$ROOT/tools/$1"
  if [ -x "$tool_dir/.venv/bin/python" ]; then
    return 0
  fi
  python=$(find_python) || {
    echo "quality: Python 3.11+ is required (brew install python@3.12, or apt install python3.12)." >&2
    exit 1
  }
  echo "quality: creating $tool_dir/.venv with $python" >&2
  "$python" -m venv "$tool_dir/.venv"
  "$tool_dir/.venv/bin/pip" install --quiet -e "$tool_dir"
}

usage() {
  echo "usage: sh scripts/quality.sh crap|dry|mutate [args…]" >&2
  exit 1
}

[ $# -ge 1 ] || usage
command=$1
shift

case "$command" in
  crap)
    ensure_venv crapper
    # ub-mode keeps every function under CRAP 10. --threshold exits 2 when the
    # worst score is higher, so the gate is the tool's own exit code.
    exec "$ROOT/tools/crapper/crapper" --threshold 10 "$@"
    ;;
  dry)
    ensure_venv dryer
    # dryer always exits 0 after a report, so the gate reads the report: any
    # DUPLICATE line at or above the ub-mode threshold (0.8) fails the run.
    output=$("$ROOT/tools/dryer/dryer" --threshold 0.8 "$@")
    printf '%s\n' "$output"
    if printf '%s\n' "$output" | grep -q '^DUPLICATE'; then
      echo "quality: duplication at or above 0.8 — extract the shared shape." >&2
      exit 3
    fi
    ;;
  mutate)
    # mutator imports crapper for function names, so both need their venvs.
    ensure_venv crapper
    ensure_venv mutator
    "$ROOT/tools/mutator/.venv/bin/pip" install --quiet -e "$ROOT/tools/crapper"
    exec "$ROOT/tools/mutator/mutator" "$@"
    ;;
  *)
    usage
    ;;
esac
