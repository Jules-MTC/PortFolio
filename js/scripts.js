document.addEventListener("DOMContentLoaded", () => {
  // Retrieve the current URL without the trailing slash
  currentURL = window.location.href.slice(0, -1);

  // Get DOM elements for version display and copyright update
  const versionElement = document.getElementById("copyRight");
  const copyRightElement = document.getElementById("copyRight");

  // Retrieve stored language from localStorage or default to English
  const storedLanguage = localStorage.getItem("language") || "en";

  // Adjust environment URL based on the current domain
  if (currentURL.includes("localhost")) {
    var currentURL = "http://localhost";
  } else if (currentURL.includes("julesantoine.fr")) {
    var currentURL = "https://www.portfolio.julesantoine.fr/";
  }

  // Fetch and display the API version
  fetch(currentURL + ":3000/api/version")
    .then((response) => response.json())
    .then((data) => {
      versionElement.textContent = versionElement.textContent.replace(
        "{VERSION}",
        data.version || ""
      );
    })
    .catch((error) => console.error("Error fetching version:", error));

  // Update the copyright year dynamically if it is not 2024
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

  // Function to load translations based on the selected language
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

  // Function to apply translations to elements with the data-i18n-key attribute
  function applyTranslations(translations) {
    document.querySelectorAll("[data-i18n-key]").forEach((element) => {
      const keys = element.getAttribute("data-i18n-key").split(".");
      let value = translations;
      keys.forEach((key) => (value = value[key]));
      element.textContent = value || element.getAttribute("data-i18n-key");
    });
  }

  // Listen for language selection changes and update the language accordingly
  document.getElementById("languageSwitcher").addEventListener("change", async (event) => {
    const selectedLanguage = event.target.value;
    localStorage.setItem("language", selectedLanguage);
    document.documentElement.lang = selectedLanguage;
    await sendLanguageToServer(selectedLanguage);
  });

  // Function to send the selected language to the server
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

  // Set the document language and update the language selector on page load
  document.documentElement.lang = storedLanguage;
  document.getElementById("languageSwitcher").value = storedLanguage;

  // Load translations for the stored or default language
  loadTranslations(storedLanguage);

  const themeSwitcher = document.getElementById("themeSwitcher");
  const htmlElement = document.documentElement;

  // Vérifiez les préférences système
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const prefersLightScheme = window.matchMedia("(prefers-color-scheme: light)").matches;
  console.log("prefersDarkScheme", prefersDarkScheme);
  console.log("prefersLightScheme", prefersLightScheme);
  // Charger le thème depuis le localStorage ou utiliser le thème système par défaut
  let savedTheme = localStorage.getItem("theme");

  if (!savedTheme) {
    // Si aucun thème n'est défini, appliquez le thème système
    savedTheme = prefersDarkScheme ? "dark" : prefersLightScheme ? "light" : "dark";
  }

  // Appliquer le thème
  htmlElement.setAttribute("data-bs-theme", savedTheme);
  updateButtonText(savedTheme);

  // Ajouter un écouteur d'événement pour le bouton
  themeSwitcher.addEventListener("click", () => {
    const currentTheme = htmlElement.getAttribute("data-bs-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    // Appliquer le nouveau thème
    htmlElement.setAttribute("data-bs-theme", newTheme);

    // Sauvegarder la préférence dans le localStorage
    localStorage.setItem("theme", newTheme);

    // Mettre à jour le texte du bouton
    updateButtonText(newTheme);
  });

  // Fonction pour mettre à jour le texte du bouton
  function updateButtonText(theme) {
    themeSwitcher.textContent = theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode";
  }
});
