// Selektiere das Logo-Element und erstelle die vier Rahmenlinien-Elemente
const logo = document.querySelector('.logo');

// Erstelle die vier Rahmenlinien
const borderTop = document.createElement('div');
borderTop.classList.add('border-top');
const borderRight = document.createElement('div');
borderRight.classList.add('border-right');
const borderBottom = document.createElement('div');
borderBottom.classList.add('border-bottom');
const borderLeft = document.createElement('div');
borderLeft.classList.add('border-left');

// Füge die Rahmenlinien zum Logo hinzu
logo.appendChild(borderTop);
logo.appendChild(borderRight);
logo.appendChild(borderBottom);
logo.appendChild(borderLeft);

// Variablen für die Timer, damit sie bei Bedarf gelöscht werden können
let topTimer, rightTimer, bottomTimer, leftTimer;

// Funktion zur Animation des Randes im Uhrzeigersinn bei Hover
function animateBorder() {
    // Setze die Animation in Schritten
    borderTop.style.width = '100%';

    // Startet die Animation für die rechte Linie mit einer kürzeren Verzögerung
    rightTimer = setTimeout(() => {
        borderRight.style.height = '100%';
    }, 300);

    // Startet die Animation für die untere Linie
    bottomTimer = setTimeout(() => {
        borderBottom.style.width = '100%';
    }, 600);

    // Startet die Animation für die linke Linie
    leftTimer = setTimeout(() => {
        borderLeft.style.height = '100%';
    }, 900);
}

// Funktion zum Zurücksetzen der Rahmenlinien, wenn die Maus das Logo verlässt
function resetBorder() {
    // Setze die Breite und Höhe aller Rahmenlinien sofort zurück
    borderTop.style.width = '0';
    borderRight.style.height = '0';
    borderBottom.style.width = '0';
    borderLeft.style.height = '0';

    // Lösche alle Timer, um die Animation sofort zu stoppen
    clearTimeout(topTimer);
    clearTimeout(rightTimer);
    clearTimeout(bottomTimer);
    clearTimeout(leftTimer);
}

// Ereignislistener für Hover und Mausverlassen
logo.addEventListener('mouseenter', animateBorder);
logo.addEventListener('mouseleave', resetBorder);
