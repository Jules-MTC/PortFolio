document.addEventListener("DOMContentLoaded", () => {
  // Retrieve the current URL without the trailing slash
  currentURL = window.location.href.slice(0, -1);

  // Get DOM elements
  const versionElement = document.getElementById("copyRight");
  const copyRightElement = document.getElementById("copyRight");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const messageInput = document.getElementById("message");
  const submitButton = document.getElementById("submitButton");
  const modalConf = document.getElementById("confirmationModal");
  const modalError = document.getElementById("errorModal");
  const confCloseButton = document.querySelector(".conf-close-form");
  const errorCloseButton = document.querySelector(".error-close-form");
  const subjectInput = document.getElementById("subject");
  const iti = window.intlTelInput(phoneInput, {
    initialCountry: "fr",
    separateDialCode: true,
    utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js"
  });

  // Adjust environment text based on current URL
  if (currentURL.includes("localhost")) {
    var currentURL = "http://localhost";
  } else if (currentURL.includes("julesantoine.tech")) {
    var currentURL = "https://portfolio.julesantoine.tech";
  } else {
    var currentURL = "https://portfolio.julesantoine.tech";
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

  // Function to validate form inputs
  const validateForm = () => {
    return (
      nameInput.value.trim() !== "" &&
      subjectInput.value.trim() !== "" &&
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
  [nameInput, subjectInput, emailInput, phoneInput, messageInput].forEach((input) => {
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
  document.getElementById("contactForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const loader = document.getElementById("loader-form");
    const contentOverlay = document.getElementById("content-overlay");
    loader.style.display = "block";
    contentOverlay.style.display = "none";

    try {
      // Récupération des valeurs du formulaire
      const formData = {
        name: document.getElementById("name").value.trim(),
        subject: document.getElementById("subject").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        message: document.getElementById("message").value.trim(),
      };

      // Envoi de la requête au serveur en JSON
      const response = await fetch("http://localhost:3000/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      // Gestion de la réponse
      if (response.ok) {
        loader.style.display = "none";
        contentOverlay.style.display = "block";
        document.getElementById("confirmationModal").style.display = "block";
      } else {
        throw new Error("Failed to send email");
      }
    } catch (error) {
      loader.style.display = "none";
      contentOverlay.style.display = "block";
      document.getElementById("errorModal").style.display = "block";
      console.error("Error sending form:", error);
    }
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

  // Load translations based on selected language
  document.getElementById("languageSwitcher").addEventListener("change", async (event) => {
    const selectedLanguage = event.target.value;
    localStorage.setItem("language", selectedLanguage);
    document.documentElement.lang = selectedLanguage;
    await sendLanguageToServer(selectedLanguage);
  });

  // Function to send selected language to server
  async function sendLanguageToServer(language) {
    try {
      const response = await fetch(`${currentURL}:3000/api/set-language`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": language,
        },
        body: JSON.stringify({ language }),
      });
      const data = await response.json();
      if (data.success) {
        loadTranslations(language);
      } else {
        console.error("Error setting language");
      }
    } catch (error) {
      console.error("Error setting language:", error);
    }
  }
  phoneInput.addEventListener("countrychange", function () {
    console.log("Nouveau pays sélectionné :", iti.getSelectedCountryData());
  });
});
