document.addEventListener('DOMContentLoaded', function() {
    // Event listener toegevoegd aan het zoekknop
    document.getElementById('searchButton').addEventListener('click', function() {
        const query = document.getElementById('searchQuery').value;
        if (query) {
            fetchNews(query);
        }
    });

    // Event listener toegevoegd aan het dropdown-menu
    document.getElementById('filterDropdown').addEventListener('change', function() {
        const selectedValue = this.value;
        if (selectedValue === 'latest' || selectedValue === 'oldest') {
            filterNews(selectedValue);
        }
    });

    // Genereren van de eerste set nieuwsartikelen
    fetchNews('latest');

    // Functie om nieuws te filteren op basis van de meest recente en meest oude publicatiedatum
    function filterNews(filterType) {
        const newsContainer = document.getElementById('newsContainer');
        const articles = Array.from(newsContainer.children);

        articles.sort((a, b) => {
            const dateA = new Date(a.dataset.publishedAt);
            const dateB = new Date(b.dataset.publishedAt);
            if (filterType === 'latest') {
                return dateB - dateA; // Sorteer van meest recent naar oudste
            } else if (filterType === 'oldest') {
                return dateA - dateB; // Sorteer van meest oud naar recent
            }
        });

        // Verwijder alle huidige artikelen uit de container
        newsContainer.innerHTML = '';

        // Voeg de gesorteerde artikelen opnieuw toe aan de container
        articles.forEach(article => {
            newsContainer.appendChild(article);
        });
    }
});

function fetchNews(query) {
    const apiKey = 'd09cb73f01f74c1cac7589848dbb014e'; // Vervang dit door je eigen API-sleutel van NewsAPI
    const language = 'en'; // Specificeer de taal van de nieuwsartikelen (bijv. 'en' voor Engels)
    const sources = 'bbc-news,cnn,abc-news'; // Specificeer de nieuwsbronnen die je wilt opnemen

    const url = `https://newsapi.org/v2/everything?q=${query}&language=${language}&sources=${sources}&apiKey=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayNews(data.articles, 'newsContainer');
        })
        .catch(error => {
            console.error('Error fetching the news:', error);
        });
}

function fetchTrendingNews() {
    const apiKey = 'd09cb73f01f74c1cac7589848dbb014e'; // Vervang dit door je eigen API-sleutel van NewsAPI
    const language = 'en'; // Specificeer de taal van de nieuwsartikelen (bijv. 'en' voor Engels)
    const sources = 'bbc-news,cnn,abc-news'; // Specificeer de nieuwsbronnen die je wilt opnemen

    const url = `https://newsapi.org/v2/top-headlines?language=${language}&sources=${sources}&apiKey=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayNews(data.articles, 'trendingContainer');
        })
        .catch(error => {
            console.error('Error fetching the trending news:', error);
        });
}

function displayNews(articles, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    if (!articles || !Array.isArray(articles)) {
        container.innerHTML = '<p>Geen nieuws gevonden.</p>';
        return;
    }

    articles.slice(0, 9).forEach((article) => {
        const newsElement = document.createElement('div');
        newsElement.className = containerId === 'newsContainer' ? 'newsArticle' : 'trendingArticle';

        if (article.urlToImage) {
            const imageLink = document.createElement('a');
            imageLink.href = article.url;
            imageLink.target = '_blank';
            const image = document.createElement('img');
            image.src = article.urlToImage;
            image.alt = article.title;
            imageLink.appendChild(image);
            newsElement.appendChild(imageLink);
        }

        const title = document.createElement('h2');
        const titleLink = document.createElement('a');
        titleLink.href = article.url;
        titleLink.textContent = article.title;
        titleLink.target = '_blank';
        title.appendChild(titleLink);
        newsElement.appendChild(title);

        const source = document.createElement('p');
        source.textContent = `Source: ${article.source.name}`;
        source.className = 'source';
        newsElement.appendChild(source);

        const date = document.createElement('p');
        date.textContent = formatDate(article.publishedAt);
        date.className = 'date';
        newsElement.appendChild(date);

        const description = document.createElement('p');
        description.textContent = article.description;
        newsElement.appendChild(description);

        newsElement.dataset.publishedAt = article.publishedAt;

        container.appendChild(newsElement);
    });
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('nl-NL', options);
}

// Initial fetch for trending news
fetchTrendingNews();
