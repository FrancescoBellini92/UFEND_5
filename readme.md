## UFEND PROJECT 5

This repo started as the final project for the Udacity Front End Nanodegree, which required some kind of travel app that allows the user to create trips and see weather forecasts.

To make things more interesting, I tried to go a little bit further: making a full (albeit simple) single page application build with vanilla JS/TS and powered by a node/express API:

As per Udacity requirements, no frameworks or external libraries (except for very basic ones) were used for both JS/TS and SCSS code.

Although responsive and working on any viewport, this project was built mobile-first and style and layout reflect this (the UI is organized vertically).

#
Being particularly familiar with Angular (at the time of writing), I really liked the idea to organize the codebase in an "angular-ish" way.

This resulted in:
- use of decorators
- components with encapsulated style and templates (with web components)
- service (business-logic classes) injected into components (with a dependency injection enginge)
- observables (with a class that mimicks RxJS observables)
- routing (implemented via hash change)

Also, a service worker is provided for caching assets.

HTML/SCSS was organized with BEM conventions in mind.
## Dependencies
Please refer to package.json for dependencies

## How to run
To run the project:
1) install all required dependencies via npm install
2) set up a .env file with content from .env.example (use your own API keys)
3) to test the build, set "MODE" to "PROD"
4) npm run build to build the frontend
5) npm start to run the express server

## How to test
To run the project:
1) install all required dependencies via npm install
2) set up a .env file with content from .env.example (use your own API keys)
3) to test the build, set "MODE" to "DEV"
4) start a dev server via npm run dev
5) start the node server via npm start
6) run unit and e2e tests via npm test
