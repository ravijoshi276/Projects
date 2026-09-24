 const wmoCodesDescription={
    "0":"Clear sky",
    "1":"Mainly clear",
    "2":"Partly cloudy",
    "3":"Overcast",
    "45":"Fog ",
    "48":"Depositing rime fog",
    "51":"Light Drizzle, moderate, and dense intensity",
    "53":"Moderate Drizzle",
    "55":"Dense Drizzle",
    "56":"Light Freezing Drizzle",
    "57":"Dense Freezing Drizzle",
    "61":"Slight Rain",
    "63":"Moderate Rain",
    "65":"Heavy Rain",
    "66":"Light Freezing Rain",
    "67":"Heavy Freezing Rain",
    "71":"Slight Snow fall",
    "73":"Moderate Snow fall",
    "75":"Heavy Snow fall",
    "77":"Snow grains",
    "80":"Slight Rain showers",
    "81":"Moderate Rain showers",
    "82":"Heavy Rain showers",
    "85":"Slight Snow showers ",
    "86":"Heavy Snow showers ",
    "95":"Thunderstorm",
    "96":"Slight Thunderstorm with hail",
    "99":"Heavy Thunderstorm with hail"
}

export function getWmoCodeDescription(code){
    return wmoCodesDescription[code];
}