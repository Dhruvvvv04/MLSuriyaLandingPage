// Scroll to top on page load
window.scrollTo(0, 0);
if (window.location.hash) {
  history.replaceState(null, null, ' ');
}

// Corporate Modal Handler
const seekersBtn = document.getElementById('seekersBtn');
const corporateBtn = document.getElementById('corporateBtn');
const corporateModal = document.getElementById('corporateModal');
const modalClose = document.querySelector('.modal-close');
const seekersModal = document.getElementById('seekersModal');
const seekersModalClose = document.querySelector('.seekers-modal-close');
const seekersTestimonialsGrid = document.getElementById('seekersTestimonialsGrid');

if (corporateBtn) {
   corporateBtn.addEventListener('click', function (e) {
     e.preventDefault();
     corporateModal.style.display = 'flex';
     document.body.style.overflow = 'hidden';
     // Scroll modal content to top
     const scrollEl = corporateModal.querySelector('.modal-scroll');
     if (scrollEl) scrollEl.scrollTop = 0;
   });
}

if (seekersBtn) {
   seekersBtn.addEventListener('click', function (e) {
     e.preventDefault();
     if (seekersModal) {
       seekersModal.style.display = 'flex';
       document.body.style.overflow = 'hidden';
       // Scroll modal content to top
       const scrollEl = seekersModal.querySelector('.modal-scroll');
       if (scrollEl) scrollEl.scrollTop = 0;
       // Load testimonials when modal opens
       loadSeekersTestimonials();
     }
   });
}

if (modalClose) {
   modalClose.addEventListener('click', function () {
     corporateModal.style.display = 'none';
     document.body.style.overflow = 'auto';
   });
}

if (seekersModalClose) {
   seekersModalClose.addEventListener('click', function () {
     seekersModal.style.display = 'none';
     document.body.style.overflow = 'auto';
   });
}

// Function to load testimonials from YouTube playlist
async function loadSeekersTestimonials() {
   if (!seekersTestimonialsGrid) return;
   
   // Show loading state
   seekersTestimonialsGrid.innerHTML = '<div class="loading">Loading testimonials...</div>';
   
   try {
     // Fetch videos from the YouTube playlist
     const playlistId = 'PLnPhRppRs8_MZ1Nkj7r6vLi9v0T7XnHQY';
     
     // Alternative approach: fetch playlist page and extract video data
     const response = await fetch(`https://www.youtube.com/playlist?list=${playlistId}`);
     if (!response.ok) {
       throw new Error('Failed to fetch playlist');
     }
     
     const html = await response.text();
     // Extract video IDs from the playlist page
     const videoIds = extractVideoIdsFromPlaylist(html);
     
     if (videoIds.length === 0) {
       seekersTestimonialsGrid.innerHTML = '<div class="error">No testimonials found</div>';
       return;
     }
     
     // Limit to first 3 testimonials for performance
     const limitedVideoIds = videoIds.slice(0, 3);
     
     // Create testimonial elements
     const testimonialsHTML = limitedVideoIds.map(videoId => {
       const videoUrl = `https://youtu.be/${videoId}`;
       const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
       
       return `
         <div class="testimonial-with-qr">
           <div class="testimonial-text">
             <p>Powerful testimonial from M.L. Suriya's teachings</p>
           </div>
           <div class="testimonial-qr">
             <a class="media-preview-link media-preview-link--founder" href="${videoUrl}" target="_blank" rel="noreferrer" aria-label="Open testimonial video">
               <span class="media-preview">
                 <div class="media-preview__portrait media-preview__portrait--img"><img src="${thumbnailUrl}" alt="Testimonial"></div>
                 <span class="media-preview__copy">
                   <span class="media-preview__eyebrow">Watch testimonial</span>
                   <span class="media-preview__title">Seeker Transformation</span>
                   <span class="media-preview__meta">Spiritual journey</span>
                 </span>
                 <span class="media-preview__cta">Open</span>
               </span>
             </a>
           </div>
         </div>
       `;
     }).join('');
     
     seekersTestimonialsGrid.innerHTML = testimonialsHTML;
   } catch (error) {
     console.error('Error loading seekers testimonials:', error);
     seekersTestimonialsGrid.innerHTML = '<div class="error">Unable to load testimonials. Please try again later.</div>';
   }
}

// Helper function to extract video IDs from YouTube playlist page
function extractVideoIdsFromPlaylist(html) {
   const videoIds = [];
   const regex = /"videoId":"([^"]+)"/g;
   let match;
   
   while ((match = regex.exec(html)) !== null) {
     videoIds.push(match[1]);
   }
   
   // Remove duplicates while preserving order
   return [...new Set(videoIds)];
}

document.querySelectorAll('.seekers-card').forEach(card => {
   card.setAttribute('role', 'button');
   card.setAttribute('tabindex', '0');

   const titleElement = card.querySelector('h3');
   const title = titleElement ? titleElement.textContent.trim() : 'Seeker Detail';
   
   // Updated details object for fallback
   const details = {
     subtitle: 'Non-Corporate Spiritual Seekers Special Session',
     heading: title,
     description: card.querySelector('p') ? card.querySelector('p').textContent.trim() : 'Expanded session detail.',
     focus: 'Practical guidance',
     outcome: 'Meaningful transformation'
   };

   const openSeekersModal = () => {
     if (!seekersModal) {
       return;
     }

     // Update modal header with card-specific info
     document.getElementById('seekersModalTitle').textContent = title;
     document.getElementById('seekersModalSubtitle').textContent = details.subtitle;
     document.getElementById('seekersModalHeading').textContent = details.heading;
     
     // Focus and outcome remain static for now
     document.getElementById('seekersModalFocus').textContent = details.focus;
     document.getElementById('seekersModalOutcome').textContent = details.outcome;
     
      seekersModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      // Scroll modal content to top
      const scrollEl = seekersModal.querySelector('.modal-scroll');
      if (scrollEl) scrollEl.scrollTop = 0;
    };

    card.addEventListener('click', openSeekersModal);

   card.addEventListener('keydown', function (e) {
     if (e.key === 'Enter' || e.key === ' ') {
       e.preventDefault();
       openSeekersModal();
     }
   });
});

// Close modal when clicking outside content
window.addEventListener('click', function (e) {
  if (e.target === corporateModal) {
    corporateModal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }

  if (e.target === seekersModal) {
    seekersModal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
});

window.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    if (corporateModal && corporateModal.style.display === 'flex') {
      corporateModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }

    if (seekersModal && seekersModal.style.display === 'flex') {
      seekersModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  }
});

// Smooth scroll to sections
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#' && document.querySelector(href)) {
      e.preventDefault();
      const target = document.querySelector(href);
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Form submission handler
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Get form values
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    // Show success message
    alert('Thank you for reaching out! We will contact you soon.');
    this.reset();
  });
}

// Enhanced scroll-reveal animations for all major elements
const revealObserverOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
};

const revealObserver = new IntersectionObserver(function(entries) {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      // Add staggered delay based on position in viewport
      const delay = entry.target.dataset.revealDelay || 0;
      setTimeout(() => {
        entry.target.classList.add('revealed');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, revealObserverOptions);

// Apply scroll-reveal to all major elements
const revealSelectors = [
  '.section-header',
  '.card',
  '.stat',
  '.program-card',
  '.video-card',
  '.testimonial',
  '.testimonial-with-qr',
  '.about-content',
  '.session-banner',
  '.key-promise',
  '.corporate-promise',
  '.four-r-framework',
  '.credentials',
  '.contact-form-link'
];

document.querySelectorAll(revealSelectors.join(', ')).forEach((el, index) => {
  // Don't apply to elements inside modals (they have their own visibility)
  if (!el.closest('.modal')) {
    el.classList.add('scroll-reveal');
    // Stagger siblings
    el.dataset.revealDelay = (index % 4) * 100;
    revealObserver.observe(el);
  }
});

// Enhanced navbar scroll effect with glassmorphism transition
const navbar = document.querySelector('.navbar');
let lastScrollTop = 0;

window.addEventListener('scroll', function() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  if (scrollTop > 80) {
    navbar.style.boxShadow = '0 8px 32px rgba(107, 53, 200, 0.1)';
    navbar.style.background = 'rgba(255, 255, 255, 0.85)';
  } else {
    navbar.style.boxShadow = 'none';
    navbar.style.background = 'rgba(255, 255, 255, 0.65)';
  }
  
  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

console.log('M.L. Suriya Landing Page loaded successfully!');

// Clone 4-R framework items for infinite scroll
document.querySelectorAll('.modal-scroll .four-r-framework').forEach(fw => {
  if (!fw.dataset.cloned) {
    const children = Array.from(fw.children);
    children.forEach(child => {
      const clone = child.cloneNode(true);
      fw.appendChild(clone);
    });
    fw.dataset.cloned = 'true';
  }
});

function slowScrollTo(element, target, duration) {
  const start = element.scrollLeft;
  const change = target - start;
  const startTime = performance.now();

  const originalSnap = element.style.scrollSnapType;
  element.style.scrollSnapType = 'none';
  element.style.scrollBehavior = 'auto';

  function animateScroll(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    
    element.scrollLeft = start + change * ease;

    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    } else {
      element.style.scrollSnapType = originalSnap;
    }
  }
  requestAnimationFrame(animateScroll);
}

// Auto-scroll 4-R framework on mobile every 5 seconds
setInterval(() => {
  if (window.innerWidth <= 768) {
    const frameworks = document.querySelectorAll('.modal-scroll .four-r-framework');
    frameworks.forEach(fw => {
      // Check if this framework's modal is visible and cloned
      if (fw.offsetParent !== null && fw.children.length >= 8) {
        const currentScroll = fw.scrollLeft;
        
        // Calculate exact offsets
        const target2 = fw.children[2].offsetLeft - fw.children[0].offsetLeft;
        const target4 = fw.children[4].offsetLeft - fw.children[0].offsetLeft;
        
        if (currentScroll >= target4 - 10) {
          // Instantly jump back to start without animation
          fw.style.scrollBehavior = 'auto';
          fw.scrollLeft = 0;
          // Force layout reflow
          void fw.offsetWidth;
          // Slowly scroll to the next pair
          slowScrollTo(fw, target2, 1200);
        } else if (currentScroll >= target2 - 10) {
          slowScrollTo(fw, target4, 1200);
        } else {
          slowScrollTo(fw, target2, 1200);
        }
      }
    });
  }
}, 5000);

const particlesContainer = document.querySelector('.hero-particles');
if (particlesContainer) {
  const particleCount = 8;
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'hero-particle';
    const size = Math.random() * 10 + 4;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = Math.random() * 90 + '%';
    particle.style.top = Math.random() * 90 + '%';
    particle.style.animationDelay = Math.random() * 5 + 's';
    particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
    particlesContainer.appendChild(particle);
  }
}
