document.addEventListener("DOMContentLoaded", () => {
  currentURL = window.location.href.slice(0, -1);
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

  fetch(currentURL + ":3000/api/version")
    .then((response) => response.json())
    .then((data) => {
      versionElement.textContent = versionElement.textContent.replace(
        "{VERSION}",
        data.version || ""
      );
    })
    .catch((error) => console.error("Error fetching version:", error));

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

  const mainNav = document.body.querySelector("#mainNav");
  if (mainNav) {
    new bootstrap.ScrollSpy(document.body, {
      target: "#mainNav",
      rootMargin: "0px 0px -40%",
    });
  }

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

    // Fonction pour récupérer le jeton CSRF
    const getCSRFToken = () => {
      return fetch(currentURL + ":3000/csrf-token")
        .then(response => {
          return response.json();
        })
        .then(data => {
          return data.csrfToken;
        })
        .catch(error => {
          console.error('Error fetching CSRF token:', error);
          return '';
        });
    };
    
    
    // Fonction pour mettre à jour le formulaire avec le jeton CSRF
    const updateFormCSRFToken = async () => {
      try {
        // Get the CSRF token
        const csrfToken = await getCSRFToken();
        if (csrfToken) {
          document.querySelector('input[name="_csrf"]').value = csrfToken;
        } else {
          console.error('CSRF token is empty or undefined.');
        }
      } catch (error) {
        console.error('Error updating CSRF token:', error);
      }
    };    
    
    // Call the function to update the CSRF token on page load
    updateFormCSRFToken();

  const validateForm = () => {
    return (
      nameInput.value.trim() !== "" &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim()) &&
      phoneInput.value.trim() !== "" &&
      messageInput.value.trim() !== ""
    );
  };

  const updateSubmitButton = () => {
    submitButton.disabled = !validateForm();
  };

  [nameInput, emailInput, phoneInput, messageInput].forEach((input) => {
    input.addEventListener("input", updateSubmitButton);
  });

  updateSubmitButton();

  confCloseButton.onclick = () => {
    modalConf.style.display = "none";
  };
  errorCloseButton.onclick = () => {
    modalError.style.display = "none";
  };

    // Écouter l'événement de soumission du formulaire
    document.getElementById("contactForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      const loader = document.getElementById("loader-form");
      const contentOverlay = document.getElementById("content-overlay");
      loader.style.display = "block";
      contentOverlay.style.display = "none";
  
      try {
        // Mettre à jour le jeton CSRF avant d'envoyer le formulaire
        await updateFormCSRFToken();
  
        // Créer et envoyer la requête POST avec FormData
        const formData = new FormData(document.getElementById("contactForm"));
        const response = await fetch(currentURL + ":3000/send-email", { method: "POST", body: formData });
  
        if (response.ok) {
          loader.style.display = "none";
          contentOverlay.style.display = "block";
          modalConf.style.display = "block";
        } else {
          throw new Error('Failed to send email');
        }
      } catch (error) {
        loader.style.display = "none";
        contentOverlay.style.display = "block";
        modalError.style.display = "block";
        console.error("Error sending form:", error);
      }
    });

  const savedLanguage = localStorage.getItem("language") || "en";
  languageSwitcher.value = savedLanguage;
  document.documentElement.lang = savedLanguage;
  loadTranslations(savedLanguage);

  languageSwitcher.addEventListener("change", (event) => {
    const selectedLanguage = event.target.value;
    localStorage.setItem("language", selectedLanguage);
    document.documentElement.lang = selectedLanguage;
    sendLanguageToServer(selectedLanguage);
  });

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

  function applyTranslations(translations) {
    document.querySelectorAll("[data-i18n-key]").forEach((element) => {
      const keys = element.getAttribute("data-i18n-key").split(".");
      let value = translations;
      keys.forEach((key) => (value = value[key]));
      element.textContent = value || element.getAttribute("data-i18n-key");
    });
  }

  function sendLanguageToServer(language) {
    fetch(currentURL + ":3000/api/set-language", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": language,
      },
      body: JSON.stringify({ language }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) window.location.reload();
        else console.error("Error setting language");
      })
      .catch((error) => console.error("Error setting language:", error));
  }
});