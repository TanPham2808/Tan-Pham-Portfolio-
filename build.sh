#!/bin/sh
# =============================================================================
# build.sh — chay tren Cloudflare Pages moi lan deploy
#
# Site nay khong co buoc build that. No lam dung hai viec:
#   1. Sinh assets/js/config.js tu W3F_KEY (file do bi .gitignore chan de
#      Web3Forms access key khong nam trong repo cong khai).
#   2. Dien ten mien that vao cac the canonical / og:url / og:image.
#
# CHI CHAY TREN CI. Chay o may ca nhan se sua truc tiep index.html.
# =============================================================================
set -eu

# ---------- 1. Access key ----------------------------------------------------
if [ -z "${W3F_KEY:-}" ]; then
  echo "LOI: thieu bien moi truong W3F_KEY." >&2
  echo "     Cloudflare Pages > Settings > Environment variables." >&2
  echo "     Dung build o day la co y: deploy that bai on ao van hon deploy" >&2
  echo "     thanh cong ma form gui khong duoc, khong ai biet." >&2
  exit 1
fi

cat > assets/js/config.js <<EOF
/* File nay do build.sh sinh ra luc deploy — dung sua tay, dung commit. */
window.TP_CONFIG = {
  web3formsKey: '${W3F_KEY}'
};
EOF
echo "OK: da sinh assets/js/config.js"

# ---------- 2. Ten mien -------------------------------------------------------
# Uu tien SITE_URL do ban tu dat (khi da mua ten mien rieng).
# Neu chua co thi dung CF_PAGES_URL — bien Cloudflare tu inject, chinh la
# dia chi *.pages.dev cua ban deploy nay.
SITE="${SITE_URL:-${CF_PAGES_URL:-}}"

if [ -z "$SITE" ]; then
  echo "LOI: khong co SITE_URL lan CF_PAGES_URL." >&2
  echo "     Thieu thi og:image se tro toi '__SITE_URL__/...' va Facebook," >&2
  echo "     Zalo se khong hien duoc anh khi chia se link." >&2
  exit 1
fi

SITE=$(printf '%s' "$SITE" | sed 's#/$##')   # bo dau / o cuoi neu co
sed -i "s#__SITE_URL__#${SITE}#g" index.html
echo "OK: ten mien dung cho the OG/canonical = ${SITE}"

# ---------- 3. Bo cac file chi dung de lam viec -------------------------------
# tools/ chua file nguon dung ra anh Open Graph (tools/og-cover.html). No la
# ban thiet ke, khong phai mot trang cua site. De nguyen thi Cloudflare Pages
# van phuc vu no tai /tools/og-cover.html: khach go trung dia chi se thay mot
# trang la, va Google co the lap chi muc trang do.
#
# Xoa han o day chu khong dung _redirects: _redirects chi doi huong, file van
# nam tren may chu. Xoa thi no khong bao gio duoc tai len.
rm -rf tools
echo "OK: da bo thu muc tools/ khoi ban deploy"
