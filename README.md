# CanvasClash

CanvasClash is a **multiplayer web game** that challenges players to sketch on a digital canvas while a neural network attempts to predict what they're drawing in real time. The fast-paced gameplay combines creativity, quick thinking, and machine learning for a fun, interactive experience.

## Table of Contents

- [Overview](#overview)
- [Game Features](#game-features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Overview

CanvasClash is designed to bring people together in a real-time, competitive setting where your drawing skills are put to the test. Players compete against each other and the underlying neural network that predicts your sketches. This blend of multiplayer dynamics and AI-driven insights offers a fresh take on drawing games.

## Game Features

- **Multiplayer Gameplay:** Connect and play with friends or join online lobbies to compete against other players.
- **Real-Time Neural Network Predictions:** As you sketch, an integrated neural network analyzes your drawing and predicts what you're attempting to create.
- **Interactive Canvas:** A robust drawing interface that supports smooth and responsive user interactions.
- **Competitive Rounds:** Engage in rounds where speed, accuracy, and creativity are key to outsmart both the system and other players.
- **Visual Feedback:** Instant feedback on predictions allows you to see how the neural network interprets your drawing in real time.

## Technology Stack

- **Frontend:** HTML, CSS, and JavaScript power the user interface, ensuring a responsive and engaging drawing experience.
- **Backend:** A web server (Node.js, Python, or another suitable technology) handles multiplayer connections and game state.
- **Neural Network Integration:** Machine learning models (possibly TensorFlow.js or Python-based frameworks) are used to process and predict sketches.
- **Real-Time Communication:** WebSockets (or similar technologies) facilitate low-latency communication between players and the server.

## Installation

To get a local copy of CanvasClash up and running, follow these steps:

1. **Clone the repository:**

   ```
   git clone https://github.com/AkulS1008/CanvasClash.git
   cd CanvasClash
   ```

2. **Install Dependencies:**

   - **cd into each frontend and backend folder and install the necessary dependencies:**
     ```
     cd server
     npm install

     cd client
     npm install
     ```

3. **Run the Application:**

   Start the server with the provided command:

   - **Start the server first:**

     ```
     cd server
     npm run dev
     ```
   - **Start the client :**

     ```
     cd client
     npm run dev
     ```

4. **Access the Game:**

   Open your web browser and navigate to [http://localhost:3000](http://localhost:3000) (or the appropriate port) to begin playing.

## Usage

- **Creating or Joining a Game:** After launching the app, you can either create a new game room or join an existing one.
- **Gameplay:** Once in a game, start sketching on the canvas. Watch as the neural network tries to guess your drawing while you compete with other players.
- **Feedback:** Your score may depend on how quickly and accurately the neural network interprets your sketch compared to your opponents.

## Contributing

Contributions are welcome! If you’d like to improve CanvasClash, please follow these guidelines:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Write your code and ensure that all tests pass.
4. Submit a pull request detailing your changes.

For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For questions, suggestions, or feedback, please open an issue in the repository or contact the project maintainer directly at [junhyung@ucsb.edu](mailto:junhyung@example.com).

---

Enjoy the game and happy sketching!
