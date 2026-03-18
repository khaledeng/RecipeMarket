document.addEventListener('DOMContentLoaded', () => {
  loadFavorites();
  setupFilters();
  setupClearAll();
});

function getFavoriteIds() {
  const data = localStorage.getItem('favoriteRecipes');
  if (!data) return [];
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch(e) {
    return [];
  }
}

function saveFavoriteIds(ids) {
  localStorage.setItem('favoriteRecipes', JSON.stringify(ids));
}

// ===== تحديث العداد =====
function updateCounter(count) {
  const title = document.querySelector('.favorites-title');
  if (count > 0) {
    title.innerHTML = `الوصفات المفضلة <span class="counter-badge">${count}</span>`;
  } else {
    title.innerHTML = `الوصفات المفضلة`;
  }
}

// ===== Shimmer Loading =====
function showShimmer() {
  const grid = document.getElementById('recipesGrid');
  grid.innerHTML = Array(6).fill('').map(() => `
    <div class="shimmer-card">
      <div class="shimmer-img"></div>
      <div class="shimmer-line"></div>
      <div class="shimmer-line short"></div>
      <div class="shimmer-line shorter"></div>
    </div>
  `).join('');
}

async function loadFavorites(filter = 'all') {
  const grid = document.getElementById('recipesGrid');
  const emptyState = document.getElementById('emptyState');

  const ids = getFavoriteIds();

  if (ids.length === 0) {
    grid.innerHTML = '';
    emptyState.style.display = 'block';
    updateCounter(0);
    return;
  }

  // ===== اظهر shimmer =====
  showShimmer();
  emptyState.style.display = 'none';

  try {
    const response = await fetch('../data/recipes.json');
    const data = await response.json();
    let favorites = data.recipes.filter(r => ids.includes(r.id));

    updateCounter(favorites.length);

    if (filter !== 'all') {
      favorites = favorites.filter(r => r.category === filter);
    }

    if (favorites.length === 0) {
      grid.innerHTML = '<p style="text-align:center; color:#9CA3AF; padding:40px;">لا توجد وصفات في هذا التصنيف</p>';
      emptyState.style.display = 'none';
      return;
    }

    emptyState.style.display = 'none';

    // ===== فلتر أنيميشن =====
    grid.innerHTML = favorites.map((recipe, index) => renderCard(recipe, index)).join('');
    grid.classList.add('filter-transition');
    setTimeout(() => grid.classList.remove('filter-transition'), 300);

  } catch(e) {
    console.error(e);
    grid.innerHTML = '<p style="text-align:center; color:red; padding:40px;">حدث خطأ في تحميل البيانات</p>';
  }
}

function renderCard(recipe, index) {
  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);
  const difficulty = recipe.difficulty === 'easy' ? 'سهل' : recipe.difficulty === 'medium' ? 'متوسط' : 'صعب';
  const diffColor = recipe.difficulty === 'easy' ? '#22c55e' : recipe.difficulty === 'medium' ? '#f59e0b' : '#ef4444';

  return `
    <div class="recipe-card" style="animation-delay: ${index * 0.07}s" id="card-${recipe.id}">
      <div class="card-image-wrapper">
        <img src="${recipe.image}" alt="${recipe.name}" onerror="this.src='https://placehold.co/300x220'" />
        <button class="heart-btn" onclick="handleHeartClick(this, ${recipe.id})" title="إزالة من المفضلة">❤️</button>
        <div class="rating-badge">⭐ ${recipe.rating} (${recipe.reviews})</div>
        <div class="difficulty-badge" style="background:${diffColor}">${difficulty}</div>
      </div>
      <div class="card-body">
        <h3 class="card-name">${recipe.name}</h3>
        <p class="card-desc">${recipe.description ? recipe.description.substring(0, 60) + '...' : ''}</p>
        <div class="card-nutrients">
          <span>🔥 ${recipe.calories || 0} سعر</span>
          <span>💪 ${recipe.protein || 0}g بروتين</span>
          <span>🌾 ${recipe.carbs || 0}g كارب</span>
        </div>
        <div class="card-meta">
          <span class="card-price">${recipe.price} ج</span>
          <span class="card-time">⏱️ ${totalTime} دقيقة</span>
        </div>
        <button class="view-btn" onclick="goToDetails(${recipe.id})">عرض التفاصيل</button>
      </div>
    </div>
  `;
}

// ===== نبضة القلب قبل الإزالة =====
function handleHeartClick(btn, recipeId) {
  btn.classList.add('beating');
  setTimeout(() => {
    removeFavorite(recipeId);
  }, 500);
}

function removeFavorite(recipeId) {
  const card = document.getElementById(`card-${recipeId}`);
  if (card) {
    card.classList.add('removing');
    setTimeout(() => {
      let ids = getFavoriteIds();
      ids = ids.filter(id => id !== recipeId);
      saveFavoriteIds(ids);
      showNotification('❤️ تم إزالة الوصفة من المفضلة');
      const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
      loadFavorites(activeFilter);
    }, 400);
  }
}

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

function setupClearAll() {
  const clearBtn = document.getElementById('clearAllBtn');
  const modalOverlay = document.getElementById('modalOverlay');
  const confirmBtn = document.getElementById('confirmClearBtn');
  const cancelBtn = document.getElementById('cancelClearBtn');

  clearBtn.addEventListener('click', () => {
    const ids = getFavoriteIds();
    if (ids.length === 0) {
      showNotification('لا توجد وصفات مفضلة لمسحها');
      return;
    }
    modalOverlay.classList.add('show');
  });

  confirmBtn.addEventListener('click', () => {
    saveFavoriteIds([]);
    modalOverlay.classList.remove('show');
    showNotification('🗑️ تم مسح جميع الوصفات المفضلة');
    loadFavorites();
  });

  cancelBtn.addEventListener('click', () => {
    modalOverlay.classList.remove('show');
  });

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) modalOverlay.classList.remove('show');
  });
}

function goToDetails(id) {
  window.location.href = `../Recipe-details/details.html?id=${id}`;
}

function showNotification(message) {
  const notif = document.getElementById('notification');
  notif.textContent = message;
  notif.classList.add('show');
  setTimeout(() => notif.classList.remove('show'), 2500);
}