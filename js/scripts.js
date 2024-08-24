document.addEventListener("DOMContentLoaded", () => {
  // Retrieve the current URL without the trailing slash
  const url = new URL(window.location.href);
  currentURL = `${url.protocol}//${url.hostname}`;

  // Get DOM elements
  const environnementElement = document.getElementById("environment");
  const versionElement = document.getElementById("copyRight");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const messageInput = document.getElementById("message");
  const submitButton = document.getElementById("submitButton");
  const modalConf = document.getElementById("confirmationModal");
  const modalError = document.getElementById("errorModal");
  const confCloseButton = document.querySelector(".conf-close-form");
  const errorCloseButton = document.querySelector(".error-close-form");
  const copyRightElement = document.getElementById("copyRight");

  // Adjust environment text based on current URL
  if (currentURL.includes("localhost")) {
    currentURL = "http://localhost";
    environnementElement.textContent = environnementElement.textContent.replace(
      "{ENV}",
      "Local - "
    );
  } else if (currentURL.includes("julesantoine.tech")) {
    var currentURL = "https://portfolio.julesantoine.tech";
    environnementElement.textContent = environnementElement.textContent.replace(
      "{ENV}",
      ""
    );
  } else {
    environnementElement.textContent = environnementElement.textContent.replace(
      "{ENV}",
      "INT - "
    );
  }

  // Fetch and display API version
  fetch(currentURL + ":3000/api/version")
    .then((response) => response.json())
    .then((data) => {
      versionElement.textContent = versionElement.textContent.replace(
        "{VERSION}",
        data.version || ""
      );
    })
    .catch((error) => console.error("Error fetching version:", error));

  // Function to shrink navbar on scroll
  const navbarShrink = function () {
    const navbarCollapsible = document.body.querySelector("#mainNav");
    if (!navbarCollapsible) return;
    if (window.scrollY === 0) {
      navbarCollapsible.classList.remove("navbar-shrink");
    } else {
      navbarCollapsible.classList.add("navbar-shrink");
    }
  };
  navbarShrink();
  document.addEventListener("scroll", navbarShrink);

  // Initialize ScrollSpy for main navigation
  const mainNav = document.body.querySelector("#mainNav");
  if (mainNav) {
    new bootstrap.ScrollSpy(document.body, {
      target: "#mainNav",
      rootMargin: "0px 0px -40%",
    });
  }

  // Toggle navbar collapse on small screens
  const navbarToggler = document.body.querySelector(".navbar-toggler");
  const responsiveNavItems = [].slice.call(
    document.querySelectorAll("#navbarResponsive .nav-link")
  );
  responsiveNavItems.map((responsiveNavItem) => {
    responsiveNavItem.addEventListener("click", () => {
      if (window.getComputedStyle(navbarToggler).display !== "none") {
        navbarToggler.click();
      }
    });
  });

  // Update copyright year if not 2024
  const currentYears = new Date().getFullYear();
  if ("2024" != currentYears) {
    copyRightElement.textContent = copyRightElement.textContent.replace(
      "{DATE}",
      " - " + currentYears
    );
  } else {
    copyRightElement.textContent = copyRightElement.textContent.replace(
      "{DATE}",
      ""
    );
  }

  // Function to fetch CSRF token
  const getCSRFToken = async () => {
    try {
      const response = await fetch(`${currentURL}:3000/csrf-token`);
      const data = await response.json();
      return data.csrfToken;
    } catch (error) {
      console.error("Error fetching CSRF token:", error);
      return "";
    }
  };

  // Function to update CSRF token in the form
  const updateFormCSRFToken = async () => {
    try {
      const csrfToken = await getCSRFToken();
      if (csrfToken) {
        document.querySelector('input[name="_csrf"]').value = csrfToken;
      } else {
        console.error("CSRF token is empty or undefined.");
      }
    } catch (error) {
      console.error("Error updating CSRF token:", error);
    }
  };

  // Call function to update CSRF token on page load
  updateFormCSRFToken();

  // Function to validate form inputs
  const validateForm = () => {
    return (
      nameInput.value.trim() !== "" &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim()) &&
      phoneInput.value.trim() !== "" &&
      messageInput.value.trim() !== ""
    );
  };

  // Function to update submit button state based on form validation
  const updateSubmitButton = () => {
    submitButton.disabled = !validateForm();
  };

  // Attach input event listeners to form inputs for real-time validation
  [nameInput, emailInput, phoneInput, messageInput].forEach((input) => {
    input.addEventListener("input", updateSubmitButton);
  });

  // Initialize submit button state on page load
  updateSubmitButton();

  // Close confirmation modal on button click
  confCloseButton.onclick = () => {
    modalConf.style.display = "none";
  };

  // Close error modal on button click
  errorCloseButton.onclick = () => {
    modalError.style.display = "none";
  };

  // Handle form submission
  document
    .getElementById("contactForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const loader = document.getElementById("loader-form");
      const contentOverlay = document.getElementById("content-overlay");
      loader.style.display = "block";
      contentOverlay.style.display = "none";

      try {
        // Update CSRF token before sending form data
        await updateFormCSRFToken();

        // Create and send POST request with FormData
        const formData = new FormData(document.getElementById("contactForm"));
        const response = await fetch(currentURL + ":3000/send-email", {
          method: "POST",
          body: formData,
        });

        // Handle response
        if (response.ok) {
          loader.style.display = "none";
          contentOverlay.style.display = "block";
          modalConf.style.display = "block";
        } else {
          throw new Error("Failed to send email");
        }
      } catch (error) {
        loader.style.display = "none";
        contentOverlay.style.display = "block";
        modalError.style.display = "block";
        console.error("Error sending form:", error);
      }
    });

  // Load saved language preference from local storage
  const savedLanguage = localStorage.getItem("language") || "en";
  languageSwitcher.value = savedLanguage;
  document.documentElement.lang = savedLanguage;
  loadTranslations(savedLanguage);

  // Change event listener for language switcher
  languageSwitcher.addEventListener("change", (event) => {
    const selectedLanguage = event.target.value;
    localStorage.setItem("language", selectedLanguage);
    document.documentElement.lang = selectedLanguage;
    sendLanguageToServer(selectedLanguage);
  });

  // Function to load translations based on selected language
  function loadTranslations(language) {
    fetch(`/backend/locales/${language}.json`)
      .then((response) => response.json())
      .then((data) => {
        applyTranslations(data);
      })
      .catch((error) => {
        console.error("Error loading translations:", error);
      });
  }

  // Function to apply translations to elements with data-i18n-key attribute
  function applyTranslations(translations) {
    document.querySelectorAll("[data-i18n-key]").forEach((element) => {
      const keys = element.getAttribute("data-i18n-key").split(".");
      let value = translations;
      keys.forEach((key) => (value = value[key]));
      element.textContent = value || element.getAttribute("data-i18n-key");
    });
  }

  // Function to send selected language to server
  async function sendLanguageToServer(language) {
    try {
      const csrfToken = await getCSRFToken();
      const response = await fetch(`${currentURL}:3000/api/set-language`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken, // Inclure le jeton CSRF dans les en-têtes
        },
        body: JSON.stringify({ language }),
      });

      const data = await response.json();
      if (data.success) {
        window.location.reload();
      } else {
        console.error("Error setting language");
      }
    } catch (error) {
      console.error("Error setting language:", error);
    }
  }
});
