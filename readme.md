## UFEND PROJECT 5

This repo started as the final project for the Udacity Front End Nanodegree, which required some kind of travel app that allows the user to create trips and see weather forecasts.

To make things more interesting, I tried to go a little bit further: making a full (albeit simple) single page application (SPA) build with vanilla JS/SCSS and powered by a node/express API:

As per Udacity requirements, no frameworks or external libraries (except for very basic ones) were used for both JS and SCSS code.
#
## Components, dependency injection and routing
Being familiar with Angular, client logic was split in components and services.

Dependency injection was implemented, and components were implemented as Web Components

Routing was implemented via hash changes

An Observable class was provided to mimick RxJS observables

A service worker is provided for caching assets.
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
