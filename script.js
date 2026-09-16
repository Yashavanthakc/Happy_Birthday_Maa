/* VARSHA BIRTHDAY SURPRISE - SCREEN BY SCREEN VERSION */
document.addEventListener("DOMContentLoaded", () => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  /* ---------- PASSWORD GATE ---------- */
  const passwordGate = $("#passwordGate");
  const passwordForm = $("#passwordForm");
  const sitePassword = $("#sitePassword");
  const rememberPassword = $("#rememberPassword");
  const passwordError = $("#passwordError");
  const togglePassword = $("#togglePassword");
  const passwordCard = $(".password-card", passwordGate);

  // The requested password is exactly: Maa
  const CORRECT_PASSWORD = "Maa";
  const REMEMBER_KEY = "maa-surprise-unlocked";

  document.body.classList.add("password-locked");

  const loader = $("#loader");

  function unlockSite() {
    passwordGate?.classList.add("hide");
    document.body.classList.remove("password-locked");

    // Make sure the loading screen cannot remain above the website.
    loader?.classList.add("hide");

    setTimeout(() => {
      passwordGate?.remove();
    }, 650);
  }

  // If she previously selected "Remember me", open the surprise automatically.
  if (localStorage.getItem(REMEMBER_KEY) === "true") {
    unlockSite();
  } else {
    setTimeout(() => sitePassword?.focus(), 300);
  }

  function checkPassword(e) {
    if (e) e.preventDefault();

    const entered = (sitePassword?.value || "").trim();

    if (entered === CORRECT_PASSWORD) {
      passwordError.textContent = "Opening your surprise... ❤️";

      if (rememberPassword.checked) {
        localStorage.setItem(REMEMBER_KEY, "true");
      } else {
        localStorage.removeItem(REMEMBER_KEY);
      }

      unlockSite();
    } else {
      passwordError.textContent = "Wrong password. Try again ❤️";
      passwordCard?.classList.remove("try-again");
      void passwordCard?.offsetWidth;
      passwordCard?.classList.add("try-again");
      sitePassword.select();
    }
  }

  passwordForm?.addEventListener("submit", checkPassword);
  passwordForm?.querySelector(".password-submit")?.addEventListener("click", checkPassword);

  togglePassword?.addEventListener("click", () => {
    const hidden = sitePassword.type === "password";
    sitePassword.type = hidden ? "text" : "password";
    togglePassword.textContent = hidden ? "🙈" : "👁️";
    togglePassword.setAttribute("aria-label", hidden ? "Hide password" : "Show password");
    sitePassword.focus();
  });

  sitePassword?.addEventListener("input", () => {
    if (passwordError) passwordError.textContent = "";
  });


  const screens = $$(".screen");
  const music = $("#birthdayMusic");
  const musicButton = $("#musicButton");
  const themeToggle = $("#themeToggle");
  const toast = $("#toast");

  /* ---------- DIRECT ROOT FILES ---------- */
  const photoFiles = Array.from({ length: 50 }, (_, i) =>
    `photo${String(i + 1).padStart(2, "0")}.jpg`
  );

  const reelFiles = Array.from({ length: 24 }, (_, i) =>
    `reel-${String(i + 1).padStart(2, "0")}.mp4`
  );

  /* ---------- LOADER ---------- */
  window.addEventListener("load", () => {
    setTimeout(() => loader?.classList.add("hide"), 450);
  });

  /* ---------- SCREEN NAVIGATION ---------- */
  function showScreen(id, push = true) {
    const target = document.getElementById(id);
    if (!target) return;

    screens.forEach(screen => {
      screen.classList.toggle("active-screen", screen === target);
    });

    window.scrollTo({ top: 0, behavior: "smooth" });

    if (push) {
      history.pushState({ screen: id }, "", `#${id}`);
    }

    stopVideosExceptVisible(target);
  }

  function stopVideosExceptVisible(active) {
    $$("video").forEach(video => {
      if (!active.contains(video)) {
        video.pause();
      }
    });
  }

  $$(".next-btn, #decisionNext, #responseNext").forEach(button => {
    button.addEventListener("click", () => {
      const next = button.dataset.next;
      if (next) showScreen(next);
    });
  });

  history.replaceState({ screen: "screen1" }, "", "#screen1");

  window.addEventListener("popstate", () => {
    const id = location.hash.replace("#", "") || "screen1";
    showScreen(id, false);
  });

  /* ---------- DARK / LIGHT MODE ---------- */
  const savedTheme = localStorage.getItem("varsha-theme");
  if (savedTheme === "light") document.body.classList.add("light-mode");
  updateThemeIcon();

  function updateThemeIcon() {
    themeToggle.textContent = document.body.classList.contains("light-mode") ? "🌙" : "☀️";
  }

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    localStorage.setItem(
      "varsha-theme",
      document.body.classList.contains("light-mode") ? "light" : "dark"
    );
    updateThemeIcon();
  });

  /* ---------- MUSIC ---------- */
  let playing = false;

  async function toggleMusic() {
    if (!music) return;

    try {
      if (music.paused) {
        await music.play();
        playing = true;
        musicButton.textContent = "🔊";
        musicButton.classList.add("playing");
        showToast("Our song is playing ❤️");
      } else {
        music.pause();
        playing = false;
        musicButton.textContent = "🎵";
        musicButton.classList.remove("playing");
      }
    } catch {
      showToast("Tap the music button again 🎵");
    }
  }

  musicButton?.addEventListener("click", toggleMusic);
  music?.addEventListener("play", () => {
    playing = true;
    musicButton.textContent = "🔊";
    musicButton.classList.add("playing");
  });
  music?.addEventListener("pause", () => {
    playing = false;
    musicButton.textContent = "🎵";
    musicButton.classList.remove("playing");
  });

  /* ---------- 30 PHOTOS ---------- */
  const photoGrid = $("#photoGrid");

  photoFiles.forEach((file, index) => {
    const card = document.createElement("button");
    card.className = "photo-card";
    card.type = "button";
    card.innerHTML = `
      <img src="${file}" alt="Memory ${index + 1}" loading="lazy">
      <span>${String(index + 1).padStart(2, "0")}</span>
    `;

    const img = $("img", card);
    img.addEventListener("error", () => {
      card.classList.add("missing");
      img.remove();
    });

    card.addEventListener("click", () => {
      if (!card.classList.contains("missing")) openLightbox(file, `Memory ${String(index + 1).padStart(2, "0")}`);
    });

    photoGrid.appendChild(card);
  });

  /* ---------- LIGHTBOX ---------- */
  const lightbox = $("#lightbox");
  const lightboxImage = $("#lightboxImage");
  const lightboxClose = $("#lightboxClose");

  function openLightbox(src, alt) {
    lightboxImage.src = src;
    lightboxImage.alt = alt;
    lightbox.classList.remove("hidden");
    document.body.classList.add("modal-open");
  }

  function closeLightbox() {
    lightbox.classList.add("hidden");
    lightboxImage.src = "";
    document.body.classList.remove("modal-open");
  }

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", e => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeLightbox();
  });

  /* ---------- 18 REELS ---------- */
  const reelsGrid = $("#reelsGrid");

  const reelTitles = [
    "That smile I can never ignore.",
    "You don't even know how cute you are.",
    "This one has a special place in my heart.",
    "One more little memory.",
    "A moment I'll always remember.",
    "Your little expressions.",
    "A smile worth replaying.",
    "Just you being you.",
    "One of my favourite moments.",
    "This made me smile again.",
    "A tiny memory, forever.",
    "Your happiness looks beautiful.",
    "Another little piece of you.",
    "A moment I wanted to keep.",
    "You make ordinary moments special.",
    "One more reason to smile.",
    "A memory I won't forget.",
    "The last little reel. ❤️",
    "Six more seconds of you I wanted to keep. 🥹❤️",
    "Another reel, another reason to smile. 💕",
    "Your smile deserves one more replay. ❤️",
    "A little moment that stayed in my heart. 🫂",
    "Just one more beautiful memory of you. 🌸❤️",
    "Saving this moment forever. 🎬❤️"
  ];

  const reelDescriptions = [
    "Every time I see this, I automatically smile.",
    "You being yourself is already beautiful.",
    "Some videos are more than just videos.",
    "A tiny moment worth keeping forever.",
    "Some memories deserve their own little place.",
    "Your expressions always make me smile.",
    "This little moment stays with me.",
    "Nothing special... just you. And that's enough.",
    "Some moments deserve to be replayed.",
    "A small video with a big memory.",
    "Little memories become the best ones.",
    "Seeing you happy is one of my favourite things.",
    "Another tiny memory I wanted to save.",
    "Because some moments shouldn't disappear.",
    "You have a way of making moments beautiful.",
    "Just another reason I smile.",
    "A moment I'll carry in my heart.",
    "And yes... I watched this more than once. ❤️",
    "this Reel  created For me Only dont lie to me now. ",
    "This Words your voice always My Fav nomatter what said. ",
    "kiss... This kisses you Give with a feeling i kept in heart always",
    "Efforts... this is All my Small Efforts to you. ",
    "Memories.. this is my memories i have with you. ",
    "This is Always I want say ",
  ];

  reelFiles.forEach((file, index) => {
    const card = document.createElement("article");
    card.className = "reel-card";
    card.innerHTML = `
      <div class="video-wrapper">
        <video controls preload="metadata" playsinline>
          <source src="${file}" type="video/mp4">
        </video>
      </div>
      <div class="reel-content">
        <div class="reel-number">REEL ${String(index + 1).padStart(2, "0")}</div>
        <h3>${reelTitles[index]} <span>❤️</span></h3>
        <p>${reelDescriptions[index]}</p>
        <button class="watch-btn" type="button">▶ Watch full screen</button>
      </div>
    `;

    const video = $("video", card);
    const watch = $(".watch-btn", card);

    video.addEventListener("error", () => card.classList.add("video-missing"));

    // STEP 2: Only one reel can play at a time.
    video.addEventListener("play", () => {
      $$("#screen8 video").forEach(other => {
        if (other !== video) other.pause();
      });
    });

    watch.addEventListener("click", async () => {
      try {
        if (document.fullscreenEnabled && video.requestFullscreen) {
          await video.requestFullscreen();
        } else if (video.webkitEnterFullscreen) {
          video.webkitEnterFullscreen();
        } else {
          video.controls = true;
          video.play().catch(() => {});
        }
      } catch {
        video.play().catch(() => {});
      }
    });

    reelsGrid.appendChild(card);
  });

  /* ---------- ENVELOPE / LETTER ---------- */
  const envelope = $("#envelope");
  const envelopeText = $("#envelopeText");
  const letter = $("#loveLetter");
  const letterNext = $("#letterNext");
  let envelopeOpened = false;

  function openEnvelope() {
    if (envelopeOpened) return;
    envelopeOpened = true;
    envelope.classList.add("open");
    envelopeText.textContent = "My heart is opening for you... ❤️";

    setTimeout(() => {
      letter.classList.remove("hidden");
      letter.classList.add("reveal");
        letterNext.classList.remove("hidden");
      letter.scrollIntoView({ behavior: "smooth", block: "center" });
      burst("❤️", 18);
    }, 900);
  }

  envelope.addEventListener("click", openEnvelope);
  envelope.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openEnvelope();
    }
  });

  /* ---------- LOVE DECISION ---------- */
  const yes = $("#loveYes");
  const maybe = $("#loveMaybe");
  const no = $("#loveNo");
  const loveResponse = $("#loveResponse");
  const decisionNext = $("#decisionNext");

// Show the birthday fireworks before the existing last surprise.
if (decisionNext) {
  decisionNext.addEventListener("click", () => {
    showBirthdayFireworks();
  });
}
  const responseChoiceField = $("#responseChoiceField");
  const responseForm = $("#responseForm");
  const formStatus = $("#formStatus");

  async function sendDecisionToFormspree(choice) {
    try {
      const response = await fetch("https://formspree.io/f/xoeaopno", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: "Maa",
          response_choice: choice,
          message: `Maa selected: ${choice}`,
          _subject: `Maa's birthday response: ${choice}`
        })
      });
      if (!response.ok) throw new Error("Decision send failed");
      showToast(`Her ${choice} response was sent to you ❤️`);
    } catch {
      showToast("Response could not be sent right now.");
    }
  }

  function choose(message, type, choice) {
    loveResponse.textContent = message;
    loveResponse.className = `response-message ${type}`;
    decisionNext.classList.remove("hidden");

    // Once she chooses, hide the options she has ruled out.
    yes.classList.toggle("hidden", type !== "yes");
    maybe.classList.toggle("hidden", type !== "maybe");
    no.classList.toggle("hidden", type !== "no");

    if (responseChoiceField) responseChoiceField.value = choice;
    sendDecisionToFormspree(choice);

    burst(type === "yes" ? "🌸" : type === "maybe" ? "🫂" : "💔", 24);
  }

  yes.addEventListener("click", () => choose(
    "You chose YES... ❤️🌸 I always knew it… you secretly love me too, you just never wanted to admit it. 😌❤️🫂.",
    "yes",
    "YES ❤️"
  ));
  maybe.addEventListener("click", () => choose(
    "Take your time... I will respect your decision. 🫂❤️",
    "maybe",
    "LET ME THINK 🥺"
  ));
  no.addEventListener("click", () => choose(
    "It's okay... I respect your choice. 💔🫂",
    "no",
    "NO 💔"
  ));

  /* ---------- FORMSPREE MESSAGE ---------- */
  responseForm.addEventListener("submit", async e => {
    e.preventDefault();
    formStatus.textContent = "Sending your message... ❤️";

    try {
      const response = await fetch(responseForm.action, {
        method: "POST",
        body: new FormData(responseForm),
        headers: { Accept: "application/json" }
      });

      if (!response.ok) throw new Error("Send failed");

      responseForm.reset();
      formStatus.textContent = "Your message reached me. ❤️ Thank you, Maa.";
      showToast("Message sent successfully ❤️");
    } catch {
      formStatus.textContent = "I couldn't send it right now. Please try again.";
    }
  });

  /* ---------- BIRTHDAY VIDEO ---------- */
  const birthdayVideo = $("#birthdayVideo");
  birthdayVideo.addEventListener("play", () => {
    if (music && !music.paused) music.pause();
  });

  /* ---------- RESTART ---------- */
  $("#restartBtn").addEventListener("click", () => {
    screens.forEach(s => s.classList.remove("active-screen"));
    $("#screen1").classList.add("active-screen");
    envelopeOpened = false;
    envelope.classList.remove("open");
    letter.classList.add("hidden");
    letterNext.classList.add("hidden");
    envelopeText.textContent = "Tap the envelope to open my heart";
    yes.classList.remove("hidden");
    maybe.classList.remove("hidden");
    no.classList.remove("hidden");
    loveResponse.textContent = "";
    loveResponse.className = "response-message";
    if (responseChoiceField) responseChoiceField.value = "";
    showScreen("screen1");
  });

  /* ---------- EFFECTS ---------- */
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  function burst(symbol, amount) {
    for (let i = 0; i < amount; i++) {
      const el = document.createElement("span");
      el.className = "burst";
      el.textContent = symbol;
      el.style.left = `${40 + Math.random() * 20}%`;
      el.style.top = `${45 + Math.random() * 10}%`;
      el.style.setProperty("--x", `${(Math.random() - 0.5) * 80}vw`);
      el.style.setProperty("--y", `${-20 - Math.random() * 55}vh`);
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1500);
    }
  }

  /* subtle floating hearts */
  const hearts = $("#hearts");
  const symbols = ["❤️", "💕", "💗", "💖"];

  setInterval(() => {
    const h = document.createElement("span");
    h.className = "floating-heart";
    h.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    h.style.left = `${Math.random() * 100}%`;
    h.style.fontSize = `${12 + Math.random() * 16}px`;
    h.style.animationDuration = `${8 + Math.random() * 7}s`;
    hearts.appendChild(h);
    setTimeout(() => h.remove(), 16000);
  }, 1200);
});


/* ---------- BIRTHDAY FIREWORKS SURPRISE ---------- */
const birthdayFireworksScreen = $("#birthdayFireworksScreen");
const fireworksWrap = $("#fireworksCanvasWrap");
const fireworksContinue = $("#fireworksContinue");

function launchBirthdayFireworks() {
  if (!birthdayFireworksScreen || !fireworksWrap) return;

  fireworksWrap.innerHTML = "";

  const colors = ["#ff4d8d", "#ffd166", "#7cf7ff", "#b88cff", "#ffffff", "#ff9f43"];
  const stars = ["✨", "❤️", "⭐", "🎉"];

  for (let burst = 0; burst < 9; burst++) {
    setTimeout(() => {
      const x = 12 + Math.random() * 76;
      const y = 15 + Math.random() * 55;

      for (let i = 0; i < 42; i++) {
        const particle = document.createElement("span");
        particle.className = "firework-particle";

        const angle = (Math.PI * 2 * i) / 42 + (Math.random() - .5) * .15;
        const distance = 55 + Math.random() * 125;

        particle.style.left = `${x}%`;
        particle.style.top = `${y}%`;
        particle.style.color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.setProperty("--fx", `${Math.cos(angle) * distance}px`);
        particle.style.setProperty("--fy", `${Math.sin(angle) * distance}px`);
        particle.style.animationDelay = `${Math.random() * .12}s`;

        fireworksWrap.appendChild(particle);
      }

      for (let i = 0; i < 3; i++) {
        const star = document.createElement("span");
        star.className = "birthday-firework-star";
        star.textContent = stars[Math.floor(Math.random() * stars.length)];
        star.style.left = `${x + (Math.random() * 10 - 5)}%`;
        star.style.top = `${y + (Math.random() * 10 - 5)}%`;
        star.style.animationDelay = `${Math.random() * .3}s`;
        fireworksWrap.appendChild(star);
      }
    }, burst * 420);
  }
}

function showBirthdayFireworks() {
  if (!birthdayFireworksScreen) return;
  document.querySelectorAll(".screen").forEach(screen => screen.classList.add("hidden"));
  birthdayFireworksScreen.classList.remove("hidden");
  birthdayFireworksScreen.classList.add("active");
  launchBirthdayFireworks();
  burst("🎆", 30);
}

if (fireworksContinue) {
  fireworksContinue.addEventListener("click", () => {
    if (birthdayFireworksScreen) birthdayFireworksScreen.classList.add("hidden");

    // Continue to the existing final/last-surprise screen.
    const lastScreen = $("#screen10");
    if (lastScreen) {
      lastScreen.classList.remove("hidden");
      lastScreen.classList.add("active");
      lastScreen.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
}
