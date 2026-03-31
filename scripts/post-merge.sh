#!/bin/bash
set -e

# @ds-foundation/tokens is hosted on GitHub Packages.
# Replit must have NODE_AUTH_TOKEN set as a secret (Secrets tab → NODE_AUTH_TOKEN).
# The .npmrc in this repo reads it automatically for the @ds-foundation scope.
if [ -z "$NODE_AUTH_TOKEN" ]; then
  echo "⚠️  NODE_AUTH_TOKEN is not set. Add it in Replit → Secrets."
  echo "    Without it, @ds-foundation/tokens cannot be installed from GitHub Packages."
  echo "    Get the token from: https://github.com/settings/tokens (read:packages scope)"
  exit 1
fi

npm install --legacy-peer-deps
