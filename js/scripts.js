window.addEventListener("DOMContentLoaded", (event) => {
  var currentURL = window.location.href;
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