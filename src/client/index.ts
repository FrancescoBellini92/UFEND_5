import '@babel/polyfill';
import main from './js/app';
import './scss/index.scss';
(() => document.addEventListener('DOMContentLoaded', main))(); // using IIFE to encapsulate logic
