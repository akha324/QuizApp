// CSCI 355 Project 2 by Ashiq Khan and Sabir Ahamed. 🎯

/* QuizApp is a lightweight, browser-based quiz game designed to offer a fun and interactive way to test general knowledge. Built entirely with HTML, CSS, and JavaScript, this application runs entirely on the client-side and does not rely on a traditional client-server architecture or backend database. Instead, it fetches quiz questions from a remote JSON file hosted online, making it simple and fast to deploy without server dependencies.                                                                 */

🧠 Quiz Content & Categories

The quiz pulls from a predefined set of general knowledge questions that cover various topics such as history, science, pop culture, and geography. These questions are stored in a questions.json file hosted on Dropbox and are fetched dynamically each time the game is played. This setup allows easy updates to the question pool by simply modifying the JSON source file, without altering the core app logic. The questions are presented in random order, ensuring a fresh experience for each playthrough. The content is structured to provide a balance of difficulty suitable for casual and competitive users.

🚀 Game Flow & Start

The game begins when the user clicks the “Start Quiz” button on the welcome screen. From there, the user is presented with a series of multiple-choice questions, one at a time. The number of questions and time allocated for each can be customized in the Settings menu. After selecting an answer, the next question appears automatically, continuing until all questions are answered. The seamless transition between questions helps maintain focus and immersion.

✅ Scoring System

The app keeps track of the user’s score internally using JavaScript. Each correct answer increments the score by one. At the end of the quiz, a score summary is displayed, showing the number of correct answers out of the total. This feedback helps users gauge their performance and encourages them to try again for a better result. The simplicity of the scoring ensures transparency and fairness for all users.

✨ Features & Customization

QuizApp comes with several user-friendly features. Users can sign up or log in using a username or email, with basic password validation and error handling. The settings panel lets users toggle a timer, adjust question count, and set the time per question. A light/dark mode toggle is also included, and the interface changes to match the system preference by default. Animated background videos (day/night themes) enhance the user experience.

📦 Architecture & Design

QuizApp is built using a single-page application (SPA) model and does not use a server-side component. All state management, DOM manipulation, and routing are handled with vanilla JavaScript. The UI design uses modern CSS features such as flexbox, glassmorphism effects, and media queries for responsive design. The lightweight architecture ensures fast load times and broad compatibility across devices. The design promotes a clean and consistent user interface across various screen sizes.

💡 Extras & Accessibility

Extra attention has been paid to accessibility and usability. The application responds to system-level dark/light mode, includes clear visual feedback for user actions (correct/wrong answers), and uses scalable design elements for smaller screens. It also includes a password reset simulation and “Remember Me” functionality for logins, which stores user preferences using localStorage. These extras help improve user engagement and satisfaction. The quiz is accessible on both desktop and mobile browsers without requiring installation.

📄 License

This project is open-source and free for educational and personal use. Attribution is appreciated but not required.
