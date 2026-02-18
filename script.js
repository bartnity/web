// ============================================================
// SMOOTH SCROLL & NAVIGATION
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Active nav link on scroll
    const sections = document.querySelectorAll('.section');

    function updateActiveNavLink() {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink();

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Hero buttons smooth scroll
    const heroButtons = document.querySelectorAll('.hero-buttons a');
    heroButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(href);
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ============================================================
    // VIDEO EMBED FUNCTIONALITY
    // ============================================================

    const projectCards = document.querySelectorAll('.project-card');
    let currentPlayingVideo = null;

    projectCards.forEach(card => {
        card.addEventListener('click', function() {
            const videoId = this.getAttribute('data-video-id');
            const videoContainer = this.querySelector('.video-container');
            const thumbnail = this.querySelector('.video-thumbnail');
            const playOverlay = this.querySelector('.play-overlay');

            // Stop currently playing video if exists
            if (currentPlayingVideo && currentPlayingVideo !== videoContainer) {
                const currentIframe = currentPlayingVideo.querySelector('iframe');
                if (currentIframe) {
                    const currentThumbnail = currentPlayingVideo.querySelector('.video-thumbnail');
                    const currentOverlay = currentPlayingVideo.querySelector('.play-overlay');

                    currentIframe.remove();
                    currentThumbnail.style.display = 'block';
                    currentOverlay.style.display = 'flex';
                }
            }

            // Check if this video is already playing
            const existingIframe = videoContainer.querySelector('iframe');
            if (existingIframe) {
                // Stop the video
                existingIframe.remove();
                thumbnail.style.display = 'block';
                playOverlay.style.display = 'flex';
                currentPlayingVideo = null;
            } else {
                // Play the video
                const iframe = document.createElement('iframe');
                iframe.src = `https://player.vimeo.com/video/${videoId}?autoplay=1&title=0&byline=0&portrait=0`;
                iframe.allow = 'autoplay; fullscreen; picture-in-picture';
                iframe.allowFullscreen = true;

                videoContainer.appendChild(iframe);
                thumbnail.style.display = 'none';
                playOverlay.style.display = 'none';
                currentPlayingVideo = videoContainer;
            }
        });
    });

    // ============================================================
    // CONTACT FORM FUNCTIONALITY
    // ============================================================

    const contactForm = document.getElementById('contactForm');
    const successPopup = document.getElementById('successPopup');

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Get form data
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const project = document.getElementById('project').value;

        // Discord webhook URL
        const webhookURL = 'https://discord.com/api/webhooks/1472939373677904015/mIoKTAoE3NWJMqreIQzZxG4XDs3LNvurXVVh90pruqbGCQo0-cIeebZ3kJuP6R4PAGO9';

        // Create Discord embed message
        const discordPayload = {
            embeds: [{
                title: 'ðŸŽ¬ New Project Inquiry',
                color: 0x4d9eff, // Blue color
                fields: [
                    {
                        name: 'ðŸ‘¤ Name',
                        value: name,
                        inline: true
                    },
                    {
                        name: 'ðŸ“§ Email',
                        value: email,
                        inline: true
                    },
                    {
                        name: 'ðŸ“ Project Details',
                        value: project,
                        inline: false
                    }
                ],
                timestamp: new Date().toISOString(),
                footer: {
                    text: 'DensityMace Portfolio'
                }
            }]
        };

        try {
            // Send to Discord webhook
            const response = await fetch(webhookURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(discordPayload)
            });

            if (response.ok) {
                // Show success popup
                successPopup.classList.add('show');

                // Reset form
                contactForm.reset();

                // Hide popup after 5 seconds
                setTimeout(() => {
                    successPopup.classList.remove('show');
                }, 5000);
            } else {
                console.error('Failed to send message to Discord');
                alert('There was an error sending your message. Please try again or contact me directly on Discord.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error sending your message. Please try again or contact me directly on Discord.');
        }
    });

    // Close popup on click
    successPopup.addEventListener('click', function() {
        this.classList.remove('show');
    });

    // ============================================================
    // SCROLL ANIMATIONS
    // ============================================================

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    const animatedElements = document.querySelectorAll(
        '.service-card, .benefit-card, .project-card, .pricing-card, .social-card, .about-text'
    );

    animatedElements.forEach((el, index) => {
        el.classList.add('fade-in');
        // Stagger animation delay
        el.style.transitionDelay = `${index * 0.05}s`;
        observer.observe(el);
    });

    // ============================================================
    // PERFORMANCE OPTIMIZATION
    // ============================================================

    // Debounce scroll events
    let scrollTimeout;
    let isScrolling = false;

    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            isScrolling = true;
            requestAnimationFrame(() => {
                updateActiveNavLink();
                isScrolling = false;
            });
        }
    }, { passive: true });

    // ============================================================
    // INITIAL ANIMATIONS
    // ============================================================

    // Animate hero content on load
    setTimeout(() => {
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }
    }, 100);
});

// ============================================================
// PAGE VISIBILITY API - PAUSE ANIMATIONS WHEN TAB IS HIDDEN
// ============================================================

document.addEventListener('visibilitychange', function() {
    const videos = document.querySelectorAll('iframe');
    if (document.hidden) {
        // Pause animations and videos when tab is not visible
        videos.forEach(video => {
            video.contentWindow.postMessage('{"method":"pause"}', '*');
        });
    }
});

// ============================================================
// KEYBOARD NAVIGATION
// ============================================================

document.addEventListener('keydown', function(e) {
    // Close popup on Escape key
    if (e.key === 'Escape') {
        const popup = document.getElementById('successPopup');
        if (popup.classList.contains('show')) {
            popup.classList.remove('show');
        }
    }
});

// ============================================================
// SMOOTH REVEAL ON INITIAL LOAD
// ============================================================

window.addEventListener('load', function() {
    document.body.style.opacity = '1';

    // Trigger initial animation check
    const event = new Event('scroll');
    window.dispatchEvent(event);
});