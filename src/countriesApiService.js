export default class CountriesApiService {
    constructor() {
        this.searchQuery = '';
    }
    
    fetchCountries() {
    const url = `https://restcountries.com/v3.1/name/${this.searchQuery}?fields=name,capital,population,flags,languages`;

        return fetch(url)
            .then(this.onStatusFetch)
    }

    onStatusFetch(response) {
        if (!response.ok) {
            throw new Error(response.status);
        }
        return response.json();
    }

    get query() {
        return this.searchQuery;
    }

    set query(newQuery) {
        this.searchQuery = newQuery;
    }
}