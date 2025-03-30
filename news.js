const API_KEY = "e1df7346e3e94ae3870c2450f9f2a7bf";
const BASE_URL = "https://newsapi.org/v2/top-headlines?country=us";

async function fetchNews(category = "") {
    let url = `${BASE_URL}&apiKey=${API_KEY}`;
    if (category) url += `&category=${category}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        displayNews(data.articles);
    } catch (error) {
        console.error("Error fetching news:", error);
    }
}

function displayNews(articles) {
    const newsContainer = document.getElementById("news-container");
    newsContainer.innerHTML = ""; // Clear previous results

    articles.forEach(article => {
        const newsItem = document.createElement("div");
        newsItem.classList.add("news-item");

        newsItem.innerHTML = `
            <img src="${article.urlToImage || 'https://via.placeholder.com/300'}" alt="News Image">
            <h3>${article.title}</h3>
            <p>${article.description || "No description available."}</p>
            <a href="${article.url}" target="_blank">Read more</a>
        `;

        newsContainer.appendChild(newsItem);
    });
}

// Dark Mode Toggle
const themeToggle = document.getElementById("theme-toggle");
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    themeToggle.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
});

// Fetch default news on load
fetchNews();