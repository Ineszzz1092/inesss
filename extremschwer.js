function generateSudoku() {
    const sudokuGrid = document.getElementById('sudoku-grid');
    sudokuGrid.innerHTML = ''; // Bestehendes Raster löschen

    // Notizmodus-Schaltfläche außerhalb des Sudoku-Rasters hinzufügen, falls sie noch nicht existiert
    let noteButton = document.getElementById('note-button');
    if (!noteButton) {
        noteButton = document.createElement('button');
        noteButton.id = 'note-button';
        noteButton.textContent = 'Notizmodus: Aus';
        noteButton.onclick = toggleNoteMode;
        // Fügt den Button direkt vor dem `sudokuGrid`-Element hinzu, sodass er erhalten bleibt
        sudokuGrid.parentNode.insertBefore(noteButton, sudokuGrid);
    }
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    // Erstelle das Sudoku
    const completeSudoku = generateCompleteSudoku();
    const puzzleSudoku = removeCells(completeSudoku, getRandomInt(50, 54));

    for (let i = 0; i < 9; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('td');
            cell.style.position = 'relative'; // Macht die Zelle zum relativen Container

            if (puzzleSudoku[i][j] === 0) {
                // Erstellt das Eingabefeld und den Notizenbereich
                const input = document.createElement('input');
                input.setAttribute('maxlength', '1'); // Begrenze auf ein Zeichen (1-9)
                input.addEventListener('input', () => handleInput(input, i, j, completeSudoku));

                const notesContainer = document.createElement('div');
                notesContainer.classList.add('notes-container');
                for (let n = 1; n <= 9; n++) {
                    const note = document.createElement('div');
                    note.classList.add('note', `note-${n}`);
                    notesContainer.appendChild(note);
                }

                cell.appendChild(input);
                cell.appendChild(notesContainer);
            } else {
                cell.textContent = puzzleSudoku[i][j];
            }
            row.appendChild(cell);
        }
        sudokuGrid.appendChild(row);
    }

    // Hinweis-Schaltfläche
    const hintButton = document.getElementById('hint-button');
    hintButton.onclick = () => giveHint(completeSudoku, puzzleSudoku);
}

// Funktion zur Überprüfung der Lösung
function checkSolution(completeGrid, inputElement, row, col) {
    const value = parseInt(inputElement.value, 10);

    if (value !== completeGrid[row][col] && !isNaN(value) && value >= 1 && value <= 9) {
        inputElement.style.backgroundColor = '#ffcccc'; // Färbe das Feld rot bei falscher Eingabe
        showErrorMessage("Falsche Zahl! Bitte korrigieren Sie Ihre Eingabe.");
    } else {
        inputElement.style.backgroundColor = '#fafafa'; // Setze die Hintergrundfarbe zurück bei korrekter Eingabe
        clearErrorMessage();
    }

    const inputs = document.querySelectorAll('#sudoku-grid input');
    let isSolved = true;
    inputs.forEach((input, index) => {
        const row = Math.floor(index / 9);
        const col = index % 9;
        const inputValue = parseInt(input.value, 10);
        if (inputValue !== completeGrid[row][col] || isNaN(inputValue) || inputValue < 1 || inputValue > 9) {
            isSolved = false;
        }
    });

    if (isSolved) {
        alert("Geschafft!");
    }
}

// Funktion zum Anzeigen einer Fehlermeldung
function showErrorMessage(message) {
    let errorContainer = document.getElementById('error-message');
    if (!errorContainer) {
        errorContainer = document.createElement('div');
        errorContainer.id = 'error-message';
        errorContainer.style.color = '#ff0000';
        errorContainer.style.marginTop = '10px';
        document.body.appendChild(errorContainer);
    }
    errorContainer.textContent = message;
}

// Funktion zum Entfernen der Fehlermeldung
function clearErrorMessage() {
    const errorContainer = document.getElementById('error-message');
    if (errorContainer) {
        errorContainer.textContent = '';
    }
}

// Funktion zur Generierung eines vollständigen Sudoku-Rasters
function generateCompleteSudoku() {
    const grid = Array.from({ length: 9 }, () => Array(9).fill(0));
    fillGrid(grid);
    return grid;
}

// Füllt das Sudoku-Raster rekursiv aus
function fillGrid(grid) {
    const emptyCell = findEmptyCell(grid);
    if (!emptyCell) {
        return true; // Alle Zellen sind gefüllt
    }

    const [row, col] = emptyCell;
    const numbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    for (const num of numbers) {
        if (isSafe(grid, row, col, num)) {
            grid[row][col] = num;
            if (fillGrid(grid)) {
                return true;
            }
            grid[row][col] = 0;
        }
    }
    return false;
}

// Findet die nächste leere Zelle
function findEmptyCell(grid) {
    for (let i = 0; i < 81; i++) {
        const row = Math.floor(i / 9);
        const col = i % 9;
        if (grid[row][col] === 0) {
            return [row, col];
        }
    }
    return null;
}

// Prüft, ob eine Zahl sicher gesetzt werden kann
function isSafe(grid, row, col, num) {
    for (let i = 0; i < 9; i++) {
        if (grid[row][i] === num || grid[i][col] === num) {
            return false;
        }
    }

    const startRow = row - (row % 3);
    const startCol = col - (col % 3);
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[startRow + i][startCol + j] === num) {
                return false;
            }
        }
    }
    return true;
}

// Zufällige Anordnung der Zahlen
function shuffleArray(array) {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Entfernt zufällig Zellen, um ein Sudoku-Puzzle zu erstellen
function removeCells(grid, cellsToRemove) {
    const puzzle = grid.map(row => row.slice());
    let removed = 0;
    while (removed < cellsToRemove) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        if (puzzle[row][col] !== 0) {
            puzzle[row][col] = 0;
            removed++;
        }
    }
    return puzzle;
}

// Funktion, um einen Hinweis zu geben
function giveHint(completeGrid, puzzleGrid) {
    const emptyOrIncorrectCells = [];
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const input = document.querySelector(`#sudoku-grid tr:nth-child(${i + 1}) td:nth-child(${j + 1}) input`);
            if (puzzleGrid[i][j] === 0 && (input === null || (input && parseInt(input.value, 10) !== completeGrid[i][j]))) {
                emptyOrIncorrectCells.push({ row: i, col: j });
            }
        }
    }

    if (emptyOrIncorrectCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyOrIncorrectCells.length);
        const { row, col } = emptyOrIncorrectCells[randomIndex];
        const input = document.querySelector(`#sudoku-grid tr:nth-child(${row + 1}) td:nth-child(${col + 1}) input`);
        if (input) {
            input.value = completeGrid[row][col];
        }
    }
}

// Notizfunktion für Sudoku-Zellen
function addNoteFunctionality(cell) {
    const inputElement = cell.querySelector('input');
    const noteContainer = document.createElement('div');
    noteContainer.className = 'note-container';
    noteContainer.style.fontSize = '0.6em';
    noteContainer.style.color = '#666';
    noteContainer.style.position = 'absolute';
    noteContainer.style.top = '0';
    noteContainer.style.left = '0';
    noteContainer.style.width = '100%';
    noteContainer.style.height = '100%';
    noteContainer.style.display = 'none'; // Versteckt, bis Notizen hinzugefügt werden
    noteContainer.style.flexWrap = 'wrap';
    noteContainer.style.alignItems = 'center';
    noteContainer.style.justifyContent = 'center';
    noteContainer.style.pointerEvents = 'none';

    cell.style.position = 'relative';
    cell.appendChild(noteContainer);

    inputElement.addEventListener('dblclick', () => {
        const noteInput = prompt("Geben Sie Ihre Notizen für mögliche Zahlen (1-9) ein, getrennt durch Kommas:");
        if (noteInput !== null) {
            const notes = noteInput.split(',').map(num => num.trim()).filter(num => num >= 1 && num <= 9);
            displayNotes(noteContainer, notes);
        }
    });
}

// Anzeige der Notizen in der Zelle
function displayNotes(noteContainer, notes) {
    noteContainer.innerHTML = '';
    noteContainer.style.display = 'flex'; // Notizen anzeigen
    notes.forEach(note => {
        const noteElement = document.createElement('span');
        noteElement.textContent = note;
        noteElement.style.flex = '1 0 33%';
        noteContainer.appendChild(noteElement);
    });
}

let isNoteMode = false;

// Funktion zum Umschalten der Notizfunktion
function toggleNoteMode() {
    isNoteMode = !isNoteMode;
    const noteButton = document.getElementById('note-button');
    noteButton.textContent = isNoteMode ? 'Notiz: Ein' : 'Notiz: Aus';
}


// Funktion zur Verarbeitung der Eingabe und Notizen
function handleInput(input, row, col, completeGrid) {
    const value = parseInt(input.value, 10);
    const notesContainer = input.parentElement.querySelector('.notes-container');


    if (isNoteMode) {
        const value = input.value;
        let currentNotes = input.dataset.notes ? input.dataset.notes.split(',') : [];

        if (currentNotes.includes(value)) {
            // Entferne die Notiz, wenn sie bereits existiert
            currentNotes = currentNotes.filter(note => note !== value);
        } else {
            // Füge die Notiz hinzu, wenn sie noch nicht existiert
            currentNotes.push(value);
        }

        // Speichere und aktualisiere Notizen
        input.dataset.notes = currentNotes.join(',');
        currentNotes.forEach(note => {
            const noteDiv = notesContainer.querySelector(`.note-${note}`);
            if (noteDiv) {
                noteDiv.textContent = note;
            }
        });

        // Entferne Notizen, die nicht mehr existieren
        for (let i = 1; i <= 9; i++) {
            if (!currentNotes.includes(i.toString())) {
                notesContainer.querySelector(`.note-${i}`).textContent = '';
            }
        }

        input.value = ''; // Eingabefeld leeren
    } else {
        // Normale Eingabe
        const value = parseInt(input.value, 10);
        if (value === completeGrid[row][col]) {
            input.style.backgroundColor = '#ccffcc';
            input.placeholder = '';
            input.dataset.notes = '';
            notesContainer.querySelectorAll('.note').forEach(noteDiv => noteDiv.textContent = ''); // Alle Notizen löschen
        } else {
            input.style.backgroundColor = '#ffcccc';
        }
    }
    if (!isNoteMode && value === completeGrid[row][col]) {
        input.style.backgroundColor = '#fff'; // Markiere das Feld grün bei korrekter Eingabe
        input.placeholder = '';
        input.dataset.notes = '';
        notesContainer.querySelectorAll('.note').forEach(noteDiv => noteDiv.textContent = ''); // Alle Notizen in der Zelle löschen

        // Entferne die Zahl als mögliche Notiz aus allen relevanten Bereichen
        clearNotesInRowColGrid(value, row, col);
    } else if (!isNoteMode) {
        input.style.backgroundColor = '#ffcccc'; // Markiere das Feld rot bei falscher Eingabe
    }
}

// Diese Funktion löscht die Zahl aus allen Notizen in derselben Zeile, Spalte und 3x3-Gruppe
function clearNotesInRowColGrid(value, row, col) {
    const sudokuGrid = document.getElementById('sudoku-grid');

    // Lösche die Notizen in der Zeile und Spalte
    for (let i = 0; i < 9; i++) {
        removeNoteFromCell(sudokuGrid, row, i, value); // Zeile
        removeNoteFromCell(sudokuGrid, i, col, value); // Spalte
    }

    // Lösche die Notizen im 3x3-Block
    const startRow = row - (row % 3);
    const startCol = col - (col % 3);
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            removeNoteFromCell(sudokuGrid, startRow + i, startCol + j, value);
        }
    }
}

// Hilfsfunktion zum Entfernen der Notiz aus einer spezifischen Zelle
function removeNoteFromCell(sudokuGrid, row, col, value) {
    const cell = sudokuGrid.querySelector(`tr:nth-child(${row + 1}) td:nth-child(${col + 1})`);
    const notesContainer = cell.querySelector('.notes-container');
    if (notesContainer) {
        const noteDiv = notesContainer.querySelector(`.note-${value}`);
        if (noteDiv) {
            noteDiv.textContent = ''; // Entferne die Notiz
        }
    }
}


// Generiere ein Sudoku beim Laden der Seite
window.onload = generateSudoku;
