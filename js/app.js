const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');
const errorDiv = document.getElementById('error');
const foodContainer = document.getElementById('food-container');

let lastMeals = [];      
let lastScroll = 0;     


searchBtn.addEventListener('click', searchFood);


searchInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        searchFood();
    }
});

function searchFood() {
    const query = searchInput.value.trim();

    if (!query) {
        errorDiv.innerText = "⚠️ Please enter a food name!";
        foodContainer.innerHTML = "";
        return;
    }

    errorDiv.innerText = "";
    getFood(query);
    searchInput.value = "";
}

async function getFood(foodName) {
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${foodName}`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        lastMeals = data.meals || [];
        displayFood(lastMeals);
    } catch (error) {
        console.error('Error fetching food:', error);
    }
}

function displayFood(meals) {
    foodContainer.innerHTML = '';

    if (!meals || meals.length === 0) {
        foodContainer.innerHTML = `<p>No food found</p>`;
        return;
    }

    meals.forEach(meal => {
        const div = document.createElement('div');
        div.classList.add('food-item');
        div.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" 
            <h3>${meal.strMeal}</h3>
        `;
        div.addEventListener('click', function () {
            lastScroll = window.scrollY; 
            showDetails(meal);
        });
        foodContainer.appendChild(div);
    });
}

function showDetails(meal) {
    foodContainer.innerHTML = `
        <div class="food-details">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
            <h2>${meal.strMeal}</h2>
            <p><b>Category:</b> ${meal.strCategory}</p>
            <p><b>Area:</b> ${meal.strArea}</p>
            <p><b>Instructions:</b> ${meal.strInstructions.slice(0, 200)}...</p>
            <button onclick="goBack()">🔙 Back</button>
        </div>
    `;
    window.scrollTo(0, 0);
}

function goBack() {
    displayFood(lastMeals);
    window.scrollTo(0, lastScroll);
}
