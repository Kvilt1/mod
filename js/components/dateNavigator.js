// Date Navigator Component Module
const DateNavigatorComponent = (function() {
    function createDateNavigator(currentDate, availableDates, onDateChange) {
        const container = document.createElement('div');
        container.className = 'date-navigator';
        
        // Previous button
        const prevButton = document.createElement('button');
        prevButton.className = 'date-nav-arrow date-nav-prev';
        prevButton.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 18l-6-6 6-6"/>
            </svg>
        `;
        
        // Date display
        const dateDisplay = document.createElement('div');
        dateDisplay.className = 'date-display';
        dateDisplay.textContent = formatDisplayDate(currentDate);
        
        // Next button
        const nextButton = document.createElement('button');
        nextButton.className = 'date-nav-arrow date-nav-next';
        nextButton.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 18l6-6-6-6"/>
            </svg>
        `;
        
        // Find current date index
        const currentIndex = availableDates.indexOf(currentDate);
        
        // Disable buttons if at bounds
        if (currentIndex === 0) {
            prevButton.disabled = true;
            prevButton.classList.add('disabled');
        } else {
            prevButton.onclick = () => onDateChange(availableDates[currentIndex - 1]);
        }
        
        if (currentIndex === availableDates.length - 1) {
            nextButton.disabled = true;
            nextButton.classList.add('disabled');
        } else {
            nextButton.onclick = () => onDateChange(availableDates[currentIndex + 1]);
        }
        
        container.appendChild(prevButton);
        container.appendChild(dateDisplay);
        container.appendChild(nextButton);
        
        return container;
    }
    
    function formatDisplayDate(dateStr) {
        const date = new Date(dateStr);
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        return date.toLocaleDateString('en-US', options);
    }
    
    // Public API
    return {
        createDateNavigator
    };
})();