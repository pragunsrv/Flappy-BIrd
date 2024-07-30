# Flappy Bird Game

This is a Flappy Bird game built with HTML, CSS, and JavaScript. It includes a countdown timer before the game starts, a scoring system, and a leaderboard. The game features a pause menu and a visual style inspired by the classic Flappy Bird game.

## Features

- **Basic Gameplay**: Tap or press the space bar to make the bird flap and navigate through pipes.
- **Countdown Timer**: A countdown before the game starts.
- **Scoring System**: Track and display the current score and high score.
- **Leaderboard**: Save and display the top scores.
- **Pause Menu**: Pause and resume the game, restart the game, or view the leaderboard.
- **Improved Graphics**: Enhanced visual effects with different bird colors and background layers.

## Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/pragsrv/Flappy-Bird.git
   cd Flappy-Bird
   ```

2. **Open the Project**
   Open `index.html` in your web browser. The game should start automatically.

## Controls

- **Space Bar / Mouse Click**: Make the bird flap.
- **Escape**: Toggle pause menu.
- **Click**: Restart the game if it’s not running.

## File Structure

- `index.html`: The HTML file containing the game structure.
- `styles.css`: The CSS file for styling the game elements.
- `script.js`: The JavaScript file containing the game logic.

## Game Mechanics

- **Bird**: The player controls a bird that flaps to navigate through pipes. The bird falls due to gravity and can be lifted by flapping.
- **Pipes**: Pipes move from right to left. The player must navigate through gaps in the pipes to avoid collisions.
- **Scoring**: The score increases each time a pipe is successfully navigated.
- **Leaderboard**: High scores are saved and displayed in a leaderboard.

## Troubleshooting

- **Images Not Loading**: If you encounter issues with images not loading, ensure that the paths to the images are correct or use the updated code that does not rely on images.
- **Canvas Issues**: Ensure that the canvas dimensions are correctly set and that the game loop is running smoothly.

## Contributing

If you find any bugs or have suggestions for improvements, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
