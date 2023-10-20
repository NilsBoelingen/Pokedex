let allPokemon;
let currentPokemon;
let maxStats = [255, 190, 250, 194, 250, 200];
let statNames = ['HP', 'ATK', 'DEF', 'S-ATK', 'S-DEF', 'SPD'];
let currentTypes = [];
let offset = 0;
let allPokemonNames = [];

async function initMainPage() {
    clearTypes();
    renderMainPage();
    await getPokemonList();
    loadPokemonList();
    getAllPokemonNames();
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
    let url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=20`;
    let response = await fetch(url);
    let responseAtJson = await response.json();
    allPokemon = responseAtJson.results;
}

async function getAllPokemonNames() {
    let url = `https://pokeapi.co/api/v2/pokemon?offset=0&limit=2000`;
    let response = await fetch(url);
    let responseAtJson = await response.json();
    allPokemonNames = responseAtJson.results.map(result => result.name);
}

function updateDropdown() {
    let input = document.getElementById('inputPokemon').value.toLowerCase();
    let dropdown = document.getElementById('dropdownMenu');
    dropdown.innerHTML = '';
    let matchingNames = allPokemonNames.filter(name => name.includes(input));
    renderDropDownSearch(matchingNames, dropdown);
    dropdown.style.display = matchingNames.length > 0 ? 'block' : 'none';
}

function selectName(name) {
    document.getElementById('inputPokemon').value = name;
    document.getElementById('dropdownMenu').style.display = 'none';
}

function searchWithInput() {
    let input = document.getElementById('inputPokemon').value.toLowerCase();
    initPokedex(input);
}

function next20Pokemon() {
    if (offset <= 1260) {
        offset = offset + 20;
        initMainPage();
    } else {
        offset = 0;
        initMainPage();
    }
}

function previous20Pokemon() {
    if (offset >= 20) {
    offset = offset - 20;
    initMainPage();
    } else {
        offset = 1280;
        initMainPage();
    }
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
        getPokemonImg(i);
        getCurrentTypes();
        changeBackgroundColorByType(0);
        document.querySelector(`#poke-container${i}`).style.backgroundColor = color;
        clearTypes();
    }
}

function getPokemonImg(i) {
    let imgContainer = document.getElementById(`pokemon${i}`);
    let img = currentPokemon.sprites.other.dream_world.front_default;
    let imgAlt = currentPokemon.sprites.front_default;
    let imgNotFound = './img/pokemon-logo.png';
    if (img) {
        imgContainer.setAttribute('src', `${img}`);
    } else if (imgAlt) {
        imgContainer.setAttribute('src', `${imgAlt}`);
    } else {
        imgContainer.setAttribute('src', `${imgNotFound}`);
    }
}

function loadPokemonTop() {
    let currentPokemonName = document.getElementById('currentPokemonName');
    let currentPokemonNumber = document.getElementById('currentPokemonNumber');

    currentPokemonName.innerHTML = `${currentPokemon.forms[0].name.toUpperCase()}`;
    loadMainImg();
    currentPokemonNumber.innerHTML = `#${currentPokemon.id}`;
}

function loadMainImg() {
    let currentPokemonImg = document.getElementById('currentPokemonImg');
    let img = currentPokemon.sprites.other.dream_world.front_default;
    let imgAlt = currentPokemon.sprites.front_default;
    let imgNotFound = './img/pokemon-logo.png';
    if (img) {
        currentPokemonImg.setAttribute('src', `${img}`);
    } else if (imgAlt) {
        currentPokemonImg.setAttribute('src', `${imgAlt}`);
    } else {
        currentPokemonImg.setAttribute('src', `${imgNotFound}`);
    }
}

function loadPokemonType() {
    let typesContainer = document.getElementById('typesContainer');
    let types = currentPokemon.types;
    typesContainer.innerHTML = '';
    getPokemonTypes(types);
    getCurrentTypes();
    changeTypeButtonColor();
    changeBackgroundColorByType(0);
    document.querySelector('.pokedex-img-container').style.backgroundColor = color;
    document.querySelector('#goToMoves').setAttribute('style', `background-color: ${color} !important`);
}

function getPokemonTypes(types) {
    for (let i = 0; i < types.length; i++) {
        const type = types[i].type.name;
        typesContainer.innerHTML += renderPokemonTypes(i, type);
    }
}

function changeTypeButtonColor() {
    for (let j = 0; j < currentTypes.length; j++) {
        changeBackgroundColorByType(j);
        document.querySelector(`.pokemon-class${j}`).style.backgroundColor = color;
    }
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
    getPokemonStats(statsContainer, stats)
    loadBaseExp(statsContainer);
}

function getPokemonStats (statsContainer, stats) {
    for (let i = 0; i < stats.length; i++) {
        const statName = statNames[i];
        const stat = stats[i].base_stat;
        const maxStat = maxStats[i];
        const statAsPercent = Math.round(stat / maxStat * 100);
        statsContainer.innerHTML += renderPokemonStats(statName, stat, maxStat, statAsPercent, i);
        changeBackgroundColorByType(0);
        document.querySelector(`#stat${i}`).style.backgroundColor = color;
    }
}

function loadBaseExp(statsContainer) {
    let bExp = currentPokemon.base_experience;
    let bExpAsPercent = Math.round(bExp / 255 * 100);

    statsContainer.innerHTML += renderBaseExp(bExp, bExpAsPercent);
    changeBackgroundColorByType(0);
    document.querySelector('#EXP').style.backgroundColor = color;
}

function loadMoves() {
    let moveList = document.getElementById('moveList');
    let moves = currentPokemon.moves;
    moveList.innerHTML = renderMoves();
    getPokemonMoves(moves);
    changeBackgroundColorByType(0);
    document.querySelector(`#backToStats`).setAttribute('style', `background-color: ${color} !important`);
}

function getPokemonMoves(moves) {
    for (let i = 0; i < moves.length; i++) {
        const move = moves[i];
        const moveName = moves[i].move.name;
        renderMoveList(moveName, i);
        loadVersions(move, i,);
        changeBackgroundColorByType(0);
        document.querySelector('.pokedex-img-container').style.backgroundColor = color;
        document.querySelector(`#btn${i}`).setAttribute('style', `background-color: ${color} !important`);
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

function getCurrentTypes() {
    let types = currentPokemon.types;
    for (let i = 0; i < types.length; i++) {
        const type = types[i].type.name;
        currentTypes.push(type);
    }
}

function clearTypes() {
    currentTypes.splice(0, 2)
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
                <input type="search" class="form-control" placeholder="Pokemon for Search ..." id="inputPokemon" oninput="updateDropdown()">
                <button class="btn btn-outline-secondary btn-danger" type="button" id="button-addon2" onclick="searchWithInput()">Search</button>
                <div id="dropdownMenu" class="dropdown-menu" style="display: none;"></div>
            </div>
            
        </div>
        <div id="pokemonList">
        </div>
        <div class="load-next-container">
            <button type="button" class="btn btn-danger" onclick="previous20Pokemon()">< Prev. 20</button>
            <button type="button" class="btn btn-danger" onclick="next20Pokemon()">Next 20 ></button>
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
            <button type="button" class="btn btn-primary" id="goToMoves" onclick="initMoves('${pokemon}')">Show Moves</button>
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
                <button type="button" class="btn btn-primary" id="backToStats" onclick="initPokedex('${pokemon}')">Back to Stats</button>
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
            <div class="progress-bar" id="EXP" style="width: ${bExpAsPercent}%">${bExp}/563</div>
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

function renderPokemonStats(statName, stat, maxStat, statAsPercent, i) {
    return `
    <tr>
        <td class="table-left"><span>${statName}</span></td>
        <td>
            <div class="progress" role="progressbar"
                aria-label="Example with label"
                aria-valuenow="${stat}" aria-valuemin="0"
                aria-valuemax="${maxStat}">
                <div class="progress-bar" id="stat${i}" style="width: ${statAsPercent}%">${stat}/${maxStat}</div>
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
        <h3>${pokemonName.toUpperCase()}</h3>
    </div>
    `;
}

function renderPokemonTypes(i, type) {
    return `
    <div class="pokemon-class${i}">${type.toUpperCase()}</div>
`;
}

function renderDropDownSearch(matchingNames, dropdown) {
    matchingNames.forEach(name => {
        let p = document.createElement('p');
        p.textContent = name.toUpperCase();
        p.onclick = function() {
            selectName(p.textContent);
        };
        dropdown.appendChild(p);
    });
}

function changeBackgroundColorByType(j) {
    if (currentTypes.length > 0) {
        const primaryType = currentTypes[j];
        switch (primaryType) {
            case 'normal':
                color = '#A8A878';
                break;
            case 'fire':
                color = '#F08030';
                break;
            case 'water':
                color = '#6890F0';
            case 'grass':
                color = '#78c850';
                break;
            case 'electric':
                color = '#F8D030';
                break;
            case 'ice':
                color = '#98D8D8';
                break;
            case 'fighting':
                color = '#C03028';
                break;
            case 'poison':
                color = '#A040A0';
                break;
            case 'ground':
                color = '#E0C068';
                break;
            case 'flying':
                color = '#A890F0';
                break;
            case 'psychic':
                color = '#F85888';
                break;
            case 'bug':
                color = '#A8B820';
                break;
            case 'rock':
                color = '#B8A038';
                break;
            case 'ghost':
                color = '#705898';
                break;
            case 'dragon':
                color = '#7038F8';
                break;
            case 'dark':
                color = '#705848';
                break;
            case 'steel':
                color = '#B8B8D0';
                break;
            case 'fairy':
                color = '#F0B6BC';
                break;
        }
    }
    return color;
}