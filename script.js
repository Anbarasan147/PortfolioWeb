/* =========================================================
   GLOBAL STATE & HELPERS
========================================================= */

const state = {
    menuOpen: false,
    activeSection: null,
    typingIndex: 0,
    typingTextIndex: 0,
    typingDeleting: false,
    modalOpen: false
};

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-link");

/* =========================================================
   PRELOADER
========================================================= */

window.addEventListener("load", () => {
    const preloader = document.getElementById("preloader");
    setTimeout(() => {
        preloader.style.opacity = "0";
        preloader.style.pointerEvents = "none";
    }, 600);
});

/* =========================================================
   MOBILE NAVIGATION
========================================================= */

const menuBtn = document.getElementById("menu-btn");
const navMenu = document.getElementById("nav-menu");

menuBtn.addEventListener("click", () => {
    state.menuOpen = !state.menuOpen;
    navMenu.classList.toggle("active");
    menuBtn.classList.toggle("open");
});

navMenu.addEventListener("click", e => {
    if (e.target.classList.contains("nav-link")) {
        navMenu.classList.remove("active");
        state.menuOpen = false;
    }
});

/* =========================================================
   SMOOTH SCROLL
========================================================= */

document.querySelectorAll("a[href^='#']").forEach(link => {
    link.addEventListener("click", e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute("href"));
        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });
});

/* =========================================================
   SCROLL SPY (ACTIVE NAV LINK)
========================================================= */

function onScrollSpy() {
    let current = "";

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (scrollY >= sectionTop) {
            current = section.getAttribute("id");
        }
    });

    if (state.activeSection !== current) {
        state.activeSection = current;
        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${current}`) {
                link.classList.add("active");
            }
        });
    }
}

window.addEventListener("scroll", onScrollSpy);

/* =========================================================
   TYPING EFFECT (HERO)
========================================================= */

const typingTarget = document.getElementById("typing-text");
const typingTexts = [
    "Frontend Developer",
    "UI / UX Enthusiast",
    "Problem Solver",
    "Creative Technologist"
];

function typingLoop() {
    if (!typingTarget) return;

    const currentText = typingTexts[state.typingTextIndex];
    if (!state.typingDeleting) {
        typingTarget.textContent = currentText.slice(0, state.typingIndex++);
        if (state.typingIndex > currentText.length) {
            setTimeout(() => (state.typingDeleting = true), 1200);
        }
    } else {
        typingTarget.textContent = currentText.slice(0, state.typingIndex--);
        if (state.typingIndex === 0) {
            state.typingDeleting = false;
            state.typingTextIndex =
                (state.typingTextIndex + 1) % typingTexts.length;
        }
    }
}

setInterval(typingLoop, 120);

/* =========================================================
   PROJECT FILTERING
========================================================= */

const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.dataset.filter;

        projectCards.forEach(card => {
            const category = card.dataset.category;
            if (filter === "all" || category === filter) {
                card.style.display = "flex";
                card.style.opacity = "0";
                setTimeout(() => (card.style.opacity = "1"), 100);
            } else {
                card.style.display = "none";
            }
        });
    });
});

/* =========================================================
   PROJECT MODAL
========================================================= */

const modal = document.getElementById("project-modal");
const modalClose = document.querySelector(".close-modal");
const modalTriggers = document.querySelectorAll(".open-modal");

modalTriggers.forEach(btn => {
    btn.addEventListener("click", () => {
        modal.classList.remove("hidden");
        document.body.style.overflow = "hidden";
        state.modalOpen = true;
    });
});

modalClose.addEventListener("click", closeModal);
modal.addEventListener("click", e => {
    if (e.target === modal) closeModal();
});

function closeModal() {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
    state.modalOpen = false;
}

/* =========================================================
   FORM VALIDATION
========================================================= */

const contactForm = document.querySelector(".contact-form");

if (contactForm) {
    contactForm.addEventListener("submit", e => {
        e.preventDefault();
        let valid = true;

        contactForm.querySelectorAll("input, textarea").forEach(field => {
            const error = field.nextElementSibling;
            if (!field.value.trim()) {
                error.textContent = "This field is required";
                valid = false;
            } else if (
                field.type === "email" &&
                !/^\S+@\S+\.\S+$/.test(field.value)
            ) {
                error.textContent = "Invalid email address";
                valid = false;
            } else {
                error.textContent = "";
            }
        });

        if (valid) {
            simulateFormSubmit();
        }
    });
}

function simulateFormSubmit() {
    const btn = contactForm.querySelector("button");
    btn.textContent = "Sending...";
    btn.disabled = true;

    setTimeout(() => {
        btn.textContent = "Message Sent ✔";
        contactForm.reset();
        setTimeout(() => {
            btn.textContent = "Send Message";
            btn.disabled = false;
        }, 2000);
    }, 1500);
}

/* =========================================================
   SCROLL REVEAL (PERFORMANCE FRIENDLY)
========================================================= */

const revealElements = document.querySelectorAll(
    ".section, .project-card, .skill-card, .blog-card"
);

const observer = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.15 }
);

revealElements.forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(40px)";
    el.style.transition = "0.8s ease";
    observer.observe(el);
});

/* =========================================================
   KEYBOARD SHORTCUTS
========================================================= */

document.addEventListener("keydown", e => {
    if (e.key === "Escape" && state.modalOpen) {
        closeModal();
    }

    if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        document.querySelector("#contact").scrollIntoView({
            behavior: "smooth"
        });
    }
});

/* =========================================================
   PERFORMANCE: DEBOUNCED RESIZE
========================================================= */

let resizeTimer;
window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (window.innerWidth > 900) {
            navMenu.classList.remove("active");
            state.menuOpen = false;
        }
    }, 200);
});

/* =========================================================
   END OF SCRIPT
========================================================= */
