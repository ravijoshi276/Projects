export  function cleanRawData(data){
     const convertTimetoIst = (date)=>  {
    
        const parsedDate = new Date(date);
        
      const timeOptions = { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit',
         hour12: true, 
        minute: '2-digit',
        timeZoneName: 'short'
      };
    return  parsedDate.toLocaleString('en-us',timeOptions);
  
  }
    return{
        ...data[0],"current":{...data[0].current,"time":convertTimetoIst(data[0].current.time)},"hourly":{...data[0].hourly,"time":data[0].hourly.time.map(time=>convertTimetoIst(time))},'daily':{...data[0].daily,
            'sunrise':data[0].daily.sunrise.map(item=>convertTimetoIst(item)),
            'sunset':data[0].daily.sunset.map(item=>convertTimetoIst(item)),
            "time": data[0].daily.time.map(item=>convertTimetoIst(item))
        }
      }
   
   
}

export const gorupByHourlyData = (hourlydata)=>{
    if(!hourlydata|| !(hourlydata?.time)) return;

    const datakeys= Object.keys(hourlydata)
    const groupedData ={};
    hourlydata.time.forEach((element,index) => {
        const datekey = element.split(',')[1].trim()
        const timekey= element.split(',')[2].slice(0,9).trim()
        
        if (!groupedData[datekey]){
            groupedData[datekey]= datakeys.reduce((acc,key)=>{
                acc[key]=[];
                return acc;
            },{})

        }

        datakeys.forEach((item)=>{
            
            if (item=='time'){
               groupedData[datekey][item].push(timekey);
                
            }else{
            groupedData[datekey][item].push(hourlydata[item][index])
            }
        }
            
        )       
        
    });
    return groupedData;
   
}
export function cleanDailyData(data){
    if(!data) return;
    const groupedData = {};
    data.time.forEach((item,index)=>{
        const datekey = item.split(',')[1].trim()
        if(!groupedData[datekey]){
            groupedData[datekey]={}
        }
        groupedData[datekey]['sunrise']= data.sunrise[index].split(',')[2].slice(0,9).trim();
        groupedData[datekey]['sunset']= data.sunset[index].split(',')[2].slice(0,9).trim();
        groupedData[datekey]['sunset']= data.sunset[index].split(',')[2].slice(0,9).trim();
        groupedData[datekey]['temperature_2m_max']= data.temperature_2m_max[index];
        groupedData[datekey]['temperature_2m_min']= data.temperature_2m_min[index];
    })
  
    return groupedData;
}
export function timeToMinutes(timeStr) {
  const [time, modifier] = timeStr.toLowerCase().split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (modifier === 'pm' && hours !== 12) hours += 12;
  if (modifier === 'am' && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

export const checkIsDay = (timeStr, dateKey, dailyDataObject) => {
    const dayInfo = dailyDataObject?.[dateKey];
    if (!dayInfo || !dayInfo.sunrise || !dayInfo.sunset) return 1; // Default fallback

    const currentMinutes = timeToMinutes(timeStr);
    const sunriseMinutes = timeToMinutes(dayInfo.sunrise);
    const sunsetMinutes = timeToMinutes(dayInfo.sunset);

    return (currentMinutes >= sunriseMinutes && currentMinutes <= sunsetMinutes) ? 1 : 0;
};