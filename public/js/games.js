let currentGame = null;
const modal = document.getElementById('addToCartModal');

// Fetch games
async function fetchGames(queryString = '') {
    console.log('Fetching games...'); // Debugging line
    
    try {
        const url = queryString ? `/games/games?${queryString}` : '/games/games';
        
        const response = await fetch(url);
        const games = await response.json();
        displayGames(games);
    } catch (error) {
        console.error('Error fetching games:', error);
        showError('Failed to load games');
    }
}

// Display games
function displayGames(games) {
    const container = document.getElementById('games-container');
    
    if (games.length === 0) {
        container.innerHTML = `
            <div class="loading">
                <h3>No games found</h3>
                <p>Try adjusting your filters</p>
            </div>
        `;
        return;
    }

    const gamesHTML = games.map(game => `
        <div class="game-card">
            <div class="game-image-container">
                <img src="${game.img}" class="game-image" alt="${game.name}">
                <span class="genre-badge">${game.genre}</span>
            </div>
            <div class="game-content">
                <h3 class="game-title">${game.name}</h3>
                <p class="game-description">${game.description.substring(0, 100)}...</p>
                <div class="game-footer">
                    <span class="game-price">$${game.price.toFixed(2)}</span>
                    <button class="add-to-cart-btn" data-game='${JSON.stringify(game)}'>
                        Add To Cart
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    container.innerHTML = gamesHTML;

    // Add event listeners to all add-to-cart buttons
    container.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', () => {
            const gameData = JSON.parse(button.dataset.game);
            showAddToCartModal(gameData);
        });
    });
}

// Show add to cart modal
function showAddToCartModal(game) {
    currentGame = game;
    document.getElementById('modalGameImage').src = game.img;
    document.getElementById('modalGameName').textContent = game.name;
    document.getElementById('modalGamePrice').textContent = `$${game.price.toFixed(2)}`;
    document.getElementById('quantity').value = 1;
    modal.style.display = 'flex';
}

// Close modal
function closeModal() {
    modal.style.display = 'none';
}

// Add to cart
async function addToCart() {
    if (!currentGame) return;

    const quantity = parseInt(document.getElementById('quantity').value);
    if (quantity < 1) return;

    try {
        const response = await fetch('/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                pid: currentGame.pid,
                quantity: quantity
            })
        });

        if (response.ok) {
            closeModal();
            showSuccess('Game added to cart successfully');
            updateCartCount();
        } else {
            showError('Failed to add game to cart');
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        showError('Failed to add game to cart');
    }
}

// Update cart count
async function updateCartCount() {
    try {
        const response = await fetch('/cart/cart');
        const items = await response.json();
        const count = items.reduce((total, item) => total + item.quantity, 0);
        document.getElementById('cart-count').textContent = count;
    } catch (error) {
        console.error('Error updating cart count:', error);
    }
}

// Filter games
function filterGames() {
    const genre = document.getElementById('genreFilter').value;
    const priceRange = document.getElementById('priceFilter').value;
    const sortBy = document.getElementById('sortBy').value;
    console.log('Filtering games with:', { genre, priceRange, sortBy }); // Debugging line
    
    // Build query string
    const params = new URLSearchParams();
    if (genre) params.append('genre', genre);
    if (priceRange) params.append('priceRange', priceRange);
    if (sortBy) params.append('sortBy', sortBy);
    
    // Fetch games with filters
    fetchGames(params.toString());
}

// Show success message
function showSuccess(message) {
    const alert = document.createElement('div');
    alert.className = 'success-message';
    alert.textContent = message;
    document.querySelector('.container').insertBefore(alert, document.querySelector('.filters'));
    setTimeout(() => alert.remove(), 3000);
}

// Show error message
function showError(message) {
    const alert = document.createElement('div');
    alert.className = 'error-message';
    alert.textContent = message;
    document.querySelector('.container').insertBefore(alert, document.querySelector('.filters'));
    setTimeout(() => alert.remove(), 3000);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchGames();
    updateCartCount();

    // Add event listeners for filters
    document.getElementById('genreFilter').addEventListener('change', filterGames);
    document.getElementById('priceFilter').addEventListener('change', filterGames);
    document.getElementById('sortBy').addEventListener('change', filterGames);

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
    //close modal when clicking the close button
    document.querySelector('.cancel-btn').addEventListener('click', closeModal);
    document.querySelector('.close-modal').addEventListener('click', closeModal);
    // Add to cart button in modal  
    document.querySelector('.confirm-btn').addEventListener('click', addToCart);
});