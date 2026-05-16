// testimonials.js - Dynamic testimonials functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize testimonials if they exist on the page
    initTestimonials();
});

function initTestimonials() {
    const testimonialElements = document.querySelectorAll('.testimonial .rating');

    testimonialElements.forEach(element => {
        const rating = parseFloat(element.getAttribute('data-rating') || 5);
        element.innerHTML = window.NegosyoPlan.generateStars(rating);
    });
}

// Sample testimonials data (could be loaded from API)
const testimonialsData = [
    {
        name: 'Maria Santos',
        location: 'Dubai',
        rating: 5,
        text: 'Negosyo Plan helped me turn my OFW savings into a successful online business. The blueprints are practical and easy to follow!',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
    },
    {
        name: 'Juan dela Cruz',
        location: 'Manila',
        rating: 5,
        text: 'As an aspiring entrepreneur, the Founder Bundle gave me the confidence to start my food cart business. Highly recommended!',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
    },
    {
        name: 'Ana Reyes',
        location: 'Abu Dhabi',
        rating: 4.5,
        text: 'The Complete Set Bundle is worth every penny. It covered all aspects of my business plan, from finance to marketing.',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
    }
];

// Function to dynamically load testimonials (if needed)
function loadTestimonials() {
    const testimonialGrid = document.querySelector('.testimonial-grid');
    if (!testimonialGrid) return;

    let testimonialsHTML = '';
    testimonialsData.forEach(testimonial => {
        testimonialsHTML += `
            <div class="testimonial">
                <img src="${testimonial.image}" alt="${testimonial.name}" loading="lazy">
                <p>"${testimonial.text}"</p>
                <div class="rating" data-rating="${testimonial.rating}"></div>
                <cite>${testimonial.name}, ${testimonial.location}</cite>
            </div>
        `;
    });

    testimonialGrid.innerHTML = testimonialsHTML;
    initTestimonials();
}