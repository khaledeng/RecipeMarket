var container = document.getElementById("recipesContainer");
var search = document.getElementById("search");

var timeFilter = document.getElementById("timeFilter");
var timeValue = document.getElementById("timeValue");

var mealRadios = document.querySelectorAll("input[name='mealType']");
var dietRadios = document.querySelectorAll("input[name='dietType']");

var resultsCount = document.getElementById("resultsCount");
var pagination = document.getElementById("pagination");

var recipes = [];
var filteredRecipes = [];

var currentPage = 1;
var pageSize = 12;

var favorites = JSON.parse(localStorage.getItem("favoriteRecipes") || "[]");

function saveFavorites(){
localStorage.setItem("favoriteRecipes", JSON.stringify(favorites));
}

function getSelectedValue(list){
for(var r of list){
if(r.checked){
return r.value;
}
}
return "";
}


var xhr = new XMLHttpRequest();
xhr.open("GET","https://raw.githubusercontent.com/khaledeng/RecipeMarket/refs/heads/main/data/recipes.json");
xhr.responseType="json";
xhr.send();

xhr.onload = function(){

recipes = xhr.response.recipes;
filteredRecipes = recipes;

showPage();

};


function showPage(){

container.innerHTML="";

var start = (currentPage-1) * pageSize;
var end = start + pageSize;

var data = filteredRecipes.slice(start,end);

resultsCount.innerText = filteredRecipes.length + " عدد الوصفات";

for(var r of data){

var card = document.createElement("div");
card.classList.add("recipe-card");


var imageDiv = document.createElement("div");
imageDiv.classList.add("image");

var img = document.createElement("img");
img.src = r.image;

var rating = document.createElement("div");
rating.classList.add("rating");
rating.innerText = "⭐ " + r.rating;

imageDiv.append(img,rating);


var title = document.createElement("h3");
title.innerText = r.name;


var cookTime = r.cookTimeMinutes || r.cookTime || 0;

var time = document.createElement("p");
time.innerText = "⏱ " + cookTime + " دقيقة";


var btnBox = document.createElement("div");
btnBox.classList.add("buttons");


var detailsBtn = document.createElement("button");
detailsBtn.classList.add("Details-btn");
detailsBtn.innerText="عرض التفاصيل";

detailsBtn.onclick = function(id){
return function(){
window.location.href="../Recipe-details/details.html?id="+id;
}
}(r.id);



var favBtn = document.createElement("button");
favBtn.classList.add("fav-btn");

if(favorites.includes(r.id)){
favBtn.classList.add("active");
favBtn.innerText="مفضلة";
}else{
favBtn.innerText="أضف للمفضلة";
}

favBtn.onclick = function(id,btn){

return function(){

if(favorites.includes(id)){

favorites = favorites.filter(function(x){
return x!=id
});

btn.classList.remove("active");
btn.innerText="أضف للمفضلة";

}else{

favorites.push(id);

btn.classList.add("active");
btn.innerText="مفضلة";

}

saveFavorites();

}

}(r.id,favBtn);


btnBox.append(detailsBtn,favBtn);

card.append(imageDiv,title,time,btnBox);

container.append(card);

}

renderPagination();

}


function renderPagination(){

pagination.innerHTML="";

var totalPages = Math.ceil(filteredRecipes.length / pageSize);


if(totalPages <= 1){
pagination.style.display = "none";
return;
}

pagination.style.display = "flex";


var prev = document.createElement("button");
prev.innerText="السابق";
prev.classList.add("page-btn");

if(currentPage == 1){
prev.disabled = true;
}

prev.onclick=function(){
if(currentPage > 1){
currentPage--;
showPage();
}
}

pagination.append(prev);



for(var i=1;i<=totalPages;i++){

var btn = document.createElement("button");

btn.innerText = i;
btn.classList.add("page-btn");

if(i == currentPage){
btn.classList.add("active");
}

btn.onclick = function(num){
return function(){
currentPage = num;
showPage();
}
}(i);

pagination.append(btn);

}


var next = document.createElement("button");

next.innerText="التالي";
next.classList.add("page-btn");

if(currentPage == totalPages){
next.disabled = true;
}

next.onclick=function(){
if(currentPage < totalPages){
currentPage++;
showPage();
}
}

pagination.append(next);

}


function filterData(){

filteredRecipes=[];

var searchText = search.value.toLowerCase();

var selectedMeal = getSelectedValue(mealRadios);
var selectedDiet = getSelectedValue(dietRadios);

var maxTime = Number(timeFilter.value);

for(var r of recipes){

var nameMatch = r.name.toLowerCase().includes(searchText);


var meal = (r.mealType || r.category || "").toLowerCase();
var mealMatch = selectedMeal=="" || meal==selectedMeal.toLowerCase();

var tags = r.tags || [];
var dietMatch = true;

if(selectedDiet == ""){
    dietMatch = true;
}
else if(selectedDiet == "lowCarb"){
    dietMatch = tags.includes("low carb") || tags.includes("healthy");
}
else if(selectedDiet == "highProtein"){
    dietMatch = tags.includes("high protein") || tags.includes("protein") || tags.includes("meat");
}
else if(selectedDiet == "vegetarian"){
    dietMatch = tags.includes("vegetarian");
}

var cookTime = r.cookTimeMinutes || r.cookTime || 0;
var timeMatch = cookTime <= maxTime;


if(nameMatch && mealMatch && dietMatch && timeMatch){

filteredRecipes.push(r);

}

}

currentPage = 1;

showPage();

}



search.addEventListener("input",filterData);


timeFilter.addEventListener("input",function(){

timeValue.innerText = timeFilter.value;

filterData();

});


mealRadios.forEach(function(r){
r.addEventListener("change",filterData);
});

dietRadios.forEach(function(r){
r.addEventListener("change",filterData);
});


function scrollTopPage(){

window.scrollTo({
top:0,
behavior:"smooth"
});
}

pagination.addEventListener("click",scrollTopPage);


var clearBtn=document.getElementById("clearFilters");

if(clearBtn){

clearBtn.onclick=function(){

search.value="";

timeFilter.value=60;

timeValue.innerText=60;

mealRadios.forEach(function(r){
r.checked=r.value=="";
});

dietRadios.forEach(function(r){
r.checked=r.value=="";
});

filteredRecipes=recipes;

currentPage=1;

showPage();

}

}