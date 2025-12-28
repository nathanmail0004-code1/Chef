/* main.js — UI interactions for the Harvest + Hearth frontend
 * Responsibilities:
 * - Mobile menu toggle
 * - Modal open/close (Booking + Checkout)
 * - Basic form validation for booking and fake checkout
 * - Newsletter submission (frontend-only)
 * - Smooth scrolling for anchor links
 * - Accessible keyboard behavior (Escape to close)
 *
 * The code is modular and commented for beginners. No frameworks used.
 */

// Helper: select single or multiple
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// Load HTML includes (vanilla JS includes)
async function loadIncludes() {
  const includes = $$('[data-include]');
  await Promise.all(includes.map(async (el) => {
    const url = el.getAttribute('data-include');
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to load: ${url}`);
      const html = await res.text();
      el.innerHTML = html;
    } catch (err) {
      console.error(err);
    }
  }));
}

// Initialize UI interactions (called after includes load)
function initUI() {
  /* ---------------- Mobile menu ---------------- */
  const mobileMenuBtn = $('#mobileMenuBtn');
  const mobileMenu = $('#mobileMenu');

  function toggleMobileMenu() {
    if (!mobileMenu || !mobileMenuBtn) return;
    const isOpen = !mobileMenu.classList.contains('hidden');
    mobileMenu.classList.toggle('hidden');
    mobileMenuBtn.setAttribute('aria-expanded', String(!isOpen));
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  // Close mobile menu when clicking a link (improves UX)
  $$('#mobileMenu a').forEach(a => a.addEventListener('click', () => {
    if (mobileMenu) mobileMenu.classList.add('hidden');
    if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'false');
  }));

  /* ---------------- Modals (Booking + Checkout) ---------------- */
  function openModal(modal) {
    if (!modal) return;
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]');
    if (focusable) focusable.focus();
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
  }

  const bookingModal = $('#bookingModal');
  const checkoutModal = $('#checkoutModal');

  // Open booking modal from multiple buttons
  $$('.book-btn').forEach(btn => btn.addEventListener('click', () => openModal(bookingModal)));
  const heroBookBtn = $('#heroBookBtn');
  if (heroBookBtn) heroBookBtn.addEventListener('click', () => openModal(bookingModal));
  const bookNowTop = $('#bookNowTop');
  if (bookNowTop) bookNowTop.addEventListener('click', () => openModal(bookingModal));
  const bookNowTopMobile = $('#bookNowTopMobile');
  if (bookNowTopMobile) bookNowTopMobile.addEventListener('click', () => openModal(bookingModal));

  // Open checkout modal for 'Buy Now' buttons
  $$('.buy-btn').forEach(btn => btn.addEventListener('click', (e) => {
    // Read product info from data attributes (or fall back to nearby title/price)
    const productName = btn.getAttribute('data-product-name') || btn.closest('.product')?.querySelector('h3')?.innerText || 'Product';
    const productPrice = btn.getAttribute('data-product-price') || btn.closest('.product')?.querySelector('span')?.innerText?.replace(/[^0-9.]/g, '') || '';

    // Populate checkout modal fields and summary
    const titleEl = $('#checkoutProductTitle');
    const priceEl = $('#checkoutProductPrice');
    const inputName = $('#checkoutProductInput');
    const inputAmount = $('#checkoutAmountInput');
    if (titleEl) titleEl.textContent = productName;
    if (priceEl) priceEl.textContent = productPrice ? `$${productPrice}` : '—';
    if (inputName) inputName.value = productName;
    if (inputAmount) inputAmount.value = productPrice;

    openModal(checkoutModal);
  }));

  // Close modal buttons
  $$('.modal-close').forEach(btn => btn.addEventListener('click', (e) => {
    const modal = e.target.closest('[role="dialog"]');
    if (modal) closeModal(modal);
  }));

  // Close modals when clicking outside the modal content
  [bookingModal, checkoutModal].forEach(modal => {
    if (!modal) return;
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });
  });

  // Escape key to close modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      [bookingModal, checkoutModal].forEach(m => { if (m && !m.classList.contains('hidden')) closeModal(m); });
    }
  });

  /* ---------------- Form validation & submit handlers ---------------- */
  function showFeedback(el, message, isError = true) {
    if (!el) return;
    el.textContent = message;
    el.classList.remove('hidden');
    // Apply color depending on success / error
    el.classList.remove('text-red-500', 'text-green-600');
    el.classList.add(isError ? 'text-red-500' : 'text-green-600');
    // Auto-hide success messages after 5s; keep errors visible a bit longer
    setTimeout(() => el.classList.add('hidden'), isError ? 6000 : 4000);
  }

  const bookingForm = $('#bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const form = e.target;
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const date = form.date.value;

      const feedback = $('#bookingFeedback');
      if (!name || !email || !date) {
        showFeedback(feedback, 'Please complete required fields.');
        return;
      }
      if (!/\S+@\S+\.\S+/.test(email)) {
        showFeedback(feedback, 'Enter a valid email address.');
        return;
      }

      closeModal(bookingModal);
      alert('Thank you! Your booking request has been submitted (demo).');
      form.reset();
    });
  }

  const checkoutForm = $('#checkoutForm');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = checkoutForm.checkoutName.value.trim();
      const email = checkoutForm.checkoutEmail.value.trim();
      const feedback = $('#checkoutFeedback');
      if (!name || !email) {
        showFeedback(feedback, 'Please complete required fields.');
        return;
      }
      if (!/\S+@\S+\.\S+/.test(email)) {
        showFeedback(feedback, 'Enter a valid email address.');
        return;
      }
      closeModal(checkoutModal);
      alert('Order placed (demo). Thank you!');
      checkoutForm.reset();
    });
  }

  const newsletterForm = $('#newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = $('#newsletterEmail').value.trim();
      if (!/\S+@\S+\.\S+/.test(email)) {
        alert('Please enter a valid email.');
        return;
      }
      alert('Thanks for subscribing! (demo)');
      newsletterForm.reset();
    });
  }

  // Contact form (simple front-end validation)
  const contactForm = $('#contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const feedback = $('#contactFeedback');

      // Collect values and basic validation
      const formData = new FormData(contactForm);
      const name = (formData.get('name') || '').toString().trim();
      const email = (formData.get('email') || '').toString().trim();
      const message = (formData.get('message') || '').toString().trim();
      const honey = (formData.get('_honey') || '').toString().trim();

      if (honey) {
        // Bot detected; silently fail
        showFeedback(feedback, 'Submission blocked.', true);
        return;
      }
      if (!name || !email || !message) {
        showFeedback(feedback, 'Please complete required fields.');
        return;
      }
      if (!/\S+@\S+\.\S+/.test(email)) {
        showFeedback(feedback, 'Enter a valid email address.');
        return;
      }

      // Send via FormSubmit AJAX endpoint. Replace the email with the one you gave.
      const endpoint = 'https://formsubmit.co/ajax/nathanmail0004@gmail.com';
      try {
        const res = await fetch(endpoint, { method: 'POST', body: formData });
        const json = await res.json();
        if (res.ok && json.success) {
          showFeedback(feedback, 'Thanks — your message has been sent.', false);
          contactForm.reset();
        } else {
          const msg = json.message || 'Submission failed — please try again later.';
          showFeedback(feedback, msg);
        }
      } catch (err) {
        console.error('Contact submission error', err);
        showFeedback(feedback, 'Network error — please try again later.');
      }
    });
  }

  /* ---------------- Smooth scrolling ---------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href.length === 1) return; // skip '#'
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ---------------- Image load error handling ---------------- */
  // Replace broken product images with a neutral inline SVG placeholder and log the URL for debugging
  const placeholderSVG = 'assets/placeholder.svg';
  $$('.product img').forEach(img => {
    img.addEventListener('error', () => {
      console.warn('Image failed to load, replacing with placeholder:', img.src);
      if (img.src !== placeholderSVG) img.src = placeholderSVG;
    });
  });
}
/* End of main.js */
// On DOM ready, load includes then initialize UI
document.addEventListener('DOMContentLoaded', async () => {
  await loadIncludes();
  // short delay to ensure includes are parsed
  initUI();
});

/* End of main.js */
