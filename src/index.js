import './css/styles.css';
import CountriesApiService from './countriesApiService';
var debounce = require('lodash.debounce');
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const refs = {
	inputText: document.querySelector('input'),
	countryList: document.querySelector('.country-list'),
	countryInfo: document.querySelector('.country-info'),
};

const countriesApiService = new CountriesApiService();
console.log(countriesApiService);

refs.inputText.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {	

	countriesApiService.query = e.target.value.toLowerCase().trim();	
	// console.log(e.target.value);

	if (!countriesApiService.query) {
		return clearMarkup()
	}
	countriesApiService.fetchCountries()
		.then(createMarkup)
		.catch(onError)
}

function createMarkup(data) {
	if (data.length >= 2 && data.length <= 10) {
		renderCountry(data, markupListCountrys);
	} else if (data.length < 2) {
		renderCountry(data, markupCountry);
	} else {
		clearMarkup();
		Notify.info("Too many matches found. Please enter a more specific name.");
	}
}

function clearMarkup() {
	refs.countryList.innerHTML = '';
}

function renderCountry(data, markupFunction) {
	refs.countryList.innerHTML = data.map(markupFunction).join('');
}

function markupListCountrys(data) {
	return `<li class="list__item--set">
	  <img src="${data.flags.svg}" 
		  alt="${data.flag}" 
		  width=30>
		<span>
		  &nbsp;${data.name.official}
		</span>
		</li>`
}

function markupCountry(data) {
	return `<li class="list__item">
    <img
		  src="${data.flags.svg}" 
		  alt="${data.flag}" 
		  width=40>
		<span>
		  &nbsp;${data.name.official}
		</span>
    <p
		  class="item__text">
			<b>Capital:</b>&nbsp;${data.capital}
		</p>
    <p
		  class="item__text">
			<b>Population:</b>&nbsp;${data.population}
		</p>
    <p
		  class="item__text">
			<b>Languages:</b>&nbsp;${Object.values(data.languages).join(', ')}
		</p>
    </li>`
}

function onError() {
	clearMarkup();
	Notify.failure('Oops, there is no country with that name');
}