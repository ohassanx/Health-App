import React, {useEffect, useState } from "react";
import './App.css';
import Recipe from './Recipe';
import Footer from './Footer';

const App = () => {

  const APP_ID = '3b276331';
  const APP_KEY = 'bae8af78b98ebdc942515c5e2ae6d26b';

  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('chicken');

  const getRecipes = async () =>{
    const response = await fetch(`https://api.edamam.com/search?q=${query}&app_id=${APP_ID}&app_key=${APP_KEY}`)
    const data = await response.json()
    setRecipes(data.hits)
    console.log(data.hits)
  }

  useEffect(() =>{
    getRecipes()
  }, [query])


  const updateSearch = (e) => {
    setSearch(e.target.value);
    console.log(query)
  }

  const getSearch = e => {
    e.preventDefault();
    setQuery(search);
  }

  return (
    <div className="App">
      <div className="head">
      <h1><b>The Recipe Project</b></h1>
      <h4>by Satwikan</h4>
      </div>
      <form onSubmit={getSearch} className="search-form">
        <input className="search-bar" 
          type="text" 
          value={search} 
          onChange={updateSearch} 
          placeholder="Type your favorite ingredients..."/>
        <button className="search-button btn btn-info" type="submit"> Find Something! </button>
      </form>
      <div className="recipes">
      {recipes.map(recipe => (
          <Recipe
            key = {recipe.recipe.label}
            title = {recipe.recipe.label}
            calories = {recipe.recipe.calories}
            image = {recipe.recipe.image}
            ingredients = {recipe.recipe.ingredients}
          />
      ))}
      </div>
      <Footer/>
    </div>
  );
}

export default App;


// @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap');

// .App {
//   min-height: 100vh;
//   font-family: 'Roboto', sans-serif;
//   background-image: linear-gradient(to top, #30cfd0 0%, #330867 100%);
// }

// .head{
//   background-color: rgb(211, 250, 250);
//   color: rgb(5, 75, 57);
//   text-align: center;
//   box-shadow: 0px 5px 20px rgb(71, 71, 71);
// }
// .search-form {
//   min-height: 10vh;
//   display: flex;
//   justify-content: center;
//   align-items: center;
// }

// .search-bar {
//   width: 50%;
//   border: none;
//   padding: 10px;
//   border-top-left-radius: 10px;
//   border-bottom-left-radius: 10px;
// }

// .search-button{
//   background: rgb(52, 135, 190);
//   border: none;
//   padding: 10px 20px;
//   color: white;
//   border-top-right-radius: 10px;
//   border-bottom-right-radius: 10px;
// }

// .recipes {
//   display: flex;
//   justify-content: space-around;
//   flex-wrap: wrap;

// }