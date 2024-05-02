window.addEventListener("DOMContentLoaded", (event) => {
  var loader = document.getElementById('loader-form');
  var currentURL = window.location.href;
  var currentURL = currentURL.slice(0, -1);
  var environnementElement = document.getElementById("environment");
  loader.style.display = 'none';

  switch (currentURL) {
    case "http://localhost":
      environnementElement.textContent = environnementElement.textContent.replace(
        "{ENV}",
        "Local - "
      );
      break;
    case "http://portfolio.julesantoine.tech":
      environnementElement.textContent = environnementElement.textContent.replace(
        "{ENV}",
        ""
      );
      break;
    default:
      environnementElement.textContent = environnementElement.textContent.replace(
        "{ENV}",
        "INT - "
      );
  }
  var versionElement = document.getElementById("copyRight");
  fetch(currentURL + ":3000/api/version")
  .then((response) => response.json())
  .then((data) => {
      versionElement.textContent = versionElement.textContent.replace(
          "{VERSION}",
          data.version
      );
  })
  .catch((error) => console.error("Error fetching version:", error));
  var navbarShrink = function () {
    const navbarCollapsible = document.body.querySelector("#mainNav");
    if (!navbarCollapsible) {
      return;
    }
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
  responsiveNavItems.map(function (responsiveNavItem) {
    responsiveNavItem.addEventListener("click", () => {
      if (window.getComputedStyle(navbarToggler).display !== "none") {
        navbarToggler.click();
      }
    });
  });
});

function calculateAge(dateOfBirth) {
  var diff = Date.now() - dateOfBirth.getTime();
  var ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

var dateOfBirth = new Date("2002-08-29");
var aboutMeElement = document.getElementById("aboutMe");
var age = calculateAge(dateOfBirth);
aboutMeElement.textContent = aboutMeElement.textContent.replace("{AGE}", age);

var dateActuelle = new Date();
var anneeActuelle = dateActuelle.getFullYear();
var copyRightElement = document.getElementById("copyRight");
if ("2024" != anneeActuelle) {
  copyRightElement.textContent = copyRightElement.textContent.replace(
    "{DATE}",
    " - " + anneeActuelle
  );
} else {
  copyRightElement.textContent = copyRightElement.textContent.replace(
    "{DATE}",
    ""
  );
}

// Mail section

    var nameInput = document.getElementById('name');
    var emailInput = document.getElementById('email');
    var phoneInput = document.getElementById('phone');
    var messageInput = document.getElementById('message');
    var submitButton = document.getElementById('submitButton');
    var currentURL = window.location.href;
    var currentURL = currentURL.slice(0, -1);

    function validateForm() {
        var nameIsValid = nameInput.value.trim() !== '';
        var emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim());
        var phoneIsValid = phoneInput.value.trim() !== '';
        var messageIsValid = messageInput.value.trim() !== '';

        return nameIsValid && emailIsValid && phoneIsValid && messageIsValid;
    }

    function updateSubmitButton() {
        submitButton.disabled = !validateForm();
    }

    nameInput.addEventListener('input', updateSubmitButton);
    emailInput.addEventListener('input', updateSubmitButton);
    phoneInput.addEventListener('input', updateSubmitButton);
    messageInput.addEventListener('input', updateSubmitButton);
    
    updateSubmitButton();

    // Modal
    var modal = document.getElementById('confirmationModal');
    var closeButton = document.querySelector('.close-form');
    closeButton.onclick = function() {
        modal.style.display = 'none';
    }

    document.getElementById('contactForm').addEventListener('submit', function(event) {
        event.preventDefault();
        var loader = document.getElementById('loader-form');
        loader.style.display = 'block';
        var formData = new FormData(document.getElementById('contactForm'));
        fetch(currentURL + ':3000/send-email', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                loader.style.display = 'none';
                modal.style.display = 'block';
            }
        })
        .catch(error => {
            loader.style.display = 'none';
            console.error('Erreur lors de l\'envoi du formulaire :', error);
        });
    });