import locations from 'countrycitystatejson';
import helper from './request.util';

const getCountryByName = (country) => {
  const lowerCountry = country ? country.toLowerCase() : '';
  return locations.getCountries().find(c => c.name.toLowerCase() === lowerCountry);
};

const validateCountryCity = async (country, city) => {
  const upCountry = country ? country.toUpperCase() : '';

  const cityLower = city ? city.toLowerCase() : '';
  const countryByname = getCountryByName(country);
  const shortName = countryByname ? countryByname.shortName : upCountry;
  const existingCountry = locations.getCountryByShort(shortName);

  if (!existingCountry) return { error: `${country} is not a valid country` };
  const { suggestions, error, names } = helper.getCityData(existingCountry.states, cityLower);
  if (error) {
    return { error, suggestions };
  }
  if (cityLower && !names.find(place => place === cityLower)) {
    return { error: `cannot find ${city} in ${existingCountry.name}` };
  }
  return { country: existingCountry.name, city: cityLower };
};

export default validateCountryCity;
