// CSCI 355 Project 2 by Ashiq Khan (and Sabir Ahamed). 🎯

/* QuizApp is a fun and interactive browser game designed to test your knowledge. This software follows the client-server architecture and is written in HTML, CSS, and JavaScript. Instead of fetching a physical file of questions, it fetches them from Dropbox.                           */

🧠 Quiz Content & Categories

The quiz covers a large variety of topics including math, science, history, and pop culture to test our general knowledge. The questions are retrieved from a questions.json file found on DropBox. The software makes it such that it shows the questions and choices as well as give the user the ability to select their answer. The questions are given in a random order and new questions appear as you retake the quiz. The quiz is created to be somewhat challenging to users.

🚀 Game Flow & Start

The user must click on or tap the "Start Quiz" button to play the game. Next, the user is given many multiple choice questions one at a time. By default, the quiz will have 10 questions and without a timer. However, if the user goes to settings, he or she can customize the number of questions the quiz gives and how much time he or she will have to answer them. After an answer is selected, the quiz will go to the next question. The quiz and how it was presented is designed to keep the user patient and engaged.

✅ Scoring System

The score of the user is stored in JavaScript. Each time the user selects the correct answer, the sore increase by one. Once the user is finished with the quiz, the quiz shows a "Quiz Complete!" message along with a score. In addition, the user is shown as "Try Again" or "Go Home" button. As the name suggests, the "Try Again" button replays the quiz whereas the "Go Home" button returns to the home page. This ensures that there is fairness to users.

✨ Features & Customization

QuizApp has many useful features. To begin, the user can create an account by clicking the "Sign Up" button, typing their credentials, and clicking on "Create Account". The user can log in by clicking on the "Login Button", typing their login credentials, checking off the "I agree with the Terms and Services" box, and then the "Login Button". If they click on "Terms and Services", they will be redirected to a page where they must read what they are agreeing to prior to signing up. Optionally, they can click on the "Remember Me" box to have their information saved. They can click on the "Reset Password" link and enter their registered email. The settings button allows the user to control the number of questions per quiz, whether there will be a timer for each question, how long the timer should be, and change between light and dark mode. Moreover, there is a button on the top right that also toggles between light and dark mode. As you can see, animated backgrounds have been used to grab the user's interest.

📦 Architecture & Design

QuizApp utilizes a client-server architecture, a model where the client gets requests from a server. It uses the function fetch() to get JSON information from each other. For example, the client sends to the server while the user is signing up, logging in, or changing the password. The server gives a response in return such as by giving a message in return such as "Account created!" or "Welcome back!". It also gives back error messages such as "Login failed!". The client is also working by fetching questions and choices from Dropbox.

💡 Extras & Accessibility

QuizApp was designed to be more accessible. It can be accessed simply by clicking on my GitHub link. It can be accesesd using on a desktop computer, laptop computer, tablet, phone, or any similar device. In addition, QuizApp was designed to be more usable. All the text in the web page is big enough to read, which makes it easier for the user to read and understand it. The buttons quickly respond to the user's requests. When the user use another device, the screen and all the content being presented changes size accordingly so that it's easy to use.

🤝 Contributions

I, Ashiq Khan, made many contributions to this project. To begin, I made the homepage, the pages of questions that appear when you "Start Quiz", and the results page. I also wrote the CSS code to make the webpage look aesthetically pleasing and the JavaScript code to control the function of each button. In addition, I added the various buttons on top including the toggle button between light and dark mode, the "Sign Up" button, "Log In" button, and "Settings" button. I made the forms that they bring the user to. My partner improvised the code. He modified the HTML, CSS, and JavaScript to code to meet the demands of the project. If he makes his own project and submits it, please count mines and his separately. Thank you for your cooperation.

📄 License

The project is open-source and is free for anyone to use. Feedback on how to improve the project is strongly appreciated. 
