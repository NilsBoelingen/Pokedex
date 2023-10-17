let currentPokemon;
let maxStats = [255, 190, 250, 194, 250, 200];
let statNames = ['HP', 'ATK', 'DEF', 'S-ATK', 'S-DEF', 'SPD'];

async function initPokedex() {
    await getPokemon();
    loadPokemonTop();
    loadPokemonType();
    loadPokemonSize();
    loadPokemonStats();
}

async function initMoves() {
    await getPokemon();
    loadPokemonTop();
    loadMoves();
}

async function getPokemon() {
    let url = 'https://pokeapi.co/api/v2/pokemon/charmander';
    let response = await fetch(url);
    currentPokemon = await response.json();
}

function loadPokemonTop() {
    let currentPokemonName = document.getElementById('currentPokemonName');
    let currentPokemonImg = document.getElementById('currentPokemonImg');
    let currentPokemonNumber = document.getElementById('currentPokemonNumber');

    currentPokemonName.innerHTML = `${currentPokemon.forms[0].name}`;
    currentPokemonImg.setAttribute('src', `${currentPokemon.sprites.other.dream_world.front_default}`);
    currentPokemonNumber.innerHTML = `#${currentPokemon.id}`;
}

function loadPokemonType() {
    let typesContainer = document.getElementById('typesContainer');
    let types = currentPokemon.types;
    typesContainer.innerHTML = '';

    for (let i = 0; i < types.length; i++) {
        const type = types[i].type.name;
        typesContainer.innerHTML += `
            <div class="pokemon-class" id="pokemonClass1">${type}</div>
        `;
    }
}

function loadPokemonSize() {
    let sizeContainer = document.getElementById('sizeContainer');
    let height = currentPokemon.height / 10;
    let weight = currentPokemon.weight / 10;

    sizeContainer.innerHTML = `
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

function loadPokemonStats() {
    let statsContainer = document.getElementById('statsContainer');
    let stats = currentPokemon.stats;
    statsContainer.innerHTML = '';

    for (let i = 0; i < stats.length; i++) {
        const statName = statNames[i];
        const stat = stats[i].base_stat;
        const maxStat = maxStats[i];
        const statAsPercent = Math.round(stat / maxStat * 100);
        statsContainer.innerHTML += `
        <tr>
            <td class="table-left"><span>${statName}</span></td>
            <td>
                <div class="progress" role="progressbar"
                    aria-label="Example with label"
                    aria-valuenow="${stat}" aria-valuemin="0"
                    aria-valuemax="${maxStat}">
                <div class="progress-bar" style="width: ${statAsPercent}%">${stat}</div>
                </div>
            </td>
        </tr>
        `;
    }
    loadBaseExp(statsContainer);
}

function loadBaseExp(statsContainer) {
    let bExp = currentPokemon.base_experience;
    let bExpAsPercent = Math.round(bExp / 255 * 100);

    statsContainer.innerHTML += `
    <tr>
        <td class="table-left"><span>B-EXP</span></td>
        <td>
            <div class="progress" role="progressbar"
                aria-label="Example with label"
                aria-valuenow="${bExp}" aria-valuemin="0"
                aria-valuemax="255">
            <div class="progress-bar" style="width: ${bExpAsPercent}%">${bExp}</div>
            </div>
        </td>
    </tr>
    `;
}

function loadMoves() {
    let moveList = document.getElementById('moveList');
    let moves = currentPokemon.moves;
    moveList.innerHTML = `        
        <tr>
            <td>name</td>
            <td>version</td>
            <td>learnd at lvl</td>
        </tr>
    `;

    for (let i = 0; i < moves.length; i++) {
        const move = moves[i];
        const moveName = moves[i].move.name;
        
        loadVersions(move);
    }
}

function loadVersions(move) {
    let versions = move.version_group_details;

    for (let i = 0; i < versions.length; i++) {
        const version = versions[i].version_group.name;
        const lerndAtLvl = versions[i].level_learned_at;
        return version, lerndAtLvl;
    }
}

function renderMoveList() {
    return moveList.innerHTML += `
        <tr>
            <td>${move.move.name}</td>
            <td>${version.version_group.name}</td>
            <td></td>
        </tr>
    `;
}