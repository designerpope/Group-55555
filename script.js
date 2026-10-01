"use strict";

/* =========================================
   API
========================================= */

const API_URL = "https://anurella.github.io/json/planet.json";


/* =========================================
   DOM ELEMENTS
========================================= */

const planetTabs = document.getElementById("planetTabs");

const planetCard = document.getElementById("planetCard");

const planetImage = document.getElementById("planetImage");
const planetName = document.getElementById("planetName");
const planetType = document.getElementById("planetType");
const planetDescription = document.getElementById("planetDescription");

const distanceFromSun = document.getElementById("distanceFromSun");
const planetMass = document.getElementById("planetMass");
const planetDiameter = document.getElementById("planetDiameter");
const planetPeriod = document.getElementById("planetPeriod");
const planetTemperature = document.getElementById("planetTemperature");
const planetGravity = document.getElementById("planetGravity");
const planetMoons = document.getElementById("planetMoons");

const planetStatus = document.getElementById("planetStatus");

const errorState = document.getElementById("errorState");
const retryButton = document.getElementById("retryButton");

const themeToggle = document.getElementById("themeToggle");


/* =========================================
   APPLICATION STATE
========================================= */

let planets = [];
let selectedPlanetIndex = 0;


/* =========================================
   FETCH PLANETS
========================================= */

async function fetchPlanets() {

    showLoadingState();

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(
                `API request failed: ${response.status}`
            );
        }

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
            throw new Error("No planet data was returned.");
        }

        planets = data;

        renderPlanetTabs();

        selectPlanet(0);

        hideErrorState();

    } catch (error) {

        console.error("Planet API error:", error);

        showErrorState();
    }
}


/* =========================================
   RENDER PLANET TABS
========================================= */

function renderPlanetTabs() {

    planetTabs.innerHTML = "";

    planets.forEach((planet, index) => {

        const button = document.createElement("button");

        button.type = "button";

        button.className = "planet-tab";

        button.textContent = planet.name;

        button.setAttribute("role", "tab");

        button.setAttribute(
            "aria-selected",
            index === selectedPlanetIndex
        );

        button.addEventListener("click", () => {
            selectPlanet(index);
        });

        planetTabs.appendChild(button);
    });
}


/* =========================================
   SELECT PLANET
========================================= */

function selectPlanet(index) {

    if (!planets[index]) {
        return;
    }

    selectedPlanetIndex = index;

    const planet = planets[index];

    updatePlanetInformation(planet);

    updatePlanetTabs();

    planetStatus.textContent =
        `${index + 1} of ${planets.length}`;
}


/* =========================================
   UPDATE PLANET INFORMATION
========================================= */

function updatePlanetInformation(planet) {

    planetName.textContent = planet.name;

    planetType.textContent = planet.type;

    planetDescription.textContent =
        planet.description;

    planetImage.src = planet.image;

    planetImage.alt =
        `${planet.name} illustration`;

    distanceFromSun.textContent =
        planet.distanceFromSun;

    planetMass.textContent =
        planet.mass;

    planetDiameter.textContent =
        planet.diameter;

    planetPeriod.textContent =
        planet.period;

    planetTemperature.textContent =
        planet.temperature;

    planetGravity.textContent =
        planet.gravity;

    planetMoons.textContent =
        planet.moons;
}


/* =========================================
   UPDATE ACTIVE PLANET TAB
========================================= */

function updatePlanetTabs() {

    const tabs =
        planetTabs.querySelectorAll(".planet-tab");

    tabs.forEach((tab, index) => {

        const isActive =
            index === selectedPlanetIndex;

        tab.classList.toggle(
            "active",
            isActive
        );

        tab.setAttribute(
            "aria-selected",
            isActive
        );
    });
}


/* =========================================
   LOADING STATE
========================================= */

function showLoadingState() {

    planetStatus.textContent =
        "Loading planets...";

    planetCard.classList.add("loading");
}


/* =========================================
   ERROR STATE
========================================= */

function showErrorState() {

    planetCard.hidden = true;

    errorState.hidden = false;

    planetStatus.textContent =
        "Unable to load planets.";
}


function hideErrorState() {

    planetCard.hidden = false;

    errorState.hidden = true;

    planetCard.classList.remove("loading");
}


/* =========================================
   RETRY
========================================= */

retryButton.addEventListener(
    "click",
    fetchPlanets
);


/* =========================================
   DARK / LIGHT THEME
========================================= */

function toggleTheme() {

    const isDark =
        document.body.classList.toggle("dark-theme");

    themeToggle.setAttribute(
        "aria-pressed",
        isDark
    );

    const icon =
        themeToggle.querySelector(".theme-icon");

    const text =
        themeToggle.querySelector(".theme-text");

    if (isDark) {

        icon.textContent = "☀";

        text.textContent = "Light";

    } else {

        icon.textContent = "☾";

        text.textContent = "Dark";
    }

    localStorage.setItem(
        "planetExplorerTheme",
        isDark ? "dark" : "light"
    );
}


themeToggle.addEventListener(
    "click",
    toggleTheme
);


/* =========================================
   LOAD SAVED THEME
========================================= */

function loadSavedTheme() {

    const savedTheme =
        localStorage.getItem(
            "planetExplorerTheme"
        );

    if (savedTheme === "dark") {

        document.body.classList.add(
            "dark-theme"
        );

        themeToggle.setAttribute(
            "aria-pressed",
            "true"
        );

        themeToggle.querySelector(
            ".theme-icon"
        ).textContent = "☀";

        themeToggle.querySelector(
            ".theme-text"
        ).textContent = "Light";
    }
}


/* =========================================
   INITIALIZE APP
========================================= */

loadSavedTheme();

fetchPlanets();