# DreamCraft

DreamCraft is an interactive "choose your own adventure" style game powered by AI. Take on the role of the protagonist and navigate a story where your choices shape the outcome. An AI Game Master describes dynamic scenes, presents challenges, and reacts to your actions, creating a unique and immersive storytelling experience. The game also features AI-generated images to visually represent the current scene, further enhancing immersion.

## ✨ Features

*   **Interactive Storytelling:** Your decisions directly influence the narrative and the world around you.
*   **AI Game Master:** A sophisticated AI (powered by Google's Generative AI) acts as your storyteller, guide, and a dynamic world simulator. It crafts engaging narratives, responds to your choices, and manages the game state.
*   **AI-Generated Scene Imagery:** As your adventure unfolds, the game generates images to depict the scenes you encounter, bringing the story to life.
*   **Dynamic Game State:** The AI maintains a detailed game state, including your location, objectives, inventory, and mood, which evolves based on your actions.

## 🚀 Tech Stack

*   **Frontend:** React, Vite, TypeScript
*   **AI:** Google Generative AI (Gemini)
*   **Image Generation:** Google Imagen

## 📦 Available Scripts

In the project directory, you can run:

*   `npm run dev`: Runs the app in development mode. Open [http://localhost:5173](http://localhost:5173) (or the port specified in your Vite config) to view it in your browser. The page will reload when you make changes.
*   `npm run build`: Builds the app for production to the `dist` folder. It correctly bundles React in production mode and optimizes the build for the best performance.
*   `npm run preview`: Serves the production build locally to preview before deployment.

## ▶️ Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd dreamcraft
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up Environment Variables:**
    This project requires a Google Generative AI API key. You'll need to set it up as an environment variable. Create a `.env` file in the root of your project and add your API key:
    ```env
    VITE_GEMINI_API_KEY=YOUR_API_KEY_HERE
    ```
    *Note: The `VITE_` prefix is important for Vite to expose the variable to your client-side code.*

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application should now be running on your local development server.

## ⚙️ How It Works

The application initializes by setting up a chat session with the Google Generative AI.
1.  The user provides an initial theme for their adventure.
2.  The AI asks clarifying questions to flesh out the theme.
3.  Once the theme is established, the game begins. The AI sends a narrative description of the scene and a JSON object representing the current game state (e.g., location, objective, inventory, mood).
4.  The application parses this information to display the story and the game status to the user.
5.  An image is generated based on the `sceneSummary` provided by the AI.
6.  The user inputs their actions or dialogue, which are sent back to the AI.
7.  The AI processes the user's input, updates the game state, generates a new narrative segment, and the cycle continues.

## 🤝 Contributing

Contributions are welcome! If you have ideas for improvements or want to fix a bug, please feel free to:

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a PullRequest.
