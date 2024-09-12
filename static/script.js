document.addEventListener('DOMContentLoaded', (event) => {
    console.log('Script is running!');
    
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('search');
    const movieResultsDiv = document.getElementById('movie-results');
    const musicResultsDiv = document.getElementById('music-results');

    async function getSpotifyToken() {
        try {
            const response = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    'Authorization': 'Basic ' + btoa('3430707c0f3245599aebc17e134dbe99:d91daed5a73c4f3bad77b0c4066c8792'),
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    'grant_type': 'client_credentials'
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Access Token:', data.access_token);
            return data.access_token;
        } catch (error) {
            console.error('Error fetching the token:', error);
        }
    }

    async function searchSpotifyTracks(query) {
        const token = await getSpotifyToken();
        
        const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(query)}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        return data.tracks.items;
    }

    if (searchInput) {
        searchButton.addEventListener('click', async function() {
            console.log('Button clicked!');
            const query = searchInput.value;
            console.log('User search input:', query);
            
            // Search for movies
            fetch(`https://api.themoviedb.org/3/search/movie?api_key=74c13373144fd634675a6aaaac541a4d&query=${query}`)
                .then(response => response.json())
                .then(data => {
                    movieResultsDiv.innerHTML = '';
                    
                    data.results.forEach(movie => {
                        const movieContainer = document.createElement('div');
                        movieContainer.className = 'movie-item';

                        const poster = document.createElement('img');
                        poster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
                        poster.alt = movie.title;
                        poster.className = 'movie-poster';

                        const title = document.createElement('div');
                        title.textContent = movie.title;
                        title.className = 'movie-title';

                        movieContainer.appendChild(poster);
                        movieContainer.appendChild(title);
                        movieResultsDiv.appendChild(movieContainer);
                    });
                })
                .catch(error => console.error('Error fetching movie data:', error));

            // Search for music
            searchSpotifyTracks(query)
                .then(tracks => {
                    musicResultsDiv.innerHTML = '';

                    tracks.forEach(track => {
                        const trackContainer = document.createElement('div');
                        trackContainer.className = 'music-item';

                        const albumArt = document.createElement('img');
                        albumArt.src = track.album.images[0].url;
                        albumArt.alt = track.name;
                        albumArt.className = 'music-album-art';

                        const trackTitle = document.createElement('div');
                        trackTitle.textContent = track.name;
                        trackTitle.className = 'music-title';

                        const artistName = document.createElement('div');
                        artistName.textContent = track.artists.map(artist => artist.name).join(', ');
                        artistName.className = 'music-artist';

                        trackContainer.appendChild(albumArt);
                        trackContainer.appendChild(trackTitle);
                        trackContainer.appendChild(artistName);
                        musicResultsDiv.appendChild(trackContainer);
                    });
                })
                .catch(error => console.error('Error fetching music data:', error));
        });
    } else {
        console.error('Search input element not found!');
    }
});
