document.addEventListener('DOMContentLoaded', (event) => {
    console.log('Script is running!');
    
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('search');

    if (searchInput) {
        searchButton.addEventListener('click', function() {
            console.log('Button clicked!');
            const query = searchInput.value;
            console.log('User search input:', query);
            
            // Example fetch logic
            fetch(`https://api.themoviedb.org/3/search/movie?api_key=74c13373144fd634675a6aaaac541a4d&query=${query}`)
                .then(response => response.json())
                .then(data => {
                    const resultsDiv = document.getElementById('results');
                    resultsDiv.innerHTML = '';
                    
                    data.results.forEach(movie => {
                        // Create a container for each movie
                        const movieContainer = document.createElement('div');
                        movieContainer.className = 'movie-item';

                        // Create an image element for the poster
                        const poster = document.createElement('img');
                        poster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
                        poster.alt = movie.title;
                        poster.className = 'movie-poster';

                        // Create a text element for the title
                        const title = document.createElement('div');
                        title.textContent = movie.title;
                        title.className = 'movie-title';

                        // Append poster and title to the movie container
                        movieContainer.appendChild(poster);
                        movieContainer.appendChild(title);

                        // Append the movie container to results div
                        resultsDiv.appendChild(movieContainer);
                    });
                })
                .catch(error => console.error('Error fetching data:', error));
        });
    } else {
        console.error('Search input element not found!');
    }
});
