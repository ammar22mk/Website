// Dark mode toggle
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const icon = themeToggle.querySelector('.material-symbols-outlined');
    if (body.classList.contains('dark-mode')) {
        icon.textContent = 'light_mode'; // Switch to sun for light mode
    } else {
        icon.textContent = 'dark_mode'; // Switch to moon for dark mode
    }
});

// Smooth scroll for navigation and contact button
document.querySelectorAll('a[href^="#"], button[data-scroll]').forEach(element => {
    element.addEventListener('click', function(e) {
        e.preventDefault();
        const target = this.getAttribute('href') || this.getAttribute('data-scroll');
        if (target) {
            document.querySelector(target).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Highlight active nav item
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('nav ul li a');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}, {
    threshold: 0.5
});

sections.forEach(section => observer.observe(section));

