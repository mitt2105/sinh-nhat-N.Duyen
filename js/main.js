(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const wishDialog = $("#wishDialog");
  const lightbox = $("#lightbox");
  const confettiLayer = $("#confettiLayer");
  let audioCtx = null, musicTimer = null, musicOn = false, noteIndex = 0;
  let masterGain = null;

  $("#openWish").addEventListener("click", () => wishDialog.showModal());
  $("#closeWish").addEventListener("click", () => wishDialog.close());
  wishDialog.addEventListener("click", e => { if (e.target === wishDialog) wishDialog.close(); });

  function celebrate() {
    const symbols = ["♡", "✦", "✿", "✧", "♥"];
    const colors = ["#c96f85", "#d6b574", "#e8b7c1", "#fff4dc", "#b98b95"];
    for (let i = 0; i < 58; i++) {
      const item = document.createElement("span");
      item.className = "confetti";
      item.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      item.style.left = Math.random() * 100 + "%";
      item.style.setProperty("--duration", (2.4 + Math.random() * 2.6) + "s");
      item.style.setProperty("--size", (12 + Math.random() * 18) + "px");
      item.style.setProperty("--color", colors[Math.floor(Math.random() * colors.length)]);
      item.style.animationDelay = (Math.random() * .7) + "s";
      confettiLayer.appendChild(item);
      setTimeout(() => item.remove(), 6000);
    }
  }
  $("#celebrateBtn").addEventListener("click", celebrate);
  $("#dialogCelebrate").addEventListener("click", () => { wishDialog.close(); celebrate(); });

  document.querySelectorAll(".memory").forEach(button => {
    button.addEventListener("click", () => {
      const img = $("#lightboxImage");
      img.src = button.dataset.full;
      img.alt = $("img", button).alt;
      lightbox.showModal();
    });
  });
  $("#closeLightbox").addEventListener("click", () => lightbox.close());
  lightbox.addEventListener("click", e => { if (e.target === lightbox) lightbox.close(); });

  // Local MP3: attempt autoplay, then gracefully fall back to the visible controls.
  const birthdayMusic = $("#birthdayMusic");
  const audioStatus = $("#audioStatus");
  const musicButton = $("#musicToggle");
  if (birthdayMusic) {
    birthdayMusic.volume = 0.55;
    const attemptAutoplay = birthdayMusic.play();
    if (attemptAutoplay && typeof attemptAutoplay.catch === "function") {
      attemptAutoplay.then(() => {
        if (audioStatus) audioStatus.textContent = "Nhạc đang phát ♫";
        musicButton.setAttribute("aria-pressed", "true");
      }).catch(() => {
        if (audioStatus) audioStatus.textContent = "Trình duyệt chặn tự phát có tiếng — bấm Play để nghe nhạc nhé.";
      });
    }
    birthdayMusic.addEventListener("play", () => {
      if (audioStatus) audioStatus.textContent = "Nhạc đang phát ♫";
      musicButton.setAttribute("aria-pressed", "true");
    });
    birthdayMusic.addEventListener("pause", () => {
      if (audioStatus) audioStatus.textContent = "Nhạc đang tạm dừng.";
      musicButton.setAttribute("aria-pressed", "false");
    });
    musicButton.addEventListener("click", () => {
      $("#music").scrollIntoView({ behavior: "smooth", block: "center" });
      if (birthdayMusic.paused) birthdayMusic.play().catch(() => {
        if (audioStatus) audioStatus.textContent = "Bấm Play trong khung nhạc để bắt đầu.";
      });
      else birthdayMusic.pause();
    });
  }

  // Reveal content gently as it enters the viewport, with reduced-motion respected.
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const targets = document.querySelectorAll(".section-heading, .letter-card, .memory, .final-section > *");
    targets.forEach(el => { el.style.opacity = "0"; el.style.transform = "translateY(12px)"; el.style.transition = "opacity .7s ease, transform .7s ease"; });
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"; entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    }), { threshold: .12 });
    targets.forEach(el => observer.observe(el));
  }
})();