// DOM Elements
const countrySelect = document.getElementById('country');
const stateSelect = document.getElementById('state');
const citySelect = document.getElementById('city');
const resultCard = document.getElementById('result-card');

// Temp Data Storage
let selectedCountryData = {};
let selectedStateData = {};
let selectedCityData = {};

// API Base URL (assuming running on same host)
const hostUrl = window.location.origin;
const API_BASE = `${hostUrl}/api`;
// const API_BASE = 'http://localhost:3000/api';

// --- Initialization ---
window.addEventListener('DOMContentLoaded', () => {
    fetchCountries();
});

// --- Event Listeners ---

// Country Change
countrySelect.addEventListener('change', async (e) => {
    const countryId = e.target.value;

    // 1. Find and store selected country data
    // We need to fetch or use stored data. To be safe/precise, we can fetch by ID or find in current options.
    // For specific requirement "country = name,capital,currency,phonecode", let's get it from the full list or fetch by ID.
    // Optimization: We can store the full country object in the option element dataset or just fetch by ID. 
    // Fetching by ID is cleaner for data integrity.

    try {
        const res = await fetch(`${API_BASE}/countries/${countryId}`);
        const json = await res.json();
        if (json.success) {
            const data = json.data; // The country object
            selectedCountryData = {
                name: data.name,
                capital: data.capital,
                currency: data.currency,
                phonecode: data.phonecode,
                iso2: data.iso2
            };

            // 2. Enable State, Disable City
            resetSelect(stateSelect, 'Select State');
            resetSelect(citySelect, 'Select City');
            citySelect.disabled = true;
            resultCard.classList.add('hidden');
            document.querySelector('.google-map-section').classList.remove('active');

            // 3. Fetch States
            fetchStates(data.iso2); // Requirement says "country_code" for state api? -> API is /states/country/:iso2
        }
    } catch (err) {
        console.error("Error fetching country details:", err);
    }
});

// State Change
stateSelect.addEventListener('change', async (e) => {
    const stateId = e.target.value; // Ideally we might want iso2 here depending on city api

    // 1. Find State Data
    // We need state_code/iso2 for the city API.
    // The option value could be the ID, and we can store iso2 in dataset.
    const selectedOption = stateSelect.options[stateSelect.selectedIndex];
    const stateCode = selectedOption.dataset.iso2;
    const stateName = selectedOption.text;

    selectedStateData = {
        name: stateName,
        iso2: stateCode,
        country_code: selectedCountryData.iso2
    };

    // 2. Enable City
    resetSelect(citySelect, 'Select City');
    resultCard.classList.add('hidden');
    document.querySelector('.google-map-section').classList.remove('active');

    // 3. Fetch Cities
    if (selectedCountryData.iso2 && stateCode) {
        fetchCities(selectedCountryData.iso2, stateCode);
    }
});

// City Change
citySelect.addEventListener('change', (e) => {
    // 1. Find City Data
    // The cities API returns full list, we have the list in dropdown, but events give value.
    // Let's store coords in dataset.
    const selectedOption = citySelect.options[citySelect.selectedIndex];
    const lat = selectedOption.dataset.lat;
    const lng = selectedOption.dataset.lng;
    const cityName = selectedOption.text;

    selectedCityData = {
        name: cityName,
        latitude: lat,
        longitude: lng
    };

    // 2. Render Final Card
    renderDetails();
});


// --- Details Functions ---

async function fetchCountries() {
    try {
        const res = await fetch(`${API_BASE}/countries`);
        const json = await res.json();
        if (json.success) {
            populateSelect(countrySelect, json.data, 'id', 'name');
        }
    } catch (err) {
        console.error("Failed to load countries", err);
    }
}

async function fetchStates(countryIso2) {
    try {
        stateSelect.disabled = true;
        stateSelect.innerHTML = '<option>Loading...</option>';

        const res = await fetch(`${API_BASE}/states/country/${countryIso2}`);
        const json = await res.json();

        if (json.success) {
            resetSelect(stateSelect, 'Select State');
            populateSelect(stateSelect, json.data, 'id', 'name', (opt, item) => {
                opt.dataset.iso2 = item.iso2; // Store ISO2 for City API
            });
            stateSelect.disabled = false;
        } else {
            resetSelect(stateSelect, 'No States Found');
        }
    } catch (err) {
        console.error("Failed to load states", err);
        stateSelect.disabled = false;
    }
}

async function fetchCities(countryCode, stateCode) {
    try {
        citySelect.disabled = true;
        citySelect.innerHTML = '<option>Loading...</option>';

        const res = await fetch(`${API_BASE}/cities/${countryCode}/${stateCode}`);
        const json = await res.json();

        if (json.success) {
            resetSelect(citySelect, 'Select City');
            populateSelect(citySelect, json.data, 'id', 'name', (opt, item) => {
                opt.dataset.lat = item.latitude;
                opt.dataset.lng = item.longitude;
            });
            citySelect.disabled = false;
        } else {
            resetSelect(citySelect, 'No Cities Found');
        }
    } catch (err) {
        console.error("Failed to load cities", err);
        citySelect.disabled = false;
    }
}

// --- Helper Functions ---

function populateSelect(selectElement, data, valueKey, textKey, customAttrCb = null) {
    data.forEach(item => {
        const option = document.createElement('option');
        option.value = item[valueKey];
        option.textContent = item[textKey];
        if (customAttrCb) customAttrCb(option, item);
        selectElement.appendChild(option);
    });
}

function resetSelect(selectElement, placeholder) {
    selectElement.innerHTML = '';
    const defOption = document.createElement('option');
    defOption.selected = true;
    defOption.disabled = true;
    defOption.textContent = placeholder;
    selectElement.appendChild(defOption);
}

function renderDetails() {
    // Country
    document.getElementById('res-country-name').textContent = selectedCountryData.name;
    document.getElementById('res-country-capital').textContent = selectedCountryData.capital;
    document.getElementById('res-country-currency').textContent = selectedCountryData.currency;
    document.getElementById('res-country-phone').textContent = `+${selectedCountryData.phonecode}`;

    // State
    document.getElementById('res-state-name').textContent = selectedStateData.name;
    document.getElementById('res-state-code').textContent = selectedStateData.iso2;

    // City
    document.getElementById('res-city-name').textContent = selectedCityData.name;
    document.getElementById('res-city-lat').textContent = selectedCityData.latitude;
    document.getElementById('res-city-lng').textContent = selectedCityData.longitude;
    initMap(selectedCityData.latitude, selectedCityData.longitude);
    // Show Card
    resultCard.classList.remove('hidden');
}

// Map instance
let map = null;

function initMap(lat, lng) { //google map
    const mapSection = document.querySelector('.google-map-section');
    mapSection.classList.add('active');

    // If map is already initialized, just update view and marker
    if (map) {
        map.setView([lat, lng], 13);
        // Clear existing markers
        map.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });
        L.marker([lat, lng]).addTo(map);
    } else {
        // Initialize map
        map = L.map('google-map').setView([lat, lng], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
        L.marker([lat, lng]).addTo(map);
    }

    // Invalidate size to ensure it renders correctly after becoming visible
    setTimeout(() => {
        map.invalidateSize();
    }, 100);
}

