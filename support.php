<?php
// Zeige Fehlermeldungen für das Debugging an
error_reporting(E_ALL);
ini_set('display_errors', 1);

// E-Mail-Einstellungen
$to = "i.palzer.ip@gmail.com"; // Zieladresse
$subject = "Support-Anfrage von Sudoku Master";

// Überprüfen, ob die Daten vorhanden sind
if(isset($_POST['email']) && isset($_POST['message'])) {
    // Eingaben aus dem Formular
    $user_email = $_POST['email'];
    $message = $_POST['message'];

    // Erstelle die Nachricht
    $email_content = "Von: $user_email\n\nNachricht:\n$message";

    // E-Mail-Header
    $headers = "From: $user_email";

    // E-Mail senden und Bestätigung anzeigen
    if(mail($to, $subject, $email_content, $headers)) {
        echo "Ihre Nachricht wurde erfolgreich gesendet.";
    } else {
        echo "Es gab ein Problem beim Senden der Nachricht. Bitte versuchen Sie es später erneut.";
    }
} else {
    echo "Bitte füllen Sie alle Felder aus.";
}
?>