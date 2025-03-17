document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.card');
    const nextStep = document.getElementById('next-step');
    const selectedType = document.getElementById('selected-type');
    const continueBtn = document.getElementById('continue-btn');
    
    // Add click event listener to each card
    cards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove selected class from all cards
            cards.forEach(c => c.classList.remove('selected'));
            
            // Add selected class to clicked card
            this.classList.add('selected');
            
            // Show next step section
            nextStep.classList.remove('hidden');
            
            // Update selected type text
            selectedType.textContent = this.querySelector('.card-title').textContent;
        });
    });
    
    // Add click event listener to continue button
    continueBtn.addEventListener('click', function() {
        const selected = document.querySelector('.card.selected');
        
        if (selected) {
            const buildingType = selected.id;
            // You can redirect to another page or load next step here
            alert(`You've selected ${buildingType} building type. Proceeding to next step.`);
            
            // Example of redirection:
            // window.location.href = `planning.html?type=${buildingType}`;
        }
    });
});