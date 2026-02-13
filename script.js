/* ========================================================================================
    Author: AmmarMK
    This js contains the following sections:
    1. Initialization and Document Ready
    2. Theme Toggle Functionality
    3. Navigation Functionality
    4. Hero Section Functionality
    5. About Section Functionality
    6. Skills Section Functionality
    7. Tooltips Functionality
    8. Works/Slider Section Functionality
    Ive added comments to each section to make it easier to understand the code. 
    Everything is simple and easy to understand. Hopes it helps.
======================================================================================== */
/* ============================================
   1. Initialization and Document Ready
============================================ */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize components in the order they appear in HTML
    initThemeToggle();
    initNavigation();
    initHeroSection();
    initAboutSection();
    initSkillsSection();
    initWorksSection();
    initTooltips();
});

/* ============================================
   2. Theme Toggle Functionality
============================================ */
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    
    if (!themeToggle) return;
    
    // Load saved theme preference on page load (default to dark)
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || !savedTheme) {
        body.classList.add('dark-mode');
        const icon = themeToggle.querySelector('iconify-icon');
        if (icon) {
            icon.setAttribute('icon', 'line-md:sunny-filled-loop-to-moon-filled-loop-transition');
        }
        if (!savedTheme) {
            localStorage.setItem('theme', 'dark');
        }
    }
    
    themeToggle.addEventListener('click', () => {
        // Disable button to prevent multiple clicks
        themeToggle.disabled = true;
        
        // Get all sections
        const sections = document.querySelectorAll('.section');
        
        // Add animation class to create staggered effect
        sections.forEach((section, index) => {
            setTimeout(() => {
                section.classList.add('theme-changing');
            }, index * 50);
        });
        
        // After animation starts, change theme
        setTimeout(() => {
            body.classList.toggle('dark-mode');
            const icon = themeToggle.querySelector('iconify-icon');
            
            // Save theme preference to localStorage
            if (body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
                if (icon) {
                    icon.setAttribute('icon', 'line-md:sunny-filled-loop-to-moon-filled-loop-transition');
                }
            } else {
                localStorage.setItem('theme', 'light');
                if (icon) {
                    icon.setAttribute('icon', 'line-md:sunny-filled-loop');
                }
            }
            
            // Remove animation classes in reverse order
            [...sections].reverse().forEach((section, index) => {
                setTimeout(() => {
                    section.classList.remove('theme-changing');
                }, index * 50);
            });
            
            // Re-enable button
            setTimeout(() => {
                themeToggle.disabled = false;
            }, sections.length * 50 + 100);
        }, sections.length * 50 + 100);
    });
}

/* ============================================
   3. Navigation Functionality
============================================ */
function initNavigation() {
    // Smooth scrolling for navigation and buttons
    document.querySelectorAll('a[href^="#"], button[data-scroll]').forEach(element => {
        element.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href') || this.getAttribute('data-scroll');
            const targetElement = document.querySelector(target);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Active section highlighting using Intersection Observer
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('nav ul li a');
    
    if (sections.length === 0 || navLinks.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { threshold: 0.5 });
    
    sections.forEach(section => observer.observe(section));
}

/* ============================================
   4. Hero Section Functionality
============================================ */
function initHeroSection() {
    const txtElement = document.querySelector('.typing-animation');
    if (!txtElement) return;
    
    const words = ['a Student.', 'a Developer.', 'an Engineer.🕘', 'AmmarMK.'];
    let wordIndex = 0;
    let txt = '';
    let isDeleting = false;
    
    function type() {
        const current = wordIndex % words.length;
        const fullTxt = words[current];

        // Add or remove characters
        txt = isDeleting 
            ? fullTxt.substring(0, txt.length - 1)
            : fullTxt.substring(0, txt.length + 1);

        txtElement.innerHTML = `I'm <span class="txt">${txt}</span>`;

        // Set typing speed
        let typeSpeed = isDeleting ? 30 : 100;

        // Handle complete word or empty text
        if (!isDeleting && txt === fullTxt) {
            typeSpeed = 1700; // Pause at the end of word
            isDeleting = true;
        } else if (isDeleting && txt === '') {
            isDeleting = false;
            wordIndex++;
            typeSpeed = 500; // Pause before starting new word
        }

        setTimeout(type, typeSpeed);
    }
    
    // Start the typing animation
    type();
}

/* ============================================
   5. About Section Functionality
============================================ */
function initAboutSection() {
    // Tab functionality
    document.querySelectorAll('.tab-btn').forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all tabs
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked tab
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId)?.classList.add('active');
        });
    });
    
    // Skill bars animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.width = entry.target.dataset.width;
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.skill-level').forEach(bar => {
        bar.dataset.width = bar.style.width;
        bar.style.width = '0%';
        observer.observe(bar);
    });
    
    // Timeline in About section
    const timeline = document.getElementById('timeline');
    if (timeline) {
        const dates = document.querySelectorAll('#dates a');
        const issues = document.querySelectorAll('#issues li');
        
        // Set initial state
        issues.forEach(issue => issue.style.display = 'none');
        
        // Select first item by default
        if (!document.querySelector('#dates a.selected')) {
            if (dates[0]) {
                dates[0].classList.add('selected');
                dates[0].parentElement.classList.add('selected');
                issues[0].style.display = 'block';
                issues[0].classList.add('selected');
            }
        } else {
            dates.forEach((date, i) => {
                if (date.classList.contains('selected') && issues[i]) {
                    issues[i].style.display = 'block';
                    issues[i].classList.add('selected');
                    date.parentElement.classList.add('selected');
                }
            });
        }
        
        // Click events for timeline
        dates.forEach((date, i) => {
            date.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Reset all items
                document.querySelectorAll('#dates li').forEach(item => {
                    item.classList.remove('selected');
                    const anchor = item.querySelector('a');
                    if (anchor) anchor.classList.remove('selected');
                });
                
                issues.forEach(issue => {
                    issue.classList.remove('selected');
                    issue.style.display = 'none';
                });
                
                // Activate selected item
                const targetDate = document.querySelectorAll('#dates li')[i];
                if (targetDate) {
                    targetDate.classList.add('selected');
                    const anchor = targetDate.querySelector('a');
                    if (anchor) anchor.classList.add('selected');
                }
                
                if (issues[i]) {
                    issues[i].classList.add('selected');
                    issues[i].style.display = 'block';
                }
            });
        });
    }
}

/* ============================================
   6. Skills Section Functionality
============================================ */
function initSkillsSection() {
    const scrollers = document.querySelectorAll(".skills-scroller");
    if (scrollers.length === 0) return;
    
    scrollers.forEach((scroller) => {
        const container = scroller.parentElement;
        if (!container) return;
        
        const icons = Array.from(scroller.querySelectorAll(".skill-icon"));
        if (icons.length === 0) return;
        
        // Configuration
        const iconWidth = 155; // Width (80px) + margin (20px + 20px) = 120px. , should be but i manually set it to 155
        const containerWidth = container.offsetWidth;
        const fadeWidth = containerWidth * 0.1; // 10% fade on each side
        const speed = 1; // Pixels per frame
        const totalWidth = icons.length * iconWidth; // Total width of the icon loop
        
        // State
        let isDragging = false;
        let isHovered = false;
        let startX;
        let globalOffset = 0;

        // Initialize icons
        icons.forEach((icon, index) => {
            icon.dataset.index = index;
        });

        // Animation loop
        function animate() {
            const row = container.dataset.row;
            const direction = row === "2" ? speed : -speed;

            // Only update offset if not dragging and not hovered
            if (!isDragging && !isHovered) {
                globalOffset += direction;
            }

            // Normalize globalOffset
            if (globalOffset > totalWidth) {
                globalOffset -= totalWidth;
            } else if (globalOffset < -totalWidth) {
                globalOffset += totalWidth;
            }

            // Update icon positions
            icons.forEach((icon) => {
                const index = parseInt(icon.dataset.index);
                let basePosition = index * iconWidth;
                let position = basePosition + globalOffset;
                position = ((position % totalWidth) + totalWidth) % totalWidth;
                position -= totalWidth;
                
                while (position < -iconWidth) {
                    position += totalWidth;
                }
                while (position > containerWidth + fadeWidth) {
                    position -= totalWidth;
                }

                icon.style.left = `${position}px`;
            });

            requestAnimationFrame(animate);
        }

        // Start animation
        requestAnimationFrame(animate);

        // Dragging functionality
        scroller.addEventListener('mousedown', startDragging);
        scroller.addEventListener('touchstart', startDragging, { passive: false });
        document.addEventListener('mousemove', drag);
        document.addEventListener('touchmove', drag, { passive: true });
        document.addEventListener('mouseup', stopDragging);
        document.addEventListener('touchend', stopDragging, { passive: true });
        
        function startDragging(e) {
            e.preventDefault();
            isDragging = true;
            startX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
            icons.forEach(icon => icon.style.transition = 'none');
            container.classList.add('dragging');
        }

        function drag(e) {
            if (!isDragging) return;
            const currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
            const diffX = currentX - startX;
            globalOffset += diffX;
            startX = currentX;
        }

        function stopDragging() {
            if (!isDragging) return;
            isDragging = false;
            container.classList.remove('dragging');
            icons.forEach(icon => {
                icon.style.transition = 'transform 0.3s ease, filter 0.5s';
            });
        }

        // Hover behavior to pause animation
        container.addEventListener('mouseenter', () => {
            if (!isDragging) {
                isHovered = true; // Pause animation
                icons.forEach(icon => icon.style.filter = 'grayscale(1)');
            }
        });
        
        container.addEventListener('mouseleave', () => {
            if (!isDragging) {
                isHovered = false; // Resume animation
                icons.forEach(icon => icon.style.filter = '');
            }
        });

        // Individual icon hover behavior
        icons.forEach(icon => {
            icon.addEventListener('mouseenter', () => {
                if (!isDragging) {
                    isHovered = true;
                }
            });
            
            icon.addEventListener('mouseleave', () => {
                if (!isDragging) {
                    isHovered = false;
                }
            });
        });
    });
}

/* ============================================
   7. Tooltips Functionality
============================================ */
function initTooltips() {
    const modal = document.getElementById("skill-modal");
    const modalContent = document.getElementById("modal-content");

    if (!modal || !modalContent) return;

    // Get all elements that should have tooltips
    const tooltipElements = [
        ...document.querySelectorAll(".skill-icon"),
        ...document.querySelectorAll(".certificate-item"),
        ...document.querySelectorAll(".read-more"),
        ...document.querySelectorAll(".card-image"),
        ...document.querySelectorAll(".social-icon")
    ];

    if (tooltipElements.length === 0) return;

    // Add event listeners to each element
    tooltipElements.forEach(element => {
        // Mouse events for desktop
        element.addEventListener("mouseenter", showTooltip);
        element.addEventListener("mouseleave", hideTooltip);

        // Touch events for mobile
        element.addEventListener("touchstart", (e) => {
            showTooltip.call(element, e);
        }, { passive: true });

        element.addEventListener("touchend", () => {
            setTimeout(hideTooltip, 1500); // Hide after delay to allow reading
        }, { passive: true });
    });

    // Show tooltip function
    function showTooltip(e) {
        // Get tooltip text from data attribute
        let tooltipText = this.getAttribute("data-tooltip");
        
        // Special case for card images with tooltip on the img element
        if (!tooltipText && this.classList.contains('card-image')) {
            const img = this.querySelector('img');
            tooltipText = img?.getAttribute("data-tooltip");
        }
        
        if (!tooltipText) return;

        // Set tooltip content
        modalContent.textContent = tooltipText;
        
        // Position tooltip based on element position
        const rect = this.getBoundingClientRect();
        positionTooltip(rect);

        // Show tooltip
        modal.classList.add("active");
    }

    // Hide tooltip function
    function hideTooltip() {
        modal.classList.remove("active");
    }

    // Position tooltip based on viewport size
    function positionTooltip(rect) {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // Position below the element on mobile
            modal.style.left = `${Math.max(10, rect.left + rect.width / 2 - modal.offsetWidth / 2)}px`;
            modal.style.top = `${rect.bottom + window.scrollY + 10}px`;
        } else {
            // Position above the element on desktop
            modal.style.left = `${Math.max(10, rect.left + rect.width / 2 - modal.offsetWidth / 2)}px`;
            modal.style.top = `${rect.top + window.scrollY - modal.offsetHeight - 10}px`;
        }
        
        // Ensure tooltip stays within viewport
        const rightEdge = parseInt(modal.style.left) + modal.offsetWidth;
        if (rightEdge > window.innerWidth - 10) {
            modal.style.left = `${window.innerWidth - modal.offsetWidth - 10}px`;
        }
    }

    // Update tooltip position on resize
    window.addEventListener("resize", () => {
        if (modal.classList.contains("active")) {
            const activeElement = tooltipElements.find(el => {
                const elTooltip = el.getAttribute("data-tooltip");
                const imgTooltip = el.classList.contains('card-image') && 
                                  el.querySelector('img')?.getAttribute("data-tooltip");
                return modalContent.textContent === elTooltip || modalContent.textContent === imgTooltip;
            });
            
            if (activeElement) {
                positionTooltip(activeElement.getBoundingClientRect());
            }
        }
    });
}

/* ============================================
   8. Works/Slider Section Functionality
============================================ */
function initWorksSection() {
    const sliderHolder = document.querySelector('.slider__holder');
    if (!sliderHolder) return;
    
    // State variables
    let startX, moveX;
    let isDragging = false;
    const threshold = 10; // Minimum distance to trigger slide change
    
    // Get all radio buttons
    const radioButtons = document.querySelectorAll('input[name="slider"]');
    if (radioButtons.length === 0) return;
    
    // Allow read-more links to be clickable on mobile
    const readMoreLinks = sliderHolder.querySelectorAll('.read-more');
    readMoreLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        link.addEventListener('touchstart', (e) => {
            e.stopPropagation();
        }, { passive: true });
    });

    // Add event listeners
    // Touch events
    sliderHolder.addEventListener('touchstart', dragStart, { passive: false });
    sliderHolder.addEventListener('touchmove', dragMove, { passive: true });
    sliderHolder.addEventListener('touchend', dragEnd, { passive: true });
    
    // Mouse events
    sliderHolder.addEventListener('mousedown', dragStart);
    sliderHolder.addEventListener('mousemove', dragMove);
    sliderHolder.addEventListener('mouseup', dragEnd);
    sliderHolder.addEventListener('mouseleave', dragEnd);
    
    // Drag start handler
    function dragStart(e) {
        if (e.target.closest('.read-more')) return;
        e.preventDefault();
        isDragging = true;
        startX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
        sliderHolder.classList.add('dragging');
    }
    
    // Drag move handler
    function dragMove(e) {
        if (!isDragging) return;
        
        // Calculate the distance moved
        moveX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
        const diffX = moveX - startX;
        
        // Add visual feedback during drag
        sliderHolder.style.transform = `translateX(${diffX * 0.1}px)`;
    }
    
    // Drag end handler
    function dragEnd(e) {
        if (!isDragging) return;
        
        // Reset state
        isDragging = false;
        sliderHolder.classList.remove('dragging');
        sliderHolder.style.transform = '';
        
        // Calculate final position
        const endX = e.type.includes('mouse') ? e.pageX : (e.changedTouches ? e.changedTouches[0].pageX : startX);
        const diffX = endX - startX;
        
        // Get currently checked radio
        const currentRadio = Array.from(radioButtons).findIndex(radio => radio.checked);
        
        // Determine direction and if threshold was met
        if (Math.abs(diffX) >= threshold) {
            if (diffX > 0 && currentRadio > 0) {
                // Swipe right -> previous card
                radioButtons[currentRadio - 1].checked = true;
            } else if (diffX < 0 && currentRadio < radioButtons.length - 1) {
                // Swipe left -> next card
                radioButtons[currentRadio + 1].checked = true;
            }
        }
    }
}