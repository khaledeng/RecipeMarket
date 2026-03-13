// navbar
var nav = document.querySelector("nav");
document.addEventListener("scroll", function () {
  if (window.scrollY > 10) {
    nav.classList.add("scrolled-bg");
    nav.style.backgroundColor = "rgba(255, 255, 255, 0.7)";
  } else {
    nav.classList.remove("scrolled-bg");
    nav.style.backgroundColor = "#F8F6F6";
  }
});
//hero

const DATA_PATH = "../data/recipes.json";

let recipes = [];
let index = 0;

async function loadHero() {
  const res = await fetch(DATA_PATH);
  const data = await res.json();

  recipes = data.recipes;

  showRecipe(recipes[index]);

  setInterval(nextRecipe, 5000); // كل 5 ثواني
}

function showRecipe(r) {
  document.getElementById("heroImg").src = r.image;
  document.getElementById("heroTitle").textContent = r.name;
  document.getElementById("heroDesc").textContent = r.description;

  document.getElementById("heroTime").textContent =
    r.prepTime + r.cookTime + " دقيقة";

  document.getElementById("heroServings").textContent = r.servings + " أشخاص";

  document.getElementById("heroCalories").textContent = r.calories + " سعرة";
}

function nextRecipe() {
  index++;

  if (index >= recipes.length) {
    index = 0;
  }

  showRecipe(recipes[index]);
}
loadHero();

//load categories
async function loadCategories() {
  let res = await fetch("../data/categories.json");
  let data = await res.json();

  let grid = document.getElementById("categoriesGrid");

  data.categories.forEach((c) => {
    grid.innerHTML += `
<div class="cat">
<div>${c.icon}</div>
<p>${c.name}</p>
</div>
`;
  });
}

loadCategories();

function next() {
  i = (i + 1) % recipes.length;
  const c = document.getElementById("heroContent");
  c.style.opacity = "0";
  setTimeout(() => {
    render(recipes[i]);
    c.style.opacity = "1";
  }, 400);
}

function render(r) {
  const img = document.getElementById("heroImg");
  img.onload = () => {
    document.getElementById("heroSkeleton").style.display = "none";
    document.getElementById("heroContent").style.opacity = "1";
  };
  img.src = r.image;
  img.alt = r.name;
  document.getElementById("heroTitle").textContent = r.name;
  document.getElementById("heroDesc").textContent = r.description;
  document.getElementById("heroTime").textContent =
    `${r.prepTime + r.cookTime} دقيقة`;
  document.getElementById("heroServings").textContent = `${r.servings} أشخاص`;
  document.getElementById("heroCalories").textContent = `${r.calories} سعرة`;
  document.getElementById("heroBtn").onclick = () =>
    (location.href = `../recipe/recipe.html?id=${r.id}`);
}

async function loadPopular() {
  let res = await fetch("../data/recipes.json");
  let data = await res.json();

  let grid = document.getElementById("popularGrid");

  data.recipes.slice(0, 4).forEach((r) => {
    grid.innerHTML += `
        <div class="card">
        <img src="${r.image}">
        <div class="card-body">
        <h4>${r.name}</h4>
        <p>⭐ ${r.rating}</p>
        </div>
        </div>
        `;
  });
}
loadPopular();
