document.addEventListener("DOMContentLoaded", function () {
  // Throttle function for performance
  function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Hamburger Menu Toggle
  const hamburger = document.querySelector(".hamburger-menu");
  const navMenu = document.querySelector(".nav-menu");

  hamburger.addEventListener("click", function () {
    this.classList.toggle("active");
    navMenu.classList.toggle("active");

    // Animate hamburger bars
    const bars = this.querySelectorAll(".bar");
    if (this.classList.contains("active")) {
      bars[0].style.transform = "translateY(9px) rotate(45deg)";
      bars[1].style.opacity = "0";
      bars[2].style.transform = "translateY(-8px) rotate(-45deg)";
    } else {
      bars.forEach((bar) => {
        bar.style.transform = "";
        bar.style.opacity = "";
      });
    }
  });

  // Close menu when clicking a link
  const navLinks = document.querySelectorAll(".nav-menu a");
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
      // Reset hamburger bars
      const bars = hamburger.querySelectorAll(".bar");
      bars.forEach((bar) => {
        bar.style.transform = "";
        bar.style.opacity = "";
      });
    });
  });

  // Scroll Reveal Animation - Using Intersection Observer for better performance
  const animateElements = document.querySelectorAll(
    ".animate-from-left, .animate-from-right, .animate-from-bottom, .animate-from-top"
  );

  // Use Intersection Observer API - much more performant than scroll events
  if ("IntersectionObserver" in window) {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
          observer.unobserve(entry.target); // Stop observing once animated
        }
      });
    }, observerOptions);

    animateElements.forEach((element) => {
      observer.observe(element);
    });
  } else {
    // Fallback for older browsers
    const elementsToAnimate = Array.from(animateElements);

    function checkScroll() {
      elementsToAnimate.forEach((element) => {
        if (element.classList.contains("animate")) {
          return;
        }

        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (elementPosition < windowHeight - 100) {
          element.classList.add("animate");
        }
      });
    }

    // Initial check
    checkScroll();

    // Check on scroll with throttling for better performance
    window.addEventListener("scroll", throttle(checkScroll, 150), {
      passive: true,
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        });
      }
    });
  });

  // Header scroll effect with throttling
  const header = document.querySelector(".header");
  let lastScroll = 0;

  const handleHeaderScroll = () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
      header.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
      return;
    }

    if (currentScroll > lastScroll && currentScroll > 100) {
      // Scroll down
      header.style.transform = "translateY(-100%)";
    } else if (currentScroll < lastScroll) {
      // Scroll up
      header.style.transform = "translateY(0)";
      header.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
    }

    lastScroll = currentScroll;
  };

  window.addEventListener("scroll", throttle(handleHeaderScroll, 100), {
    passive: true,
  });
});

// open privacy policy
document.querySelectorAll("[data-privacy-trigger]").forEach((trigger) =>
  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    document.querySelector(".policypage").classList.toggle("show");
  })
);

// Theme toggle logic
const themeToggle = document.getElementById("themeToggle");
const themeToggleIcon = themeToggle.querySelector("i");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
function setTheme(mode) {
  if (mode === "night") {
    document.body.classList.add("night");
    document.body.classList.remove("theme-soft");
    if (themeToggleIcon) {
      themeToggleIcon.className = "fa-solid fa-sun";
    }
    themeToggle.setAttribute("aria-label", "Switch to light mode");
  } else {
    document.body.classList.remove("night");
    document.body.classList.add("theme-soft");
    if (themeToggleIcon) {
      themeToggleIcon.className = "fa-solid fa-moon";
    }
    themeToggle.setAttribute("aria-label", "Switch to dark mode");
  }
}
// Follow system theme
function followSystemTheme() {
  setTheme(prefersDark.matches ? "night" : "day");
}
// Initial theme
followSystemTheme();
// Listen for system theme changes
prefersDark.addEventListener("change", followSystemTheme);
// Manual toggle
themeToggle.addEventListener("click", () => {
  if (document.body.classList.contains("night")) {
    setTheme("day");
  } else {
    setTheme("night");
  }
});

// ============================================
// CHAT BOT - Modern Redesign
// ============================================

const chatPage = document.querySelector(".chat-page");
const chatButton = document.querySelector(".chat-bot");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatMessages = document.getElementById("chatMessages");
const chatTyping = document.getElementById("chatTyping");
const chatSuggestionsWrapper = document.getElementById(
  "chatSuggestionsWrapper"
);
const chatOptionsBtn = document.getElementById("chatOptionsBtn");

// Open/Close chat
chatButton.addEventListener("click", () => {
  chatPage.classList.remove("hidden");
  chatInput.focus();
});

document.getElementById("closeChat").addEventListener("click", () => {
  chatPage.classList.add("hidden");
});

// Handle suggestion chips
if (chatSuggestionsWrapper) {
  chatSuggestionsWrapper.addEventListener("click", (e) => {
    const chip = e.target.closest(".suggestion-chip");
    if (chip) {
      const text = chip.dataset.text;
      chatInput.value = text;
      chatInput.focus();
      // Hide suggestions after selection
      chatSuggestionsWrapper.style.display = "none";
    }
  });
}

// Toggle suggestions with options button
if (chatOptionsBtn) {
  chatOptionsBtn.addEventListener("click", () => {
    if (chatSuggestionsWrapper.style.display === "none") {
      chatSuggestionsWrapper.style.display = "flex";
    } else {
      chatSuggestionsWrapper.style.display = "none";
    }
  });
}

// Format timestamp
function getTimestamp() {
  const now = new Date();
  return now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// Add user message to chat
function addUserMessage(message) {
  const wrapper = document.createElement("div");
  wrapper.className = "chat-msg-wrapper user-wrapper";

  const msgDiv = document.createElement("div");
  msgDiv.className = "chat-msg user";

  const textP = document.createElement("p");
  textP.textContent = message;

  const timestamp = document.createElement("span");
  timestamp.className = "chat-timestamp";
  timestamp.textContent = getTimestamp();

  msgDiv.appendChild(textP);
  msgDiv.appendChild(timestamp);
  wrapper.appendChild(msgDiv);

  chatMessages.appendChild(wrapper);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Add bot message with typing effect
async function addBotMessage(message) {
  const wrapper = document.createElement("div");
  wrapper.className = "chat-msg-wrapper bot-wrapper";

  const avatar = document.createElement("img");
  avatar.src = "assests/stj.jpg";
  avatar.alt = "Bot";
  avatar.className = "chat-msg-avatar";

  const msgDiv = document.createElement("div");
  msgDiv.className = "chat-msg bot";

  const textP = document.createElement("div");
  textP.className = "chat-msg-content";
  textP.textContent = ""; // Start empty for typing effect

  const timestamp = document.createElement("span");
  timestamp.className = "chat-timestamp";
  timestamp.textContent = getTimestamp();

  msgDiv.appendChild(textP);
  msgDiv.appendChild(timestamp);
  wrapper.appendChild(avatar);
  wrapper.appendChild(msgDiv);

  chatMessages.appendChild(wrapper);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // Typing effect with markdown rendering
  const words = message.split(" ");
  let currentText = "";

  for (let i = 0; i < words.length; i++) {
    currentText += (i > 0 ? " " : "") + words[i];

    // Render markdown as we type
    if (typeof marked !== "undefined") {
      textP.innerHTML = marked.parse(currentText);
    } else {
      textP.textContent = currentText;
    }

    chatMessages.scrollTop = chatMessages.scrollHeight;
    await new Promise((res) => setTimeout(res, 50));
  }

  // Final render to ensure all markdown is processed
  if (typeof marked !== "undefined") {
    textP.innerHTML = marked.parse(message);
  }
}

// Show/hide typing indicator
function setTypingIndicator(show) {
  if (chatTyping) {
    chatTyping.classList.toggle("hidden", !show);
    if (show) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }
}

// Handle form submission
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userMsg = chatInput.value.trim();
  if (!userMsg) return;

  // Add user message
  addUserMessage(userMsg);
  chatInput.value = "";

  // Hide suggestions after first message
  if (chatSuggestionsWrapper) {
    chatSuggestionsWrapper.style.display = "none";
  }

  // Show typing indicator
  setTypingIndicator(true);

  try {
    // Portfolio context for the AI
    const systemContext = `You are Stephen Amuzu's AI assistant. Key information:
- Full-stack engineer with 3+ years freelance experience
- Delivered 40+ projects with 100% client satisfaction
- Tech stack: React, Next.js, TypeScript, Node.js, Python, Supabase, Firebase
- Contact: stevejupiter4@gmail.com, +233 53 297 3455
- Location: Accra, Ghana
- Focuses on: AI workflows, design systems, web animations, real-time collaboration
Answer professionally and concisely.`;

    console.log("Fetching Hugging Face token from Supabase Edge Function...");

    // Get token from Supabase Edge Function
    let HF_TOKEN = "";
    try {
      const tokenResponse = await fetch(
        `${window.supabaseConfig.url}/functions/v1/get-hf-token`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${window.supabaseConfig.anonKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!tokenResponse.ok) {
        throw new Error("Failed to fetch token");
      }

      const tokenData = await tokenResponse.json();
      HF_TOKEN = tokenData.token;

      if (!HF_TOKEN) {
        throw new Error("Token not found in response");
      }
    } catch (tokenError) {
      console.error("Error fetching Hugging Face token:", tokenError);
      setTypingIndicator(false);
      await addBotMessage(
        "Configuration error. Please contact the site administrator."
      );
      return;
    }

    console.log("Token retrieved, calling Hugging Face API...");

    const response = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "MiniMaxAI/MiniMax-M2:novita",
          messages: [
            {
              role: "system",
              content: systemContext,
            },
            {
              role: "user",
              content: userMsg,
            },
          ],
          max_tokens: 300,
          temperature: 0.7,
        }),
      }
    );

    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", errorText);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Response data:", data);

    // Hide typing indicator
    setTypingIndicator(false);

    // Extract the AI response
    const botResponse =
      data.choices?.[0]?.message?.content ||
      "I'm sorry, I couldn't process that.";

    // Add bot response with typing effect
    await addBotMessage(botResponse);
  } catch (error) {
    setTypingIndicator(false);
    console.error("Chat error details:", error);
    console.error("Error type:", error.name);
    console.error("Error message:", error.message);

    await addBotMessage(
      "Sorry, I'm having trouble connecting. Please try again later."
    );
  }
});

// Legacy typing function for backward compatibility
async function typeBotResponse(text, container) {
  container.innerHTML = ""; // Clear previous content
  const words = text.split(" ");
  for (let i = 0; i < words.length; i++) {
    container.innerHTML += (i > 0 ? " " : "") + words[i];
    container.scrollTop = container.scrollHeight;
    await new Promise((res) => setTimeout(res, 80)); // Adjust speed here (ms per word)
  }
}

// Legacy dropdown suggestion handler (if needed)
const chatSuggestions = document.getElementById("chatSuggestions");
chatSuggestions.addEventListener("change", function () {
  if (this.value) {
    chatInput.value = this.value;
    chatInput.focus();
    this.selectedIndex = 0; // Reset dropdown to placeholder
  }
});

// ============================================
// CONTACT FORM - Email Handler
// ============================================

const contactForm = document.getElementById("contactForm");
const contactStatus = document.getElementById("contactStatus");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get form data
    const formData = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      message: document.getElementById("message").value.trim(),
    };

    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML =
      '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    contactStatus.textContent = "";
    contactStatus.className = "contact-status";

    try {
      // Using EmailJS or FormSubmit.co approach
      // Option 1: Direct mailto (simple but opens email client)
      const subject = encodeURIComponent(`Portfolio Contact: ${formData.name}`);
      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      );
      const mailtoLink = `mailto:stevejupiter4@gmail.com?subject=${subject}&body=${body}`;

      // Option 2: FormSubmit.co (no backend needed)
      const response = await fetch(
        "https://formsubmit.co/ajax/stevejupiter4@gmail.com",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            message: formData.message,
            _subject: `New Portfolio Contact from ${formData.name}`,
            _template: "table",
          }),
        }
      );

      if (response.ok) {
        // Success
        contactStatus.textContent =
          "✓ Message sent successfully! I'll get back to you soon.";
        contactStatus.className = "contact-status success";
        contactForm.reset();

        // Clear success message after 5 seconds
        setTimeout(() => {
          contactStatus.textContent = "";
          contactStatus.className = "contact-status";
        }, 5000);
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Contact form error:", error);

      // Fallback to mailto
      contactStatus.textContent =
        "⚠ Opening your email client... Please send the message manually.";
      contactStatus.className = "contact-status error";

      setTimeout(() => {
        const subject = encodeURIComponent(
          `Portfolio Contact: ${formData.name}`
        );
        const body = encodeURIComponent(
          `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
        );
        window.location.href = `mailto:stevejupiter4@gmail.com?subject=${subject}&body=${body}`;
      }, 1000);
    } finally {
      // Reset button
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
}

// ============================================
// PROJECT STUDIO
// ============================================

function setupProjectStudio() {
  const projectsGrid = document.getElementById("projectsGrid");
  if (!projectsGrid) return;

  const projectsEmpty = document.getElementById("projectsEmpty");
  const adminPanel = document.getElementById("studio");
  const closeAdminBtn = document.getElementById("closeAdmin");
  const projectForm = document.getElementById("projectForm");
  const statusEl = projectForm?.querySelector(".admin-form__status");
  const submitBtn = projectForm?.querySelector('button[type="submit"]');
  const fallbackCover =
    "https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1200&q=80";

  let firebaseReady = false;
  let db = null;
  let storage = null;
  let database = null;
  let unsubscribeProjects = null;
  let adminVisible = false;

  const resolvePasscodePath = () => {
    const rawPath =
      window.firebaseConfig?.studioPasscodePath || "/studioPasscode";
    return rawPath.replace(/^\/+/, "");
  };

  const setStatus = (message = "", variant = "info") => {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.dataset.variant = variant;
  };

  const setButtonLoading = (isLoading) => {
    if (!submitBtn) return;
    submitBtn.disabled = isLoading;
    submitBtn.classList.toggle("btn--loading", isLoading);
  };

  const toggleAdmin = (show) => {
    if (!adminPanel) return;
    adminVisible = show;
    adminPanel.classList.toggle("hidden", !show);
    adminPanel.setAttribute("aria-hidden", show ? "false" : "true");
  };

  closeAdminBtn?.addEventListener("click", () => toggleAdmin(false));

  // Passcode Modal Elements
  const passcodeModal = document.getElementById("passcodeModal");
  const passcodeForm = document.getElementById("passcodeForm");
  const passcodeInput = document.getElementById("passcodeInput");
  const passcodeError = document.getElementById("passcodeError");
  const cancelPasscodeBtn = document.getElementById("cancelPasscode");

  // Function to show passcode modal
  const showPasscodeModal = () => {
    if (!passcodeModal) return;
    passcodeModal.classList.remove("hidden");
    passcodeInput.value = "";
    passcodeError.textContent = "";
    // Focus on input after modal is visible
    setTimeout(() => passcodeInput.focus(), 100);
  };

  // Function to hide passcode modal
  const hidePasscodeModal = () => {
    if (!passcodeModal) return;
    passcodeModal.classList.add("hidden");
    passcodeInput.value = "";
    passcodeError.textContent = "";
  };

  // Function to verify passcode
  const verifyPasscode = (input) => {
    const passcode = window.firebaseConfig?.localStudioPasscode;
    if (!passcode) {
      passcodeError.textContent =
        "Studio passcode is not configured locally in firebase-config.js.";
      return false;
    }
    if (input === passcode) {
      return true;
    } else {
      passcodeError.textContent = "Incorrect passcode. Please try again.";
      return false;
    }
  };

  // Handle passcode form submission
  if (passcodeForm) {
    passcodeForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const input = passcodeInput.value.trim();

      if (verifyPasscode(input)) {
        hidePasscodeModal();
        toggleAdmin(true);
      }
    });
  }

  // Handle cancel button
  if (cancelPasscodeBtn) {
    cancelPasscodeBtn.addEventListener("click", () => {
      hidePasscodeModal();
    });
  }

  // Close modal when clicking outside
  if (passcodeModal) {
    passcodeModal.addEventListener("click", (event) => {
      if (event.target === passcodeModal) {
        hidePasscodeModal();
      }
    });
  }

  // Studio link click handler
  const studioLink = document.getElementById("studioLink");
  if (studioLink) {
    studioLink.addEventListener("click", (event) => {
      event.preventDefault();
      showPasscodeModal();
    });
  }

  // Keyboard shortcut (Shift + Alt + P)
  window.addEventListener("keydown", async (event) => {
    if (event.shiftKey && event.altKey && event.code === "KeyP") {
      event.preventDefault();
      showPasscodeModal();
    }
  });

  const guardFirebaseConfig = () => {
    if (!window.firebaseConfig || !window.firebaseConfig.apiKey) {
      console.warn("Firebase configuration is missing.");
      projectsGrid.setAttribute("data-state", "error");
      projectsGrid.innerHTML = "";
      const notice = document.createElement("article");
      notice.className = "project-card project-card--placeholder";
      const content = document.createElement("div");
      content.className = "project-content";
      const meta = document.createElement("div");
      meta.className = "project-meta";
      const chip = document.createElement("span");
      chip.className = "project-chip";
      chip.textContent = "Setup";
      meta.appendChild(chip);
      const heading = document.createElement("h3");
      heading.textContent = "Add Firebase configuration";
      const copy = document.createElement("p");
      copy.textContent =
        "Populate firebase-config.js with your project keys to load live projects.";
      content.append(meta, heading, copy);
      notice.appendChild(content);
      projectsGrid.appendChild(notice);
      return false;
    }
    return true;
  };

  const ensureFirebaseReady = async () => {
    if (firebaseReady) return;
    if (!guardFirebaseConfig()) {
      throw new Error("Missing Firebase configuration");
    }
    if (!firebase.apps.length) {
      firebase.initializeApp(window.firebaseConfig);
    }
    db = firebase.firestore();
    storage = firebase.storage();
    database = firebase.database();
    firebaseReady = true;
  };

  const fetchPasscode = async ({ silent } = { silent: false }) => {
    // Prioritize local passcode for development
    if (window.firebaseConfig?.localStudioPasscode) {
      return Promise.resolve(window.firebaseConfig.localStudioPasscode);
    }
    if (passcodeValue) {
      return passcodeValue;
    }
    if (passcodePromise) {
      return passcodePromise;
    }

    if (!silent) {
      setStatus("Fetching studio passcode...");
    }

    passcodePromise = ensureFirebaseReady()
      .then(() => {
        if (!database) {
          throw new Error("Firebase Realtime Database is not initialized.");
        }
        const path = resolvePasscodePath();
        return database.ref(path).once("value");
      })
      .then((snapshot) => {
        if (!snapshot.exists()) {
          throw new Error("Studio passcode not found at the configured path.");
        }
        const value = snapshot.val();
        if (typeof value !== "string" || value.trim() === "") {
          throw new Error("Studio passcode must be a non-empty string.");
        }
        passcodeValue = value;
        passcodeError = null;
        return passcodeValue;
      })
      .catch((error) => {
        passcodeError = error;
        throw error;
      })
      .finally(() => {
        if (!silent) {
          setStatus("");
        }
        passcodePromise = null;
      });

    return passcodePromise;
  };

  const createProjectCard = (project) => {
    const card = document.createElement("article");
    card.className = "project-card animate-from-bottom";

    const media = document.createElement("div");
    media.className = "project-media";
    const img = document.createElement("img");
    img.src = project.coverUrl || fallbackCover;
    img.alt = project.name ? `${project.name} cover` : "Project cover";
    media.appendChild(img);

    const content = document.createElement("div");
    content.className = "project-content";

    const meta = document.createElement("div");
    meta.className = "project-meta";
    if (project.category) {
      const chip = document.createElement("span");
      chip.className = "project-chip";
      chip.textContent = project.category;
      meta.appendChild(chip);
    }
    if (project.featured) {
      const chip = document.createElement("span");
      chip.className = "project-chip";
      chip.textContent = "Featured";
      meta.appendChild(chip);
    }

    const title = document.createElement("h3");
    title.textContent = project.name || "Untitled Project";

    const summary = document.createElement("p");
    summary.textContent =
      project.tagline || project.description || "Case study coming soon.";

    const footer = document.createElement("div");
    footer.className = "project-footer";

    const makeLink = (href, label) => {
      const anchor = document.createElement("a");
      anchor.href = href;
      anchor.className = "project-link";
      anchor.target = "_blank";
      anchor.rel = "noopener";
      anchor.innerHTML = `<i class="fa-solid fa-arrow-up-right-from-square"></i> ${label}`;
      return anchor;
    };

    if (project.liveUrl) {
      footer.appendChild(makeLink(project.liveUrl, "View live"));
    }
    if (project.repoUrl) {
      footer.appendChild(makeLink(project.repoUrl, "Case study"));
    }

    const stack = document.createElement("ul");
    stack.className = "project-stack";
    const techList = Array.isArray(project.tech)
      ? project.tech
      : (project.tech || "")
          .toString()
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
    techList.forEach((tech) => {
      const li = document.createElement("li");
      li.textContent = tech;
      stack.appendChild(li);
    });

    if (meta.children.length) {
      content.appendChild(meta);
    }
    content.append(title, summary);

    if (footer.children.length || stack.children.length) {
      if (footer.children.length) {
        content.appendChild(footer);
      }
      if (stack.children.length) {
        content.appendChild(stack);
      }
    }

    card.append(media, content);

    requestAnimationFrame(() => {
      card.classList.add("animate");
    });

    return card;
  };

  const renderProjects = (projects) => {
    projectsGrid.dataset.state = "ready";
    if (!Array.isArray(projects) || projects.length === 0) {
      projectsGrid.innerHTML = "";
      projectsGrid.classList.add("hidden");
      projectsEmpty?.classList.remove("hidden");
      return;
    }
    projectsGrid.classList.remove("hidden");
    projectsEmpty?.classList.add("hidden");
    const cards = projects.map(createProjectCard);
    projectsGrid.replaceChildren(...cards);
  };

  const subscribeToProjects = () => {
    if (!db) return;
    if (unsubscribeProjects) unsubscribeProjects();
    const query = db.collection("projects").orderBy("createdAt", "desc");
    unsubscribeProjects = query.onSnapshot(
      (snapshot) => {
        const projects = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        renderProjects(projects);
      },
      (error) => {
        console.error("Failed to load projects", error);
        projectsGrid.dataset.state = "error";
        projectsGrid.innerHTML = "";
        const errorCard = document.createElement("article");
        errorCard.className = "project-card project-card--placeholder";
        const content = document.createElement("div");
        content.className = "project-content";
        const heading = document.createElement("h3");
        heading.textContent = "Couldn't load projects";
        const copy = document.createElement("p");
        copy.textContent = "Refresh the page or check the console for details.";
        content.append(heading, copy);
        errorCard.appendChild(content);
        projectsGrid.appendChild(errorCard);
      }
    );
  };

  if (projectForm) {
    projectForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      setStatus("Preparing upload...");
      try {
        await ensureFirebaseReady();
      } catch (error) {
        setStatus(error.message, "error");
        return;
      }

      if (!db || !storage) {
        setStatus("Firebase failed to initialize.", "error");
        return;
      }

      const formData = new FormData(projectForm);
      const name = (formData.get("name") || "").toString().trim();
      const tagline = (formData.get("tagline") || "").toString().trim();
      const description = (formData.get("description") || "").toString().trim();
      const category = (formData.get("category") || "").toString().trim();
      const techRaw = (formData.get("tech") || "").toString();
      const liveUrl = (formData.get("liveUrl") || "").toString().trim();
      const repoUrl = (formData.get("repoUrl") || "").toString().trim();
      const featured = formData.get("featured") === "true";

      const coverInput = projectForm.elements.namedItem("cover");
      const attachmentsInput = projectForm.elements.namedItem("attachments");
      const coverFile =
        coverInput && coverInput.files ? coverInput.files[0] : null;
      const attachmentFiles =
        attachmentsInput && attachmentsInput.files
          ? Array.from(attachmentsInput.files)
          : [];

      if (!name || !description) {
        setStatus("Name and description are required.", "error");
        return;
      }

      if (!coverFile) {
        setStatus("Please attach a cover image.", "error");
        return;
      }

      setButtonLoading(true);
      setStatus("Uploading assets...");

      try {
        const projectRef = db.collection("projects").doc();
        const storageRoot = storage.ref().child(`projects/${projectRef.id}`);

        const coverRef = storageRoot.child(
          `cover-${Date.now()}-${coverFile.name}`
        );
        await coverRef.put(coverFile);
        const coverUrl = await coverRef.getDownloadURL();

        setStatus("Saving attachments...");
        const attachments = await Promise.all(
          attachmentFiles.map(async (file, index) => {
            const fileRef = storageRoot.child(
              `attachments/${Date.now()}-${index}-${file.name}`
            );
            await fileRef.put(file);
            const url = await fileRef.getDownloadURL();
            return {
              name: file.name,
              url,
              size: file.size,
              contentType: file.type,
            };
          })
        );

        const tech = techRaw
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);

        const payload = {
          name,
          tagline,
          description,
          category,
          tech,
          liveUrl: liveUrl || null,
          repoUrl: repoUrl || null,
          featured,
          coverUrl,
          attachments,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        };

        await projectRef.set(payload);

        setStatus("Project saved successfully!", "success");
        projectForm.reset();
      } catch (error) {
        console.error("Failed to add project", error);
        setStatus(`Upload failed: ${error.message}`, "error");
      } finally {
        setButtonLoading(false);
        setTimeout(() => setStatus(""), 4000);
      }
    });
  }

  ensureFirebaseReady()
    .then(() => {
      subscribeToProjects();
      return fetchPasscode({ silent: true }).catch((error) => {
        console.warn("Failed to prefetch studio passcode", error);
      });
    })
    .catch((error) => {
      setStatus(error.message, "error");
    });
}

document.addEventListener("DOMContentLoaded", setupProjectStudio);
