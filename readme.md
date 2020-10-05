## UFEND PROJECT 5

This is the final project developed for the Udacity Front End Nanodegree.

It is a simple single page application (SPA) build with vanilla JS and powered by a node/express API, that allows the user to create trips and see weather forecasts.

To develop a SPA with vanilla JS, web components were used to ensure encapsulation of style and logic (naming conventions are "angular-like").

The observable pattern and functional programming were used to set up an observer class inspiredy by RxJS observables.

A service worker is provided for caching assets.

Performance overhead is kept low by applying event-delegation, and by limiting DOM querying by 
keeping elements references and using document fragments

One point that causes reduced performance is the import of shared style in each web component: being encapsulated each in its shadow DOM, importing all shared style is required for each of them.

## How to run
To run the project:
1) install all required dependencies via npm install
2) set up a .env file with content from .env.example (use your own API keys)
3) to test the build, set "MODE" to "PROD"
4) npm run build to build the frontend
5) npm start to run the express server
