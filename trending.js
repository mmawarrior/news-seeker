document.addEventListener('DOMContentLoaded', function() {
    fetchTrendingNews();
});

function fetchTrendingNews() {
    const apiKey = 'd09cb73f01f74c1cac7589848dbb014e'; // Vervang dit door je eigen API-sleutel van NewsAPI
    const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayTrendingNews(data.articles);
        })
        .catch(error => {
            console.error('Error fetching the trending news:', error);
        });
}

function displayTrendingNews(articles) {
    const trendingContainer = document.getElementById('trendingContainer');
    trendingContainer.innerHTML = '';

    if (!articles || !Array.isArray(articles)) {
        trendingContainer.innerHTML = '<p>Geen trending nieuws gevonden.</p>';
        return;
    }

    articles.slice(0, 9).forEach((article) => { // Weergeven van 9 trending artikelen
        const trendingElement = document.createElement('div');
        trendingElement.className = 'trendingArticle';

        if (article.urlToImage) {
            const imageLink = document.createElement('a');
            imageLink.href = article.url;
            imageLink.target = '_blank';
            const image = document.createElement('img');
            image.src = article.urlToImage;
            image.alt = article.title;
            imageLink.appendChild(image);
            trendingElement.appendChild(imageLink);
        }

        const title = document.createElement('h2');
        const titleLink = document.createElement('a');
        titleLink.href = article.url;
        titleLink.textContent = article.title;
        titleLink.target = '_blank';
        title.appendChild(titleLink);
        trendingElement.appendChild(title);

        const source = document.createElement('p');
        source.textContent = `Source: ${article.source.name}`;
        source.className = 'source';
        trendingElement.appendChild(source);

        const date = document.createElement('p');
        date.textContent = formatDate(article.publishedAt);
        date.className = 'date';
        trendingElement.appendChild(date);

        const description = document.createElement('p');
        description.textContent = article.description;
        trendingElement.appendChild(description);

        trendingContainer.appendChild(trendingElement);
    });
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('nl-NL', options);
}
