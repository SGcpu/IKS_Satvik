document.addEventListener("DOMContentLoaded", function () {
    // Dark Mode Toggle with Local Storage
    const themeToggle = document.getElementById("theme-toggle-icon");
    if (!localStorage.getItem("dark-mode") || localStorage.getItem("dark-mode") === "enabled") {
        document.body.classList.add("dark-mode");
        themeToggle.classList.remove("fa-moon");
        themeToggle.classList.add("fa-sun");
        localStorage.setItem("dark-mode", "enabled");
    }
    
    themeToggle.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");
        themeToggle.classList.toggle("fa-moon");
        themeToggle.classList.toggle("fa-sun");
        localStorage.setItem("dark-mode", document.body.classList.contains("dark-mode") ? "enabled" : "disabled");
    });

    // Sticky Navigation
    const header = document.querySelector("header");
    window.addEventListener("scroll", function () {
        if (window.scrollY > 50) {
            header.classList.add("sticky");
        } else {
            header.classList.remove("sticky");
        }
    });

    // Carousel Navigation Buttons
    const carousel = document.querySelector(".carousel");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");
    const carouselItems = document.querySelectorAll(".carousel-item");
    const itemWidth = carouselItems[0].offsetWidth + 24; // Width + gap
    
    prevBtn.addEventListener("click", () => {
        carousel.scrollBy({ left: -itemWidth * 2, behavior: "smooth" });
    });
    
    nextBtn.addEventListener("click", () => {
        carousel.scrollBy({ left: itemWidth * 2, behavior: "smooth" });
    });

    // Carousel Touch/Mouse Drag Functionality
    let isDown = false;
    let startX;
    let scrollLeft;
    
    carousel.addEventListener("mousedown", (e) => {
        isDown = true;
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
        carousel.style.cursor = "grabbing";
    });
    
    carousel.addEventListener("mouseleave", () => {
        isDown = false;
        carousel.style.cursor = "grab";
    });
    
    carousel.addEventListener("mouseup", () => {
        isDown = false;
        carousel.style.cursor = "grab";
    });
    
    carousel.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2;
        carousel.scrollLeft = scrollLeft - walk;
    });
    
    // Touch events for mobile
    carousel.addEventListener("touchstart", (e) => {
        isDown = true;
        startX = e.touches[0].pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
    });
    
    carousel.addEventListener("touchend", () => {
        isDown = false;
    });
    
    carousel.addEventListener("touchmove", (e) => {
        if (!isDown) return;
        const x = e.touches[0].pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2;
        carousel.scrollLeft = scrollLeft - walk;
    });

    // Carousel Card Click to Show Details
    document.querySelectorAll(".card").forEach(card => {
        card.addEventListener("click", function() {
            const carouselItem = this.closest(".carousel-item");
            const category = carouselItem.dataset.category;
            const cardDetails = carouselItem.querySelector(".card-details");
            
            // Close all other open card details
            document.querySelectorAll(".card-details.active").forEach(detail => {
                if (detail !== cardDetails) {
                    detail.classList.remove("active");
                }
            });
            
            // Toggle active state on clicked card details
            cardDetails.classList.toggle("active");
            this.classList.toggle("active");
            
            // Scroll to show details if they're now active
            if (cardDetails.classList.contains("active")) {
                setTimeout(() => {
                    cardDetails.scrollIntoView({ behavior: "smooth", block: "nearest" });
                }, 100);
            }
        });
    });

    // Accordion Functionality for Utensils
    document.querySelectorAll(".accordion-header").forEach(header => {
        header.addEventListener("click", function () {
            // Close all other accordion items
            document.querySelectorAll(".accordion-item.active").forEach(item => {
                if (item !== this.parentElement) {
                    item.classList.remove("active");
                    item.querySelector(".accordion-content").style.maxHeight = null;
                }
            });
            
            // Toggle current accordion item
            this.parentElement.classList.toggle("active");
            const content = this.nextElementSibling;
            
            if (this.parentElement.classList.contains("active")) {
                content.style.maxHeight = content.scrollHeight + "px";
                // Scroll to show the opened accordion
                setTimeout(() => {
                    this.scrollIntoView({ behavior: "smooth", block: "nearest" });
                }, 300);
            } else {
                content.style.maxHeight = null;
            }
        });
    });

    // Search Functionality
    const searchButton = document.querySelector(".search-button");
    const searchModal = document.getElementById("searchModal");
    const closeSearch = document.querySelector(".close-search");
    const searchInput = document.querySelector(".search-container input");
    const searchResults = document.querySelector(".search-results");
    
    searchButton.addEventListener("click", () => {
        searchModal.classList.add("active");
        searchInput.focus();
        searchButton.classList.add("active");
    });
    
    closeSearch.addEventListener("click", () => {
        searchModal.classList.remove("active");
        searchButton.classList.remove("active");
        searchInput.value = "";
        searchResults.innerHTML = "";
    });
    
    // Close search on escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && searchModal.classList.contains("active")) {
            searchModal.classList.remove("active");
            searchButton.classList.remove("active");
            searchInput.value = "";
            searchResults.innerHTML = "";
        }
    });
    
    // Close search when clicking outside the search container
    searchModal.addEventListener("click", (e) => {
        if (e.target === searchModal) {
            searchModal.classList.remove("active");
            searchButton.classList.remove("active");
            searchInput.value = "";
            searchResults.innerHTML = "";
        }
    });
    
    searchInput.addEventListener("input", function () {
        const query = this.value.toLowerCase().trim();
        searchResults.innerHTML = "";
        
        if (query.length > 1) {
            let results = [];
            
            // Search in ingredients
            document.querySelectorAll(".carousel-item").forEach(item => {
                const title = item.querySelector("h3").innerText.toLowerCase();
                const details = item.querySelector(".card-details").innerText.toLowerCase();
                if (title.includes(query) || details.includes(query)) {
                    results.push({
                        element: item,
                        type: "ingredient",
                        title: item.querySelector("h3").innerText
                    });
                }
            });
            
            // Search in utensils
            document.querySelectorAll(".accordion-item").forEach(item => {
                const title = item.querySelector("h3").innerText.toLowerCase();
                const details = item.querySelector(".accordion-content").innerText.toLowerCase();
                if (title.includes(query) || details.includes(query)) {
                    results.push({
                        element: item,
                        type: "utensil",
                        title: item.querySelector("h3").innerText
                    });
                }
            });
            
            // Display search results
            if (results.length > 0) {
                results.forEach(result => {
                    const resultItem = document.createElement("div");
                    resultItem.classList.add("search-result-item");
                    
                    const resultIcon = document.createElement("i");
                    resultIcon.classList.add("fas");
                    if (result.type === "ingredient") {
                        resultIcon.classList.add("fa-leaf");
                    } else {
                        resultIcon.classList.add("fa-utensils");
                    }
                    
                    const resultText = document.createElement("span");
                    resultText.textContent = result.title;
                    
                    resultItem.appendChild(resultIcon);
                    resultItem.appendChild(resultText);
                    
                    resultItem.addEventListener("click", () => {
                        searchModal.classList.remove("active");
                        searchButton.classList.remove("active");
                        
                        // Activate the clicked item
                        if (result.type === "ingredient") {
                            // Close all other card details
                            document.querySelectorAll(".card-details.active").forEach(detail => {
                                detail.classList.remove("active");
                                detail.previousElementSibling.classList.remove("active");
                            });
                            
                            const card = result.element.querySelector(".card");
                            const cardDetails = result.element.querySelector(".card-details");
                            card.classList.add("active");
                            cardDetails.classList.add("active");
                        } else {
                            // Close all other accordion items
                            document.querySelectorAll(".accordion-item.active").forEach(item => {
                                item.classList.remove("active");
                                item.querySelector(".accordion-content").style.maxHeight = null;
                            });
                            
                            result.element.classList.add("active");
                            const content = result.element.querySelector(".accordion-content");
                            content.style.maxHeight = content.scrollHeight + "px";
                        }
                        
                        // Scroll to the element
                        setTimeout(() => {
                            result.element.scrollIntoView({ behavior: "smooth", block: "center" });
                        }, 100);
                    });
                    
                    searchResults.appendChild(resultItem);
                });
            } else {
                const noResults = document.createElement("div");
                noResults.classList.add("no-results");
                noResults.textContent = "No results found. Try a different search term.";
                searchResults.appendChild(noResults);
            }
        }
    });

    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // CTA Button Action
    document.querySelector('.cta-button').addEventListener('click', function() {
        document.querySelector('#ingredients').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    });

    // Progressive Loading Animation
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe sections, cards, and accordion items for animation
    document.querySelectorAll('.section, .card, .accordion-item, .avoid-item').forEach(item => {
        observer.observe(item);
    });

    // Add touch-friendly class to improve mobile experience
    if ('ontouchstart' in window || navigator.maxTouchPoints) {
        document.body.classList.add('touch-device');
    }

    // Initialize the page with the first accordion item open
    const firstAccordionItem = document.querySelector('.accordion-item');
    if (firstAccordionItem) {
        setTimeout(() => {
            firstAccordionItem.classList.add('active');
            const content = firstAccordionItem.querySelector('.accordion-content');
            content.style.maxHeight = content.scrollHeight + "px";
        }, 1000);
    }
});

document.addEventListener("DOMContentLoaded", function() {
    // Initialize particles.js only if the hero section exists
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        // Create particles container if it doesn't exist
        if (!document.getElementById('particles-text')) {
            const particlesContainer = document.createElement('div');
            particlesContainer.id = 'particles-text';
            particlesContainer.className = 'particles-text-container';
            
            // Insert it as the first child of the hero section
            heroSection.insertBefore(particlesContainer, heroSection.firstChild);
        }
        
        // Initialize particles.js
        particlesJS('particles-text', {
            "particles": {
                "number": {
                    "value": 120,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": ["#FAA002", "#835601", "#313B30", "#4D5B4C", "#DEB887"]
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    },
                    "polygon": {
                        "nb_sides": 5
                    }
                },
                "opacity": {
                    "value": 0.6,
                    "random": false,
                    "anim": {
                        "enable": false,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": {
                        "enable": false,
                        "speed": 40,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#FAA002",
                    "opacity": 0.4,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 2,
                    "direction": "none",
                    "random": false,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "grab"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 140,
                        "line_linked": {
                            "opacity": 1
                        }
                    },
                    "bubble": {
                        "distance": 400,
                        "size": 40,
                        "duration": 2,
                        "opacity": 8,
                        "speed": 3
                    },
                    "repulse": {
                        "distance": 200,
                        "duration": 0.4
                    },
                    "push": {
                        "particles_nb": 4
                    },
                    "remove": {
                        "particles_nb": 2
                    }
                }
            },
            "retina_detect": true
        });

        // Create the text overlay for "Satvik Aahar"
        if (!document.querySelector('.particles-text-overlay')) {
            const textOverlay = document.createElement('div');
            textOverlay.className = 'particles-text-overlay';
            textOverlay.textContent = 'Satvik Aahar';
            
            // Add it after the particles container
            heroSection.insertBefore(textOverlay, document.getElementById('particles-text').nextSibling);
        }
    }

    // Handle responsive adjustments for particles
    function adjustParticlesForScreen() {
        const width = window.innerWidth;
        const particlesContainer = document.getElementById('particles-text');
        
        if (particlesContainer) {
            if (width < 768) {
                // Reduce particle count and size for mobile
                particlesJS('particles-text', {
                    particles: {
                        number: {
                            value: 60
                        },
                        size: {
                            value: 2
                        },
                        move: {
                            speed: 1.5
                        }
                    }
                });
            }
        }
    }

    // Run on page load and resize
    adjustParticlesForScreen();
    window.addEventListener('resize', adjustParticlesForScreen);
});