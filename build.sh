#!/bin/sh
# =============================================================================
# build.sh — chay tren Cloudflare Pages moi lan deploy
#
# Site nay khong co buoc build that. Viec duy nhat can lam la sinh
# assets/js/config.js tu bien moi truong, vi file do bi .gitignore chan
# de Web3Forms access key khong nam trong repo cong khai.
#
# Cloudflare Pages > Settings > Environment variables:
#   W3F_KEY = <access key lay tu https://web3forms.com>
# =============================================================================
set -eu

if [ -z "${W3F_KEY:-}" ]; then
  echo "LOI: thieu bien moi truong W3F_KEY." >&2
  echo "     Vao Cloudflare Pages > Settings > Environment variables de them." >&2
  echo "     Dung build o day co chu y: tha deploy that bai con hon deploy" >&2
  echo "     thanh cong voi form gui khong duoc ma khong ai biet." >&2
  exit 1
fi

cat > assets/js/config.js <<EOF
/* File nay do build.sh sinh ra luc deploy — dung sua tay, dung commit. */
window.TP_CONFIG = {
  web3formsKey: '${W3F_KEY}'
};
EOF

echo "OK: da sinh assets/js/config.js ($(wc -c < assets/js/config.js) bytes)"
