// Fallback quotes in case the API fails
const fallbackQuotes = [
    // Inspirational
    {
        quoteText: "Life is what happens while you're busy making other plans.",
        quoteAuthor: "John Lennon",
        tags: ['life', 'inspirational']
    },
    {
        quoteText: "The only way to do great work is to love what you do.",
        quoteAuthor: "Steve Jobs",
        tags: ['work', 'inspirational']
    },
    // Wisdom
    {
        quoteText: "The journey of a thousand miles begins with one step.",
        quoteAuthor: "Lao Tzu",
        tags: ['wisdom', 'motivation']
    },
    {
        quoteText: "What you seek is seeking you.",
        quoteAuthor: "Rumi",
        tags: ['wisdom', 'spiritual']
    },
    // Success
    {
        quoteText: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        quoteAuthor: "Winston Churchill",
        tags: ['success', 'courage']
    },
    {
        quoteText: "The harder you work for something, the greater you'll feel when you achieve it.",
        quoteAuthor: "Anonymous",
        tags: ['success', 'work']
    },
    // Life
    {
        quoteText: "In three words I can sum up everything I've learned about life: it goes on.",
        quoteAuthor: "Robert Frost",
        tags: ['life', 'wisdom']
    },
    {
        quoteText: "Life is either a daring adventure or nothing at all.",
        quoteAuthor: "Helen Keller",
        tags: ['life', 'adventure']
    },
    // Dreams
    {
        quoteText: "The future belongs to those who believe in the beauty of their dreams.",
        quoteAuthor: "Eleanor Roosevelt",
        tags: ['dreams', 'future']
    },
    {
        quoteText: "All our dreams can come true if we have the courage to pursue them.",
        quoteAuthor: "Walt Disney",
        tags: ['dreams', 'courage']
    },
    // Love
    {
        quoteText: "The best thing to hold onto in life is each other.",
        quoteAuthor: "Audrey Hepburn",
        tags: ['love', 'life']
    },
    {
        quoteText: "Where there is love there is life.",
        quoteAuthor: "Mahatma Gandhi",
        tags: ['love', 'life']
    },
    // Philosophy
    {
        quoteText: "He who has a why to live can bear almost any how.",
        quoteAuthor: "Friedrich Nietzsche",
        tags: ['philosophy', 'purpose']
    },
    {
        quoteText: "The unexamined life is not worth living.",
        quoteAuthor: "Socrates",
        tags: ['philosophy', 'wisdom']
    },
    // Motivation
    {
        quoteText: "The only limit to our realization of tomorrow will be our doubts of today.",
        quoteAuthor: "Franklin D. Roosevelt",
        tags: ['motivation', 'future']
    },
    {
        quoteText: "Don't watch the clock; do what it does. Keep going.",
        quoteAuthor: "Sam Levenson",
        tags: ['motivation', 'perseverance']
    },
    // Science
    {
        quoteText: "The important thing is not to stop questioning.",
        quoteAuthor: "Albert Einstein",
        tags: ['science', 'curiosity']
    },
    {
        quoteText: "The good thing about science is that it's true whether or not you believe in it.",
        quoteAuthor: "Neil deGrasse Tyson",
        tags: ['science', 'truth']
    },
    // Art
    {
        quoteText: "Art enables us to find ourselves and lose ourselves at the same time.",
        quoteAuthor: "Thomas Merton",
        tags: ['art', 'self-discovery']
    },
    {
        quoteText: "Every artist was first an amateur.",
        quoteAuthor: "Ralph Waldo Emerson",
        tags: ['art', 'growth']
    }
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
document.addEventListener('DOMContentLoaded', async () => {
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
    await getNewQuote(); // Wait for the first quote to load
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

async function getQuoteFromAPI() {
    try {
        console.log('Fetching quote from API...');
        const response = await fetch('https://api.quotable.io/quotes/random?limit=1', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            cache: 'no-cache'
        });

        console.log('API Response status:', response.status);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const [data] = await response.json();
        console.log('API Response data:', data);

        if (!data || !data.content) {
            throw new Error('Invalid quote data');
        }

        return {
            text: data.content,
            author: data.author || 'Unknown',
            tags: data.tags || ['inspirational']
        };
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

async function getNewQuote() {
    vibrate(50);

    try {
        toggleLoading(true);
        
        // Try to get a new quote from the API
        const data = await getQuoteFromAPI();
        
        // Start fade out animation
        quoteText.style.transition = 'opacity 0.3s ease-out';
        quoteAuthor.style.transition = 'opacity 0.3s ease-out';
        quoteText.style.opacity = '0';
        quoteAuthor.style.opacity = '0';
        
        // Wait for fade out to complete
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Update quote content
        quoteText.textContent = `"${data.text}"`;
        quoteAuthor.textContent = `\u2014 ${data.author}`;
        
        // Start fade in animation
        quoteText.style.transition = 'opacity 0.5s ease-in';
        quoteAuthor.style.transition = 'opacity 0.5s ease-in';
        quoteText.style.opacity = '1';
        quoteAuthor.style.opacity = '1';
        
        // Update tags if available
        displayTags(data.tags || ['inspirational']);
        
    } catch (error) {
        console.error('Error fetching quote:', error);
        
        // Use a fallback quote with smooth transition
        const fallbackQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
        
        // Fade out current quote if any
        quoteText.style.transition = 'opacity 0.3s ease-out';
        quoteAuthor.style.transition = 'opacity 0.3s ease-out';
        quoteText.style.opacity = '0';
        quoteAuthor.style.opacity = '0';
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Update with fallback quote
        quoteText.textContent = `"${fallbackQuote.quoteText}"`;
        quoteAuthor.textContent = `\u2014 ${fallbackQuote.quoteAuthor}`;
        
        // Fade in fallback quote
        quoteText.style.transition = 'opacity 0.5s ease-in';
        quoteAuthor.style.transition = 'opacity 0.5s ease-in';
        quoteText.style.opacity = '1';
        quoteAuthor.style.opacity = '1';
        
        // Update tags
        displayTags(['inspirational']);
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
