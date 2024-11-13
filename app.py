from flask import Flask, render_template
import numpy as np
import random

app = Flask(__name__)


# Sudoku-Generierungs-Code
def generate_complete_sudoku():
    grid = np.zeros((9, 9), dtype=int)
    fill_grid(grid)
    return grid

def fill_grid(grid):
    numbers = list(range(1, 10))
    for i in range(9):
        for j in range(9):
            if grid[i][j] == 0:
                random.shuffle(numbers)
                for num in numbers:
                    if is_safe(grid, i, j, num):
                        grid[i][j] = num
                        if check_grid_full(grid):
                            return True
                        elif fill_grid(grid):
                            return True
                grid[i][j] = 0
                return False
    return True

def is_safe(grid, row, col, num):
    return (num not in grid[row] and
            num not in grid[:, col] and
            num not in grid[row//3*3:row//3*3+3, col//3*3:col//3*3+3])

def check_grid_full(grid):
    return not any(0 in row for row in grid)

def create_sudoku():
    full_grid = generate_complete_sudoku()
    puzzle = full_grid.copy()
    for _ in range(30):  # Entfernt zufällig 30 Zahlen
        row, col = random.randint(0, 8), random.randint(0, 8)
        puzzle[row][col] = 0
    return puzzle

# Flask-Route, um das Sudoku anzuzeigen
@app.route("/")
def home():
    sudoku = create_sudoku()  # Sudoku-Generator aufrufen
    return render_template("spieldestages.html", sudoku=sudoku)

if __name__ == "__main__":
    app.run(debug=True)

