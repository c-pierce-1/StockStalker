# StockStalker
StockStalker is a web app that allows users to search for and subscribe to publicly traded companies, while visualizing the current and historical performance of their stocks through interactive graphs.

## Setup instructions
1. Clone this repository.
2. Install dependencies for the backend and the frontend:
    - For the backend:
        - Create a `.env` file with the following content:
        ```bash
        DATABASE_URL='YOUR_DATABASE_URL_HERE'
        FINNHUB_API_KEY='YOUR_FINNHUB_API_KEY_HERE'
        ```
        - Install dependencies
        ```bash
        cd stockstalker
        npm install
        ```
    - For the frontend:
        ```bash
        cd SSfrontend
        npm install
        ```
3. Start the backend server:
    ```bash
    cd stockstalker
    node server.js
    ```
4. In a separate terminal, start the frontend development server:
    ```bash
    cd SSfrontend
    npm run dev
    ```
5. Open your browser and navigate to `http://localhost:5173` to view the application.

## Deployed app URL


## Reflection
    - React was chosen to give users a smooth browsing experience without full page reloads.
    - Node/Express was chosen for its ease of implementation for a PostgreSQL database.
    - A relational database using PostgreSQL was used to handle crucial relationships between users and their watchlist subscriptions.
    - The biggest problem I encountered was API rate limits for Finnhub. A lot of information I wanted to access from Finnhub was not accessible with a free account. This made accessing historical data for graph visualizations especially difficult, but this was solved by catching errors from Finnhub fetches, and creating a 30-day mock dataset, allowing for a visualization to still be shown to users. This ensures that if Finnhub services are unavailable, the user experience impacted less drastically.
    - I gained deep experience in creating a full-stack application integrating client-side rendering with React and a server-side SQL database. The most important lesson was learning to do enough research on third-party API's, specifically their documentation and limits, before actually choosing to implement them.
    - In the future, I would like to add more elements to the application to make it feel more whole. Either by paying for a better account from finnhub, and adding company specific news, or discovering other methods of making UI feel less empty.
    

## MVP DEMO:
https://uncg-my.sharepoint.com/:v:/g/personal/chpierce2_uncg_edu/IQB7JvZ4xshASrKWmxG3RRiMASRx93MnQLx0FB__tsCp0Ac?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=WuRljJ
