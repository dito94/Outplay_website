#!/usr/bin/env bash
# Build the site and publish dist/ to the gh-pages branch as a normal (non-force) commit.
# GitHub Pages: Settings → Pages → Build and deployment → Deploy from a branch → gh-pages / (root).
set -euo pipefail
cd "$(dirname "$0")/.."
ROOT=$(pwd)
SKIP_BUILD=${SKIP_BUILD:-0}
[ "$SKIP_BUILD" = "1" ] || npx astro build
touch dist/.nojekyll
SRC_SHA=$(git rev-parse --short HEAD)
WT=$(mktemp -d)

if git ls-remote --exit-code --heads origin gh-pages >/dev/null 2>&1; then
  git fetch -q origin gh-pages:refs/remotes/origin/gh-pages
  git worktree add -q -B gh-pages "$WT" origin/gh-pages
else
  git worktree add -q --detach "$WT"
  git -C "$WT" checkout -q --orphan gh-pages
fi

# replace the branch contents with the fresh build
git -C "$WT" rm -rq --ignore-unmatch . >/dev/null 2>&1 || true
find "$WT" -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
cp -r dist/. "$WT/"
git -C "$WT" add -A
if git -C "$WT" diff --cached --quiet; then
  echo "No changes to deploy"
else
  git -C "$WT" -c user.name="${GIT_AUTHOR_NAME:-Dimitar Tolev}" -c user.email="${GIT_AUTHOR_EMAIL:-dimitar.tolev@racebox.pro}" \
    commit -q -m "Deploy site from ${SRC_SHA}"
  git -C "$WT" push -q origin gh-pages
  echo "Deployed ${SRC_SHA} to gh-pages"
fi
cd "$ROOT"
git worktree remove --force "$WT"
