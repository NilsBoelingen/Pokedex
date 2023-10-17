let currentPokemon;

async function initPokedex() {
    await getPokemon();
    renderPokemonTop();
}

async function getPokemon() {
    let url = 'https://pokeapi.co/api/v2/pokemon/charmander';
    let response = await fetch(url);
    currentPokemon = await response.json();
}

function renderPokemonTop() {
    let currentPokemonName = document.getElementById('currentPokemonName');
    let currentPokemonImg = document.getElementById('currentPokemonImg');
    let currentPokemonNumber = document.getElementById('currentPokemonNumber');

    currentPokemonName.innerHTML = `${currentPokemon.forms[0].name}`;
    currentPokemonImg.setAttribute('src', `${currentPokemon.sprites.other.dream_world.front_default}`);
    currentPokemonNumber.innerHTML = `#${currentPokemon.id}`;
}