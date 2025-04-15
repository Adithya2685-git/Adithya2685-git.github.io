/**
 * Visual indicator for event tracking
 * Displays recent events and instructions
 */

document.addEventListener('DOMContentLoaded', function() {
    // Create the tracking panel
    createTrackingPanel();
    
    // Override the logEvent function to display events in our panel
    const originalLogEvent = window.logEvent;
    
    window.logEvent = function(eventType, elementType, description) {
        // Call the original function
        if (originalLogEvent) {
            originalLogEvent(eventType, elementType, description);
        }
        
        // Add event to our display panel
        addEventToDisplay(eventType, elementType, description);
    };
    
    /**
     * Creates the tracking panel in the UI
     */
    function createTrackingPanel() {
        const panel = document.createElement('div');
        panel.className = 'tracking-panel';
        panel.innerHTML = `
            <div class="tracking-header">
                <h3>Event Tracking (Q2)</h3>
                <button class="toggle-panel">▼</button>
            </div>
            <div class="tracking-content">
                <p class="instructions">
                    Events are logged in the browser console. Press F12 or right-click > Inspect > Console to view all events.
                    Recent events appear below:
                </p>
                <div class="events-list"></div>
            </div>
        `;
        
        document.body.appendChild(panel);
        
        // Handle toggle button click
        const toggleBtn = panel.querySelector('.toggle-panel');
        const content = panel.querySelector('.tracking-content');
        
        toggleBtn.addEventListener('click', function() {
            content.classList.toggle('hidden');
            toggleBtn.textContent = content.classList.contains('hidden') ? '▲' : '▼';
        });
    }
    
    /**
     * Adds an event to the display panel
     */
    function addEventToDisplay(eventType, elementType, description) {
        const eventsList = document.querySelector('.events-list');
        if (!eventsList) return;
        
        const timestamp = new Date().toLocaleTimeString();
        const eventItem = document.createElement('div');
        eventItem.className = 'event-item';
        eventItem.innerHTML = `
            <span class="event-time">${timestamp}</span>
            <span class="event-type">${eventType}</span>
            <span class="event-element">${elementType}</span>
        `;
        
        // Limit to 5 most recent events
        while (eventsList.children.length >= 5) {
            eventsList.removeChild(eventsList.firstChild);
        }
        
        eventsList.appendChild(eventItem);
    }
});
