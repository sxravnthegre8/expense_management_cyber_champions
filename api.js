// Get country/currency
fetch('https://restcountries.com/v3.1/all?fields=name,currencies')
  .then(res => res.json())
  .then(data => /* populate country/currency dropdown */);

// Currency conversion
fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`)
  .then(res => res.json())
  .then(data => /* use data.rates[currency] */);