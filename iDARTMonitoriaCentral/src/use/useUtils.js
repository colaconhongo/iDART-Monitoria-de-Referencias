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

    return {
      groupedArray,
      groupBy,
      groupedMap
    }


}
