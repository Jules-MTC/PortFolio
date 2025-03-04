document.addEventListener("DOMContentLoaded", () => {
  // Retrieve the current URL without the trailing slash
  currentURL = window.location.href.slice(0, -1);

  // Get DOM elements
  const versionElement = document.getElementById("copyRight");
  const copyRightElement = document.getElementById("copyRight");
  const storedLanguage = localStorage.getItem("language") || "en";

  // Adjust environment text based on current URL
  if (currentURL.includes("localhost")) {
    var currentURL = "http://localhost";
  } else if (currentURL.includes("julesantoine.tech")) {
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

  document.documentElement.lang = storedLanguage;
  document.getElementById("languageSwitcher").value = storedLanguage;
  loadTranslations(storedLanguage);

});
