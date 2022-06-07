import moment from 'moment';
const monthsEng = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
export default {
    getStatisticMonthByDate(date) {
      const toDateStr = str => new Date(str.replace(/^(\d+)\/(\d+)\/(\d+)$/, '$2/$1/$3'))
    let statisticMonth = 0;
  //  const returnStatisticMonth = (date) => {
        const dayOfMonth =  toDateStr(date).getDate()
       // console.log(dayOfMonth)
           const month =  toDateStr(date).getMonth() +1
                console.log(month)
           
           if(((dayOfMonth >= 21 && month === 12)  || (dayOfMonth <= 20 && month === 1))) statisticMonth = 1;
           if(((dayOfMonth >= 21 && month === 1)  || (dayOfMonth <= 20 && month === 2))) statisticMonth = 2;
           if(((dayOfMonth >= 21 && month === 2)  || (dayOfMonth <= 20 && month === 3))) statisticMonth = 3;
           if(((dayOfMonth >= 21 && month === 3)  || (dayOfMonth <= 20 && month === 4))) statisticMonth = 4;
           if(((dayOfMonth >= 21 && month === 4)  || (dayOfMonth <= 20 && month === 5))) statisticMonth = 5;
           if(((dayOfMonth >= 21 && month === 5)  || (dayOfMonth <= 20 && month === 6))) statisticMonth = 6;
           if(((dayOfMonth >= 21 && month === 6)  || (dayOfMonth <= 20 && month === 7))) statisticMonth = 7;
           if(((dayOfMonth >= 21 && month === 7)  || (dayOfMonth <= 20 && month === 8))) statisticMonth = 8;
           if(((dayOfMonth >= 21 && month === 8)  || (dayOfMonth <= 20 && month === 9))) statisticMonth = 9;
           if(((dayOfMonth >= 21 && month === 9)  || (dayOfMonth <= 20 && month === 10))) statisticMonth =10;
           if(((dayOfMonth >= 21 && month === 10)  || (dayOfMonth <= 20 && month === 11))) statisticMonth = 11;
           if(((dayOfMonth >= 21 && month === 11)  || (dayOfMonth <= 20 && month === 12))) statisticMonth = 12;
           console.log('dia'+dayOfMonth+'mes'+month+'mesEsta'+statisticMonth)
          return statisticMonth - 1;
 //  }
},

    organizeDispensesByMonth (list) 
  {
      var monthsPresent = []
   const map = list.reduce((a, b) => {
 // const m = returnReturnStatisticMonth(b.dispensedate)
 // const m = toDateStr(b.dispensedate).getMonth()
  const m = this.getStatisticMonthByDate(b.dispensedate)
  console.log(m)
  a[m] = (a[m] || 0) + 1
  monthsPresent.push(monthsEng[+m])
     return a
}, {})
   let result = Object.entries(map).map(([key, data]) => ({ data, key: monthsEng[+key] }))
   var monthsNot = monthsEng.filter(item => !monthsPresent.includes(item))
   for (const item of monthsNot) {
     result.push(({ data: 0, key: item }))
   }
  result = result.sort(function (a, b) {
  // sort based on the value in the monthNames object
  return +moment(a.key, 'MMM') - moment(b.key, 'MMM')
})
  return result
  },

   organizeRefferedPatientsByMonth(list)
  {
      var monthsPresent = []
   const map = list.reduce((a, b) => {
     if(b.prescriptiondate !== null){ 
  // const m = toDateStr(b.prescriptiondate).getMonth()
  const m = this.getStatisticMonthByDate(b.prescriptiondate)
  a[m] = (a[m] || 0) + 1
  monthsPresent.push(monthsEng[+m])
     return a
}}, {})
   let result = Object.entries(map).map(([key, data]) => ({ data, key: monthsEng[+key] }))
   var monthsNot = monthsEng.filter(item => !monthsPresent.includes(item))
   for (const item of monthsNot) {
     result.push(({ data: 0, key: item }))
   }
  result = result.sort(function (a, b) {
  // sort based on the value in the monthNames object
  return +moment(a.key, 'MMM') - moment(b.key, 'MMM')
})
  return result
  },

 organizeEpisodesByMonth(list)
  {
      var monthsPresent = []
   const map = list.reduce((a, b) => {
  // const m = toDateStr(b.stopdate).getMonth()
   const m = this.getStatisticMonthByDate(b.stopdate)
  a[m] = (a[m] || 0) + 1
  monthsPresent.push(monthsEng[+m])
     return a
}, {})
   let result = Object.entries(map).map(([key, data]) => ({ data, key: monthsEng[+key] }))
   var monthsNot = monthsEng.filter(item => !monthsPresent.includes(item))
   for (const item of monthsNot) {
     result.push(({ data: 0, key: item }))
   }
  result = result.sort(function (a, b) {
  // sort based on the value in the monthNames object
  return +moment(a.key, 'MMM') - moment(b.key, 'MMM')
})
  return result
  },

  getLastFiveYears () {
  
     const years = [];
     const currentYear = new Date().getFullYear();
     years.push(currentYear)
     for (let i = 1; i < 5; i++)
     {
         years.push(currentYear - i);
     }
     return years;
  }
}
  