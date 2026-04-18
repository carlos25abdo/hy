document.addEventListener("DOMContentLoaded", () => {
  const themeToggleBtn = document.getElementById("theme-toggle");
  const themeIcon = themeToggleBtn?.querySelector("i");
  const currentTheme = localStorage.getItem("aya-theme") || "light";

  if (currentTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    if (themeIcon) {
      themeIcon.classList.replace("fa-moon", "fa-sun");
    }
  }

  themeToggleBtn?.addEventListener("click", () => {
    let theme = document.documentElement.getAttribute("data-theme");
    if (theme === "dark") {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("aya-theme", "light");
      if (themeIcon) themeIcon.classList.replace("fa-sun", "fa-moon");
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("aya-theme", "dark");
      if (themeIcon) themeIcon.classList.replace("fa-moon", "fa-sun");
    }
  });

  const headerDate = document.getElementById("header-date");
  const mainHeader = document.querySelector(".main-header");
  const track = document.querySelector(".carousel-track");
  const slides = Array.from(document.querySelectorAll(".carousel-slide"));
  const nextBtn = document.getElementById("next-slide");
  const prevBtn = document.getElementById("prev-slide");
  const dotsContainer = document.querySelector(".carousel-dots");
  const heroSection = document.querySelector(".hero-carousel");
  const menuToggle = document.querySelector(".mobile-nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  const navItems = Array.from(document.querySelectorAll(".nav-item"));
  const newsletterForm = document.getElementById("newsletter-form");
  const newsletterEmail = document.getElementById("newsletter-email");
  const newsletterMessage = document.getElementById("newsletter-message");
  const contactForm = document.getElementById("contact-form");
  const contactName = document.getElementById("contact-name");
  const contactEmail = document.getElementById("contact-email");
  const contactMessage = document.getElementById("contact-message");
  const contactFormMessage = document.getElementById("contact-form-message");
  const sections = Array.from(document.querySelectorAll("main section[id]"));

  if (headerDate) {
    headerDate.textContent = new Intl.DateTimeFormat("ar-SA", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date());
  }

  let currentIndex = 0;
  let intervalId = null;

  const dots = slides.map((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = `carousel-dot${index === 0 ? " active" : ""}`;
    dot.setAttribute("aria-label", `الانتقال إلى الشريحة ${index + 1}`);
    dot.addEventListener("click", () => {
      currentIndex = index;
      moveSlide(currentIndex);
      restartAutoPlay();
    });
    dotsContainer?.appendChild(dot);
    return dot;
  });

  function moveSlide(index) {
    if (!track) return;
    track.style.transition = "transform 0.8s cubic-bezier(0.65, 0, 0.35, 1)";
    track.style.transform = `translateX(${index * 100}%)`;

    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  }

  function startAutoPlay() {
    return window.setInterval(() => {
      currentIndex = (currentIndex + 1) % slides.length;
      moveSlide(currentIndex);
    }, 6500);
  }

  function restartAutoPlay() {
    if (intervalId) window.clearInterval(intervalId);
    intervalId = startAutoPlay();
  }

  nextBtn?.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % slides.length;
    moveSlide(currentIndex);
    restartAutoPlay();
  });

  prevBtn?.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    moveSlide(currentIndex);
    restartAutoPlay();
  });

  if (slides.length > 1) {
    intervalId = startAutoPlay();
  }

  heroSection?.addEventListener("mouseenter", () => {
    if (intervalId) window.clearInterval(intervalId);
  });

  heroSection?.addEventListener("mouseleave", () => {
    if (slides.length > 1) intervalId = startAutoPlay();
  });

  window.addEventListener("scroll", () => {
    if (!mainHeader) return;

    const compact = window.scrollY > 40;
    mainHeader.style.boxShadow = compact
      ? "0 14px 38px rgba(15, 23, 42, 0.08)"
      : "0 0 0 rgba(0, 0, 0, 0)";
    mainHeader.style.background = compact
      ? "rgba(255, 255, 255, 0.96)"
      : "rgba(255, 255, 255, 0.88)";
  });

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("active");
      document.body.classList.toggle("nav-open", isOpen);
      const icon = menuToggle.querySelector("i");
      if (icon) {
        icon.classList.toggle("fa-bars", !isOpen);
        icon.classList.toggle("fa-times", isOpen);
      }
    });

    navItems.forEach((item) => {
      item.addEventListener("click", () => {
        navLinks.classList.remove("active");
        document.body.classList.remove("nav-open");
        const icon = menuToggle.querySelector("i");
        if (icon) {
          icon.classList.add("fa-bars");
          icon.classList.remove("fa-times");
        }
      });
    });
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { threshold: 0.18 }
  );

  document.querySelectorAll(".reveal-on-scroll").forEach((element) => {
    revealObserver.observe(element);
  });

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute("id");
        navItems.forEach((item) => {
          item.classList.toggle("active", item.getAttribute("href") === `#${id}`);
        });
      });
    },
    { rootMargin: "-35% 0px -45% 0px", threshold: 0.1 }
  );

  sections.forEach((section) => navObserver.observe(section));

  function setMessage(element, text, type) {
    if (!element) return;
    element.textContent = text;
    element.classList.remove("success", "error");
    if (type) element.classList.add(type);
  }

  newsletterForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = newsletterEmail?.value.trim() ?? "";
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!emailValid) {
      setMessage(newsletterMessage, "يرجى إدخال بريد إلكتروني صحيح.", "error");
      return;
    }

    setMessage(newsletterMessage, "تم الاشتراك بنجاح. سنرسل لك آخر التحديثات قريبًا.", "success");
    newsletterForm.reset();
  });

  contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = contactName?.value.trim() ?? "";
    const email = contactEmail?.value.trim() ?? "";
    const message = contactMessage?.value.trim() ?? "";
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name || !emailValid || !message) {
      setMessage(contactFormMessage, "يرجى تعبئة جميع الحقول بشكل صحيح قبل الإرسال.", "error");
      return;
    }

    setMessage(contactFormMessage, "تم إرسال رسالتك بنجاح. سيتواصل فريق التحرير معك قريبًا.", "success");
    contactForm.reset();
  });

  const updatePulseClock = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    const hoursEl = document.getElementById("clock-hours");
    const minutesEl = document.getElementById("clock-minutes");
    const secondsEl = document.getElementById("clock-seconds");

    if (hoursEl) hoursEl.textContent = hours;
    if (minutesEl) minutesEl.textContent = minutes;
    if (secondsEl) secondsEl.textContent = seconds;
  };

  updatePulseClock();
  window.setInterval(updatePulseClock, 1000);
});
