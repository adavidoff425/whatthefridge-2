const unirest = require('unirest');
const queryString = require('query-string')
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const API_KEY = "8966c29058mshee75833095db4cep1052bcjsn43d9790a58a9" // Alex rapidapi key

//URLs, paths, and query parameters
const BASE = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/" //"https://api.spoonacular.com/";
const RECIPES_URL = BASE  + "recipes/";
const PRODUCTS_URL = BASE + "food/products/";

//makes API call to the url
function makeRequest(url) {
  console.log(url)
  return new Promise((resolve, reject) => {
    unirest.get(url)
          .header("x-rapidapi-host", "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com")  
          .header("x-rapidapi-key", API_KEY)
          .end((result) => {
      if (result.status === 200) {
        //console.log("results.body", result.body); //uncomment to see the output JSON in the console
        resolve(result.body);
      } else {
        reject("ERROR! Call to endpoint failed!");
      }
    });
  })
}

class SpoonacularEndpoints {
  constructor() {
    this.apiKey = API_KEY;
  }

  /**
   * Required:
   *  @param {string} query The (natural language) recipe search query.
   * Optional:
   *  go to: https://spoonacular.com/food-api/docs#Search-Recipes-Complex 
   *  for list of optional parameters
   */
  //example request to endpoint: https://api.spoonacular.com/recipes/complexSearch?query=pasta
  searchRecipe(parameters) {
    let query = queryString.stringify(parameters);
    //console.log("query: ", query); //uncomment to see query parameters as a string
    let endpointURL = RECIPES_URL + "complexSearch/?" + query;
    return makeRequest(endpointURL);
  }

  /**
   * Required:
   *  @param {number} id The recipe id
   * Optional:
   *  go to: https://spoonacular.com/food-api/docs#Search-Recipes-Complex 
   *  for list of optional parameters
   */
  //example request to endpoint: https://api.spoonacular.com/recipes/complexSearch?query=pasta
  searchRecipeByID(params) {
    //console.log("query: ", query); //uncomment to see query parameters as a string
    let endpointURL = RECIPES_URL + params.id + '/information'
    return makeRequest(endpointURL);
  }

  /**
   * Required:
   *  @param {string} ingredients comma separated list of ingredients
   * Optional:
   *  @param {number} number The maximum number of recipes to return (between 1 and 100). Defaults to 10.
   *  @param {boolean} limitLicense Whether the recipes should have an open license that allows display with proper attribution.
   *  @param {number} ranking Whether to maximize used ingredients (1) or minimize missing ingredients (2) first.
   *  @param {boolean} ignorePantryWhether to ignore typical pantry items, such as water, salt, flour, etc.
   */
  //example request to endpoint: https://api.spoonacular.com/recipes/findByIngredients?ingredients=apples,flour,sugar
  getRecipesByIngredients(parameters) {
    let query = queryString.stringify(parameters);
    //console.log("query: ", query); //uncomment to see query parameters as a string
    let endpointURL = RECIPES_URL + "findByIngredients/?" + query;
    return makeRequest(endpointURL);
  }

  /**
   * Required:
   *  @param {number} id The recipe id.
   * Optional:
   *  @param {boolean} defaultCSS shows recipe ingredient images. Hard coded to true in our case
   */
  //example request to endpoint: https://api.spoonacular.com/data/recipe/visualizeRecipeByIngredientsID?query=shakshuka
  visualizeRecipeIngredientsByID(parameters) {
    let id = parameters.id;
    let defaultCss = parameters.defaultCss; //hard coded to true
    let endpointURL = RECIPES_URL + id + "/ingredientWidget/?" + defaultCss; 
    return makeRequest(endpointURL);
  }

    /**
   * Required:
   *  @param {number} id The recipe id.
   */
  //example request to endpoint: https://api.spoonacular.com/data/recipe/ingredientWidget.json?id={id}
  getRecipeIngredientsByID(parameters) {
    let id = parameters.id;
    let endpointURL = RECIPES_URL + id + "/ingredientWidget.json"
    return makeRequest(endpointURL);
  }

  /**
   * Required:
   *  @param {number} id The recipe id.
   * Optional:
   *  @param {boolean} defaultCSS shows recipe ingredient images. Hard coded to true in our case
   */
  //example request to endpoint: https://api.spoonacular.com/data/recipe/visualizeRecipePriceBreakdownByID?query=shakshuka
    visualizeRecipePriceBreakdownByID(parameters) {
    let id = parameters.id;
    let defaultCss = parameters.defaultCss; //hard coded to true
    let endpointURL = RECIPES_URL + id + "/priceBreakdownWidget/?" + defaultCss; 
    return makeRequest(endpointURL);
  }

  /**
   * Required:
   *  @param {string} query name of grocery product 
   * Optional:
   *  go to: https://spoonacular.com/food-api/docs#Search-Grocery-Products
   *  for list of optional parameters
   */
  //example request to endpoint: https://api.spoonacular.com/food/products/search?query=tomato
  searchGroceryProducts(parameters) {
    let query = queryString.stringify(parameters);
    //console.log("query: ", query); //uncomment to see query parameters as a string
    let endpointURL = PRODUCTS_URL + "search/?" + query;
    return makeRequest(endpointURL);
  }

  /**
   * Required:
   *  @param {number} id The id of the packaged food. 
   */
  //example request to endpoint: https://api.spoonacular.com/food/products/22347
  getProductInformation(parameters) {
    let id = parameters;
    let endpointURL = PRODUCTS_URL + id
    console.log("endpointURL: ", endpointURL);
    return makeRequest(endpointURL);
  }

  /**
   * Required:
   *  @param {number} id The recipe id.
   */
  //example request to endpoint: https://api.spoonacular.com/data/recipes/{id}/nutritionWidget.json
  getNutritionInfoID(parameters) {
    let id = parameters.id;
    let endpointURL = RECIPES_URL + id + "/nutritionWidget.json"
    return makeRequest(endpointURL);
  }
}

const Spoonacular = new SpoonacularEndpoints();
module.exports = Spoonacular; 