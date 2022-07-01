// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import en from 'react-phone-number-input/locale/en.json';
import { Country, getCountries } from 'react-phone-number-input';
import { intersection } from 'lodash';

const blacklistCountries = ['CN', 'IR', 'IQ', 'AF', 'CU', 'CD', 'LR', 'KP', 'SD', 'SY', 'ZW', 'MM', 'CI'];

const filterBlacklistCountries = (c: [string, unknown]) => !blacklistCountries.includes(c[0] as string);

const filteredCountryEntries = Object.entries(en)
  .filter((i) => i[0] !== 'ZZ')
  .filter(filterBlacklistCountries)
  .filter((i) => i[0].length === 2)
  .sort((a, b) => {
    if ((a[1] as string).toLowerCase() > (b[1] as string).toLowerCase()) {
      return 1;
    } return -1;
  });

const finalCountries: Country[] = filteredCountryEntries.map((c) => c[0] as Country);
const countries = intersection(finalCountries, getCountries());

export default countries;
