var detailsRow = document.getElementById("detailsRow");
var nav = document.querySelector('nav');
var selectedIngredients = [];

var categoryMap = {
    "breakfast": "الفطار",
    "lunch": "الغداء",
    "dinner": "العشاء",
    "dessert": "الحلويات",
    "drinks": "المشروبات",
    "salads": "السلطات",
    "soups": "الحساء",
    "meats": "اللحوم"
};
var unitMap = {
    "g": "جرام",
    "kg": "كيلو",
    "ml": "مل",
    "l": "لتر",
    "tsp": "ملعقة صغيرة",
    "tbsp": "ملعقة كبيرة",
    "cup": "كوب",
    "حبة": "حبة"
};
var params = new URLSearchParams(window.location.search);
var id = params.get('id');

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


var xhr = new XMLHttpRequest();
xhr.open('Get', `https://raw.githubusercontent.com/khaledeng/RecipeMarket/refs/heads/main/data/recipes.json`);
xhr.send();
xhr.responseType = "json";
xhr.onload = function () {
    var recipes = xhr.response.recipes;
    var recipe = recipes.find(r => r.id == id);
    displayRecipeDetails(recipe);
}


function calcTotal() {
    var total = selectedIngredients.filter(ing => ing.selected)
        .reduce((sum, ing) => sum + ing.price, 0);
    document.querySelector('#totalPrice').innerHTML = `${total} ر.س`
}

function addToCart(recipe) {
    var cart = JSON.parse(localStorage.getItem('cart')) || [];
    var cartItem = {
        recipeId: recipe.id,
        recipeName: recipe.name,
        recipeImg: recipe.image,
        recipeIngredients: selectedIngredients.filter(ing => ing.selected),
        total: selectedIngredients.filter(ing => ing.selected)
            .reduce((sum, ing) => sum + ing.price, 0)
    }
    var existingIndex = cart.findIndex(item => item.recipeId == recipe.id);
    if (existingIndex >= 0) {
        cart[existingIndex] = cartItem;
    }
    else {
        cart.push(cartItem);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    var dialog = document.getElementById('successDialog');
    dialog.showModal();
    document.body.style.overflow = 'hidden';

    document.getElementById('closeDialog').onclick = function () {
        dialog.close();
        document.body.style.overflow = '';
    };

    document.getElementById('goToCart').onclick = function () {
        window.location.href = '../Cart-page/cart.html';
    };
}
function displayRecipeDetails(recipe) {
    console.log(recipe)
    detailsRow.innerHTML = `
      <div class="col right-side">
                    <div class="recipe-nav">
                        <a href="../Home-page/Index.html">الرئيسية</a>
                        <i class="fa-solid fa-chevron-left"></i>
                        <a href="../Recipes-page/recipes.html">الوصفات</a>
                        <i class="fa-solid fa-chevron-left"></i>
                        <span>${recipe.name}</span>
                    </div>
                    <div class="recipe-img">
                        <img src="${recipe.image}"
                            alt="">
                    </div>
                    <div class="nutrition">
                        <div class="card">
                            <p>سعرات حرارية</p>
                            <h3>${recipe.calories}</h3>
                        </div>
                        <div class="card">
                            <p>بروتين</p>
                            <h3>${recipe.protein} جم</h3>
                        </div>
                        <div class="card">
                            <p>كربوهيدرات</p>
                            <h3>${recipe.carbs} جم</h3>
                        </div>
                    </div>
                    <div class="add-to-cart">
                        <div class="price">
                            <span>السعر الإجمالي</span>
                            <p id="totalPrice">${recipe.price} ر.س</p>
                        </div>
                        <div class="add-btn">
                            <button id="addBtn"><i class="fa-solid fa-cart-arrow-down" ></i> أضف المكونات للسلة</button>
                        </div>
                        <div class="paragraph">
                            <p>سيتم إضافة جميع المكونات المختارة إلى سلة التسوق الخاصة بك</p>
                        </div>
                    </div>
                </div>

                <div class="col left-side">
                    <div class="category-rating">
                        <span class="cat-title">${categoryMap[recipe.category]}</span>
                        <span class="rate">
                            <i class="fa-regular fa-star"></i> ${recipe.rating}
                        </span>
                        <span class="rate-number">
                            (${recipe.reviews} تقييم)
                        </span>
                    </div>
                    <div class="title">
                        <h2>${recipe.name}</h2>
                    </div>
                    <div class="description">
                        <p>${recipe.description}</p>
                    </div>
                    <div class="serving-size">
                        <h3><i class="fa-solid fa-users"></i> عدد الأشخاص</h3>
                        <div class="serving-options">
                            <button class="serving-btn active" >2 أشخاص</button>
                            <button class="serving-btn" >4 أشخاص</button>
                            <button class="serving-btn " >6 أشخاص</button>
                        </div>
                    </div>
                    <div class="ingredients">
                        <div class="title">
                            <h3><i class="fa-solid fa-box-archive"></i> المكونات المطلوبة</h3>
                            <span>تحديد الكل</span>
                        </div>
                        <div class="ingredient-card">
                        ${recipe.ingredients.map(ingredient => `<label class="ingredient">
                                <div class="check">
                                    <input type="checkbox" name="" class="checkInput" checked>
                                    <div class="ingredient-text">
                                        <p>${ingredient.name}</p>
                                        <p class="quantity">${ingredient.quantity} ${unitMap[ingredient.unit]}</p>
                                    </div>
                                </div>
                                <span class="price">${ingredient.price} ر.س</span>
                            </label>`).join('')}
                            
                        </div>
                        <div class="steps">
                            <h3><i class="fa-solid fa-list-ol"></i> خطوات التحضير</h3>
                            ${recipe.instructions.map((step, index) => `
                                 <div class="step">
                                <div class="count">
                                    <div class="number">${index + 1}</div>
                                   ${index < recipe.instructions.length - 1 ? ` <div class="line"></div>` : ''} 
                                </div>
                                <div class="step-text">
                                    <p>${step}</p>
                                </div>
                            </div>
                                `).join('')}
                           
                        </div>
                    </div>
                </div>
     `

    selectedIngredients = recipe.ingredients.map(ing => ({ ...ing, selected: true }));

    var checkInput = document.querySelectorAll('.checkInput')
    checkInput.forEach((checkbox, i) => {
        checkbox.addEventListener('change', function () {
            selectedIngredients[i].selected = this.checked;
            calcTotal();
        });
    });

    document.getElementById('addBtn').addEventListener('click', function () {
        addToCart(recipe);
    });
}

