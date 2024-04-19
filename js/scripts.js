window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // Mail section

    // Sélectionner les champs du formulaire
    var nameInput = document.getElementById('name');
    var emailInput = document.getElementById('email');
    var phoneInput = document.getElementById('phone');
    var messageInput = document.getElementById('message');
    var submitButton = document.getElementById('submitButton');

    // Fonction pour vérifier si tous les champs sont remplis et valides
    function validateForm() {
        var nameIsValid = nameInput.value.trim() !== '';
        var emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim());
        var phoneIsValid = phoneInput.value.trim() !== '';
        var messageIsValid = messageInput.value.trim() !== '';

        return nameIsValid && emailIsValid && phoneIsValid && messageIsValid;
    }

    // Fonction pour activer ou désactiver le bouton "Send" en fonction de la validité du formulaire
    function updateSubmitButton() {
        submitButton.disabled = !validateForm();
    }

    // Écouter les événements de saisie dans les champs du formulaire
    nameInput.addEventListener('input', updateSubmitButton);
    emailInput.addEventListener('input', updateSubmitButton);
    phoneInput.addEventListener('input', updateSubmitButton);
    messageInput.addEventListener('input', updateSubmitButton);
    
    // Vérifier la validité du formulaire une fois au chargement de la page
    updateSubmitButton();

    // Modal
    var modal = document.getElementById('confirmationModal');
    var closeButton = document.querySelector('.close');

    // Fermer la fenêtre modale lorsqu'on clique sur le bouton de fermeture
    closeButton.onclick = function() {
        modal.style.display = 'none';
    }

    // Afficher la fenêtre modale lorsque le formulaire est soumis avec succès
    document.getElementById('contactForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Empêcher le formulaire de se soumettre normalement
        var formData = new FormData(this); // Récupérer les données du formulaire

        // Envoyer les données du formulaire au serveur
        fetch('http://localhost:3000/send-email', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                modal.style.display = 'block'; // Afficher la fenêtre modale si l'envoi est réussi
            }
        })
        .catch(error => {
            console.error('Erreur lors de l\'envoi du formulaire :', error);
        });
    });
});
