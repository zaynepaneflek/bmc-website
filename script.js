document.addEventListener("DOMContentLoaded", () => {
  const revealSections = document.querySelectorAll(".reveal");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if ("IntersectionObserver" in window && !reducedMotion) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealSections.forEach((section) => observer.observe(section));
  } else {
    revealSections.forEach((section) => section.classList.add("visible"));
  }

  const brandImage = document.querySelector(".brand-mark img");
  if (brandImage) {
    brandImage.addEventListener("error", () => {
      brandImage.style.display = "none";
      brandImage.parentElement.classList.add("fallback");
    });
  }

  const navToggle = document.querySelector(".mobile-nav-toggle");
  const navLinks = document.getElementById("site-nav");

  const closeNavigation = () => {
    if (!navToggle || !navLinks) return;
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation");
    navLinks.classList.remove("show");
  };

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isExpanded));
      navToggle.setAttribute(
        "aria-label",
        isExpanded ? "Open navigation" : "Close navigation"
      );
      navLinks.classList.toggle("show", !isExpanded);
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeNavigation);
    });

    document.addEventListener("click", (event) => {
      if (!navLinks.contains(event.target) && !navToggle.contains(event.target)) {
        closeNavigation();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeNavigation();
        navToggle.focus();
      }
    });
  }

  const carousel = document.querySelector(".carousel");
  if (!carousel) return;

  const slides = [...carousel.querySelectorAll(".carousel-slide")];
  const dots = [...carousel.querySelectorAll(".dot")];
  const previousButton = carousel.querySelector(".prev");
  const nextButton = carousel.querySelector(".next");
  let currentSlideIndex = 0;
  let carouselInterval;

  const showSlide = (index) => {
    currentSlideIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("active", slideIndex === currentSlideIndex);
    });
    dots.forEach((dot, dotIndex) => {
      const isCurrent = dotIndex === currentSlideIndex;
      dot.classList.toggle("active", isCurrent);
      dot.setAttribute("aria-current", isCurrent ? "true" : "false");
    });
  };

  const stopAutoRotate = () => clearInterval(carouselInterval);
  const startAutoRotate = () => {
    if (reducedMotion) return;
    stopAutoRotate();
    carouselInterval = setInterval(() => showSlide(currentSlideIndex + 1), 5000);
  };

  previousButton?.addEventListener("click", () => {
    showSlide(currentSlideIndex - 1);
    startAutoRotate();
  });

  nextButton?.addEventListener("click", () => {
    showSlide(currentSlideIndex + 1);
    startAutoRotate();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
      startAutoRotate();
    });
  });

  carousel.addEventListener("mouseenter", stopAutoRotate);
  carousel.addEventListener("mouseleave", startAutoRotate);
  carousel.addEventListener("focusin", stopAutoRotate);
  carousel.addEventListener("focusout", (event) => {
    if (!carousel.contains(event.relatedTarget)) startAutoRotate();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopAutoRotate();
    else startAutoRotate();
  });

  showSlide(0);
  startAutoRotate();
});
