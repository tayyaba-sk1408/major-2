document.documentElement.classList.add("js-ready");

const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector("#nav");
const navLinks = document.querySelectorAll(".nav a");

function closeMenu() {
  nav.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation");
}

menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!open));
  menuButton.setAttribute("aria-label", open ? "Open navigation" : "Close navigation");
  nav.classList.toggle("open", !open);
});

navLinks.forEach(link => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeMenu();
});
window.addEventListener("resize", () => {
  if (window.innerWidth > 760) closeMenu();
});

const revealItems = document.querySelectorAll(".reveal");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if ("IntersectionObserver" in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(item => revealObserver.observe(item));
} else {
  revealItems.forEach(item => item.classList.add("visible"));
}

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
      }
    });
  }, { rootMargin: "-35% 0px -55% 0px" });
  document.querySelectorAll("main section[id]").forEach(section => sectionObserver.observe(section));
}

document.querySelectorAll("[data-topic]").forEach(link => {
  link.addEventListener("click", () => {
    const select = document.querySelector("#topic");
    const match = Array.from(select.options).find(option => option.textContent.trim() === link.dataset.topic);
    if (match) select.value = match.value;
  });
});

document.querySelectorAll(".faq-question").forEach(button => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    const shouldOpen = button.getAttribute("aria-expanded") !== "true";
    document.querySelectorAll(".faq-item").forEach(other => {
      other.classList.remove("open");
      other.querySelector(".faq-question").setAttribute("aria-expanded", "false");
    });
    if (shouldOpen) {
      item.classList.add("open");
      button.setAttribute("aria-expanded", "true");
    }
  });
});

const form = document.querySelector("#contact-form");
const feedback = document.querySelector("#feedback");
const fields = {
  name: document.querySelector("#name"),
  email: document.querySelector("#email"),
  topic: document.querySelector("#topic"),
  message: document.querySelector("#message")
};
const errors = {
  name: document.querySelector("#name-error"),
  email: document.querySelector("#email-error"),
  topic: document.querySelector("#topic-error"),
  message: document.querySelector("#message-error")
};

function setError(key, message) {
  errors[key].textContent = message;
  fields[key].classList.toggle("invalid", Boolean(message));
  fields[key].setAttribute("aria-invalid", String(Boolean(message)));
}

function validate() {
  const value = {
    name: fields.name.value.trim(),
    email: fields.email.value.trim(),
    topic: fields.topic.value,
    message: fields.message.value.trim()
  };
  const issue = {
    name: value.name.length < 2 ? "Please enter your name." : "",
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email) ? "" : "Please enter a valid email address.",
    topic: value.topic ? "" : "Please choose a topic.",
    message: value.message.length < 10 ? "Please enter at least 10 characters." : ""
  };
  Object.keys(issue).forEach(key => setError(key, issue[key]));
  return { value, issue, valid: Object.values(issue).every(message => !message) };
}

Object.entries(fields).forEach(([key, field]) => {
  field.addEventListener("input", () => {
    if (errors[key].textContent) validate();
  });
  field.addEventListener("change", () => {
    if (errors[key].textContent) validate();
  });
});

form.addEventListener("submit", event => {
  event.preventDefault();
  const result = validate();
  if (!result.valid) {
    feedback.textContent = "Please review the highlighted fields.";
    fields[Object.keys(result.issue).find(key => result.issue[key])].focus();
    return;
  }
  const subject = encodeURIComponent(`Website enquiry: ${result.value.topic}`);
  const body = encodeURIComponent(`Name: ${result.value.name}\nEmail: ${result.value.email}\nTopic: ${result.value.topic}\n\nMessage:\n${result.value.message}`);
  feedback.textContent = "Your email application will open so you can review and send the enquiry.";
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
});

document.querySelector("#year").textContent = new Date().getFullYear();
