// navbar
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
//hero

const DATA_PATH = '../data/recipes.json';
const CAT_PATH  = '../data/categories.json';
let recipes = [], i = 0;

async function loadHero() {
  try {
    const { recipes: data } = await fetch(DATA_PATH).then(r => r.json());
    recipes = data.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    render(recipes[0]);
    setInterval(next, 5000);
  } catch {
    document.getElementById('heroSkeleton').innerHTML =
      `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:#1a1a1a;color:#aaa;font-family:Cairo,sans-serif">⚠️ تعذّر تحميل وصفة اليوم</div>`;
  }
}

//load categories
async function loadCategories() {
  try {
    const { recipes: allRecipes } = await fetch(DATA_PATH).then(r => r.json());
    const { categories }          = await fetch(CAT_PATH).then(r => r.json());
 
    // عدّ الوصفات لكل category
    const countMap = allRecipes.reduce((acc, r) => {
      acc[r.category] = (acc[r.category] || 0) + 1;
      return acc;
    }, {});
 
    const grid = document.getElementById('categoriesGrid');
    grid.innerHTML = categories.map(c => `
      <a class="cat-card" href="../recipes/recipes.html?category=${c.value}">
        <div class="cat-icon" style="background:${c.color}22">${c.icon}</div>
        <span class="cat-name">${c.name}</span>
        <span class="cat-count">${countMap[c.value] || 0} وصفة</span>
      </a>
    `).join('');
  } catch (err) {
    console.error('❌ فشل تحميل التصنيفات:', err);
  }
}

function next() {
  i = (i + 1) % recipes.length;
  const c = document.getElementById('heroContent');
  c.style.opacity = '0';
  setTimeout(() => { render(recipes[i]); c.style.opacity = '1'; }, 400);
}

function render(r) {
  const img = document.getElementById('heroImg');
  img.onload = () => {
    document.getElementById('heroSkeleton').style.display = 'none';
    document.getElementById('heroContent').style.opacity  = '1';
  };
  img.src = r.image;
  img.alt = r.name;
  document.getElementById('heroTitle').textContent    = r.name;
  document.getElementById('heroDesc').textContent     = r.description;
  document.getElementById('heroTime').textContent     = `${r.prepTime + r.cookTime} دقيقة`;
  document.getElementById('heroServings').textContent = `${r.servings} أشخاص`;
  document.getElementById('heroCalories').textContent = `${r.calories} سعرة`;
  document.getElementById('heroBtn').onclick = () =>
    location.href = `../recipe/recipe.html?id=${r.id}`;
}

loadHero();
loadCategories();
loadPopular();
 
async function loadPopular() {
  try {
    const { recipes: data } = await fetch(DATA_PATH).then(r => r.json());
    // أعلى 8 وصفات بالـ rating
    const top = data.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews).slice(0, 8);
    let page = 0;
    const perPage = 4;
 
    function render() {
      const slice = top.slice(page * perPage, page * perPage + perPage);
      document.getElementById('popularGrid').innerHTML = slice.map((r, idx) => `
        <div class="recipe-card">
          <div class="recipe-img-wrap">
            <img src="${r.image}" alt="${r.name}" loading="lazy"/>
            <button class="fav-btn" onclick="this.classList.toggle('active')">♥</button>
            ${idx === 3 ? '<span class="badge-popular">الأكثر مبيعاً</span>' : ''}
          </div>
          <div class="recipe-info">
            <div class="recipe-name">${r.name}</div>
            <div class="recipe-rating">★ ${r.rating} <span>(${r.reviews})</span></div>
          </div>
        </div>
      `).join('');
    }
 
    render();
    document.getElementById('prevBtn').onclick = () => { if (page > 0) { page--; render(); } };
    document.getElementById('nextBtn').onclick = () => { if ((page + 1) * perPage < top.length) { page++; render(); } };
  } catch(err) { console.error('❌ فشل تحميل الوصفات:', err); }
}
 
