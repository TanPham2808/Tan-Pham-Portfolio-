/* ==========================================================================
   APP.JS — Toàn bộ JavaScript tuỳ chỉnh (vanilla, không thư viện ngoài)
   1) Scroll reveal (IntersectionObserver)   5) Cuộn mượt tới neo
   2) Stagger cho container                  6) Đóng offcanvas khi chọn menu
   3) Sticky navbar                          7) Validate form liên hệ
   4) Nút cuộn về đầu trang                  8) Năm hiện tại ở chân trang
                                             9) Chuyển giao diện sáng / tối
                                            10) Xem ảnh chứng chỉ phóng to
   ========================================================================== */
(function () {
  'use strict';

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SCROLL_BEHAVIOR = REDUCED ? 'auto' : 'smooth';

  var NAV_STICK_AT = 250;   // px — ngưỡng bật navbar dính
  var TO_TOP_AT    = 400;   // px — ngưỡng hiện nút về đầu trang
  var STAGGER_STEP = 100;   // ms — bước trễ giữa các phần tử con

  /* ----------------------------------------------------------------------
     1 + 2) SCROLL REVEAL & STAGGER
     API: data-cue="fadeIn|zoomIn|slideInUp" · data-delay="200" · data-duration="700"
          data-cues="slideInUp" trên container -> con trực tiếp trễ dần 100ms
     ---------------------------------------------------------------------- */
  function reveal(el) {
    el.classList.add('tp-cue-in');
  }

  function applyTiming(el, delay, duration) {
    if (delay)    { el.style.transitionDelay = delay + 'ms'; }
    if (duration) { el.style.transitionDuration = duration + 'ms'; }
  }

  function initScrollCue() {
    var singles = Array.prototype.slice.call(document.querySelectorAll('[data-cue]'));
    var groups  = Array.prototype.slice.call(document.querySelectorAll('[data-cues]'));

    // Gán timing cho phần tử đơn
    singles.forEach(function (el) {
      applyTiming(el, parseInt(el.getAttribute('data-delay'), 10) || 0,
                      parseInt(el.getAttribute('data-duration'), 10) || 0);
    });

    // Gán timing tăng dần cho con trực tiếp của container stagger
    groups.forEach(function (group) {
      var base     = parseInt(group.getAttribute('data-delay'), 10) || 0;
      var duration = parseInt(group.getAttribute('data-duration'), 10) || 0;
      Array.prototype.forEach.call(group.children, function (child, i) {
        applyTiming(child, base + i * STAGGER_STEP, duration);
      });
    });

    // Tắt hiệu ứng: hiện ngay toàn bộ nội dung
    if (REDUCED || !('IntersectionObserver' in window)) {
      singles.forEach(reveal);
      groups.forEach(function (group) {
        Array.prototype.forEach.call(group.children, reveal);
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) { return; }
        var el = entry.target;

        if (el.hasAttribute('data-cues')) {
          Array.prototype.forEach.call(el.children, reveal);
        } else {
          reveal(el);
        }

        obs.unobserve(el);            // chỉ chạy MỘT LẦN
      });
    }, { threshold: 0.15 });

    singles.forEach(function (el) { observer.observe(el); });
    groups.forEach(function (el) { observer.observe(el); });
  }

  /* ----------------------------------------------------------------------
     3) STICKY NAVBAR  +  4) NÚT CUỘN VỀ ĐẦU TRANG
     ---------------------------------------------------------------------- */
  function initScrollState() {
    var navbar = document.getElementById('tpNavbar');
    var toTop  = document.getElementById('tpToTop');
    var ticking = false;

    function update() {
      var y = window.pageYOffset || document.documentElement.scrollTop;

      if (navbar) {
        navbar.classList.toggle('navbar-stick', y > NAV_STICK_AT);
      }
      if (toTop) {
        toTop.classList.toggle('tp-show', y > TO_TOP_AT);
      }
      ticking = false;
    }

    function onScroll() {
      if (ticking) { return; }
      ticking = true;
      window.requestAnimationFrame(update);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    update();

    if (toTop) {
      toTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: SCROLL_BEHAVIOR });
      });
    }
  }

  /* ----------------------------------------------------------------------
     5 + 6) CUỘN MƯỢT TỚI NEO (bù chiều cao navbar qua scroll-margin-top)
            và đóng offcanvas khi chọn một mục menu trên mobile
     ---------------------------------------------------------------------- */
  function goTo(target) {
    target.scrollIntoView({ behavior: SCROLL_BEHAVIOR, block: 'start' });

    // Đưa tiêu điểm bàn phím tới đúng khối vừa cuộn đến
    if (!target.hasAttribute('tabindex')) {
      target.setAttribute('tabindex', '-1');
      target.addEventListener('blur', function handler() {
        target.removeAttribute('tabindex');
        target.removeEventListener('blur', handler);
      });
    }
    target.focus({ preventScroll: true });
  }

  function initAnchors() {
    var offcanvasEl = document.getElementById('tpMenu');

    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) { return; }

      var hash = link.getAttribute('href');
      if (!hash || hash === '#') { return; }

      var target = document.querySelector(hash);
      if (!target) { return; }

      e.preventDefault();
      if (history.pushState) { history.pushState(null, '', hash); }

      // Nếu offcanvas đang mở: đóng trước rồi mới cuộn
      var instance = offcanvasEl && window.bootstrap
        ? window.bootstrap.Offcanvas.getInstance(offcanvasEl)
        : null;

      if (instance && offcanvasEl.classList.contains('show')) {
        offcanvasEl.addEventListener('hidden.bs.offcanvas', function handler() {
          offcanvasEl.removeEventListener('hidden.bs.offcanvas', handler);
          goTo(target);
        });
        instance.hide();
        return;
      }

      goTo(target);
    });
  }

  /* ----------------------------------------------------------------------
     7) FORM LIÊN HỆ — validate (Constraint Validation API + .was-validated)
        rồi GỬI THẬT qua Web3Forms.

        Nguyên tắc: chỉ hiện thông báo thành công khi máy chủ xác nhận đã nhận.
        Mọi trường hợp còn lại (mất mạng, sai key, quá hạn mức) đều hiện lỗi
        kèm số điện thoại và email để khách vẫn liên hệ được.
     ---------------------------------------------------------------------- */
  var W3F_ENDPOINT    = 'https://api.web3forms.com/submit';
  var W3F_KEY_MISSING = 'DAN-ACCESS-KEY-VAO-DAY';   // giá trị mẫu trong index.html

  function initContactForm() {
    var form      = document.getElementById('tpContactForm');
    var success   = document.getElementById('tpFormSuccess');
    var errorBox  = document.getElementById('tpFormError');
    var errorText = document.getElementById('tpFormErrorText');
    if (!form) { return; }

    var submitBtn  = form.querySelector('button[type="submit"]');
    var submitIdle = submitBtn ? submitBtn.textContent.trim() : 'Gửi';

    // Chỉ lấy các trường người dùng thực sự nhập — bỏ hidden và bẫy spam
    var fields = Array.prototype.slice.call(
      form.querySelectorAll('input:not([type="hidden"]), textarea, select')
    ).filter(function (f) { return f.name !== 'botcheck'; });

    function syncAria() {
      fields.forEach(function (field) {
        field.setAttribute('aria-invalid', field.checkValidity() ? 'false' : 'true');
      });
    }

    function hideAlerts() {
      if (success)  { success.classList.add('d-none'); }
      if (errorBox) { errorBox.classList.add('d-none'); }
    }

    function showAlert(box, message) {
      if (!box) { return; }
      if (message && errorText && box === errorBox) { errorText.textContent = message; }
      box.classList.remove('d-none');
      box.scrollIntoView({ behavior: SCROLL_BEHAVIOR, block: 'nearest' });
    }

    function setBusy(busy) {
      if (!submitBtn) { return; }
      submitBtn.disabled = busy;
      submitBtn.setAttribute('aria-busy', String(busy));
      submitBtn.textContent = busy ? 'Đang gửi…' : submitIdle;
    }

    // Sau lần gửi đầu tiên, cập nhật trạng thái ngay khi người dùng sửa
    fields.forEach(function (field) {
      field.addEventListener('input', function () {
        if (form.classList.contains('was-validated')) { syncAria(); }
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      e.stopPropagation();

      form.classList.add('was-validated');
      syncAria();
      hideAlerts();

      if (!form.checkValidity()) {
        var firstInvalid = fields.filter(function (f) { return !f.checkValidity(); })[0];
        if (firstInvalid) { firstInvalid.focus(); }
        return;
      }

      // Access key đọc từ assets/js/config.js — file đó KHÔNG nằm trong repo
      var key = ((window.TP_CONFIG && window.TP_CONFIG.web3formsKey) || '').trim();

      // Chưa cấu hình key -> báo thẳng, tuyệt đối không giả vờ gửi thành công
      if (!key || key === W3F_KEY_MISSING) {
        showAlert(errorBox, 'Form chưa được cấu hình để gửi đi (thiếu access key).');
        return;
      }

      setBusy(true);

      var payload = Object.fromEntries(new FormData(form).entries());
      payload.access_key = key;

      fetch(W3F_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          return res.json().catch(function () { return { success: false }; });
        })
        .then(function (data) {
          if (!data || data.success !== true) {
            throw new Error(data && data.message ? data.message : 'Máy chủ từ chối yêu cầu.');
          }
          form.reset();
          form.classList.remove('was-validated');
          fields.forEach(function (f) { f.setAttribute('aria-invalid', 'false'); });
          showAlert(success);
        })
        .catch(function (err) {
          showAlert(errorBox, 'Không gửi được: ' + (err && err.message ? err.message : 'lỗi kết nối') + '.');
        })
        .then(function () { setBusy(false); });
    });
  }

  /* ----------------------------------------------------------------------
     8) NĂM HIỆN TẠI Ở CHÂN TRANG
     ---------------------------------------------------------------------- */
  function initYear() {
    var el = document.getElementById('tpYear');
    if (el) { el.textContent = String(new Date().getFullYear()); }
  }

  /* ----------------------------------------------------------------------
     9) CHUYỂN GIAO DIỆN SÁNG / TỐI
        Giá trị ban đầu đã được đặt bởi đoạn script nội tuyến trong <head>
        (để không nháy màu). Ở đây chỉ xử lý bấm nút, lưu lựa chọn và theo
        dõi thay đổi cấp hệ điều hành khi người dùng CHƯA tự chọn.
     ---------------------------------------------------------------------- */
  var THEME_KEY = 'tp-theme';

  function initThemeToggle() {
    var root = document.documentElement;
    var btn  = document.getElementById('tpThemeToggle');
    var media = window.matchMedia('(prefers-color-scheme: dark)');

    function stored() {
      try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
    }

    function currentTheme() {
      return root.getAttribute('data-bs-theme') === 'dark' ? 'dark' : 'light';
    }

    function apply(theme, remember) {
      root.setAttribute('data-bs-theme', theme);

      if (remember) {
        try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* bỏ qua */ }
      }
      if (btn) {
        var toDark = theme !== 'dark';
        btn.setAttribute('aria-pressed', String(theme === 'dark'));
        btn.setAttribute('title', toDark ? 'Chuyển sang giao diện tối'
                                         : 'Chuyển sang giao diện sáng');
      }
    }

    apply(currentTheme(), false);   // đồng bộ nhãn nút với giao diện hiện tại

    if (btn) {
      btn.addEventListener('click', function () {
        apply(currentTheme() === 'dark' ? 'light' : 'dark', true);
      });
    }

    // Người dùng chưa tự chọn -> bám theo cài đặt của hệ điều hành
    var onSystemChange = function (e) {
      if (stored()) { return; }
      apply(e.matches ? 'dark' : 'light', false);
    };

    if (media.addEventListener) {
      media.addEventListener('change', onSystemChange);
    } else if (media.addListener) {
      media.addListener(onSystemChange);         // Safari cũ
    }
  }

  /* ----------------------------------------------------------------------
     10) XEM ẢNH CHỨNG CHỈ PHÓNG TO
         Một modal dùng chung cho cả 4 ảnh; nội dung điền theo nút được bấm.
     ---------------------------------------------------------------------- */
  function initCertModal() {
    var modal = document.getElementById('tpCertModal');
    if (!modal) { return; }

    var img   = document.getElementById('tpCertModalImg');
    var label = document.getElementById('tpCertModalLabel');

    modal.addEventListener('show.bs.modal', function (e) {
      var trigger = e.relatedTarget;
      if (!trigger || !img) { return; }

      var src   = trigger.getAttribute('data-cert-src');
      var title = trigger.getAttribute('data-cert-title') || 'Chứng chỉ';
      var thumb = trigger.querySelector('img');

      img.setAttribute('src', src);
      // Mượn lại alt của ảnh nhỏ để không mô tả trùng lặp hai nơi
      img.setAttribute('alt', thumb ? thumb.getAttribute('alt') : title);
      if (label) { label.textContent = title; }
    });

    // Trả ảnh về rỗng khi đóng để lần mở sau không chớp ảnh cũ
    modal.addEventListener('hidden.bs.modal', function () {
      if (img) { img.setAttribute('src', ''); img.setAttribute('alt', ''); }
    });
  }

  /* ---------------------------------------------------------------------- */
  function init() {
    initThemeToggle();
    initCertModal();
    initScrollCue();
    initScrollState();
    initAnchors();
    initContactForm();
    initYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
