// --- Product Editing, Deleting, and Order Deleting ---
async function loadEditProducts() {
  const res = await fetch('/api/products');
  const products = await res.json();
  const container = document.getElementById('edit-products');
  container.innerHTML = '';
  products.forEach(product => {
    const row = document.createElement('div');
    row.className = 'd-flex align-items-center mb-2 gap-2';
    row.innerHTML = `
      <input class="form-control form-control-sm w-auto" value="${product.name}" id="edit-name-${product.id}" />
      <input class="form-control form-control-sm w-auto" type="number" value="${product.price}" id="edit-price-${product.id}" />
      <button class="btn btn-sm btn-primary" onclick="editProduct('${product.id}')">Save</button>
      <button class="btn btn-sm btn-danger" onclick="deleteProduct('${product.id}')">Delete</button>
    `;
    container.appendChild(row);
  });
}

async function editProduct(id) {
  const name = document.getElementById(`edit-name-${id}`).value;
  const price = parseFloat(document.getElementById(`edit-price-${id}`).value);
  const res = await fetch('/api/admin/edit-product', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, name, price })
  });
  const data = await res.json();
  alert(data.success ? 'Product updated' : 'Failed to update');
  loadEditProducts();
}

async function deleteProduct(id) {
  if (!confirm('Delete this product?')) return;
  const res = await fetch('/api/admin/delete-product', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  });
  const data = await res.json();
  alert(data.success ? 'Product deleted' : 'Failed to delete');
  loadEditProducts();
}

async function deleteOrder(orderId) {
  if (!confirm('Delete this order?')) return;
  const res = await fetch(`/api/admin/delete-order?orderId=${orderId}`, {
    method: 'DELETE'
  });
  const data = await res.json();
  alert(data.success ? 'Order deleted' : 'Failed to delete order');
  loadOrders();
}
let loggedIn = false;

async function login() {
  const username = document.getElementById('user').value;
  const password = document.getElementById('pass').value;

  const res = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  if (data.success) {
    loggedIn = true;
    document.getElementById('adminPanel').style.display = 'block';
    loadOrders();
    loadEditProducts();
  } else {
    alert('Login failed');
  }
}

async function addProduct() {
  const name = document.getElementById('pname').value;
  const price = parseFloat(document.getElementById('pprice').value);

  const res = await fetch('/api/admin/add-product', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, price })
  });

  const data = await res.json();
  alert(data.success ? 'Product added' : 'Failed to add');
}

async function loadOrders() {
  const res = await fetch('/api/admin/orders');
  const orders = await res.json();
  const container = document.getElementById('orders');
  container.innerHTML = '';
  orders.forEach(order => {
    const div = document.createElement('div');
    div.className = 'd-flex align-items-center justify-content-between border rounded p-2 mb-2';
    div.innerHTML = `
      <span><b>Address:</b> ${order.address} | <b>Items:</b> ${order.items.map(i => i.name).join(', ')}</span>
      <button class="btn btn-sm btn-danger" onclick="deleteOrder('${order.id}')">Delete</button>
    `;
    container.appendChild(div);
  });
}
