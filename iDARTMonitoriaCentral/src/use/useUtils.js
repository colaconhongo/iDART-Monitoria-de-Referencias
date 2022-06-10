import moment from 'moment';
export function useUtils() {
  let groupedArray = [];
  const groupBy = (array, key) => {
    const result = {};
    array.forEach((item) => {
      if (!result[item[key]]) {
        result[item[key]] = [];
      }
      result[item[key]].push(item);
    });
    groupedArray = result;
  };

  const ageCalculator = (birthDate) => {
    if (moment(birthDate).isValid()) {
      const patientBirthDate = moment(birthDate);
      const todayDate = moment(new Date());
      const idade = todayDate.diff(patientBirthDate, 'years');
      return idade;
    }
  };

  return {
    groupedArray,
    groupBy,
    ageCalculator,
  };
}
