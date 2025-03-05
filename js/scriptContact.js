document.addEventListener("DOMContentLoaded", () => {
  // Retrieve the current URL without the trailing slash
  currentURL = window.location.href.slice(0, -1);

  // Get DOM elements for form inputs, buttons, and modals
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const messageInput = document.getElementById("message");
  const submitButton = document.getElementById("submitButton");
  const modalConf = document.getElementById("confirmationModal"); // Confirmation modal
  const modalError = document.getElementById("errorModal"); // Error modal
  const confCloseButton = document.querySelector(".conf-close-form"); // Close button for confirmation modal
  const errorCloseButton = document.querySelector(".error-close-form"); // Close button for error modal
  const subjectInput = document.getElementById("subject");

  // Initialize international phone input library (intlTelInput)
  const iti = window.intlTelInput(phoneInput, {
    initialCountry: "fr", // Default country: France
    separateDialCode: true, // Display country dial code separately
    utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js" // Load utilities script
  });

  // Adjust the environment text based on the current URL
  if (currentURL.includes("localhost")) {
    var currentURL = "http://localhost";
  } else if (currentURL.includes("julesantoine.tech")) {
    var currentURL = "https://portfolio.julesantoine.tech";
  }

  // Function to validate form inputs before enabling the submit button
  const validateForm = () => {
    return (
      nameInput.value.trim() !== "" &&
      subjectInput.value.trim() !== "" &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim()) && // Validate email format
      phoneInput.value.trim() !== "" &&
      messageInput.value.trim() !== ""
    );
  };

  // Function to update submit button state based on form validation
  const updateSubmitButton = () => {
    submitButton.disabled = !validateForm();
  };

  // Attach event listeners to form inputs for real-time validation
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
    event.preventDefault(); // Prevent default form submission

    // Show loading animation and hide form content
    const loader = document.getElementById("loader-form");
    const contentOverlay = document.getElementById("content-overlay");
    const contactForm = document.getElementById("contactForm");

    loader.style.display = "block"; // Show loading animation
    contentOverlay.style.display = "none"; // Hide form content

    // Disable submit button to prevent duplicate submissions
    submitButton.disabled = true;
    submitButton.classList.add("btn-secondary"); // Change button style to indicate processing
    submitButton.classList.remove("btn-primary");

    try {
      // Gather form data
      const formData = {
        name: document.getElementById("name").value.trim(),
        subject: document.getElementById("subject").value.trim(),
        email: document.getElementById("email").value.trim(),
        phonecountry: iti.getSelectedCountryData().name, // Get selected country name
        phonecode: iti.getSelectedCountryData().dialCode, // Get country dial code
        phone: document.getElementById("phone").value.trim(),
        message: document.getElementById("message").value.trim(),
      };

      // Send form data to backend API
      const response = await fetch(`${currentURL}:3000/api/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      // Handle success response
      if (response.ok) {
        loader.style.display = "none"; // Hide loading animation
        contentOverlay.style.display = "block"; // Show form content again
        document.getElementById("confirmationModal").style.display = "block"; // Show success modal
        contactForm.reset(); // Reset form fields after successful submission

        // 🔄 Reset submit button state
        submitButton.disabled = true;
        submitButton.classList.add("btn-primary"); // Change button style back to normal
        submitButton.classList.remove("btn-secondary");
      } else {
        throw new Error("Failed to send email");
      }
    } catch (error) {
      // Handle errors during form submission
      loader.style.display = "none"; // Hide loading animation
      contentOverlay.style.display = "block"; // Show form content again
      document.getElementById("errorModal").style.display = "block"; // Show error modal
      console.error("Error sending form:", error);

      // Re-enable the submit button to allow retrying
      submitButton.disabled = false;
      submitButton.classList.add("btn-danger"); // Change button style to indicate an error
      submitButton.classList.remove("btn-primary", "btn-secondary");
    }
  });
});
