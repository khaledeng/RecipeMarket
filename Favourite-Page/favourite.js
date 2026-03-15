var nav = document.querySelector('nav');
document.addEventListener('scroll', function () {
    if (window.scrollY > 10) {
        nav.classList.add('scrolled-bg');
        nav.style.backgroundColor = "rgba(255, 255, 255, 0.7)"

    }
    else {
        nav.classList.remove('scrolled-bg');
        nav.style.backgroundColor = "#F8F6F6"
    }
})

 
// ===== favourite.js =====

document.addEventListener('DOMContentLoaded', () => {
  loadFavorites();
  setupFilters();
  setupClearAll();
});

// ===== جيب المفضلة من localStorage =====
function getFavorites() {
  const data = localStorage.getItem('favorites');
  if (!data) return [];
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch(e) {
    return [];
  }
}
// ===== احفظ المفضلة في localStorage =====
function saveFavorites(favorites) {
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

// ===== تحميل وعرض المفضلة =====
function loadFavorites(filter = 'all') {
  const grid = document.getElementById('recipesGrid');
  const emptyState = document.getElementById('emptyState');

  let favorites = getFavorites();

  if (favorites.length === 0) {
    grid.innerHTML = '';
    emptyState.style.display = 'block';
    return;
  }

  if (filter !== 'all') {
    favorites = favorites.filter(r => r.category === filter);
  }

  if (favorites.length === 0) {
    grid.innerHTML = '<p style="text-align:center; color:#9CA3AF; padding:40px;">لا توجد وصفات في هذا التصنيف</p>';
    emptyState.style.display = 'none';
    return;
  }

  emptyState.style.display = 'none';
  grid.innerHTML = favorites.map((recipe, index) => renderCard(recipe, index)).join('');
}

// ===== رسم كارد =====
function renderCard(recipe, index) {
  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);
  return `
    <div class="recipe-card" style="animation-delay: ${index * 0.07}s">
      <div class="card-image-wrapper">
        <img src="${recipe.image}" alt="${recipe.name}" onerror="this.src='https://via.placeholder.com/300x220'" />
        <button class="heart-btn" onclick="removeFavorite(${recipe.id})">❤️</button>
        <div class="rating-badge">⭐ ${recipe.rating} (${recipe.reviews})</div>
      </div>
      <div class="card-body">
        <h3 class="card-name">${recipe.name}</h3>
        <div class="card-meta">
          <span class="card-price">${recipe.price} ج</span>
          <span class="card-time">⏱️ ${totalTime} دقيقة</span>
        </div>
        <button class="view-btn" onclick="goToDetails(${recipe.id})">عرض التفاصيل</button>
      </div>
    </div>
  `;
}

// ===== إزالة وصفة =====
function removeFavorite(recipeId) {
  let favorites = getFavorites();
  favorites = favorites.filter(r => r.id !== recipeId);
  saveFavorites(favorites);
  showNotification('تم إزالة الوصفة من المفضلة');
  const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
  loadFavorites(activeFilter);
}

// ===== الفلاتر =====
function setupFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      loadFavorites(btn.dataset.filter);
    });
  });
}

// ===== مسح الكل =====
function setupClearAll() {
  const clearBtn = document.getElementById('clearAllBtn');
  const modalOverlay = document.getElementById('modalOverlay');
  const confirmBtn = document.getElementById('confirmClearBtn');
  const cancelBtn = document.getElementById('cancelClearBtn');

  clearBtn.addEventListener('click', () => {
    const favorites = getFavorites();
    if (favorites.length === 0) {
      showNotification('لا توجد وصفات مفضلة لمسحها');
      return;
    }
    modalOverlay.classList.add('show');
  });

  confirmBtn.addEventListener('click', () => {
    saveFavorites([]);
    modalOverlay.classList.remove('show');
    showNotification('تم مسح جميع الوصفات المفضلة');
    loadFavorites();
  });

  cancelBtn.addEventListener('click', () => {
    modalOverlay.classList.remove('show');
  });

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) modalOverlay.classList.remove('show');
  });
}

// ===== الانتقال لصفحة التفاصيل =====
function goToDetails(id) {
  window.location.href = `../Recipe-details/details.html?id=${id}`;
}

// ===== نوتيفيكيشن =====
function showNotification(message) {
  const notif = document.getElementById('notification');
  notif.textContent = message;
  notif.classList.add('show');
  setTimeout(() => notif.classList.remove('show'), 2500);
}