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

/* filepath: /c:/Users/Admin/Documents/Websire/script.js */
// Add this to your existing script.js file


// Typing animation
class TypeWriterAnimation {
    constructor(txtElement, words, wait = 3000) {
        this.txtElement = txtElement;
        this.words = words;
        this.txt = '';
        this.wordIndex = 0;
        this.wait = parseInt(wait, 10);
        this.type();
        this.isDeleting = false;
      }
  
    type() {
      // Current index of word
      const current = this.wordIndex % this.words.length;
      // Get full text of current word
      const fullTxt = this.words[current];
  
      // Check if deleting
      if(this.isDeleting) {
        // Remove char
        this.txt = fullTxt.substring(0, this.txt.length - 1);
      } else {
        // Add char
        this.txt = fullTxt.substring(0, this.txt.length + 1);
      }
  
      // Insert txt into element
      this.txtElement.innerHTML = `I'm <span class="txt">${this.txt}</span>`;
  
      // Initial Type Speed
      let typeSpeed = 100;
  
      if(this.isDeleting) {
        typeSpeed /= 3; // Faster when deleting
      }
  
      // If word is complete
      if(!this.isDeleting && this.txt === fullTxt) {
        // Make pause at end
        typeSpeed = this.wait;
        // Set delete to true
        this.isDeleting = true;
      } else if(this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        // Move to next word
        this.wordIndex++;
        // Pause before start typing
        typeSpeed = 500;
      }
  
      setTimeout(() => this.type(), typeSpeed);
    }
  }
  
  // Init On DOM Load
document.addEventListener('DOMContentLoaded', () => {
    const txtElement = document.querySelector('.typing-animation');
    const words = ['a Student.', 'a Developer.', 'an Engineer.🕘', 'AmmarMK.'];
    const waitTime = 1700; 
    
    // Init TypeWriterAnimation
    new TypeWriterAnimation(txtElement, words, waitTime);
  });

  // Tab functionality for About section
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and panes
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Show corresponding tab content
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Animate skill bars on first appearance
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.width = entry.target.dataset.width || entry.target.style.width;
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.skill-level').forEach(bar => {
        // Set initial width to 0
        const targetWidth = bar.style.width;
        bar.style.width = '0%';
        bar.dataset.width = targetWidth;
        observer.observe(bar);
    });
});

// Timeline functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize only if the timeline exists
    const timeline = document.getElementById('timeline');
    if (timeline) {
        initTimeline();
    }
});

function initTimeline() {
    const dates = document.querySelectorAll('#dates a');
    const issues = document.querySelectorAll('#issues li');
    
    let current = 0;
    
    // Initialize
    dates.forEach((date, i) => {
        issues[i].style.display = 'none';
        if (date.classList.contains('selected')) {
            current = i;
            issues[i].style.display = 'block';
            issues[i].classList.add('selected');
        }
    });
    
    // Click on date
    dates.forEach((date, i) => {
        date.addEventListener('click', function(e) {
            e.preventDefault();
            navigateTo(i);
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === "ArrowDown" || e.key === "ArrowRight") {
            if (current < dates.length - 1) {
                navigateTo(current + 1);
            }
        } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
            if (current > 0) {
                navigateTo(current - 1);
            }
        }
    });
    
    function navigateTo(index) {
        // Remove selected classes
        dates.forEach(date => date.classList.remove('selected'));
        issues.forEach(issue => {
            issue.classList.remove('selected');
            issue.style.display = 'none';
        });
        
        // Add selected class to current
        dates[index].classList.add('selected');
        issues[index].classList.add('selected');
        issues[index].style.display = 'block';
        
        // Update current index
        current = index;
    }
}
