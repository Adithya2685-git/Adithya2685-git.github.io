/**
 * Event tracking script for monitoring user interactions
 * Captures and logs click events and page views
 */

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Track page view on initial load
    logEvent('view', 'page', document.title);
    
    // Set up intersection observer for tracking element views
    setupViewTracking();
    
    // Track all click events
    document.addEventListener('click', handleClickEvent);
});

/**
 * Handle click events throughout the document
 * @param {Event} event - The click event object
 */
function handleClickEvent(event) {
    const target = event.target;
    
    // Determine the type of clicked element
    let elementType = getElementType(target);
    
    // Log the click event
    logEvent('click', elementType, getElementDescription(target));
}

/**
 * Set up intersection observer to track when elements come into view
 */
function setupViewTracking() {
    // Create options for the observer
    const options = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.5 // at least 50% of the element is visible
    };
    
    // Create the observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Element has come into view
                const element = entry.target;
                const elementType = getElementType(element);
                
                // Only log if it's a significant element (not small text or containers)
                if (isSignificantElement(element)) {
                    logEvent('view', elementType, getElementDescription(element));
                }
                
                // Stop observing this element to prevent duplicate logs
                observer.unobserve(element);
            }
        });
    }, options);
    
    // Start observing all significant elements
    const elements = document.querySelectorAll('img, h1, h2, h3, section, .gallery-item, .skill-item, .timeline-item');
    elements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Determine if an element is significant enough to track views
 * @param {Element} element - The DOM element
 * @return {boolean} Whether the element is significant
 */
function isSignificantElement(element) {
    // Skip tiny elements and pure container elements
    const minSize = 100; // minimum size in pixels
    const rect = element.getBoundingClientRect();
    
    // Check if element has reasonable size
    if (rect.width < minSize && rect.height < minSize) {
        return false;
    }
    
    // Check if element is likely a container with no direct content
    if (element.children.length > 0 && element.textContent.trim() === '') {
        return false;
    }
    
    return true;
}

/**
 * Get a user-friendly type name for an element
 * @param {Element} element - The DOM element
 * @return {string} The element type name
 */
function getElementType(element) {
    const tagName = element.tagName.toLowerCase();
    
    // Special cases for common elements
    if (tagName === 'a') return 'link';
    if (tagName === 'img') return 'image';
    if (tagName === 'button') return 'button';
    if (tagName === 'input') {
        return element.type + ' input';
    }
    if (tagName === 'textarea') return 'text area';
    
    // Check for common CSS classes
    if (element.classList.contains('gallery-item')) return 'gallery image';
    if (element.classList.contains('skill-item')) return 'skill badge';
    if (element.classList.contains('download-btn')) return 'download button';
    
    // For headings, use their level
    if (tagName.match(/^h[1-6]$/)) return `heading (${tagName})`;
    
    // For sections, use their ID or class if available
    if (tagName === 'section' && element.id) {
        return `${element.id} section`;
    }
    
    // Default to tag name
    return tagName;
}

/**
 * Get a description of the element for logging
 * @param {Element} element - The DOM element
 * @return {string} A description of the element
 */
function getElementDescription(element) {
    // For images, use alt text or src filename
    if (element.tagName.toLowerCase() === 'img') {
        return element.alt || element.src.split('/').pop();
    }
    
    // For links, use href or text content
    if (element.tagName.toLowerCase() === 'a') {
        return element.textContent.trim() || element.href;
    }
    
    // For buttons and other elements, use text content
    let text = element.textContent.trim();
    if (text) {
        // Limit the length to avoid huge logs
        return text.length > 50 ? text.substring(0, 47) + '...' : text;
    }
    
    // If no text content, use class or id
    if (element.className) {
        return `element with class: ${element.className}`;
    }
    
    if (element.id) {
        return `element with id: ${element.id}`;
    }
    
    // Last resort
    return 'unnamed element';
}

/**
 * Log an event to the console with timestamp
 * @param {string} eventType - The type of event (click, view)
 * @param {string} elementType - The type of element
 * @param {string} description - A description of the element
 */
function logEvent(eventType, elementType, description) {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp}, ${eventType}, ${elementType} (${description})`);
}
