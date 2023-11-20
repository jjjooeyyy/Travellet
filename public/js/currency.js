/*jshint esversion: 6 */ 
import countryToCurrency from "https://unpkg.com/country-to-currency/index.esm.js";



/* 
// change theme 
themeToggler.addEventListener('click',() => {
     document.body.classList.toggle('dark-theme-variables');
     themeToggler.querySelector('span:nth-child(1)').classList.toggle('active');
     themeToggler.querySelector('span:nth-child(2)').classList.toggle('active');
}) */

///// Country Flag 
const inputBtn = document.querySelector('.input-btn');
const flagFrom = document.querySelector('.flag-from');
const flagTo = document.querySelector('.flag-to');

inputBtn.addEventListener('click', async () => {
  const countryFromInput = document.getElementById('country-from');
  const countryToInput = document.getElementById('country-to');
  const fromContainer = document.querySelector('.from');
  const toContainer = document.querySelector('.to');
  const amountToConvertInput = document.getElementById('amount-to-convert');
  const amountToConvert = parseFloat(amountToConvertInput.value);

try{
  flagFrom.src = `https://flagsapi.com/${countryFromInput.value}/flat/64.png`;
  flagFrom.style.width = '10%';
  fromContainer.insertBefore(flagFrom, fromContainer.firstChild);

  flagTo.src = `https://flagsapi.com/${countryToInput.value}/flat/64.png`;
  flagTo.style.width = '10%';
  toContainer.insertBefore(flagTo, toContainer.firstChild);

  // Get currency codes
  const convertFROM = countryToCurrency[countryFromInput.value];
  const convertTo = countryToCurrency[countryToInput.value];

   const requestURL = `https://v6.exchangerate-api.com/v6/cfe8752aed0f25c766e89aa7/pair/${convertFROM}/${convertTo}`;
  const request = new XMLHttpRequest();
  request.open('GET', requestURL);
  request.responseType = 'json';

  request.onload = function() {
    const response = request.response;
    console.log(response);
    const rate = response.conversion_rate;
    const result = rate * amountToConvert;
    const outputElement = document.getElementById('amount-output');
    outputElement.textContent = `${result.toFixed(2)} ${convertTo}`;
  };

  request.send();
}catch(error){
  console.log(error);
}
});
