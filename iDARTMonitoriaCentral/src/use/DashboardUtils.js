export default {
    
    getStatisticMonthByDate(date) {
        const toDateStr = str => new Date(str.replace(/^(\d+)\/(\d+)\/(\d+)$/, '$2/$1/$3'))
    let statisticMonth = 0;
  //  const returnStatisticMonth = (date) => {
        const dayOfMonth =  toDateStr(date).getDate()
        console.log(dayOfMonth)
           const month =  toDateStr(date).getMonth()
                console.log(month)
           
           if(((dayOfMonth >= 21 && month == 12)  || (dayOfMonth <= 20 && month === 1))) statisticMonth = 1;
           if(((dayOfMonth >= 21 && month === 1)  || (dayOfMonth <= 20 && month === 2))) statisticMonth = 2;
           if(((dayOfMonth >= 21 && month === 2)  || (dayOfMonth <= 20 && month === 3))) statisticMonth = 3;
           if(((dayOfMonth >= 21 && month === 3)  || (dayOfMonth <= 20 && month === 4))) statisticMonth = 4;
           if(((dayOfMonth >= 21 && month === 4)  || (dayOfMonth <= 20 && month === 5))) statisticMonth = 5;
           if(((dayOfMonth >= 21 && month === 5)  || (dayOfMonth <= 20 && month === 6))) statisticMonth = 6;
           if(((dayOfMonth >= 21 && month === 6)  || (dayOfMonth <= 20 && month === 7))) statisticMonth = 7;
           if(((dayOfMonth >= 21 && month === 7)  || (dayOfMonth <= 20 && month === 8))) statisticMonth = 8;
           if(((dayOfMonth >= 21 && month === 8)  || (dayOfMonth <= 20 && month === 9))) statisticMonth = 9;
           if(((dayOfMonth >= 21 && month === 9)  || (dayOfMonth <= 20 && month === 10)))statisticMonth =10;
           if(((dayOfMonth >= 21 && month === 10)  || (dayOfMonth <= 20 && month === 11))) statisticMonth = 11;
           if(((dayOfMonth >= 21 && month === 11)  || (dayOfMonth <= 20 && month === 12))) statisticMonth = 12;
          return statisticMonth;
   
 //  }
  
}
  
  }
  