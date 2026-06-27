# MealPrep AI 🥑

A smart cooking to-do list that turns your budget, time, and fridge contents into a
structured meal plan, grocery list, and substitutions — powered by Anthropic Claude.

## Run locally

1. Copy `config.example.js` to `config.js` and add your Anthropic API key:
   ```js
   window.ANTHROPIC_API_KEY = "sk-ant-...";
   ```
2. Open `app_cl.html` (via a local server like VS Code Live Server, or directly).

> `config.js` is gitignored, so your API key is never committed.

## ⚠️ Note on the live demo

This is a client-side app that calls the Anthropic API directly from the browser.
The hosted GitHub Pages version does **not** include an API key on purpose — embedding a
key in a public site would expose it to anyone. To use it live safely, route requests
through a small backend proxy that holds the key server-side.
