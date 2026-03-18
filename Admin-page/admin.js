// ===== admin.js =====

// ===== Count Up Animation =====
function countUp(el, target, duration = 2000) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      start = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(start).toLocaleString('ar-EG');
  }, 16);
}

// ===== تشغيل العداد لما الصفحة تفتح =====
window.addEventListener('load', () => {
  document.querySelectorAll('.stat-value[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target);
    countUp(el, target, 4000);
  });
});

// ===== Chart =====
const ctx = document.getElementById('salesChart').getContext('2d');
const chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو'],
    datasets: [{
      label: 'المبيعات (ج)',
      data: [0, 0, 0, 0, 0, 0, 0],
      borderColor: '#ff6200',
      backgroundColor: 'rgba(255, 98, 0, 0.1)',
      borderWidth: 3,
      pointBackgroundColor: '#ff6200',
      pointRadius: 5,
      fill: true,
      tension: 0.4
    }]
  },
  options: {
    responsive: true,
    animation: { duration: 3000, easing: 'easeInOutQuart' },
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: false, grid: { color: '#f3f4f6' } },
      x: { grid: { display: false } }
    }
  }
});

// ===== رسم الـ Chart بعد ثانية =====
setTimeout(() => {
  chart.data.datasets[0].data = [12000, 19000, 15000, 25000, 22000, 30000, 45200];
  chart.update();
}, 500);

// ===== Search =====
document.getElementById('searchInput').addEventListener('input', function() {
  const value = this.value.toLowerCase();
  document.querySelectorAll('#ordersTableBody tr').forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(value) ? '' : 'none';
  });
});

// ===== تغيير حالة الطلب =====
function changeStatus(btn) {
  const row = btn.closest('tr');
  const badge = row.querySelector('.badge');

  if (badge.classList.contains('pending')) {
    badge.classList.remove('pending');
    badge.classList.add('delivered');
    badge.textContent = 'تم التوصيل';
  } else if (badge.classList.contains('delivered')) {
    badge.classList.remove('delivered');
    badge.classList.add('cancelled');
    badge.textContent = 'ملغي';
  } else {
    badge.classList.remove('cancelled');
    badge.classList.add('pending');
    badge.textContent = 'قيد التنفيذ';
  }

  badge.style.animation = 'none';
  badge.offsetHeight;
  badge.style.animation = 'badgePop 0.3s ease';
  showNotification('✅ تم تغيير حالة الطلب');
}

// ===== حذف بأنيميشن =====
function deleteRow(btn) {
  const row = btn.closest('tr');
  row.classList.add('removing');
  setTimeout(() => {
    row.remove();
    showNotification('🗑️ تم حذف الطلب');
  }, 400);
}

// ===== Modal إضافة وصفة =====
document.getElementById('addRecipeBtn').addEventListener('click', () => {
  document.getElementById('addRecipeModal').classList.add('show');
});

document.getElementById('closeModal').addEventListener('click', closeModal);
document.getElementById('cancelModal').addEventListener('click', closeModal);

document.getElementById('addRecipeModal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('addRecipeModal')) closeModal();
});

function closeModal() {
  document.getElementById('addRecipeModal').classList.remove('show');
}

// ===== حفظ الوصفة الجديدة =====
document.getElementById('saveRecipeBtn').addEventListener('click', () => {
  const name     = document.getElementById('recipeName').value.trim();
  const image    = document.getElementById('recipeImage').value.trim();
  const price    = document.getElementById('recipePrice').value.trim();
  const time     = document.getElementById('recipeTime').value.trim();
  const category = document.getElementById('recipeCategory').value;
  const diff     = document.getElementById('recipeDifficulty').value;
  const desc     = document.getElementById('recipeDesc').value.trim();

  if (!name || !price) {
    showNotification('⚠️ من فضلك ادخل اسم الوصفة والسعر');
    return;
  }

  const tbody = document.getElementById('ordersTableBody');
  const newRow = document.createElement('tr');
  newRow.classList.add('adding');
  newRow.innerHTML = `
    <td>#ORD-NEW</td>
    <td>—</td>
    <td>${name}</td>
    <td>${price} ج</td>
    <td>${new Date().toISOString().split('T')[0]}</td>
    <td><span class="badge pending">قيد التنفيذ</span></td>
    <td class="actions-cell">
      <button class="action-btn status-btn" onclick="changeStatus(this)">تغيير الحالة</button>
      <button class="action-btn delete" onclick="deleteRow(this)">حذف</button>
    </td>
  `;
  tbody.insertBefore(newRow, tbody.firstChild);

  // تحديث عداد الوصفات
  const recipesCounter = document.querySelectorAll('.stat-value')[3];
  const current = parseInt(recipesCounter.textContent.replace(/[\u0660-\u0669,]/g, (c) =>
    c >= '\u0660' ? c.charCodeAt(0) - 0x0660 : '')) + 1;
  countUp(recipesCounter, current, 500);

  closeModal();
  showNotification(`🎉 تم إضافة وصفة "${name}" بنجاح!`);

  document.getElementById('recipeName').value = '';
  document.getElementById('recipeImage').value = '';
  document.getElementById('recipePrice').value = '';
  document.getElementById('recipeTime').value = '';
  document.getElementById('recipeDesc').value = '';
});

// ===== Notification =====
function showNotification(message) {
  const notif = document.getElementById('adminNotification');
  notif.textContent = message;
  notif.classList.add('show');
  setTimeout(() => notif.classList.remove('show'), 3000);
}