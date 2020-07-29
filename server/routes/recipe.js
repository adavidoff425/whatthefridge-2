const Spoonacular = require('../api-manager.js');
const unirest = require('unirest');
const express = require("express");
const SpoonacularEndpoints = require('../api-manager.js');
const { response } = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

function getRecipeData(request, response) {
  let data = {};
  let recipe = request.query.query;
  let addRecipeInformation = request.query.addRecipeInformation;
  let addRecipeNutrition = request.query.addRecipeNutrition;
  let queryParameters = {query: recipe, addRecipeInformation: addRecipeInformation, addRecipeNutrition: addRecipeNutrition};
  SpoonacularEndpoints.searchRecipe(queryParameters)
    .then((result) => {
      //console.log(result); //uncomment to see JSON returned from endpoint
      data.recipe = result.results[0].title;
      data.imageURL = result.results[0].image;
      data.id = result.results[0].id;
      data.calories = result.results[0].calories;
      data.carbs = result.results[0].carbs;
      data.fat = result.results[0].fat;
      data.protein = result.results[0].protein;
      response.send(data);
    })
    .catch((error) => {
      console.log("In catch block of getRecipeData...\n" +
        "API call to searchRecipe failed!\n" + 
        "You tried to request data for: " + recipe + " which DNE\n");
      console.log("Error message: " + error);
    })
}

//TODO: figure out how to get usedIngredients and unusedIngredients
function getRecipeDataByIngredients(request, response) {
  let data = {};
  let ingredients = request.query.ingredients;
  let number = request.query.number;
  let limitLicense = request.query.limitLicense;
  let ranking = request.query.ranking;
  let ignorePantry = request.query.ignorePantry;
  let queryParameters = {query: ingredients, number: number, limitLicense: limitLicense, ranking: ranking, ignorePantry: ignorePantry};
  SpoonacularEndpoints.searchRecipe(queryParameters)
    .then((result) => {
      console.log("result: ", result); //uncomment to see JSON returned from endpoint
      data.recipe = result.results[0].title;
      data.imageURL = result.results[0].image;
      data.id = result.results[0].id;
      data.usedIngredients = result.results[0].usedIngredients;
      data.unusedIngredients = result.results[0].unusedIngredients;
      response.contentType("application/json");
      response.send(data);
    })
    .catch((error) => {
      console.log("In catch block of getRecipeDataByIngredients...\n" +
        "API call to getRecipesByIngredients failed!\n" + 
        "You tried to request data for: " + ingredients + " which DNE\n");
      console.log("Error message: " + error);
    })
}

function getRecipeIngredientCSS(request, response) {
  let recipe = request.query.query;
  let queryParameters = {query: recipe};
  SpoonacularEndpoints.searchRecipe(queryParameters)
    .then((result) => {
      //console.log(result); //uncomment to see JSON returned from endpoint
      let id = result.results[0].id;
      let defaultCss = true; //CSS endpoints always hard coded to true
      let queryParameters = {id: id, defaultCss: defaultCss};
      SpoonacularEndpoints.visualizeRecipeIngredientsByID(queryParameters)
        .then((result) => {
          response.contentType("text/html");
          response.send(result);
        })
        .catch((error) => {
          console.log("In catch block of getRecipeIngredientCSS...\n" +
            "API call to visualizeRecipeIngredientsByID failed!\n" + 
            "You tried to request data for: " + id + " which DNE\n");
          console.log("Error message: " + error);
        })
    })
    .catch((error) => {
      console.log("In catch block of getRecipeIngredientCSS...\n" +
        "API call to searchRecipe failed!\n" + 
        "You tried to request data for: " + recipe + " which DNE\n");
      console.log("Error message: " + error);
    }) 
}

//TODO: CSS isn't displaying
function getRecipePrice(request, response) {
  let recipe = request.query.query;
  let queryParameters = {query: recipe};
  SpoonacularEndpoints.searchRecipe(queryParameters)
    .then((result) => {
      //console.log(result); //uncomment to see JSON returned from endpoint
      let id = result.results[0].id;
      let defaultCss = true; //CSS endpoints always hard coded to true
      let queryParameters = {id: id, defaultCss: defaultCss};
      SpoonacularEndpoints.visualizeRecipePriceBreakdownByID(queryParameters)
        .then((result) => {
          response.contentType("text/html");
          response.send(result);
        })
        .catch((error) => {
          console.log("In catch block of getRecipePrice...\n" +
            "API call to visualizeRecipePriceBreakdownByID failed!\n" + 
            "You tried to request data for: " + id + " which DNE\n");
          console.log("Error message: " + error);
        })
    })
    .catch((error) => {
      console.log("In catch block of getRecipePrice...\n" +
        "API call to searchRecipe failed!\n" + 
        "You tried to request data for: " + recipe + " which DNE\n");
      console.log("Error message: " + error);
    })  
}

module.exports = {getRecipeData, getRecipeDataByIngredients, getRecipeIngredientCSS, getRecipePrice};