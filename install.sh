#!/bin/sh
# openloot installer — https://github.com/vidya-hub/openloot
# Usage: curl -fsSL https://raw.githubusercontent.com/vidya-hub/openloot/main/install.sh | sh

set -e

REPO="vidya-hub/openloot"
INSTALL_DIR="/usr/local/bin"
BINARY_NAME="openloot"

# Detect OS
OS="$(uname -s)"
case "$OS" in
  Linux*)  OS_NAME="linux" ;;
  Darwin*) OS_NAME="darwin" ;;
  *)
    echo "Error: Unsupported OS: $OS"
    echo "openloot supports Linux and macOS only."
    exit 1
    ;;
esac

# Detect architecture
ARCH="$(uname -m)"
case "$ARCH" in
  x86_64|amd64)  ARCH_NAME="x64" ;;
  aarch64|arm64)  ARCH_NAME="arm64" ;;
  *)
    echo "Error: Unsupported architecture: $ARCH"
    echo "openloot supports x64 and arm64 only."
    exit 1
    ;;
esac

ASSET_NAME="${BINARY_NAME}-${OS_NAME}-${ARCH_NAME}"

# Get latest release tag
LATEST_TAG=$(curl -fsSL "https://api.github.com/repos/${REPO}/releases/latest" | grep '"tag_name"' | sed -E 's/.*"tag_name": *"([^"]+)".*/\1/')

if [ -z "$LATEST_TAG" ]; then
  echo "Error: Could not determine latest release."
  exit 1
fi

DOWNLOAD_URL="https://github.com/${REPO}/releases/download/${LATEST_TAG}/${ASSET_NAME}"

echo "🏴‍☠️ Installing openloot ${LATEST_TAG}..."
echo "   Platform: ${OS_NAME}-${ARCH_NAME}"
echo "   From: ${DOWNLOAD_URL}"
echo ""

# Download to temp file
TMP_FILE="$(mktemp)"
curl -fsSL "$DOWNLOAD_URL" -o "$TMP_FILE"

# Install
chmod +x "$TMP_FILE"

if [ -w "$INSTALL_DIR" ]; then
  mv "$TMP_FILE" "${INSTALL_DIR}/${BINARY_NAME}"
else
  echo "   Installing to ${INSTALL_DIR} (requires sudo)..."
  sudo mv "$TMP_FILE" "${INSTALL_DIR}/${BINARY_NAME}"
fi

echo "✅ openloot ${LATEST_TAG} installed to ${INSTALL_DIR}/${BINARY_NAME}"
echo ""
echo "   Run 'openloot' to get started!"
