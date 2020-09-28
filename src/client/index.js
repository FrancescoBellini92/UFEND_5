import '@babel/polyfill';
import main from './js/app';
import './scss/index.scss';
import TripFormComponent from './js/components/trip-form/trip-form.component';
TripFormComponent.define();
// (() => document.addEventListener('DOMContentLoaded', main))(); // using IIFE to encapsulate logic
