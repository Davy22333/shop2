
// --- Ratings Logic ---
const starsDiv = document.getElementById('rating-stars');
const submitRatingBtn = document.getElementById('submitRating');
let selectedStars = 0;

function renderStars(selected = 0) {
  starsDiv.innerHTML = '';
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement('span');
    star.className = 'fs-1';
    star.style.cursor = 'pointer';
    star.innerHTML = i <= selected ? '★' : '☆';
    star.style.color = i <= selected ? '#ffc107' : '#ccc';
    star.onclick = () => {
      selectedStars = i;
      renderStars(i);
      submitRatingBtn.disabled = false;
    };
    starsDiv.appendChild(star);
  }
}

renderStars();

if (submitRatingBtn) {
  submitRatingBtn.onclick = async () => {
    if (selectedStars < 1 || selectedStars > 5) return;
    submitRatingBtn.disabled = true;
    await fetch('/api/ratings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stars: selectedStars })
    });
    selectedStars = 0;
    renderStars();
    loadRatings();
  };
}

async function loadRatings() {
  const res = await fetch('/api/ratings');
  const data = await res.json();
  drawRatingsChart(data);
}

function drawRatingsChart(data) {
  const ctx = document.getElementById('ratingsChart').getContext('2d');
  if (window.ratingsChartInstance) window.ratingsChartInstance.destroy();
  window.ratingsChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['1★', '2★', '3★', '4★', '5★'],
      datasets: [{
        label: 'Number of Ratings',
        data: [data[1]||0, data[2]||0, data[3]||0, data[4]||0, data[5]||0],
        backgroundColor: [
          '#dc3545', '#fd7e14', '#ffc107', '#0d6efd', '#198754'
        ]
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true, precision: 0 }
      }
    }
  });
}

if (document.getElementById('ratingsChart')) {
  loadRatings();
}
let cart = [];

async function loadProducts() {
  const res = await fetch('/api/products');
  const products = await res.json();
  const container = document.getElementById('products');
  container.innerHTML = '';
  products.forEach(p => {
    const item = document.createElement('div');
    item.innerHTML = `${p.name} - $${p.price} <button onclick='addToCart(${JSON.stringify(p)})'>Add</button>`;
    container.appendChild(item);
  });
}

function addToCart(product) {
  cart.push(product);
  updateCart();
}

function updateCart() {
  const cartDiv = document.getElementById('cart');
  cartDiv.innerHTML = '';
  cart.forEach(p => {
    const item = document.createElement('div');
    item.textContent = p.name + ' - $' + p.price;
    cartDiv.appendChild(item);
  });
}

function checkout() {
  document.getElementById('addressForm').style.display = 'block';
}

async function submitOrder() {
  const address = document.getElementById('address').value;
  const res = await fetch('/api/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address, items: cart })
  });
  const data = await res.json();
  if (data.success) alert('Order placed!');
}

loadProducts();
