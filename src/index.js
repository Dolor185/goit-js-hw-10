import './css/styles.css';

import {fetchCountries} from './js/fetchCountries';
import { createPrewiewMarkup, createCountryInfoMarkup } from './js/markup';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;

const refs = {
    search : document.querySelector('#search-box'),
    countryList : document.querySelector('.country-list'),
    countryInfo : document.querySelector('.country-info'),
};

let query = '';

refs.search.addEventListener('input', debounce(onSearchInput, DEBOUNCE_DELAY));

function onSearchInput(e) {

    clearCountryList();
    clearCountryInfo();
    query = e.target.value.trim().toLowerCase();

    if(!query){
        return
    }

    fetchCountries(query).then(data => {
        if (data.length === 1) {
          renderCountryInfoMarkup(data);
        } else if (data.length >= 2 && data.length <= 10) {
          renderPrewiewMarkup(data);
        } else {
            onManyMatches();
          }
      })
      .catch(error => {
        onInvalidName();

      });
  }



function renderPrewiewMarkup(data) {
    const markup = data.map(createPrewiewMarkup).join('');
    refs.countryList.innerHTML = markup;
  }

  function renderCountryInfoMarkup(data) {
    const markup = data.map(createCountryInfoMarkup).join('');
    refs.countryInfo.innerHTML = markup;
  }


  function clearCountryList() {
    refs.countryList.innerHTML = '';
  }
  
  function clearCountryInfo() {
    refs.countryInfo.innerHTML = '';
  }


  function onManyMatches() {
    return Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  }


  function onInvalidName() {
    return Notify.failure('Oops, there is no country with that name');
  }