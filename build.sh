#!/bin/sh
# =============================================================================
# build.sh — chay tren Cloudflare Pages moi lan deploy
#
# Site nay khong co buoc build that. No lam dung hai viec:
#   1. Sinh assets/js/config.js tu W3F_KEY (file do bi .gitignore chan de
#      Web3Forms access key khong nam trong repo cong khai).
#   2. Dien ten mien SAN XUAT vao canonical / og:url / og:image.
#
# CHI CHAY TREN CI. Chay o may ca nhan se sua truc tiep index.html.
# =============================================================================
set -eu

# ---------- 1. Access key ----------------------------------------------------
if [ -z "${W3F_KEY:-}" ]; then
  echo "LOI: thieu bien moi truong W3F_KEY." >&2
  echo "     Cloudflare Pages > Settings > Variables and Secrets." >&2
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
# BAT BUOC dat SITE_URL = dia chi SAN XUAT cua site.
#
# KHONG dung CF_PAGES_URL o day. Bien do la dia chi rieng cua TUNG LAN DEPLOY
# (co tien to bam, vi du https://2eb46552.tanpham.pages.dev) va doi sau moi lan
# build. Nhet no vao og:url / og:image se khien Facebook va Zalo luu cache theo
# dia chi bam do, nen deploy lai la anh xem truoc ket o ban cu.
SITE="${SITE_URL:-}"

if [ -z "$SITE" ]; then
  echo "LOI: thieu bien moi truong SITE_URL." >&2
  echo "     Cloudflare Pages > Settings > Variables and Secrets, them:" >&2
  echo "       SITE_URL = https://tanpham.pages.dev" >&2
  echo "     (sau nay mua ten mien rieng thi doi thanh https://tanpham.info)" >&2
  echo "     Thieu no thi og:image sai dia chi, ma loi do khong nhin thay" >&2
  echo "     duoc khi xem site binh thuong." >&2
  exit 1
fi

SITE=$(printf '%s' "$SITE" | sed 's#/$##')   # bo dau / o cuoi neu co
sed -i "s#__SITE_URL__#${SITE}#g" index.html
echo "OK: ten mien dung cho the OG/canonical = ${SITE}"
