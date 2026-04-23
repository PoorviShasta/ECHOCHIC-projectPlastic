const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
  if (!header) return;
  header.classList.toggle('scrolled', window.scrollY > 12);
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

const year = document.querySelector('[data-year]');
if (year) {
  year.textContent = new Date().getFullYear();
}

const SESSION_STORAGE_KEY = "echochic_session_v1";

function getActiveSession() {
  const localSession = localStorage.getItem(SESSION_STORAGE_KEY);
  const sessionSession = sessionStorage.getItem(SESSION_STORAGE_KEY);
  const raw = localSession || sessionSession;
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (_error) {
    return null;
  }
}

function clearActiveSession() {
  localStorage.removeItem(SESSION_STORAGE_KEY);
  sessionStorage.removeItem(SESSION_STORAGE_KEY);
}

function initAuthNavState() {
  const navLinksEl = document.getElementById('nav-links');
  if (!navLinksEl) return;

  const loginLink = navLinksEl.querySelector('a[href="login.html"]');
  const signupLink = navLinksEl.querySelector('a[href="signup.html"]');
  const navCta = document.querySelector('.nav-cta');
  const activeSession = getActiveSession();

  if (!activeSession) return;

  if (loginLink) {
    loginLink.textContent = 'Dashboard';
    loginLink.href = '#top';
  }

  if (signupLink) {
    signupLink.textContent = 'Logout';
    signupLink.href = '#';
    signupLink.setAttribute('data-auth-logout', 'true');
  }

  if (navCta) {
    const firstName = String(activeSession.name || '').split(' ')[0] || 'Member';
    navCta.textContent = `Hi, ${firstName}`;
    navCta.href = '#top';
  }

  navLinksEl.addEventListener('click', (event) => {
    const logoutLink = event.target.closest('[data-auth-logout="true"]');
    if (!logoutLink) return;

    event.preventDefault();
    clearActiveSession();
    window.location.reload();
  });
}

initAuthNavState();

function syncModalLock() {
  const hasVisibleModal = Boolean(document.querySelector('.success-modal:not([hidden])'));
  document.body.classList.toggle('modal-open', hasVisibleModal);
}

const mockCampaigns = [
  {
    id: 1,
    location: 'Downtown',
    title: 'Riverfront Plastic Recovery Drive',
    ngo: 'Green Streets NGO',
    time: 'Saturday, 9:00 AM',
    difficulty: 'Moderate'
  },
  {
    id: 2,
    location: 'Northside',
    title: 'School Block Weekend Cleanup',
    ngo: 'Youth Eco Collective',
    time: 'Sunday, 8:30 AM',
    difficulty: 'Beginner'
  },
  {
    id: 3,
    location: 'Lakeside',
    title: 'Lake Trail Waste Sorting Mission',
    ngo: 'Blue Planet Care',
    time: 'Friday, 4:00 PM',
    difficulty: 'Advanced'
  },
  {
    id: 4,
    location: 'Downtown',
    title: 'Market Area Recycle & Restore',
    ngo: 'City Youth Council',
    time: 'Wednesday, 5:30 PM',
    difficulty: 'Beginner'
  }
];

const campaignLocationInput = document.getElementById('campaign-location-input');
const searchCampaignBtn = document.getElementById('search-campaign-btn');
const campaignResults = document.getElementById('campaign-results');
const joinSuccessModal = document.getElementById('join-success-modal');
const closeJoinModal = document.getElementById('close-join-modal');

function renderCampaignCards(campaigns, locationQuery = '') {
  if (!campaignResults) return;

  if (!campaigns.length) {
    const queryText = locationQuery ? ` for "${locationQuery}"` : '';
    campaignResults.innerHTML = `<p class="campaign-empty">No campaigns found${queryText}. Try Downtown or Northside.</p>`;
    return;
  }

  campaignResults.innerHTML = campaigns
    .map(
      (campaign) => `
        <article class="campaign-card">
          <h3>${campaign.title}</h3>
          <p class="campaign-card-meta">
            <span><strong>Location:</strong> ${campaign.location}</span>
            <span><strong>NGO:</strong> ${campaign.ngo}</span>
            <span><strong>Time:</strong> ${campaign.time}</span>
            <span><strong>Difficulty:</strong> ${campaign.difficulty}</span>
          </p>
          <button class="btn primary join-team-btn" type="button" data-campaign-id="${campaign.id}">
            Join Team
          </button>
        </article>
      `
    )
    .join('');
}

if (campaignLocationInput && searchCampaignBtn && campaignResults) {
  searchCampaignBtn.addEventListener('click', () => {
    const locationQuery = campaignLocationInput.value.trim().toLowerCase();
    const filteredCampaigns = mockCampaigns.filter((campaign) =>
      campaign.location.toLowerCase().includes(locationQuery)
    );
    renderCampaignCards(filteredCampaigns, campaignLocationInput.value.trim());
  });

  campaignLocationInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      searchCampaignBtn.click();
    }
  });

  campaignResults.addEventListener('click', (event) => {
    const joinButton = event.target.closest('.join-team-btn');
    if (!joinButton) return;

    if (joinSuccessModal) {
      joinSuccessModal.hidden = false;
      syncModalLock();
    }
  });
}

if (joinSuccessModal && closeJoinModal) {
  closeJoinModal.addEventListener('click', () => {
    joinSuccessModal.hidden = true;
    syncModalLock();
  });

  joinSuccessModal.addEventListener('click', (event) => {
    if (event.target === joinSuccessModal) {
      joinSuccessModal.hidden = true;
      syncModalLock();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !joinSuccessModal.hidden) {
      joinSuccessModal.hidden = true;
      syncModalLock();
    }
  });
}

const productGrid = document.getElementById('product-grid');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const cartStatus = document.getElementById('cart-status');
const clearCartBtn = document.getElementById('clear-cart-btn');
const checkoutBtn = document.getElementById('checkout-btn');
const checkoutSuccessModal = document.getElementById('checkout-success-modal');
const closeCheckoutModal = document.getElementById('close-checkout-modal');
const checkoutSuccessText = document.getElementById('checkout-success-text');

const cart = new Map();

function formatCurrency(value) {
  return `$${value.toFixed(2)}`;
}

function setCartStatus(message) {
  if (!cartStatus) return;
  cartStatus.textContent = message;
}

function getProductFromCard(card) {
  return {
    id: card.dataset.productId,
    name: card.dataset.productName,
    price: Number(card.dataset.productPrice || 0)
  };
}

function addToCart(product, quantity = 1) {
  if (!product.id) return;

  const currentItem = cart.get(product.id);
  if (currentItem) {
    currentItem.quantity += quantity;
    cart.set(product.id, currentItem);
  } else {
    cart.set(product.id, { ...product, quantity });
  }
}

function updateCartItemQuantity(productId, delta) {
  const item = cart.get(productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    cart.delete(productId);
  } else {
    cart.set(productId, item);
  }
}

function renderCart() {
  if (!cartItemsContainer || !cartCount || !cartTotal) return;

  const cartEntries = Array.from(cart.values());
  const totalItems = cartEntries.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cartEntries.reduce((sum, item) => sum + item.price * item.quantity, 0);

  cartCount.textContent = String(totalItems);
  cartTotal.textContent = formatCurrency(totalAmount);

  if (cartEntries.length === 0) {
    cartItemsContainer.innerHTML = '<p class="cart-empty">No products added yet. Add an item to start shopping.</p>';
    return;
  }

  cartItemsContainer.innerHTML = cartEntries
    .map(
      (item) => `
        <article class="cart-item">
          <div class="cart-item-top">
            <p class="cart-item-title">${item.name}</p>
            <p class="cart-item-subtotal">${formatCurrency(item.price * item.quantity)}</p>
          </div>
          <div class="cart-controls">
            <button class="qty-btn" type="button" data-cart-action="decrease" data-product-id="${item.id}">-</button>
            <span class="qty-value">${item.quantity}</span>
            <button class="qty-btn" type="button" data-cart-action="increase" data-product-id="${item.id}">+</button>
            <button class="remove-item-btn" type="button" data-cart-action="remove" data-product-id="${item.id}">Remove</button>
          </div>
        </article>
      `
    )
    .join('');
}

function openCheckoutModal(message) {
  if (!checkoutSuccessModal) return;
  if (checkoutSuccessText) {
    checkoutSuccessText.textContent = message;
  }
  checkoutSuccessModal.hidden = false;
  syncModalLock();
}

if (productGrid && cartItemsContainer) {
  productGrid.addEventListener('click', (event) => {
    const addButton = event.target.closest('.add-to-cart-btn');
    const buyNowButton = event.target.closest('.buy-now-btn');
    if (!addButton && !buyNowButton) return;

    const productCard = event.target.closest('.product-card');
    if (!productCard) return;
    const product = getProductFromCard(productCard);

    addToCart(product, 1);
    renderCart();

    if (addButton) {
      setCartStatus(`${product.name} added to cart.`);
      return;
    }

    setCartStatus(`${product.name} added. Processing your order...`);
    openCheckoutModal(`You ordered ${product.name} for ${formatCurrency(product.price)}. Our team will confirm delivery details soon.`);
  });

  cartItemsContainer.addEventListener('click', (event) => {
    const actionButton = event.target.closest('[data-cart-action]');
    if (!actionButton) return;

    const action = actionButton.dataset.cartAction;
    const productId = actionButton.dataset.productId;
    if (!action || !productId) return;

    if (action === 'increase') {
      updateCartItemQuantity(productId, 1);
    } else if (action === 'decrease') {
      updateCartItemQuantity(productId, -1);
    } else if (action === 'remove') {
      cart.delete(productId);
    }

    renderCart();
  });

  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
      cart.clear();
      renderCart();
      setCartStatus('Cart cleared.');
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      const cartEntries = Array.from(cart.values());
      if (cartEntries.length === 0) {
        setCartStatus('Your cart is empty. Add a product first.');
        return;
      }

      const totalItems = cartEntries.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = cartEntries.reduce((sum, item) => sum + item.price * item.quantity, 0);

      openCheckoutModal(
        `You placed an order for ${totalItems} item(s), total ${formatCurrency(totalAmount)}. Thank you for supporting eco-products.`
      );
      setCartStatus('Order placed successfully.');
      cart.clear();
      renderCart();
    });
  }

  renderCart();
}

if (checkoutSuccessModal && closeCheckoutModal) {
  closeCheckoutModal.addEventListener('click', () => {
    checkoutSuccessModal.hidden = true;
    syncModalLock();
  });

  checkoutSuccessModal.addEventListener('click', (event) => {
    if (event.target === checkoutSuccessModal) {
      checkoutSuccessModal.hidden = true;
      syncModalLock();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !checkoutSuccessModal.hidden) {
      checkoutSuccessModal.hidden = true;
      syncModalLock();
    }
  });
}
