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
        loadSeekersTestimonials(); // Enable dynamic loading to use static content in index.html as fallback
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
          <div class="video-card video-card--inline" data-video-id="${videoId}">
            <div class="video-qr">
              <div class="video-inline-thumb" role="button" tabindex="0" aria-label="Play testimonial video">
                <span class="media-preview">
                  <div class="media-preview__portrait media-preview__portrait--img">
                    <img src="${thumbnailUrl}" alt="Testimonial">
                    <div class="video-inline-play">
                      <svg viewBox="0 0 24 24" width="22" height="22">
                        <circle cx="12" cy="12" r="11" fill="rgba(0,0,0,0.7)" />
                        <polygon points="10,7 17,12 10,17" fill="white" />
                      </svg>
                    </div>
                  </div>
                  <span class="media-preview__copy">
                    <span class="media-preview__eyebrow">Watch story</span>
                    <span class="media-preview__title">Seeker Transformation</span>
                    <span class="media-preview__meta">Spiritual journey</span>
                  </span>
                  <span class="media-preview__cta">Play</span>
                </span>
              </div>
            </div>
            <div class="video-info">
              <h4>Powerful testimonial from M.L. Suriya's teachings</h4>
              <p class="video-duration">Click to play — inline</p>
            </div>
          </div>
        `;

      if ((index + 1) % 3 === 0) {
        testimonialsHTML += createProgramsSummaryCard();
        testimonialsHTML += createPaymentCard();
      }
    });

    // Ensure there's at least one set of info blocks at the end if the total count wasn't a multiple of 3
    if (videoIds.length % 3 !== 0) {
      testimonialsHTML += createProgramsSummaryCard();
      testimonialsHTML += createPaymentCard();
    }

    seekersTestimonialsGrid.innerHTML = testimonialsHTML;

    // Initialize inline players for the newly loaded videos
    initInlineVideo();
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

const revealObserver = new IntersectionObserver(function (entries) {
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

window.addEventListener('scroll', function () {
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
function initInlineVideo() {
  function extractYouTubeId(url) {
    if (!url) return null;
    const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return m ? m[1] : null;
  }

  function embedVideo(videoId, container, autoplay = false) {
    container.style.cssText = 'display:block;padding:0;min-height:0;width:100%';
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'position:relative;width:100%;padding-bottom:56.25%;background:#000;border-radius:8px;overflow:hidden;';
    const iframe = document.createElement('iframe');
    const autoplayParam = autoplay ? '1' : '0';
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=${autoplayParam}&rel=0`;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    iframe.loading = 'lazy'; // Important for performance
    iframe.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;border:0';
    wrapper.appendChild(iframe);
    container.innerHTML = '';
    container.appendChild(wrapper);
  }

  // 1. Convert all inline cards immediately
  document.querySelectorAll('.video-card--inline:not([data-inline-init])').forEach(card => {
    const videoId = card.dataset.videoId;
    const qr = card.querySelector('.video-qr');
    if (videoId && qr) {
      embedVideo(videoId, qr, false);
      card.dataset.inlineInit = 'true';
    }
  });

  // 2. Convert standard cards immediately
  document.querySelectorAll('.video-card:not(.video-card--inline):not([data-inline-init])').forEach(card => {
    const link = card.querySelector('a[href*="youtube.com"], a[href*="youtu.be"]');
    if (!link) return;

    const href = link.getAttribute('href');
    const videoId = extractYouTubeId(href);
    if (!videoId) return;

    const qr = card.querySelector('.video-qr');
    if (qr) {
      embedVideo(videoId, qr, false);
      card.dataset.inlineInit = 'true';
      card.classList.add('video-card--inline');
    }
  });
}

// Initial call
initInlineVideo();

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
    if (link.href && (link.href.includes('youtube.com') || link.href.includes('youtu.be'))) {
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
// PROGRAM LEVELS & PAYMENT CARD INSERTION
// ═══════════════════════════════════════
function createProgramsSummaryCard() {
  return `
    <div class="program-card join-trigger" style="cursor: pointer;">
      <div class="program-level">1</div>
      <h3 class="program-title">RISHI <span class="devanagari">ऋषि</span></h3>
      <p class="program-duration">2 HOURS — 1 DAY</p>
      <p>Entry-level mastery to understand the 4-R framework.</p>
    </div>
    <div class="program-card join-trigger" style="cursor: pointer;">
      <div class="program-level">2</div>
      <h3 class="program-title">MUNI <span class="devanagari">मुनि</span></h3>
      <p class="program-duration">6 DAYS — EACH DAY 2 HOURS</p>
      <p>Intermediate mastery with practical application.</p>
    </div>
    <div class="program-card featured join-trigger" style="cursor: pointer;">
      <div class="program-level">3</div>
      <h3 class="program-title">YOGI <span class="devanagari">योगी</span></h3>
      <p class="program-duration">LIFETIME — EACH DAY 1 HOUR</p>
      <p>Advanced mastery for continuous growth and support.</p>
      <div class="featured-badge">Most Popular</div>
    </div>
  `;
}

function createPaymentCard() {
  return `
    <div class="program-card payment-card join-trigger" style="cursor: pointer; border-left: 4px solid #4a1f94;">
      <div class="program-level">✓</div>
      <h3 class="program-title">PAYMENT & REGISTRATION</h3>
      <p class="program-duration">ENTRY मास्टरक्लास</p>
      <p>Secure your spot and begin your transformation journey today.</p>
      <div class="featured-badge" style="background: #4a1f94;">Register Now</div>
    </div>
  `;
}


function insertPaymentCards() {
  const containers = document.querySelectorAll('.testimonials-grid, .videos-grid');
  containers.forEach(container => {
    if (container.closest('#about')) return;
    const videoCards = container.querySelectorAll(':scope > .video-card');
    if (videoCards.length === 0) return;

    videoCards.forEach((card, index) => {
      if ((index + 1) % 3 === 0) {
        // Programs Summary Card(s) - Rishi, Muni, Yogi
        const programsDiv = document.createElement('div');
        programsDiv.innerHTML = createProgramsSummaryCard();

        // Insert all program cards before the payment card
        let lastInserted = card;
        while (programsDiv.firstElementChild) {
          const pCard = programsDiv.firstElementChild;
          card.parentNode.insertBefore(pCard, lastInserted.nextSibling);
          lastInserted = pCard;
        }

        // Payment Card
        const paymentDiv = document.createElement('div');
        paymentDiv.innerHTML = createPaymentCard();
        const paymentCard = paymentDiv.firstElementChild;
        card.parentNode.insertBefore(paymentCard, lastInserted.nextSibling);
      }
    });

    // Also add at the very end if not already covered
    if (videoCards.length % 3 !== 0) {
      const programsDiv = document.createElement('div');
      programsDiv.innerHTML = createProgramsSummaryCard();
      while (programsDiv.firstElementChild) {
        container.appendChild(programsDiv.firstElementChild);
      }

      const paymentDiv = document.createElement('div');
      paymentDiv.innerHTML = createPaymentCard();
      container.appendChild(paymentDiv.firstElementChild);
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    insertPaymentCards();
    initJoinModal();
  });
} else {
  insertPaymentCards();
  initJoinModal();
}

function initJoinModal() {
  const joinModal = document.getElementById('joinModal');
  const closeJoinModalBtn = document.getElementById('closeJoinModal');
  const googleFormIframe = document.getElementById('googleFormIframe');
  const embedUrl = "https://docs.google.com/forms/d/e/1FAIpQLSc8dlMIY4RK6BQxrM5Epsd3wjuUIC4Z6afR2WWdDwWAtEgkKw/viewform?embedded=true";

  function openModal() {
    if (joinModal) {
      joinModal.style.display = 'block';
      if (googleFormIframe && googleFormIframe.src === 'about:blank') {
        googleFormIframe.src = embedUrl;
      }
    }
  }

  // Listen for clicks on ANY element with .join-trigger or id openJoinModal
  document.addEventListener('click', (e) => {
    if (e.target.closest('.join-trigger') || e.target.id === 'openJoinModal') {
      e.preventDefault();
      openModal();
    }
  });

  if (closeJoinModalBtn) {
    closeJoinModalBtn.addEventListener('click', () => {
      joinModal.style.display = 'none';
    });
  }

  window.addEventListener('click', (event) => {
    if (event.target === joinModal) {
      joinModal.style.display = 'none';
    }
  });
}
