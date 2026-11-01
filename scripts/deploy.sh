#!/usr/bin/env bash
# Build the site and publish dist/ to the gh-pages branch (GitHub Pages: Settings → Pages → Deploy from branch → gh-pages / root).
set -euo pipefail
cd "$(dirname "$0")/.."
npx astro build
touch dist/.nojekyll
SRC_SHA=$(git rev-parse --short HEAD)
TMP=$(mktemp -d)
cp -r dist/. "$TMP/"
cd "$TMP"
git init -q -b gh-pages
git add -A
git -c user.name="${GIT_AUTHOR_NAME:-OUTPLAY deploy}" -c user.email="${GIT_AUTHOR_EMAIL:-deploy@localhost}" commit -q -m "Deploy site from ${SRC_SHA}"
git remote add origin "$(git -C "$OLDPWD" remote get-url origin)"
git push -f origin gh-pages
echo "Deployed ${SRC_SHA} to gh-pages"
