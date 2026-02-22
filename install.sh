#!/bin/sh
# openloot installer — https://github.com/vidya-hub/openloot
# Usage: curl -fsSL https://raw.githubusercontent.com/vidya-hub/openloot/main/install.sh | sh
set -e
REPO="vidya-hub/openloot"
INSTALL_DIR="/usr/local/bin"
BINARY_NAME="openloot"
# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

error() {
  printf "${RED}Error: %s${NC}\n" "$1" >&2
  exit 1
}

warn() {
  printf "${YELLOW}Warning: %s${NC}\n" "$1" >&2
}

info() {
  printf "%s\n" "$1"
}

success() {
  printf "${GREEN}%s${NC}\n" "$1"
}

# Check for required commands
command -v curl >/dev/null 2>&1 || error "curl is required but not installed."
# Detect OS
OS="$(uname -s)"
case "$OS" in
  Linux*)  OS_NAME="linux" ;;
  Darwin*) OS_NAME="darwin" ;;
  *)
    error "Unsupported OS: $OS. openloot supports Linux and macOS only."
    ;;
esac

# Detect architecture (with Rosetta 2 detection on macOS)
ARCH="$(uname -m)"
case "$ARCH" in
  x86_64|amd64)
    # On macOS, check if actually running on ARM under Rosetta 2
    if [ "$OS_NAME" = "darwin" ]; then
      if sysctl hw.optional.arm64 2>/dev/null | grep -q ': 1'; then
        ARCH_NAME="arm64"
      else
        ARCH_NAME="x64"
      fi
    else
      ARCH_NAME="x64"
    fi
    ;;
  aarch64|arm64) ARCH_NAME="arm64" ;;
  *)
    error "Unsupported architecture: $ARCH. openloot supports x64 and arm64 only."
    ;;
esac

ASSET_NAME="${BINARY_NAME}-${OS_NAME}-${ARCH_NAME}"
# Get latest release tag
info "Fetching latest release information..."
LATEST_TAG=$(curl -fsSL "https://api.github.com/repos/${REPO}/releases/latest" 2>/dev/null | grep '"tag_name"' | sed -E 's/.*"tag_name": *"([^"]+)".*/\1/')
if [ -z "$LATEST_TAG" ]; then
  error "Could not determine latest release. Check your internet connection."
fi

DOWNLOAD_URL="https://github.com/${REPO}/releases/download/${LATEST_TAG}/${ASSET_NAME}"

echo ""
echo "🏴‍☠️ Installing openloot ${LATEST_TAG}..."
info "   Platform: ${OS_NAME}-${ARCH_NAME}"
info "   From: ${DOWNLOAD_URL}"
echo ""
# Download to temp file
TMP_FILE="$(mktemp)"
trap 'rm -f "$TMP_FILE"' EXIT

info "Downloading..."
if ! curl -fsSL "$DOWNLOAD_URL" -o "$TMP_FILE"; then
  error "Failed to download from ${DOWNLOAD_URL}. The release asset may not exist."
fi

# Verify download is not empty
if [ ! -s "$TMP_FILE" ]; then
  error "Downloaded file is empty. Please try again."
fi

# Make executable
chmod +x "$TMP_FILE"
# macOS: Remove quarantine attribute to allow execution of unsigned binary
if [ "$OS_NAME" = "darwin" ]; then
  if command -v xattr >/dev/null 2>&1; then
    xattr -d com.apple.quarantine "$TMP_FILE" 2>/dev/null || true
  fi
fi
# Install
if [ -w "$INSTALL_DIR" ]; then
  mv "$TMP_FILE" "${INSTALL_DIR}/${BINARY_NAME}"
else
  info "   Installing to ${INSTALL_DIR} (requires sudo)..."
  sudo mv "$TMP_FILE" "${INSTALL_DIR}/${BINARY_NAME}"
  # macOS: Remove quarantine after sudo move as well
  if [ "$OS_NAME" = "darwin" ]; then
    if command -v xattr >/dev/null 2>&1; then
      sudo xattr -d com.apple.quarantine "${INSTALL_DIR}/${BINARY_NAME}" 2>/dev/null || true
    fi
  fi
fi

echo ""
success "✅ openloot ${LATEST_TAG} installed to ${INSTALL_DIR}/${BINARY_NAME}"
echo ""
info "   Run 'openloot' to get started!"
