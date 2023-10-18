let allPokemon;
let currentPokemon;
let maxStats = [255, 190, 250, 194, 250, 200];
let statNames = ['HP', 'ATK', 'DEF', 'S-ATK', 'S-DEF', 'SPD'];
let currentTypes = [];

async function initMainPage() {
    clearTypes();
    renderMainPage();
    await getPokemonList();
    loadPokemonList();

}

async function initPokedex(pokemon) {
    clearTypes();
    renderPokedex(pokemon);
    await getPokemon(pokemon);
    loadPokemonTop();
    loadPokemonType();
    loadPokemonSize();
    loadPokemonStats();
}

async function initMoves(pokemon) {
    renderMovePage(pokemon);
    await getPokemon(pokemon);
    loadPokemonTop();
    loadMoves();
}

async function getPokemon(pokemon) {
    let url = `https://pokeapi.co/api/v2/pokemon/${pokemon}`;
    let response = await fetch(url);
    currentPokemon = await response.json();
}

async function getPokemonList() {
    let url = 'https://pokeapi.co/api/v2/pokemon/?limit=20';
    let response = await fetch(url);
    let responseAtJson = await response.json();
    allPokemon = responseAtJson.results;
}

function loadPokemonList() {
    let list = document.getElementById('pokemonList');
    
    for (let i = 0; i < allPokemon.length; i++) {
        const pokemonName = allPokemon[i].name;
        list.innerHTML += renderPokemonList(pokemonName, i);
    }
    renderImg();
}

async function renderImg() {
    for (let i = 0; i < allPokemon.length; i++) {
        const pokemon = allPokemon[i].name;
        await getPokemon(pokemon);
        let imgContainer = document.getElementById(`pokemon${i}`);
        let img = currentPokemon.sprites.other.dream_world.front_default;
        imgContainer.setAttribute('src', `${img}`);
        getCurrentTypes();
        changeCardBackgroundColorByMainType(i);
        clearTypes();
    }
}

function loadPokemonTop() {
    let currentPokemonName = document.getElementById('currentPokemonName');
    let currentPokemonImg = document.getElementById('currentPokemonImg');
    let currentPokemonNumber = document.getElementById('currentPokemonNumber');

    currentPokemonName.innerHTML = `${currentPokemon.forms[0].name.toUpperCase()}`;
    currentPokemonImg.setAttribute('src', `${currentPokemon.sprites.other.dream_world.front_default}`);
    currentPokemonNumber.innerHTML = `#${currentPokemon.id}`;
}

function loadPokemonType() {
    let typesContainer = document.getElementById('typesContainer');
    let types = currentPokemon.types;
    typesContainer.innerHTML = '';

    for (let i = 0; i < types.length; i++) {
        const type = types[i].type.name;
        typesContainer.innerHTML += renderPokemonTypes(i, type);
    }
    getCurrentTypes();
    changeBackgroundColorByMainType();
    changeBackgroundColorBySubType();
}

function loadPokemonSize() {
    let sizeContainer = document.getElementById('sizeContainer');
    let height = currentPokemon.height / 10;
    let weight = currentPokemon.weight / 10;

    sizeContainer.innerHTML = renderPokemonSize(weight, height);
}

function loadPokemonStats() {
    let statsContainer = document.getElementById('statsContainer');
    let stats = currentPokemon.stats;
    statsContainer.innerHTML = '';

    for (let i = 0; i < stats.length; i++) {
        const statName = statNames[i];
        const stat = stats[i].base_stat;
        const maxStat = maxStats[i];
        const statAsPercent = Math.round(stat / maxStat * 100);
        statsContainer.innerHTML += renderPokemonStats(statName, stat, maxStat, statAsPercent);
    }
    loadBaseExp(statsContainer);
}

function loadBaseExp(statsContainer) {
    let bExp = currentPokemon.base_experience;
    let bExpAsPercent = Math.round(bExp / 255 * 100);

    statsContainer.innerHTML += renderBaseExp(bExp, bExpAsPercent);
}

function loadMoves() {
    let moveList = document.getElementById('moveList');
    let moves = currentPokemon.moves;
    moveList.innerHTML = renderMoves();
    for (let i = 0; i < moves.length; i++) {
        const move = moves[i];
        const moveName = moves[i].move.name;
        renderMoveList(moveName, i);
        loadVersions(move, i,);
        changeBackgroundColorOnMoveList(i);
    }
    

}

function loadVersions(move, i) {
    let versions = move.version_group_details;
    for (let j = 0; j < versions.length; j++) {
        const version = versions[j].version_group.name;
        renderVersionsList(version, i, j);
    }
}

function loadAtLvlLearn(i, j) {
    let lvl = currentPokemon.moves[i].version_group_details[j].level_learned_at;
    let learnAtLvl = document.getElementById(`learnAtLvl${i}`);
    learnAtLvl.innerHTML = lvl;
}

function renderMoveList(moveName, i) {
    return moveList.innerHTML += `
        <tr>
            <td>${moveName.toUpperCase()}</td>
            <td>
                <div class="btn-group">
                    <button type="button" id="btn${i}" class="btn btn-danger dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">Select Version</button>
                    <ul class="dropdown-menu" id="versionList${i}">
                    </ul>
                </div>
            </td>
            <td id="tdVersion${i}">Choose a Version</td>
            <td id="learnAtLvl${i}">X</td>
        </tr>
    `;
}

function renderVersionsList(version, i, j) {
    let versionList = document.getElementById(`versionList${i}`);
    versionList.innerHTML += `
        <li><a class="dropdown-item" onclick="showVersion('${version}', ${i}, ${j})">${version.toUpperCase()}</a></li>
    `;
}

function showVersion(version, i, j) {
    let tdVersion = document.getElementById(`tdVersion${i}`);
    tdVersion.innerHTML = `${version.toUpperCase()}`;
    loadAtLvlLearn(i, j);
}

function renderMainPage() {
    let content = document.getElementById('content');
    content.innerHTML = `
        <div class="header">
            <h1>Pokedex</h1>
        </div>
        <div class="search-field">
            <div class="input-group mb-3">
                <input type="text" class="form-control" placeholder="Type Pokemon Name for Search ..." id="inputPokemon">
                <button class="btn btn-outline-secondary btn-danger" type="button" id="button-addon2" onclick="searchWhithInput()">Search</button>
            </div>
        </div>
        <div id="pokemonList">
        </div>
        <div class="load-next-container">
            <button type="button" class="btn btn-danger">< Prev. 20</button>
            <button type="button" class="btn btn-danger">Next 20 ></button>
        </div>
    `;
}

function renderPokedex(pokemon) {
    let content = document.getElementById('content');
    content.innerHTML = `
        <div class="pokedex-main-container">
            <div class="pokedex-img-container">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="go-back" onclick="initMainPage()"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg>
                <h4 id="currentPokemonNumber"></h4>
                <img src alt id="currentPokemonImg">
            </div>
            <div class="pokedex-stats-main-container">
                <h1 id="currentPokemonName"></h1>

                <div class="pokemon-class-container" id="typesContainer">
                </div>
                <div class="pokemon-size-container" id="sizeContainer">
                </div>
                <div class="base-stats-maincontainer">
                    <h1>Base Stats</h1>
                    <table id="statsContainer">
                    </table>
                </div>
            <button type="button" class="btn btn-primary" onclick="initMoves('${pokemon}')">Show Moves</button>
            </div>
        </div>
    `;
}

function renderMovePage(pokemon) {
    let content = document.getElementById('content');
    content.innerHTML = `
        <div class="pokedex-main-container">
            <div class="pokedex-img-container">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="go-back" onclick="initPokedex('${pokemon}')"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg>
                <h4 id="currentPokemonNumber"></h4>
                <img src alt id="currentPokemonImg">
            </div>
            <div class="pokedex-stats-main-container">
                <h1 id="currentPokemonName"></h1>
                <table id="moveList">
                </table>
                <button type="button" class="btn btn-primary" onclick="initPokedex('${pokemon}')">Back to Stats</button>
            </div>
        </div>
    `;
}

function renderBaseExp(bExp, bExpAsPercent) {
    return `
    <tr>
        <td class="table-left"><span>B-EXP</span></td>
        <td>
            <div class="progress" role="progressbar"
                aria-label="Example with label"
                aria-valuenow="${bExp}" aria-valuemin="0"
                aria-valuemax="255">
            <div class="progress-bar" style="width: ${bExpAsPercent}%">${bExp}/255</div>
            </div>
        </td>
    </tr>
    `;
}

function renderMoves() {
    return `        
    <tr class="table-header">
        <td>Name</td>
        <td>Version</td>
        <td>Version Name</td>
        <td>Learnd at lvl</td>
    </tr>
    `;
}

function renderPokemonStats(statName, stat, maxStat, statAsPercent) {
    return `
    <tr>
        <td class="table-left"><span>${statName}</span></td>
        <td>
            <div class="progress" role="progressbar"
                aria-label="Example with label"
                aria-valuenow="${stat}" aria-valuemin="0"
                aria-valuemax="${maxStat}">
            <div class="progress-bar" style="width: ${statAsPercent}%">${stat}/${maxStat}</div>
            </div>
        </td>
    </tr>
    `;
}

function renderPokemonSize(weight, height) {
    return `
    <div class="w-160">
        <h3>${weight} KG</h3>
        <span class="color-gray">Weight</span>
    </div>
    <div class="w-160">
        <h3>${height} M</h3>
        <span class="color-gray">Height</span>
    </div>
    `;
}

function renderPokemonList(pokemonName, i) {
    return `
    <div class="poke-container" id="poke-container${i}" onclick="initPokedex('${pokemonName}')">
        <img src="" id="pokemon${i}" class="poke-img">
        <h2>${pokemonName.toUpperCase()}</h2>
    </div>
    `;
}

function getCurrentTypes() {
    let types = currentPokemon.types;
    for (let i = 0; i < types.length; i++) {
        const type = types[i].type.name;
        currentTypes.push(type);
    }
}

function changeBackgroundColorByMainType() {
    let backgroundColor = 'white';

    if (currentTypes.length > 0) {
        const primaryType = currentTypes[0];
        switch (primaryType) {
            case 'normal':
                backgroundColor = '#A8A878';
                break;
            case 'fire':
                backgroundColor = '#F08030';
                break;
            case 'water':
                backgroundColor = '#6890F0';
            case 'grass':
                backgroundColor = '#78c850';
                break;
            case 'electric':
                backgroundColor = '#F8D030';
                break;
            case 'ice':
                backgroundColor = '#98D8D8';
                break;
            case 'fighting':
                backgroundColor = '#C03028';
                break;
            case 'posion':
                backgroundColor = '#A040A0';
                break;
            case 'ground':
                backgroundColor = '#E0C068';
                break;
            case 'flying':
                backgroundColor = '#A890F0';
                break;
            case 'psychic':
                backgroundColor = '#F85888';
                break;
            case 'bug':
                backgroundColor = '#A8B820';
                break;
            case 'rock':
                backgroundColor = '#B8A038';
                break;
            case 'ghost':
                backgroundColor = '#705898';
                break;
            case 'dragon':
                backgroundColor = '#7038F8';
                break;
            case 'dark':
                backgroundColor = '#705848';
                break;
            case 'steel':
                backgroundColor = '#B8B8D0';
                break;
            case 'fairy':
                backgroundColor = '#F0B6BC';
                break;
        }
    }
    document.querySelector('.pokedex-img-container').style.backgroundColor = backgroundColor;
    document.querySelector('.pokemon-class0').style.backgroundColor = backgroundColor;
}

function renderPokemonTypes(i, type) {
    return `
    <div class="pokemon-class${i}">${type.toUpperCase()}</div>
`;
}

function changeBackgroundColorOnMoveList(i) {
    let backgroundColor = 'white';

    if (currentTypes.length > 0) {
        const primaryType = currentTypes[0];
        switch (primaryType) {
            case 'normal':
                backgroundColor = '#A8A878';
                break;
            case 'fire':
                backgroundColor = '#F08030';
                break;
            case 'water':
                backgroundColor = '#6890F0';
            case 'grass':
                backgroundColor = '#78c850';
                break;
            case 'electric':
                backgroundColor = '#F8D030';
                break;
            case 'ice':
                backgroundColor = '#98D8D8';
                break;
            case 'fighting':
                backgroundColor = '#C03028';
                break;
            case 'posion':
                backgroundColor = '#A040A0';
                break;
            case 'ground':
                backgroundColor = '#E0C068';
                break;
            case 'flying':
                backgroundColor = '#A890F0';
                break;
            case 'psychic':
                backgroundColor = '#F85888';
                break;
            case 'bug':
                backgroundColor = '#A8B820';
                break;
            case 'rock':
                backgroundColor = '#B8A038';
                break;
            case 'ghost':
                backgroundColor = '#705898';
                break;
            case 'dragon':
                backgroundColor = '#7038F8';
                break;
            case 'dark':
                backgroundColor = '#705848';
                break;
            case 'steel':
                backgroundColor = '#B8B8D0';
                break;
            case 'fairy':
                backgroundColor = '#F0B6BC';
                break;
        }
    }
    document.querySelector('.pokedex-img-container').style.backgroundColor = backgroundColor;
    document.querySelector(`#btn${i}`).style.backgroundColor = backgroundColor;
    document.querySelector(`#btn${i}`).style.borderColor = backgroundColor;
}

function changeBackgroundColorBySubType() {
    let backgroundColor = 'white';

    if (currentTypes.length > 1) {
        const primaryType = currentTypes[1];
        switch (primaryType) {
            case 'normal':
                backgroundColor = '#A8A878';
                break;
            case 'fire':
                backgroundColor = '#F08030';
                break;
            case 'water':
                backgroundColor = '#6890F0';
            case 'grass':
                backgroundColor = '#78c850';
                break;
            case 'electric':
                backgroundColor = '#F8D030';
                break;
            case 'ice':
                backgroundColor = '#98D8D8';
                break;
            case 'fighting':
                backgroundColor = '#C03028';
                break;
            case 'poison':
                backgroundColor = '#A040A0';
                break;
            case 'ground':
                backgroundColor = '#E0C068';
                break;
            case 'flying':
                backgroundColor = '#A890F0';
                break;
            case 'psychic':
                backgroundColor = '#F85888';
                break;
            case 'bug':
                backgroundColor = '#A8B820';
                break;
            case 'rock':
                backgroundColor = '#B8A038';
                break;
            case 'ghost':
                backgroundColor = '#705898';
                break;
            case 'dragon':
                backgroundColor = '#7038F8';
                break;
            case 'dark':
                backgroundColor = '#705848';
                break;
            case 'steel':
                backgroundColor = '#B8B8D0';
                break;
            case 'fairy':
                backgroundColor = '#F0B6BC';
                break;
        }
    }
    document.querySelector('.pokemon-class1').style.backgroundColor = backgroundColor;
}

function changeCardBackgroundColorByMainType(i) {
    let backgroundColor = 'white';

    if (currentTypes.length > 0) {
        const primaryType = currentTypes[0];
        switch (primaryType) {
            case 'normal':
                backgroundColor = '#A8A878';
                break;
            case 'fire':
                backgroundColor = '#F08030';
                break;
            case 'water':
                backgroundColor = '#6890F0';
            case 'grass':
                backgroundColor = '#78c850';
                break;
            case 'electric':
                backgroundColor = '#F8D030';
                break;
            case 'ice':
                backgroundColor = '#98D8D8';
                break;
            case 'fighting':
                backgroundColor = '#C03028';
                break;
            case 'poison':
                backgroundColor = '#A040A0';
                break;
            case 'ground':
                backgroundColor = '#E0C068';
                break;
            case 'flying':
                backgroundColor = '#A890F0';
                break;
            case 'psychic':
                backgroundColor = '#F85888';
                break;
            case 'bug':
                backgroundColor = '#A8B820';
                break;
            case 'rock':
                backgroundColor = '#B8A038';
                break;
            case 'ghost':
                backgroundColor = '#705898';
                break;
            case 'dragon':
                backgroundColor = '#7038F8';
                break;
            case 'dark':
                backgroundColor = '#705848';
                break;
            case 'steel':
                backgroundColor = '#B8B8D0';
                break;
            case 'fairy':
                backgroundColor = '#F0B6BC';
                break;
        }
    }
    document.querySelector(`#poke-container${i}`).style.backgroundColor = backgroundColor;
}

function clearTypes() {
    currentTypes.splice(0, 2)
}

function searchWhithInput() {
    let input = document.getElementById('inputPokemon').value;
    let lowerInput = input.toLowerCase();
    let trimLowerInput = lowerInput.trim();
    initPokedex(trimLowerInput);
}