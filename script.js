// Fallback quotes in case the API fails
const fallbackQuotes = [
    { quoteText: "Be the change you wish to see in the world.", quoteAuthor: "Mahatma Gandhi" },
    { quoteText: "The only way to do great work is to love what you do.", quoteAuthor: "Steve Jobs" },
    { quoteText: "Life is what happens when you're busy making other plans.", quoteAuthor: "John Lennon" },
    { quoteText: "Success is not final, failure is not fatal: it is the courage to continue that counts.", quoteAuthor: "Winston Churchill" },
    { quoteText: "The future belongs to those who believe in the beauty of their dreams.", quoteAuthor: "Eleanor Roosevelt" }
];

const quoteText = document.getElementById('quoteText');
const quoteAuthor = document.getElementById('quoteAuthor');
const newQuoteBtn = document.getElementById('newQuote');
const saveQuoteBtn = document.getElementById('saveQuote');
const themeToggle = document.getElementById('themeToggle');
const favoritesList = document.getElementById('favoritesList');
const favoritesSection = document.getElementById('favoritesSection');
const twitterShareBtn = document.getElementById('twitterShare');
const facebookShareBtn = document.getElementById('facebookShare');
const whatsappShareBtn = document.getElementById('whatsappShare');
const copyQuoteBtn = document.getElementById('copyQuote');
const quoteTagsContainer = document.getElementById('quoteTags');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const pageInfo = document.getElementById('pageInfo');

// Vibration handling
let hasUserInteracted = false;

document.addEventListener('click', () => {
    hasUserInteracted = true;
}, { once: true });

function vibrate(pattern) {
    if (hasUserInteracted && window.navigator.vibrate) {
        window.navigator.vibrate(pattern);
    }
}

// Pagination state
let currentPage = 1;
const itemsPerPage = 5;

// Define categories and their associated keywords
const categories = {
    'Inspiration': ['dream', 'inspire', 'motivation', 'success', 'achieve', 'possible', 'believe'],
    'Wisdom': ['wise', 'knowledge', 'learn', 'understand', 'truth', 'wisdom', 'mind'],
    'Love': ['love', 'heart', 'soul', 'passion', 'emotion', 'feel', 'care'],
    'Life': ['life', 'live', 'journey', 'path', 'experience', 'moment', 'time'],
    'Success': ['success', 'achieve', 'goal', 'win', 'accomplish', 'excel', 'victory'],
    'Peace': ['peace', 'calm', 'tranquil', 'quiet', 'serene', 'harmony', 'balance']
};

let currentTheme = localStorage.getItem('theme') || 'light';
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add touch feedback for all buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('touchstart', () => {
            button.style.transform = 'scale(0.95)';
            vibrate(50);
        }, { passive: true });

        button.addEventListener('touchend', () => {
            button.style.transform = '';
        }, { passive: true });
    });

    // Initialize event listeners
    newQuoteBtn.addEventListener('click', getNewQuote);
    saveQuoteBtn.addEventListener('click', saveFavorite);
    themeToggle.addEventListener('click', () => {
        vibrate(50);
        toggleTheme();
    });
    twitterShareBtn.addEventListener('click', shareOnTwitter);
    facebookShareBtn.addEventListener('click', shareOnFacebook);
    whatsappShareBtn.addEventListener('click', shareOnWhatsApp);
    copyQuoteBtn.addEventListener('click', copyToClipboard);

    // Pagination event listeners
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            showFavorites();
        }
    });

    nextPageBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(favorites.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            showFavorites();
        }
    });

    // Initialize theme and load first quote
    document.body.classList.add(currentTheme);
    updateThemeButton();
    showFavorites();
    getNewQuote();
});

// Share Functions
function shareOnTwitter() {
    vibrate(50);
    const quote = quoteText.textContent;
    const author = quoteAuthor.textContent;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(quote + ' ' + author)}`;
    window.open(twitterUrl, '_blank');
}

function shareOnFacebook() {
    vibrate(50);
    const quote = quoteText.textContent;
    const author = quoteAuthor.textContent;
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(quote + ' ' + author)}`;
    window.open(fbUrl, '_blank');
}

function shareOnWhatsApp() {
    vibrate(50);
    const quote = quoteText.textContent;
    const author = quoteAuthor.textContent;
    const text = `${quote} ${author}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
}

async function copyToClipboard() {
    vibrate([50, 30]);
    const quote = quoteText.textContent;
    const author = quoteAuthor.textContent;
    const textToCopy = `${quote} ${author}`;
    
    try {
        await navigator.clipboard.writeText(textToCopy);
        copyQuoteBtn.textContent = '✓ Copied!';
        setTimeout(() => {
            copyQuoteBtn.textContent = '📋 Copy';
        }, 2000);
    } catch (err) {
        console.error('Failed to copy:', err);
    }
}

function determineQuoteCategories(quoteText) {
    const text = quoteText.toLowerCase();
    const matchedCategories = [];
    
    for (const [category, keywords] of Object.entries(categories)) {
        if (keywords.some(keyword => text.includes(keyword))) {
            matchedCategories.push(category);
        }
    }
    
    // If no categories match, add 'General'
    if (matchedCategories.length === 0) {
        matchedCategories.push('General');
    }
    
    return matchedCategories;
}

function displayTags(categories) {
    quoteTagsContainer.innerHTML = categories
        .map(category => `<span class="tag">${category}</span>`)
        .join('');
}

async function getNewQuote() {
    vibrate(50);
    try {
        toggleLoading(true);
        
        // Try to fetch from Quotable API first (more reliable)
        try {
            const response = await fetch('https://api.quotable.io/random');
            const data = await response.json();
            
            // Fade out current quote
            quoteText.style.opacity = '0';
            quoteAuthor.style.opacity = '0';
            
            // Update and fade in new quote after fade out
            setTimeout(() => {
                quoteText.textContent = `"${data.content}"`;
                quoteAuthor.textContent = `\u2014 ${data.author || 'Unknown'}`;
                quoteText.style.opacity = '1';
                quoteAuthor.style.opacity = '1';
                
                // Determine and display categories
                const quoteCategories = data.tags || determineQuoteCategories(data.content);
                displayTags(quoteCategories);
            }, 300);
            
            return;
        } catch (apiError) {
            console.log('Primary API failed, trying fallback...');
        }
        
        // Fallback to Forismatic API
        const fetchQuote = () => new Promise((resolve, reject) => {
            const script = document.createElement('script');
            const callbackName = 'jsonpCallback_' + Date.now();
            
            // Define the callback function
            window[callbackName] = (data) => {
                delete window[callbackName];
                document.body.removeChild(script);
                resolve(data);
            };
            
            // Handle errors
            script.onerror = () => {
                delete window[callbackName];
                document.body.removeChild(script);
                reject(new Error('Failed to fetch quote'));
            };
            
            // Set up the JSONP URL
            script.src = `https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=jsonp&jsonp=${callbackName}`;
            document.body.appendChild(script);
        });
        
        const data = await fetchQuote();
        
        // Fade out current quote
        quoteText.style.opacity = '0';
        quoteAuthor.style.opacity = '0';
        
        // Update and fade in new quote after fade out
        setTimeout(() => {
            quoteText.textContent = `"${data.quoteText}"`;
            quoteAuthor.textContent = `\u2014 ${data.quoteAuthor || 'Unknown'}`;
            quoteText.style.opacity = '1';
            quoteAuthor.style.opacity = '1';
            
            // Determine and display categories
            const quoteCategories = determineQuoteCategories(data.quoteText);
            displayTags(quoteCategories);
        }, 300);
        
    } catch (error) {
        console.error('Error:', error);
        // Use a fallback quote if everything fails
        const fallbackQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
        quoteText.textContent = `"${fallbackQuote.quoteText}"`;
        quoteAuthor.textContent = `\u2014 ${fallbackQuote.quoteAuthor}`;
        quoteText.style.opacity = '1';
        quoteAuthor.style.opacity = '1';
    } finally {
        toggleLoading(false);
    }
}

function saveFavorite() {
    const currentQuote = {
        content: quoteText.textContent,
        author: quoteAuthor.textContent
    };

    if (!favorites.some(fav => fav.content === currentQuote.content)) {
        favorites.push(currentQuote);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        showFavorites();
    }
    vibrate([50, 50, 50]);
}

function removeFavorite(index) {
    favorites.splice(index, 1);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    // Adjust current page if necessary
    const totalPages = Math.ceil(favorites.length / itemsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
        currentPage = totalPages;
    }
    
    showFavorites();
}

function updatePaginationControls() {
    const totalPages = Math.ceil(favorites.length / itemsPerPage);
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
}

function showFavorites() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageItems = favorites.slice(startIndex, endIndex);

    favoritesList.innerHTML = pageItems.map((quote, index) => {
        const globalIndex = startIndex + index;
        return `
            <li>
                <div class="quote-content">${quote.content || quote.quoteText}</div>
                <div class="quote-author">${quote.author || quote.quoteAuthor}</div>
                <button class="remove-btn" onclick="removeFavorite(${globalIndex})">❌ Remove</button>
            </li>
        `;
    }).join('');

    favoritesSection.style.display = favorites.length ? 'block' : 'none';
    updatePaginationControls();
}

function toggleTheme() {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    themeToggle.textContent = isDark ? '☀️ Light' : '🌙 Dark';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

function updateThemeButton() {
    themeToggle.textContent = currentTheme === 'light' ? '🌙 Dark' : '☀️ Light';
}

function toggleLoading(isLoading) {
    document.body.classList.toggle('loading', isLoading);
    newQuoteBtn.disabled = isLoading;
}
