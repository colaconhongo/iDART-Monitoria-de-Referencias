export function useUtils(){

  let groupedArray = []
    const groupBy = (array, key) => {
      const result = {}
      array.forEach(item => {
        if (!result[item[key]]){
          result[item[key]] = []
        }
        result[item[key]].push(item)
      })
      console.log(array)
      console.log(result)
      groupedArray = result
    }

    const ageCalculator = (dateOfBirth) => {
      console.log(dateOfBirth)
    }

    return {
      groupedArray,
      groupBy,
      groupedMap,
      ageCalculator
    }


}
