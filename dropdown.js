document.addEventListener("DOMContentLoaded", function() {
    const menuIcon = document.querySelector('.menu-icon');
    const dropdownContent = document.querySelector('.dropdown-content');

    // Toggle nur auf kleineren Bildschirmen (768px und kleiner)
    function toggleDropdown() {
        if (window.innerWidth <= 768) {
            dropdownContent.classList.toggle('show');
        }
    }

    // Event-Listener zum Öffnen/Schließen des Dropdowns bei Klick auf das Menü-Symbol
    menuIcon.addEventListener('click', toggleDropdown);

    // Event-Listener zum Schließen des Dropdowns, wenn außerhalb des Menüs geklickt wird
    window.addEventListener('click', function(event) {
        if (window.innerWidth <= 768 && !menuIcon.contains(event.target) && !dropdownContent.contains(event.target)) {
            dropdownContent.classList.remove('show');
        }
    });
});