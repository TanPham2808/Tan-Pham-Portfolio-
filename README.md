# Tân Phạm — Website giới thiệu dịch vụ

> Định vị: **Freelance Software Engineer — Backend, AI Automation và DevOps**.
> Nội dung ba khối dịch vụ lấy đúng theo bản mô tả bạn cung cấp; toàn bộ phần chữ còn lại
> (hero, cách làm việc, lợi thế, liên hệ, footer) là bản viết riêng cho site này.

Site tĩnh một trang, HTML + Bootstrap 5.3.3, không build tool, không backend.
Có **nút chuyển giao diện sáng / tối**; lần đầu vào site sẽ bám theo cài đặt của hệ điều hành,
sau đó ghi nhớ lựa chọn của người dùng trong `localStorage`.
Toàn bộ hiệu ứng viết bằng vanilla JS + CSS (không AOS, không GSAP, không jQuery).

---

## 1. Cách chạy

### Cách nhanh nhất
Mở trực tiếp `index.html` bằng trình duyệt (double-click). Mọi đường dẫn tài nguyên đều là
đường dẫn tương đối nên chạy tốt ở giao thức `file://`.

### Chạy qua static server (khuyến nghị khi kiểm thử)
Chọn một trong các lệnh dưới đây, chạy tại thư mục gốc dự án:

```bash
npx --yes http-server . -p 5173 -c-1
```

```bash
python -m http.server 5173
```

Sau đó mở `http://localhost:5173`.

### Yêu cầu mạng
Site chạy offline **trừ** ba tài nguyên CDN (ghim cứng phiên bản):

| Tài nguyên | Phiên bản | Nguồn |
|---|---|---|
| Bootstrap CSS + JS bundle | 5.3.3 | `cdn.jsdelivr.net` |
| Bootstrap Icons | 1.11.3 | `cdn.jsdelivr.net` |
| Google Font `Public Sans` | 400/500/600/700 | `fonts.googleapis.com` |

Mất mạng thì bố cục vẫn còn nhưng mất lưới Bootstrap, icon và font thương hiệu
(font tự lùi về `system-ui / Segoe UI`).

---

## 2. Cấu trúc file

```
index.html                        ← toàn bộ nội dung, 7 khối
assets/css/theme.css              ← 100% CSS tuỳ chỉnh, chia 11 phần có đánh số
assets/js/app.js                  ← 100% JS tuỳ chỉnh, chia 10 phần có đánh số
assets/js/config.example.js       ← mẫu cấu hình; bản thật do build.sh sinh, không commit
assets/img/avatar.jpg             ← avatar tròn ở hero — 512×512, 52 KB
assets/img/Certification_1..4.png ← 4 chứng chỉ Anthropic
assets/img/og-cover.svg           ← ảnh Open Graph
assets/img/favicon.svg            ← icon tab trình duyệt (logo chữ T)
build.sh                          ← sinh config.js từ W3F_KEY lúc deploy
_headers  /  _redirects           ← cấu hình Cloudflare Pages
README.md
```

Không có `<style>` trong `index.html`. Có đúng **một** `<script>` nội tuyến ở `<head>` —
đoạn đặt giao diện sáng/tối trước khi trang vẽ để không bị nháy màu; mọi JS còn lại nằm ở
`assets/js/app.js`.

---

## 3. Bảng design token

Kiến trúc token ở `assets/css/theme.css`:

| Phần | Nội dung |
|---|---|
| **1) DESIGN TOKEN** | giá trị `--tp-*` của giao diện **sáng** |
| **1b) DESIGN TOKEN — TỐI** | ghi đè `--tp-*` dưới selector `[data-bs-theme="dark"]` |
| **2) OVERRIDE BIẾN BOOTSTRAP** | map `--bs-* = var(--tp-*)` |

Vì phần 2 chỉ *trỏ* sang `--tp-*` chứ không ghi giá trị cứng, đổi giao diện là toàn bộ
component Bootstrap tự đổi theo. Muốn đổi màu thương hiệu thì **chỉ sửa phần 1 và 1b**.

Ba token màu thương hiệu có vai trò khác nhau, đừng dùng lẫn:

| Token | Vai trò |
|---|---|
| `--tp-primary` | mặt phẳng **tô đặc** (nút, FAB) — luôn đi kèm chữ trắng |
| `--tp-accent` | **chữ / icon** đặt trên nền trang — sáng lên ở dark mode để giữ tương phản |
| `--tp-surface` | nền của card / navbar dính / dropdown / offcanvas |

### Màu — giao diện sáng

| Token | Giá trị | Dùng ở đâu |
|---|---|---|
| `--tp-primary` | `#8b3dff` | Nền hero, nút chính, icon, eyebrow, FAB |
| `--tp-primary-hover` | `#7526f0` | Trạng thái hover/active của nút và liên kết |
| `--tp-primary-subtle` | `rgba(139,61,255,.08)` | Nền ô icon 56×56, badge pill, hover mega-menu |
| `--tp-primary-border` | `rgba(139,61,255,.18)` | Viền badge pill |
| `--tp-accent` | `#8b3dff` | Chữ/icon màu thương hiệu trên nền trang |
| `--tp-accent-hover` | `#7526f0` | Chữ badge pill (cần đậm hơn để đạt 4.5:1) |
| `--tp-body-bg` | `#ffffff` | Nền trang |
| `--tp-surface` | `#ffffff` | Nền card, navbar dính, dropdown, offcanvas |
| `--tp-hero-bg` | `#8b3dff` | Nền khối hero |
| `--tp-section-bg` | `#f8fafc` | Band "Thế mạnh", nền footer |
| `--tp-heading` | `#0f172a` | h1–h6, label form |
| `--tp-body-color` | `#64748b` | Văn bản thường |
| `--tp-muted` | `#94a3b8` | Placeholder input, số bước mờ (chỉ trang trí) |
| `--tp-border` | `#e2e8f0` | Viền card, viền input, border-top footer |
| `--tp-link` | `#7526f0` | Màu liên kết |
| `--tp-link-hover` | `#8b3dff` | Liên kết khi hover |
| `--tp-success` | `#008008` | Alert gửi form thành công, trạng thái valid |
| `--tp-danger` | `#db1436` | Thông báo lỗi form, trạng thái invalid |
| `--tp-warning` | `#ffc107` | Dự phòng (chưa dùng trong bố cục hiện tại) |
| `--tp-on-primary` | `#ffffff` | Chữ/nút trên nền primary |
| `--tp-on-primary-soft` | `rgba(255,255,255,.95)` | Chữ phụ trên nền primary — vẫn đạt WCAG AA (4.65:1) |

### Màu — giao diện tối

Khối `[data-bs-theme="dark"]` chỉ ghi đè những token thực sự đổi:

| Token | Giá trị | Ghi chú |
|---|---|---|
| `--tp-accent` | `#b48bff` | Sáng hơn primary để chữ/icon đạt 7.2:1 trên nền tối |
| `--tp-accent-hover` | `#cdb2ff` | |
| `--tp-primary-subtle` | `rgba(163,112,255,.14)` | Nền ô icon, badge |
| `--tp-primary-border` | `rgba(163,112,255,.30)` | |
| `--tp-body-bg` | `#0b1220` | |
| `--tp-surface` | `#131f36` | Sáng hơn nền trang để card nổi lên |
| `--tp-section-bg` | `#111b2e` | |
| `--tp-hero-bg` | `#5b21b6` | Tím sâu hơn; chữ trắng đạt 8.9:1 |
| `--tp-heading` | `#f1f5f9` | |
| `--tp-body-color` | `#a3b2c7` | 7.6:1 trên `--tp-surface` |
| `--tp-muted` | `#64748b` | Chỉ dùng cho placeholder & chi tiết trang trí |
| `--tp-border` | `#26334b` | |
| `--tp-link` / hover | `#b48bff` / `#cdb2ff` | |
| `--tp-success` | `#4ade80` | |
| `--tp-danger` | `#ff7a90` | |
| `--tp-warning` | `#ffd24d` | |
| `--tp-shadow-sm/md/lg` | `rgba(0,0,0,.35/.45/.55)` | Đậm hơn nhiều mới thấy trên nền tối |

`--tp-primary` và `--tp-primary-hover` **giữ nguyên** `#8b3dff` / `#7526f0` ở cả hai giao diện:
nút tô đặc luôn đi với chữ trắng nên đã đạt 4.99:1 dù nền trang là gì.

### Typography

| Token / quy tắc | Giá trị |
|---|---|
| `--tp-font-sans` | `"Public Sans", system-ui, -apple-system, "Segoe UI", sans-serif` |
| `h1` | `clamp(2.25rem, 1.6rem + 2.2vw, 2.9rem)` · 700 · lh 1.25 · ls `-0.03em` |
| `h2` | `clamp(1.6rem, 1.3rem + 1.1vw, 1.9rem)` · 700 · ls `-0.02em` |
| `h3` | `1.25rem` · 600 |
| body | `1rem` · lh 1.6 |
| `.tp-eyebrow` | `.8125rem` · 600 · ls `.08em` · UPPERCASE · màu primary |

### Hình khối & nhịp

| Token | Giá trị |
|---|---|
| `--tp-radius-sm` | `.25rem` |
| `--tp-radius` | `.5rem` |
| `--tp-radius-lg` | `.75rem` |
| `--tp-radius-xl` | `1rem` |
| `--tp-radius-2xl` | `2rem` |
| `--tp-radius-pill` | `50rem` |
| `--tp-shadow-sm` | `0 .125rem .25rem rgba(2,6,23,.075)` |
| `--tp-shadow-md` | `0 .5rem 1rem rgba(2,6,23,.08)` |
| `--tp-shadow-lg` | `0 1rem 3rem rgba(2,6,23,.12)` |
| `--tp-section-space` | `7rem` (class `.py-lg-9`, bổ sung vì Bootstrap không có bậc 9) |
| `--tp-container` | `1140px` (áp dụng từ breakpoint `xl`) |
| `--tp-navbar-h` | `88px` (dùng cho `scroll-margin-top` của mọi section có `id`) |
| `--tp-ease` | `cubic-bezier(.25,.46,.45,.94)` |

Nhịp dọc mỗi section: `py-5` ở mobile → `py-lg-9` (7rem) từ `lg`.

---

## 4. Chỗ thay từng placeholder

**Không còn placeholder nào.** Toàn bộ thương hiệu, nội dung và thông tin liên hệ đã điền xong:

| Thông tin | Giá trị | Vị trí (dòng trong `index.html`) |
|---|---|---|
| Điện thoại | `0936 864 438` (href `tel:+84936864438`) | `465` |
| Email | `xtandev@gmail.com` | `466` |
| Địa chỉ | `Tân Phú, Thành phố Hồ Chí Minh` | `467` |
| Tên miền | `tanpham.info` | `25` canonical · `33` `og:url` · `34` `og:image` |

Số điện thoại hiển thị theo dạng nhóm `0936 864 438` cho dễ đọc, còn `href` dùng dạng quốc tế
`tel:+84936864438` để bấm gọi được từ máy ở nước ngoài. Đổi số thì nhớ sửa **cả hai**.

### Những chỗ khác nên xem lại

| Cần sửa | Ở đâu |
|---|---|
| Ảnh Open Graph | `assets/img/og-cover.svg` đã mang thương hiệu Tân Phạm, nhưng nên xuất lại thành **PNG/JPG 1200×630** rồi sửa `og:image` (dòng `34`) cho khớp đuôi file — nhiều mạng xã hội không đọc được SVG |
| Năm bản quyền | tự cập nhật bằng JS (`app.js`, mục 8); không cần sửa tay |
| Ghi chú "Nhận số lượng hạng mục có giới hạn mỗi tháng" (dòng `201`) | đổi hoặc bỏ nếu không đúng thực tế |

---

## 5. Logo chữ T

Logo là **SVG nội tuyến** trong `index.html` (navbar và footer), không phải file ảnh — nhờ vậy
đổi màu được theo ngữ cảnh mà không cần tải thêm tài nguyên.

Cấu tạo: khối bo góc **bất đối xứng** (ba góc bo `9`, riêng góc dưới phải bo `2.5`) + chữ T
hình học bo đầu, khoét dương bản. Hai lớp màu điều khiển bằng biến CSS:

| Lớp | Biến | Mặc định |
|---|---|---|
| Khối nền | `--tp-logo-tile` | `--tp-primary` (`#8b3dff`) |
| Chữ T | `--tp-logo-mark` | `#ffffff` |

Rule `.tp-navbar:not(.navbar-stick) .tp-logo` đảo hai màu này khi navbar còn trong suốt nằm
trên hero (khối trắng, chữ T màu nền hero), rồi trả lại khi navbar dính. Bốn trạng thái đã
kiểm tra:

| Trạng thái | Khối | Chữ T |
|---|---|---|
| Sáng · trên hero | `#ffffff` | `#8b3dff` |
| Sáng · navbar dính | `#8b3dff` | `#ffffff` |
| Tối · trên hero | `#ffffff` | `#5b21b6` |
| Tối · navbar dính | `#8b3dff` | `#ffffff` |

`assets/img/favicon.svg` dùng lại đúng hình này ở bản màu cố định (tím / trắng).
Muốn đổi hình chữ T thì sửa đồng thời ba chỗ: navbar, footer và favicon.

---

## 6. Ảnh đại diện

Site hiển thị `assets/img/avatar.jpg` — **512×512, 52 KB**.

Bản trước đó là PNG **2048×2048 nặng 6,5 MB** nhưng hiển thị ở đúng 160px, chiếm 73% dung
lượng cả site. Đã chuyển sang JPG chất lượng 88: nhẹ đi **126 lần**, ở 160px không phân biệt
được bằng mắt.

**Quy tắc khi đổi ảnh khác:** dùng **ảnh vuông**, xuất **JPG** cỡ **512×512**, khuôn mặt chiếm
khoảng 55–65% chiều cao. Đừng để PNG — với ảnh chụp thì PNG không nén mất dữ liệu nên phình
gấp hàng trăm lần mà không đẹp hơn chút nào ở kích thước này. Đổi ảnh xong nhớ xem lại `alt`
trong `index.html`.

Các ảnh nguồn (`TanPham.JPG`, `avatar1.jpg`, `avatar2.jpg`) đã gỡ khỏi thư mục làm việc để
site nhẹ, nhưng vẫn nằm trong lịch sử Git — lấy lại bằng:

```bash
git checkout 4f20be4 -- assets/img/avatar2.jpg
```

---

## 7. Làm nổi bật ba khối dịch vụ

Ba thẻ dịch vụ dùng thêm class `.tp-card-service` (`theme.css`, mục 7) chồng lên `.tp-card`:

| Chi tiết | Thực hiện |
|---|---|
| Vạch gradient thương hiệu chạy dọc mép trên | `.tp-card-service::before`, cao `4px`, `linear-gradient(90deg, --tp-primary, --tp-accent)` |
| Số thứ tự `01 / 02 / 03` mờ ở góc phải | `.tp-card-index`, `opacity .16`, có `aria-hidden` nên trình đọc màn hình bỏ qua |
| Bóng đổ đậm hơn thẻ thường | `--tp-shadow-md` ở trạng thái tĩnh (thẻ thường chỉ `sm`) |
| Ô icon có viền | `.tp-icon-box` thêm `1px solid var(--tp-primary-border)` |
| Hover | nâng `-6px` + `--tp-shadow-lg` + viền chuyển sang màu thương hiệu + ô icon phóng `1.06` |

Icon ba khối: `bi-hdd-network`, `bi-robot`, `bi-boxes`.

### Khối chứng chỉ (nằm trong section `#the-manh`)

Hai phần, đặt sau hai badge nghiệp vụ:

| Phần | Nội dung |
|---|---|
| 3 thẻ `.tp-cert-card` | tổng quan theo nguồn cấp — Azure ×3, Google Education ×1, Anthropic ×4 |
| Lưới `.tp-cert-thumb` | 4 ảnh chứng chỉ Anthropic, bấm mở modal xem cỡ đầy đủ |

Số thẻ và ảnh mỗi hàng: **1/2** ở 375px · **2/2** ở 768px · **3/4** từ `lg`.

**Về icon thương hiệu:** `bi-microsoft` và `bi-google` là glyph có sẵn trong bộ Bootstrap Icons
(giấy phép MIT) đang dùng cho cả site — không phải logo chính thức của Microsoft hay Google.
Anthropic không có glyph trong bộ này nên dùng `bi-stars` trung tính. Muốn dùng huy hiệu
chính thức thì tải từ chính nơi cấp (Microsoft phát hành qua Credly) và thay thẻ `<i>` bằng
`<img>` — đừng vẽ lại logo, vì đó là nhãn hiệu được bảo hộ.

**Thẻ tổng quan chỉ có icon, tên nguồn cấp và một dòng mô tả** — không hiện số lượng chứng chỉ.
Con số duy nhất còn lại nằm ở tiêu đề "Tám chứng chỉ từ ba nền tảng"; sửa số đó thì sửa thẳng
trong `<h3 class="h2">` của khối.

**Thêm ảnh chứng chỉ mới:** copy một khối `<li class="col">` trong lưới rồi đổi `data-cert-src`,
`data-cert-title` và `alt` — `app.js` mục 10 tự lo phần modal, không cần sửa JS.

Modal dùng chung một thẻ `#tpCertModal` cho cả 4 ảnh; nội dung điền theo nút được bấm qua
`show.bs.modal`, và `src` được xoá khi đóng để lần mở sau không chớp ảnh cũ. Thumbnail là
`<button>` thật nên bấm được bằng bàn phím.

### Mỗi khối một màu riêng

Ba thẻ mang ba màu nhấn khác nhau để phân biệt nhóm dịch vụ ngay từ cái nhìn đầu tiên. Màu
được truyền qua **một cặp biến** đặt trên chính thẻ (`theme.css`, mục 7):

| Biến | Ý nghĩa |
|---|---|
| `--tp-card-accent` | màu đặc — icon, dấu check, số thứ tự, đầu vạch gradient |
| `--tp-card-accent-rgb` | cùng màu ở dạng RGB, để dẫn xuất nền và viền bằng `rgba()` |

| Class | Khối | Giao diện sáng | Giao diện tối |
|---|---|---|---|
| `.tp-card-s1` | Backend và API | `#8b3dff` (tím thương hiệu) | `#b48bff` |
| `.tp-card-s2` | AI và Automation | `#0f766e` (teal) | `#2dd4bf` |
| `.tp-card-s3` | DevOps và vận hành | `#c2410c` (cam đất) | `#fb923c` |

Nền ô icon và màu viền **không khai báo tay** mà dẫn xuất từ `--tp-card-accent-rgb` với độ mờ
lấy từ `--tp-tint-a` / `--tp-edge-a` — hai biến này đổi theo giao diện (`.10 / .22` ở sáng,
`.16 / .34` ở tối) vì nền tối cần đậm hơn mới nhìn thấy.

**Đổi màu một khối** chỉ cần sửa đúng một cặp biến trong `.tp-card-sN`; toàn bộ icon, dấu
check, số thứ tự, vạch trên, nền ô icon và viền hover tự đổi theo. Nhớ đặt luôn bản cho giao
diện tối trong khối `[data-bs-theme="dark"] .tp-card-sN` — màu đủ tương phản trên nền trắng
thường quá tối trên nền `#131f36`.

Tương phản đã đo (ngưỡng cho đồ hoạ phi văn bản là 3:1):

| | Icon trên ô nền | Dấu check |
|---|---|---|
| s1 sáng / tối | 4.33 / 4.83 | 4.99 / 6.33 |
| s2 sáng / tối | 4.76 / 6.31 | 5.47 / 8.83 |
| s3 sáng / tối | 4.48 / 5.56 | 5.18 / 7.27 |

### Bố cục khối "Cách làm việc"

Hai cột, lệch trọng lượng để phần chữ dẫn dắt và phần các bước tách bạch:

| Cột | Nội dung |
|---|---|
| `col-lg-5` (trái) | eyebrow → `h2` → đoạn mở đầu đậm (`.tp-lead-strong`) → đoạn phụ cỡ thường |
| `col-lg-7` (phải) | `<ol class="row row-cols-1 row-cols-sm-2 g-3 list-unstyled">` chứa 4 thẻ `.tp-step` |

Bốn bước dùng `<ol>` chứ không phải `<div>`: thứ tự là một phần ý nghĩa, trình đọc màn hình
sẽ thông báo "danh sách 4 mục". Số thứ tự nằm thẳng trong `h3` (`1. Làm rõ vấn đề`) nên đọc
lên vẫn đủ nghĩa — khác với bản trước dùng số lớn trang trí phải gắn `aria-hidden`.

Thẻ `.tp-step` có `height: 100%` để hai thẻ cùng hàng luôn bằng nhau dù chữ dài ngắn khác
nhau. Số thẻ mỗi hàng: **1** dưới `sm`, **2** từ `sm` trở lên.

---

## 8. Chín hiệu ứng và nơi chỉnh

| # | Hiệu ứng | Nơi chỉnh |
|---|---|---|
| 1 | Scroll reveal (`IntersectionObserver`, threshold `0.15`, chạy một lần rồi `unobserve`) | `app.js` mục 1 · CSS `[data-cue]` mục 10 |
| 2 | Stagger 100ms cho con trực tiếp của `[data-cues]` | `app.js` hằng số `STAGGER_STEP` |
| 3 | Sticky navbar khi `scrollY > 250`, trượt xuống từ `translateY(-100%)` trong 300ms | `app.js` `NAV_STICK_AT` · CSS `.navbar-stick` + `@keyframes tpSlideDown` |
| 4 | Hero cắt chéo `clip-path` (`4rem` desktop / `2rem` mobile) | CSS `.tp-hero` |
| 5 | Ảnh đại diện tròn viền trắng 8px, `margin-top:-80px` | CSS `.tp-avatar-band`, `.tp-avatar` |
| 6 | Card hover `translateY(-6px)` + shadow md | CSS `.tp-card` |
| 7 | Button hover đổi nền `#7526f0` + `translateY(-2px)` | CSS `.btn`, `.btn-primary`, `.btn-outline-primary` |
| 8 | FAB cuộn về đầu trang, hiện khi `scrollY > 400` | `app.js` `TO_TOP_AT` · CSS `.tp-to-top` |
| 9 | Cuộn mượt tới neo có bù chiều cao navbar | `app.js` mục 5 · CSS `scroll-margin-top: var(--tp-navbar-h)` |

**Cách dùng API reveal trong HTML**

```html
<!-- phần tử đơn -->
<p data-cue="fadeIn" data-delay="200" data-duration="700">…</p>

<!-- container: các con trực tiếp trễ dần 100ms -->
<div class="row" data-cues="slideInUp">
  <div class="col">…</div>
  <div class="col">…</div>
</div>
```

Giá trị hợp lệ của `data-cue` / `data-cues`: `fadeIn`, `zoomIn`, `slideInUp`.

**Giảm chuyển động**: toàn bộ animation nằm trong `@media (prefers-reduced-motion: reduce)`
(`theme.css` mục 11) — khi bật, mọi transition tắt và nội dung hiện ngay lập tức, kể cả khi
JS chưa chạy.

---

## 9. Form liên hệ

- Validate hoàn toàn phía client bằng **Constraint Validation API** + class `.was-validated`
  của Bootstrap. Thông báo lỗi tiếng Việt nằm trong các `<div class="invalid-feedback">`
  ngay dưới từng trường (`index.html`, khối 6).
- Form **gửi thật** qua [Web3Forms](https://web3forms.com) — xem mục "Bật gửi form" ngay dưới.
- Ràng buộc hiện tại: họ tên ≥ 2 ký tự · điện thoại khớp `(0|+84)…` · email đúng định dạng ·
  nội dung ≥ 10 ký tự.
- Nút gửi dùng `.tp-btn-submit` chứ không phải `.btn-lg`: giữ cỡ chữ `1rem` bằng ô nhập và
  đệm dọc `.625rem` để cao đúng **46px** — khớp chiều cao `.form-control`. Dùng `btn-lg` thì
  chữ nhảy lên `1.25rem`, to hơn hẳn nhãn (15px) và ô nhập (16px) của chính form.
  Wrapper `.d-grid .d-sm-block` vẫn giữ: dưới `sm` nút kéo hết chiều ngang cho dễ bấm.

### Bật gửi form — access key nằm NGOÀI repo

Access key **không được commit**. Nó nằm trong `assets/js/config.js`, file này đã bị
`.gitignore` chặn.

Sau khi clone repo về máy mới:

```bash
cp assets/js/config.example.js assets/js/config.js
```

rồi mở `config.js` và điền key thật:

```js
window.TP_CONFIG = { web3formsKey: 'key-cua-ban' };
```

Lấy key miễn phí tại <https://web3forms.com> — nhập `xtandev@gmail.com`, họ gửi key về hộp
thư đó, không cần tạo tài khoản.

Chưa có `config.js` thì form **báo lỗi rõ ràng** chứ không giả vờ gửi thành công.

**Khi deploy:** `config.js` do `build.sh` sinh ra từ biến môi trường `W3F_KEY` — xem mục 12.
Không phải upload tay, và key vẫn không nằm trong repo.

| Mục | Giá trị |
|---|---|
| Hạn mức miễn phí | 250 lượt/tháng, lưu lịch sử 30 ngày |
| Nơi nhận | `xtandev@gmail.com` (gắn với access key, không xuất hiện trong mã nguồn) |
| Endpoint | `https://api.web3forms.com/submit` (`app.js`, hằng `W3F_ENDPOINT`) |
| Chống spam | honeypot `botcheck` (`.tp-hp`) — bot điền vào thì Web3Forms loại |

### Điều cần hiểu rõ về access key

Tách key khỏi repo giải quyết được việc **key bị lưu vĩnh viễn trong lịch sử Git công khai**,
nơi bot chuyên quét GitHub có thể nhặt được.

Nhưng nó **không giấu được key khỏi người xem site**. Web3Forms gọi API từ trình duyệt, nên
bất kỳ ai mở DevTools trên site đã deploy đều đọc được key trong `config.js`. Đây là bản chất
của mọi dịch vụ form chạy phía client, không phải thiếu sót của cách làm này.

Key chỉ **ghi** được: không đọc được dữ liệu đã gửi, không lộ email nhận. Rủi ro thực tế là
người khác dùng key để bắn form làm đầy hộp thư và đốt hạn mức 250 lượt/tháng. Cách chặn:

1. Vào bảng điều khiển Web3Forms, giới hạn tên miền được phép gửi về `tanpham.info`.
2. Bật hCaptcha nếu vẫn bị spam.

Muốn key **không bao giờ** lộ ra trình duyệt thì phải bỏ Web3Forms và tự chạy một
serverless function giữ key ở phía máy chủ — chỉ cần thay phần `fetch` trong `app.js` mục 7.

### Không bao giờ báo thành công khi chưa gửi được

`app.js` mục 7 chỉ hiện `#tpFormSuccess` khi máy chủ trả về `success: true`. Bốn tình huống
còn lại đều hiện `#tpFormError` kèm số điện thoại và email để khách vẫn liên hệ được:

| Tình huống | Hành vi |
|---|---|
| Chưa dán access key | "Form chưa được cấu hình để gửi đi (thiếu access key)." |
| Key sai / hết hạn mức | hiện đúng thông báo máy chủ trả về |
| Mất mạng | "Không gửi được: Failed to fetch." |
| Máy chủ trả JSON hỏng | coi như thất bại |

Ở mọi nhánh lỗi, **dữ liệu khách đã nhập được giữ nguyên** để họ không phải gõ lại. Chỉ khi
gửi thành công form mới reset. Trong lúc chờ, nút chuyển sang "Đang gửi…" và bị khoá để
tránh bấm hai lần.

Nếu sau này bạn muốn bỏ Web3Forms và tự chạy backend, chỉ cần thay phần `fetch` trong
`app.js` mục 7 — phần validate, trạng thái nút và hai hộp thông báo giữ nguyên.

---

## 10. Chuyển giao diện sáng / tối

| Thành phần | Ở đâu |
|---|---|
| Nút bấm | `index.html`, `<button id="tpThemeToggle">` trong navbar (ở mobile nằm trong offcanvas) |
| Đặt giao diện trước khi vẽ | `<script>` nội tuyến ở `<head>` — đọc `localStorage['tp-theme']`, nếu chưa có thì lấy `prefers-color-scheme` |
| Xử lý bấm & ghi nhớ | `app.js` mục 9 |
| Bảng màu | `theme.css` mục 1b |
| Logo đảo màu theo giao diện | `theme.css` mục 5, xem bảng ở mục 5 của README này |

Hành vi:

1. Lần đầu truy cập → bám theo cài đặt hệ điều hành. Người dùng đổi cài đặt hệ thống thì
   site đổi theo ngay (miễn là họ chưa tự bấm nút).
2. Bấm nút → ghi `localStorage['tp-theme']`, từ đó lựa chọn thủ công được ưu tiên.
3. Muốn quay lại chế độ "theo hệ thống": xoá khoá `tp-theme` trong localStorage.

Muốn đổi mặc định thành **luôn sáng**, sửa đoạn script trong `<head>`: bỏ nhánh
`matchMedia(...)` và gán thẳng `t = 'light'`.

---

## 11. Ghi chú kỹ thuật

- Mọi cặp màu chữ/nền đã được đo bằng công thức tương phản WCAG ở **cả hai giao diện**;
  toàn bộ văn bản đạt AA (≥ 4.5:1). Ngoại lệ duy nhất: icon trong ô `.tp-icon-box` ở giao diện
  sáng đạt **4.46:1** — đây là đồ hoạ phi văn bản nên chỉ cần ≥ 3:1 theo WCAG 1.4.11, và cặp màu
  này là do design token quy định (`--tp-accent` trên `--tp-primary-subtle`).
- Mega-menu dùng `data-bs-display="static"` để Popper không chèn `transform` inline —
  nhờ vậy panel tự trải ngang theo `.container` và tự animate fade + `translateY(8px)`.
  Khi đóng, panel ở `visibility:hidden` nên **không nằm trong thứ tự Tab**.
- Hiệu ứng mở mega-menu chỉ áp dụng từ `lg` trở lên; dưới `lg` menu nằm trong offcanvas
  và bung ra theo chiều dọc như bình thường.
- Ba cột chân trang dùng `col-12 col-sm-6 col-lg-*` chứ không phải `col-6`: ở 375px, cột
  `col-6` chỉ rộng 188px trong khi địa chỉ email dài tới 235px, gây đè chữ sang cột bên cạnh
  (lỗi này bị `body { overflow-x: hidden }` che nên không lộ ra ở kiểm tra tràn ngang cấp
  trang). `.tp-footer-list a` cũng có `overflow-wrap: anywhere` làm lưới an toàn cho email
  hoặc địa chỉ dài hơn nữa.
- Bootstrap khai báo các biến `--bs-dropdown-*` / `--bs-offcanvas-*` **ngay trên chính class
  component**, nên ghi đè ở `:root` sẽ bị che. Vì vậy chúng được ghi đè tại
  `.tp-navbar .dropdown-menu` và `.tp-offcanvas` (`theme.css` mục 5).
- Trạng thái khởi đầu của scroll-reveal (`opacity: 0`) nằm trong CSS. Nếu trình duyệt tắt
  JavaScript, nội dung sẽ không hiện — trừ khi người dùng bật "giảm chuyển động".
  Cần hỗ trợ no-JS thì bỏ khối `[data-cue] { opacity: 0 }` ở `theme.css` mục 10.
- `body { overflow-x: hidden }` chỉ là lưới an toàn; đã kiểm tra thực tế **không có** phần tử
  nào tràn khung ở 375 / 768 / 1440px.

---

## 12. Deploy lên Cloudflare Pages

### Vì sao cần `build.sh`

Site không có bước build thật. `build.sh` tồn tại vì đúng một lý do: sinh
`assets/js/config.js` từ biến môi trường lúc deploy, vì file đó bị `.gitignore` chặn để
Web3Forms access key không nằm trong repo công khai.

Nếu thiếu `W3F_KEY`, **build cố tình dừng lại với mã lỗi 1**. Đây là lựa chọn có chủ ý: deploy
thất bại ồn ào dễ phát hiện hơn nhiều so với deploy thành công nhưng form gửi không được mà
không ai hay.

### Thiết lập trong Cloudflare Pages

Tạo project mới → **Connect to Git** → chọn repo `Tan-Pham-Portfolio-`, rồi điền:

| Ô | Giá trị |
|---|---|
| Framework preset | `None` |
| Build command | `sh build.sh` |
| Build output directory | `/` |
| Root directory | *(để trống)* |

**Settings → Environment variables**, thêm cho cả Production và Preview:

| Tên | Giá trị |
|---|---|
| `W3F_KEY` | access key lấy từ <https://web3forms.com> |

### Tên miền trong thẻ OG và canonical

`index.html` **không gắn cứng tên miền**. Ba chỗ `canonical`, `og:url`, `og:image` dùng
placeholder `__SITE_URL__`, và `build.sh` điền vào lúc deploy theo thứ tự ưu tiên:

| Thứ tự | Nguồn | Khi nào dùng |
|---|---|---|
| 1 | `SITE_URL` | bạn tự đặt, sau khi đã mua tên miền riêng |
| 2 | `CF_PAGES_URL` | Cloudflare tự inject — chính là địa chỉ `*.pages.dev` |

Thiếu cả hai thì **build dừng**. Lý do: nếu để sót `__SITE_URL__` trong `og:image`, link chia
sẻ lên Facebook và Zalo sẽ không hiện ảnh, mà lỗi này không thấy được khi xem site bình thường.

Nhờ vậy deploy lên `*.pages.dev` là thẻ OG tự đúng ngay, không phải sửa gì. Sau này mua tên
miền thì chỉ cần thêm biến `SITE_URL` — không đụng vào mã nguồn.

### Trỏ tên miền

**Custom domains** → thêm **cả hai**: `tanpham.info` và `www.tanpham.info`.
Cloudflare tự cấp chứng chỉ TLS, không phải làm gì thêm.

Phải thêm cả `www` thì `_redirects` mới gom được về tên miền gốc. Thiếu bước này thì
`www.tanpham.info` sẽ không phân giải, và Google có thể lập chỉ mục hai địa chỉ cho cùng một
nội dung.

### Hai file cấu hình

Cloudflare Pages đọc hai file này và **không phục vụ chúng như nội dung trang**:

| File | Việc nó làm |
|---|---|
| `_headers` | header bảo mật (`nosniff`, `Referrer-Policy`, `X-Frame-Options`) + quy tắc cache |
| `_redirects` | gom `www` về tên miền gốc — **đang tắt**, bật khi đã mua tên miền riêng |

**Về cache:** tên file CSS/JS không có hash nên chỉ cache 1 giờ — nếu để dài, sửa `theme.css`
xong khách vẫn dùng bản cũ hàng tuần. HTML đặt `must-revalidate` để nội dung mới hiện ngay.
Ảnh cache 7 ngày vì hiếm khi đổi.

Nếu sau này thêm hash vào tên file (ví dụ `theme.a1b2c3.css`) thì hạ được `max-age` lên 1 năm
cho CSS/JS.

### Vì sao chọn Cloudflare thay vì Render

Render đáp ứng đủ yêu cầu kỹ thuật, nhưng gói free chỉ có **5 GB băng thông/tháng**, và khi
vượt mức mà chưa gắn thẻ thanh toán thì Render **tạm ngưng toàn bộ dịch vụ tới hết tháng** —
site tắt hẳn chứ không phải chậm đi. Cloudflare Pages không giới hạn băng thông nên không tồn
tại kịch bản đó, đồng thời có POP tại TP.HCM và Hà Nội nên nhanh hơn với khách trong nước.

### Ảnh Open Graph

`assets/img/og-cover.png` — **1200×630, 29 KB**, đúng cỡ Facebook, Zalo và LinkedIn khuyến nghị.

Bản SVG cũ đã gỡ: phần lớn mạng xã hội **không đọc được SVG**, chia sẻ link sẽ ra thẻ trắng
không ảnh. Ảnh mới vẽ bằng GDI+ (script trong lịch sử phiên làm việc), dùng font Segoe UI vì
Public Sans không cài sẵn trên máy — ảnh tĩnh nên không ảnh hưởng gì.

Kèm theo `og:image:type` và `og:image:alt` để Facebook và Zalo dựng thẻ xem trước chính xác hơn.

**Đổi ảnh này:** thay `og-cover.png` bằng file PNG/JPG khác đúng **1200×630**. Sai tỉ lệ thì
Facebook tự cắt, thường cắt mất chữ.
