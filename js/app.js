const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');
const errorDiv = document.getElementById('error');
const foodContainer = document.getElementById('food-container');
const detailsDiv = document.getElementById('food-details');

let lastMeals = [];

// Search button
searchBtn.addEventListener('click', searchFood);

// Enter key
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
        detailsDiv.innerHTML = "";
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
        showAllFoods(lastMeals);
    } catch (error) {
        console.error('Error fetching food:', error);
    }
}

function showAllFoods(meals) {
    foodContainer.innerHTML = '';
    detailsDiv.innerHTML = '';

    if (!meals || meals.length === 0) {
        errorDiv.innerText = "⚠️ No food found!";
        return;
    } else {
        errorDiv.innerText = "";
    }

    meals.forEach(meal => {
        const div = document.createElement('div');
        div.classList.add('food-item');
        div.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
            <h3>${meal.strMeal}</h3>
        `;
        div.addEventListener('click', function () {
            showDetails(meal);
        });
        foodContainer.appendChild(div);
    });
}

function showDetails(meal) {
    let ingredients = "";
    for (let i = 1; i <= 20; i++) {
        let ing = meal[`strIngredient${i}`];
        let measure = meal[`strMeasure${i}`];
        if (ing && ing.trim() !== "") {
            ingredients += `<li>${ing} - ${measure}</li>`;
        }
    }

    detailsDiv.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
        <h2>${meal.strMeal}</h2>
        
        <p><b>Category:</b> ${meal.strCategory}</p>
        <p><b>Area:</b> ${meal.strArea}</p>
        ${meal.strTags ? `<p><b>Tags:</b> ${meal.strTags}</p>` : ""}

        <h3>Ingredients</h3>
        <ul>${ingredients}</ul>

        <h3>Instructions</h3>
        <p>${meal.strInstructions}</p>

        ${meal.strYoutube ? `<p><a href="${meal.strYoutube}" target="_blank">▶ Watch on YouTube</a></p>` : ""}
    `;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}
