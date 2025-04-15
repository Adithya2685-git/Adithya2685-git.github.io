/**
 * Text analysis script for analyzing text content
 * Implements the requirements for Q3 of the assignment
 */

document.addEventListener('DOMContentLoaded', function() {
    const analyzeButton = document.getElementById('analyze-btn');
    const textInput = document.getElementById('text-input');
    
    analyzeButton.addEventListener('click', function() {
        const text = textInput.value;
        
        if (text.trim().length === 0) {
            alert('Please enter some text to analyze');
            return;
        }
        
        // Perform analysis
        const basicStats = analyzeBasicStats(text);
        const pronounStats = analyzePronounsCount(text);
        const prepositionStats = analyzePrepositionsCount(text);
        const articleStats = analyzeArticlesCount(text);
        
        // Display results
        displayBasicStats(basicStats);
        displayWordCountStats('pronouns-stats', pronounStats, 'Pronouns');
        displayWordCountStats('prepositions-stats', prepositionStats, 'Prepositions');
        displayWordCountStats('articles-stats', articleStats, 'Articles');
    });
    
    // Load sample text button (for testing)
    // Add a button to the page to load sample text for testing
    const inputArea = document.querySelector('.input-area');
    const loadSampleBtn = document.createElement('button');
    loadSampleBtn.textContent = 'Load Sample Text';
    loadSampleBtn.style.marginLeft = '10px';
    loadSampleBtn.addEventListener('click', loadSampleText);
    
    analyzeButton.parentNode.insertBefore(loadSampleBtn, analyzeButton.nextSibling);
});

/**
 * Analyze basic text statistics
 * @param {string} text - The input text
 * @return {Object} Object containing basic text statistics
 */
function analyzeBasicStats(text) {
    const letterCount = (text.match(/[a-zA-Z]/g) || []).length;
    const wordCount = (text.match(/\b\w+\b/g) || []).length;
    const spaceCount = (text.match(/\s/g) || []).length;
    const newlineCount = (text.match(/\n/g) || []).length;
    
    // Count special symbols (non-alphanumeric, non-whitespace)
    const specialSymbolCount = (text.match(/[^\w\s]/g) || []).length;
    
    return {
        letterCount,
        wordCount,
        spaceCount,
        newlineCount,
        specialSymbolCount,
        totalCharacters: text.length
    };
}

/**
 * Count pronouns in the text
 * @param {string} text - The input text
 * @return {Object} Object with pronouns and their counts
 */
function analyzePronounsCount(text) {
    // List of common English pronouns
    const pronouns = [
        'i', 'me', 'my', 'mine', 'myself',
        'you', 'your', 'yours', 'yourself', 'yourselves',
        'he', 'him', 'his', 'himself',
        'she', 'her', 'hers', 'herself',
        'it', 'its', 'itself',
        'we', 'us', 'our', 'ours', 'ourselves',
        'they', 'them', 'their', 'theirs', 'themselves',
        'who', 'whom', 'whose', 'which', 'what',
        'this', 'that', 'these', 'those',
        'anybody', 'anyone', 'anything',
        'everybody', 'everyone', 'everything',
        'nobody', 'no one', 'nothing',
        'somebody', 'someone', 'something'
    ];
    
    return countWordsInText(text, pronouns);
}

/**
 * Count prepositions in the text
 * @param {string} text - The input text
 * @return {Object} Object with prepositions and their counts
 */
function analyzePrepositionsCount(text) {
    // List of common English prepositions
    const prepositions = [
        'about', 'above', 'across', 'after', 'against', 'along', 'amid', 'among',
        'around', 'at', 'before', 'behind', 'below', 'beneath', 'beside', 'between',
        'beyond', 'by', 'concerning', 'considering', 'despite', 'down', 'during',
        'except', 'for', 'from', 'in', 'inside', 'into', 'like', 'near', 'of',
        'off', 'on', 'onto', 'out', 'outside', 'over', 'past', 'regarding',
        'round', 'since', 'through', 'throughout', 'to', 'toward', 'towards',
        'under', 'underneath', 'until', 'unto', 'up', 'upon', 'with', 'within', 'without'
    ];
    
    return countWordsInText(text, prepositions);
}

/**
 * Count indefinite articles in the text
 * @param {string} text - The input text
 * @return {Object} Object with articles and their counts
 */
function analyzeArticlesCount(text) {
    // Indefinite articles in English
    const articles = ['a', 'an'];
    
    return countWordsInText(text, articles);
}

/**
 * Count occurrences of specific words in text
 * @param {string} text - The input text
 * @param {Array} wordList - List of words to count
 * @return {Object} Object with words and their counts
 */
function countWordsInText(text, wordList) {
    const counts = {};
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    
    // Initialize counts for all words in the list
    wordList.forEach(word => {
        counts[word] = 0;
    });
    
    // Count occurrences
    words.forEach(word => {
        if (wordList.includes(word)) {
            counts[word]++;
        }
    });
    
    // Filter out words with zero count
    const result = {};
    Object.keys(counts).forEach(word => {
        if (counts[word] > 0) {
            result[word] = counts[word];
        }
    });
    
    return result;
}

/**
 * Display basic statistics in the UI
 * @param {Object} stats - The basic statistics object
 */
function displayBasicStats(stats) {
    const container = document.getElementById('basic-stats');
    container.innerHTML = `
        <ul>
            <li><strong>Total Characters:</strong> ${stats.totalCharacters}</li>
            <li><strong>Letters:</strong> ${stats.letterCount}</li>
            <li><strong>Words:</strong> ${stats.wordCount}</li>
            <li><strong>Spaces:</strong> ${stats.spaceCount}</li>
            <li><strong>Newlines:</strong> ${stats.newlineCount}</li>
            <li><strong>Special Symbols:</strong> ${stats.specialSymbolCount}</li>
        </ul>
    `;
}

/**
 * Display word count statistics in the UI
 * @param {string} containerId - The ID of the container element
 * @param {Object} stats - The word count statistics
 * @param {string} category - The category name
 */
function displayWordCountStats(containerId, stats, category) {
    const container = document.getElementById(containerId);
    
    if (Object.keys(stats).length === 0) {
        container.innerHTML = `<p>No ${category.toLowerCase()} found in the text.</p>`;
        return;
    }
    
    // Sort by count (descending)
    const sortedWords = Object.keys(stats).sort((a, b) => stats[b] - stats[a]);
    
    let html = '<ul>';
    sortedWords.forEach(word => {
        html += `<li><strong>${word}:</strong> ${stats[word]}</li>`;
    });
    html += '</ul>';
    
    container.innerHTML = html;
}

/**
 * Load sample text for testing
 */
function loadSampleText() {
    // Sample text with various pronouns, prepositions, and articles
    const sampleText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. I believe that you should always do your best in everything you attempt. He said that she would be joining us for dinner tonight. We are planning to go to the park with them this weekend.

When it comes to learning, everyone has their own approach. Some people learn by reading, while others prefer hands-on experience. I think both methods have their merits. The key is to find what works for you.

In today's world, technology is advancing at an unprecedented rate. We use computers and smartphones for almost everything now. They have become an essential part of our daily lives. 

Throughout history, humans have been fascinated by the stars above. Ancient civilizations looked to the night sky and saw gods and mythical creatures. They created stories and legends about the constellations. We now understand that stars are massive, luminous spheres of plasma held together by their own gravity.

There's something magical about walking through a forest after it rains. The earth smells fresh, and the leaves glisten with droplets of water. Birds sing their melodies from the branches above, and small creatures rustle in the undergrowth below.

A person's character is not determined by how they behave when things are going well, but by how they respond during challenging times. It's during our darkest moments that our true nature is revealed.

Someone once told me that the secret to happiness is not to seek it directly, but to create a life where happiness can find you. This involves pursuing meaningful goals, nurturing relationships, and maintaining a positive outlook despite life's inevitable setbacks.

Everything we do has consequences, both for ourselves and for others. We must consider the impact of our actions before we take them. This is an essential aspect of living ethically in society.

Nobody can predict the future with certainty, but we can prepare for it. By developing valuable skills, maintaining good health, and building strong relationships, we position ourselves to adapt to whatever challenges may arise.

The journey of a thousand miles begins with a single step. Take that first step today, and you'll be amazed at how far you can go. Remember that progress often happens slowly, but consistency is the key to achieving remarkable results over time.`;
    
    // Add more content to reach 10,000+ words
    let repeatedText = '';
    for (let i = 0; i < 100; i++) {
        repeatedText += sampleText + '\n\n';
    }
    
    document.getElementById('text-input').value = repeatedText;
}
