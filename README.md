# Trixel.Tech Website

This is the enhanced single-page website for Trixel.Tech.

## How to Run

This project is a frontend-only application and does not require a backend server to run.

1.  **Clone the repository** to your local machine.
2.  **Open the `n1.html` file** directly in your preferred web browser (e.g., Google Chrome, Firefox, Safari).

### For Best Results (Recommended)

To ensure all features work as expected, especially those sensitive to browser security policies (like some JavaScript animations and potential future API calls), it's best to serve the files from a simple local web server.

If you have Python installed, you can easily start a server:

1.  Open your terminal or command prompt.
2.  Navigate to the directory where the `n1.html` and `script.js` files are located.
3.  Run one of the following commands:

    *   For **Python 3**: `python3 -m http.server`
    *   For **Python 2**: `python -m SimpleHTTPServer`

4.  Once the server is running, open your web browser and go to `http://localhost:8000`.

## Features Implemented (Frontend-Only)

*   **Advanced Audio System**:
    *   Simultaneous playback of a guided tour voiceover and background music.
    *   Volume ducking for background music when the tour or AI voice is active.
    *   A functional audio control panel to play/pause, skip tracks, and adjust the volume of the background music.
    *   A background music playlist that loops automatically.
*   **Persistent Chatbot**:
    *   Chat history is saved for each user individually using the browser's `localStorage`.
    *   When a user returns to the site, their previous conversation with the AI assistant is restored.

**Note**: As this is a frontend-only implementation, there is no centralized admin panel to view all user conversations or analytics. All data is stored locally in each user's browser.
