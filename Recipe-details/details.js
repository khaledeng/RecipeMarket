var detailsRow = document.getElementById("detailsRow");
var nav = document.querySelector('nav');

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
xhr.open('Get',`../data/recipes.json`);
xhr.send();
xhr.responseType = "json";
xhr.onload = function(){
    var recipes = xhr.response.recipes;
    var recipe = recipes.find(r => r.id == id);
    displayRecipeDetails(recipe);
}

function displayRecipeDetails(recipe){
     console.log(recipe)
     detailsRow.innerHTML = `
      <div class="col right-side">
                    <div class="recipe-nav">
                        <a href="">الرئيسية</a>
                        <i class="fa-solid fa-chevron-left"></i>
                        <a href="">وصفات رئيسية</a>
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
                            <p>${recipe.price} ر.س</p>
                        </div>
                        <div class="add-btn">
                            <button><i class="fa-solid fa-cart-arrow-down"></i> أضف المكونات للسلة</button>
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
                        ${recipe.ingredients.map(ingredient =>`<label class="ingredient">
                                <div class="check">
                                    <input type="checkbox" name="" id="" checked>
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
                            ${recipe.instructions.map((step,index) => `
                                 <div class="step">
                                <div class="count">
                                    <div class="number">${index + 1}</div>
                                   ${index < recipe.instructions.length - 1 ? ` <div class="line"></div>`:''} 
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
     
     // 1. متغير يحفظ المكونات المختارة
let selectedIngredients = recipe.ingredients.map(ing => ({ ...ing, selected: true }));

// 2. دالة تحسب السعر
function calcTotal() {
    let total = selectedIngredients
        .filter(ing => ing.selected)
        .reduce((sum, ing) => sum + ing.price, 0);
    document.querySelector('.add-to-cart .price p').textContent = total + ' ر.س';
}
// 3. لما يغير عدد الأشخاص
document.querySelectorAll('.serving-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.serving-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        let newServings = parseInt(this.dataset.servings);
        let ratio = newServings / recipe.servings;

        selectedIngredients = selectedIngredients.map(ing => ({
            ...ing,
            quantity: +(ing.quantity * ratio).toFixed(1)
        }));

        // تحديث الكميات في الصفحة
        document.querySelectorAll('.quantity').forEach((el, i) => {
            el.textContent = `${selectedIngredients[i].quantity} ${unitMap[selectedIngredients[i].unit] || selectedIngredients[i].unit}`;
        });
    });
});
// 4. لما يشيل checkbox
document.querySelectorAll('.ingredient input[type="checkbox"]').forEach((checkbox, i) => {
    checkbox.addEventListener('change', function () {
        selectedIngredients[i].selected = this.checked;
        calcTotal();
    });
});
// 5. زرار أضف للسلة
document.querySelector('.add-btn button').addEventListener('click', function () {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    let cartItem = {
        recipeId: recipe.id,
        recipeName: recipe.name,
        recipeImage: recipe.image,
        ingredients: selectedIngredients.filter(ing => ing.selected),
        total: selectedIngredients
            .filter(ing => ing.selected)
            .reduce((sum, ing) => sum + ing.price, 0)
    };
    // لو الوصفة موجودة قبل كده، حدّثها
    let existingIndex = cart.findIndex(item => item.recipeId == recipe.id);
    if (existingIndex >= 0) {
        cart[existingIndex] = cartItem;
    } else {
        cart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    window.location.href = '../cart/index.html';
});
}

