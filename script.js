// Always start at top — no scroll restoration, no hash
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);
if (window.location.hash) history.replaceState(null, null, ' ');
window.addEventListener('pageshow', function () { window.scrollTo(0, 0); });

// Content toggle — via checkbox selection (inline, no modals)
const seekersCheck = document.getElementById('seekersCheck');
const corporateCheck = document.getElementById('corporateCheck');
const corporateContent = document.getElementById('corporateContent');
const seekersContent = document.getElementById('seekersContent');
const seekersTestimonialsGrid = document.getElementById('seekersTestimonialsGrid');
const seekersModal = document.getElementById('seekersModal');
const corporateModal = document.getElementById('corporateModal');

if (corporateCheck) {
   corporateCheck.addEventListener('change', function () {
     if (this.checked) {
       seekersCheck.checked = false;
       if (seekersContent) seekersContent.style.display = 'none';
       if (corporateContent) {
         corporateContent.style.display = 'block';
         setTimeout(() => corporateContent.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
       }
     } else {
       if (corporateContent) corporateContent.style.display = 'none';
     }
   });
}

if (seekersCheck) {
   seekersCheck.addEventListener('change', function () {
     if (this.checked) {
       corporateCheck.checked = false;
       if (corporateContent) corporateContent.style.display = 'none';
       if (seekersContent) {
         seekersContent.style.display = 'block';
         loadSeekersTestimonials();
         setTimeout(() => seekersContent.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
       }
     } else {
       if (seekersContent) seekersContent.style.display = 'none';
     }
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
     
      let testimonialsHTML = '';
      videoIds.forEach((videoId, index) => {
        const videoUrl = `https://youtu.be/${videoId}`;
        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        
        testimonialsHTML += `
          <div class="testimonial-with-qr">
            <div class="testimonial-text">
              <p>Powerful testimonial from M.L. Suriya's teachings</p>
            </div>
            <div class="testimonial-qr">
              <a class="media-preview-link media-preview-link--founder" href="${videoUrl}" rel="noreferrer" aria-label="Open testimonial video">
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

        if ((index + 1) % 3 === 0 && index < videoIds.length - 1) {
          testimonialsHTML += createPaymentCard();
        }
      });
      
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
  if (corporateModal && e.target === corporateModal) {
    corporateModal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }

  if (seekersModal && e.target === seekersModal) {
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

// ═══════════════════════════════════════════════════════
// INLINE YOUTUBE EMBED — Replace thumbnail with player
// ═══════════════════════════════════════════════════════
(function initInlineVideo() {
  function extractYouTubeId(url) {
    const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/) ||
              url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
    return m ? m[1] : null;
  }

  function embedVideo(videoId, container) {
    container.style.cssText = 'display:block;padding:0;min-height:0;width:100%';
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'position:relative;width:100%;padding-bottom:56.25%;background:#000';
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    iframe.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;border:0';
    wrapper.appendChild(iframe);
    container.appendChild(wrapper);
  }

  // Directly disable navigation on ALL YouTube links inside video cards
  document.querySelectorAll('.video-card a[href*="youtube.com/watch"], .video-card a[href*="youtu.be/"], .video-card a[href*="youtube.com/shorts"]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const videoId = extractYouTubeId(href);
    if (!videoId) return;

    link.removeAttribute('href');
    link.removeAttribute('target');
    link.style.cursor = 'pointer';

    link.addEventListener('click', function (e) {
      e.preventDefault();
      const card = this.closest('.video-card');
      if (!card) return;
      const qr = card.querySelector('.video-qr');
      if (!qr || qr.dataset.videoEmbedded) return;
      qr.dataset.videoEmbedded = 'true';
      embedVideo(videoId, qr);
    });
  });
})();

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

// ═══════════════════════════════════════
// VIDEO MODAL HANDLING
// ═══════════════════════════════════════
(function initVideoModal() {
  const videoModal = document.getElementById('videoModal');
  const videoIframe = document.getElementById('videoModalIframe');
  const closeBtn = document.querySelector('.video-modal-close');

  if (!videoModal) return;

  function extractYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  function openVideoModal(e) {
    let target = e.currentTarget;
    if (!target) return;
    
    // Find the closest a tag if clicked inside
    if (target.tagName !== 'A') {
        target = target.closest('a');
    }

    if (!target || !target.href) return;
    
    // Check if it's a youtube link
    if (!target.href.includes('youtube.com') && !target.href.includes('youtu.be')) {
        return; // Not a youtube link, let default behavior happen
    }

    e.preventDefault();
    e.stopPropagation();

    const videoId = extractYouTubeId(target.href);
    if (videoId) {
      videoIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      videoModal.classList.add('show');
    } else {
        // Fallback: just open the link if we can't parse it
        window.open(target.href, '_blank');
    }
  }

  function closeVideoModal() {
    videoModal.classList.remove('show');
    // small delay to let transition finish before clearing src to prevent visual glitch
    setTimeout(() => {
      videoIframe.src = '';
    }, 300);
  }

  // Attach event listeners to all video links
  const videoLinks = document.querySelectorAll('.media-preview-link, .video-info a, .video-card a');
  videoLinks.forEach(link => {
    // Only attach to links that point to youtube
    if(link.href && (link.href.includes('youtube.com') || link.href.includes('youtu.be'))) {
        link.addEventListener('click', openVideoModal);
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeVideoModal);
  }

  // Close when clicking outside the modal content
  videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) {
      closeVideoModal();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal.classList.contains('show')) {
      closeVideoModal();
    }
  });
})();

// ── Inline YouTube video playback (plays on page, not in new tab) ──
document.addEventListener('click', function (e) {
  const thumb = e.target.closest('.video-inline-thumb');
  if (!thumb) return;
  const card = thumb.closest('.video-card--inline');
  if (!card || card.classList.contains('is-playing')) return;
  card.classList.add('is-playing');
  const videoId = card.dataset.videoId;
  if (!videoId) return;
  thumb.innerHTML =
    '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/' +
    videoId + '?autoplay=1&rel=0" frameborder="0" allowfullscreen allow="autoplay" ' +
    'style="position:absolute;top:0;left:0;width:100%;height:100%;border-radius:8px;"></iframe>';
});

// ── Counter animation (0→N when stats come into view) ──
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const numEl = el.querySelector('.stat-num');
  if (!numEl) return;
  const duration = 2000;
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    numEl.textContent = current;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function animateMultiplier(el) {
  const target = parseInt(el.dataset.target, 10);
  const numEl = el.querySelector('.stat-num');
  const fillEl = el.querySelector('.stat-multiplier-fill');
  if (!numEl) return;
  const duration = 2200;
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = (eased * target).toFixed(1);
    numEl.textContent = current;
    if (fillEl) fillEl.style.width = (eased * 100) + '%';
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const countObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      if (entry.target.classList.contains('stat--multiplier')) {
        animateMultiplier(entry.target);
      } else {
        animateCounter(entry.target);
      }
      countObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.stat--count, .stat--multiplier').forEach(function (el) {
  countObserver.observe(el);
});

// ═══════════════════════════════════════
// PAYMENT CARD INSERTION
// ═══════════════════════════════════════
function createPaymentCard() {
  return `
    <div class="video-card payment-card">
      <div class="video-qr">
        <img src="assets/qr/qr01.png" class="qr-image" alt="Support / Donation QR">
      </div>
      <div class="video-info">
        <h4 style="text-align:center;">Support the Mission</h4>
        <p class="video-duration" style="text-align:center; font-style:italic;">Donation / योगदान — Scan to contribute</p>
      </div>
    </div>
  `;
}

function insertPaymentCards() {
  const containers = document.querySelectorAll('.testimonials-grid, .videos-grid');
  containers.forEach(container => {
    if (container.id === 'seekersTestimonialsGrid') return;
    const videoCards = container.querySelectorAll(':scope > .video-card');
    if (videoCards.length === 0) return;
    let inserted = 0;
    videoCards.forEach((card, index) => {
      if ((index + 1) % 3 === 0 && index < videoCards.length - 1) {
        const paymentDiv = document.createElement('div');
        paymentDiv.innerHTML = createPaymentCard();
        const paymentCard = paymentDiv.firstElementChild;
        card.parentNode.insertBefore(paymentCard, card.nextSibling);
        inserted++;
      }
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', insertPaymentCards);
} else {
  insertPaymentCards();
}
