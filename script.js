const API_URL = 'https://majazocom.github.io/Data/solaris.json';
const searchBarEl = document.querySelector('#search-bar');
const prevPlanetBtn = document.querySelector('#back_btn');
const nextPlanetBtn = document.querySelector('#fwd_btn');
let chosenPlanet = [];
let planetsArray = [];
let planetsContainerEl = document.querySelector('.planets-container');

// HÄMTA PLANETINFO FRÅN API
async function getSolarSystem() {
    let respons = await fetch(API_URL);
    planetsArray = await respons.json();
    renderPlanetsToUi(planetsArray);
}
getSolarSystem();

// RENDERA PLANETERNA
function renderPlanetsToUi(planets) {
    let planetsArticle = document.createElement('article');
    planetsArticle.classList.add('planets');
    planetsContainerEl.appendChild(planetsArticle);
    planets.forEach(planet => {
        let planetEl = document.createElement('section');
        planetEl.classList.add('planet-element');
        planetEl.setAttribute('id', planet.name)
        planetEl.innerHTML = `<p class='hidden-text'>${planet.name}</p>`;
        planetsArticle.appendChild(planetEl);
        planetEl.addEventListener('click',() => {
            chosenPlanet = planet;
            overlayOn(chosenPlanet)
        });
    });
}

// GENERERA OVERLAY
function overlayOn(chosenPlanet) {
    document.querySelector(".planets-info__overlay").style.display = "block";
    let overlayContent = `
    <article class="planet-info" id=${chosenPlanet.id}>
    <section class="planet-info__name-desc">
    <h2 class="planet__name">${chosenPlanet.name}</h2>
    <h3 class="planet__latin">${chosenPlanet.latinName}</h3>
    <p class="planet__descr">${chosenPlanet.desc}</p>
    </section>
    <div class="break-line"></div>
    <section class="planet-info__temp-dist">
    <h3>OMKRETS<br><p>${chosenPlanet.circumference} km</p></h3>
    <h3>KM FRÅN SOLEN<br><p>${chosenPlanet.distance} km</p></h3>
    <h3>MAX TEMPERATUR<br><p>${chosenPlanet.temp.day} °C</p></h3>
    <h3>MIN TEMPERATUR<br><p>${chosenPlanet.temp.night} °C</p></h3>
    </section>
    <div class="break-line"></div>
    <section class="planet-info__moons">
    <h3>MÅNAR</h3>
    <p>${chosenPlanet.moons.map((moon) => `${moon}`).join(" | ")}</p>
    </section>
    </article>`;
    document.querySelector(".overlay-info").innerHTML = overlayContent;
    backBtn(chosenPlanet);
    fwdBtn(chosenPlanet);
}

// STÄNGA OVERLAY
let overlay = document.querySelector("#close-overlay_btn");
overlay.addEventListener('click', () => {
    overlayOff();
});
function overlayOff() {
    document.querySelector(".planets-info__overlay").style.display = "none";
}

// TILLBAKA-KNAPP
function backBtn(array) {
    prevPlanetBtn.addEventListener('click', () => {
        overlayOff();
        let currentPlanetIndex = planetsArray.findIndex(p => p.id === array.id);
        overlayOn(planetsArray[currentPlanetIndex - 1]);
    });
}

// NÄSTA-KNAPP
function fwdBtn(array) {
    nextPlanetBtn.addEventListener('click', () => {
        overlayOff();
        let currentPlanetIndex = planetsArray.findIndex(p => p.id === array.id);
        overlayOn(planetsArray[currentPlanetIndex + 1]);
    });
}

// SÖKFUNKTION 
searchBarEl.addEventListener('keyup', function () {
    let resultsContainer = document.querySelector('.results-container');
    resultsContainer.innerHTML = '';
    let input = searchBarEl.value;
    let matches = [];
    planetsArray.forEach(planet => {
        if (planet.name.toLowerCase().includes(input.toLowerCase())) {
            matches.push(planet);
        }
    });
    
    if (matches.length > 0) {
    matches.forEach(match => {
        let searchResult = document.createElement('p');
        searchResult.setAttribute('id', 'planet-search-result');
        searchResult.innerHTML = match.name;
        resultsContainer.appendChild(searchResult);
        searchResult.addEventListener('click', () => {
            overlayOn(match);
        })
        if (input === '') {
            resultsContainer.innerHTML = '';
        }
    })
    } else {
        resultsContainer.innerHTML = "Inga planeter hittades, testa gärna igen.";
    }
});

    