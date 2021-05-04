"use strict";$(document).ready((function(){$(window).on("load",(function(){$("#preloader").length&&$("#preloader").delay(100).fadeOut("slow",(function(){$(this).remove()}))}));let t="",e="",a="",r="",n="",o="";const s=function(t){$.ajax({url:"libs/php/getCountryInfo.php",type:"POST",dataType:"json",data:{lang:"en",country:t},success:function(e){const r=e.data[0];"ok"==e.status.name&&($("#textCountry").html(r.countryName),$("#textCapital").html(r.capital),$("#textContinent").html(r.continent),$("#textPopulation").html(r.population),$("#textLanguages").html(r.languages),$("#textArea").html(r.areaInSqKm),n=r.currencyCode,a=r.capital,d(n),c(),i(t,a),l(a))},error:function(t,e,a){alert("Error! Couldn't get informations from Geonames")}})},i=function(t,e){$.ajax({url:"libs/php/getCapitalWeather.php",type:"POST",dataType:"json",data:{city:e,countryCode:t},success:function(t){const e=t.data;if("ok"==t.status.name){$("#weatherHeader").html("Weather in "),$("#weatherLocation").html(e.name),$("#weatherCountry").html(", "+e.sys.country+"<br>"),$("#weatherLat").html("Lat: "+e.coord.lat),$("#weatherLng").html("Lon: "+e.coord.lon),$("#weatherFeels").html("temperature:<br><span class='weather-emoji'>🌡</span><br>"+(e.main.feels_like-273.15).toFixed(2)+"°C"),$("#weatherHumidity").html("humidity:<br><span class='weather-emoji'>💧</span><br>"+e.main.humidity+"%"),$("#weatherWind").html("wind:<br><span class='weather-emoji'>💨</span><br>"+e.wind.speed+"Km/h"),$("#weatherVisibility").html("visibility:<br><span class='weather-emoji'>🏞</span><br>"+e.visibility/1e3+"Km");const t=e.weather[0].description[0].toUpperCase()+e.weather[0].description.substring(1);$("#weatherWeather").html(t);let a="";switch(e.weather[0].icon){case"01d":a="☀️";break;case"01n":a="🌙";break;case"02d":a="⛅️";break;case"02n":case"03d":case"03n":case"04d":case"04n":a="☁️";break;case"09d":case"09n":a="🌦";break;case"10d":case"10n":a="🌧";break;case"11d":case"11n":a="🌩";break;case"13d":case"13n":a="❄️";break;case"50d":case"50n":a="☁️";break;default:a=""}$("#weatherIcon").html(a)}},error:function(t,e,a){alert("Error! Couldn't get weather from Openweather")}})},c=t=>{let e=new Date;const a=e.toDateString().split(" ")[0],r=e.toDateString().split(" ")[1],n=e.toDateString().split(" ")[2],o=e.toDateString().split(" ")[3],s=e.toTimeString().split(" ")[0].split(":")[0]+":"+e.toTimeString().split(" ")[0].split(":")[1];$("#dateEx").html(a+", "+n+" "+r+" "+o+" - "+s)},l=t=>{$.ajax({url:"libs/php/getTimezoneByCity.php",type:"POST",dataType:"json",data:{capital:t},success:function(t){const e=t.data.date_time_txt.split(":")[0]+":"+t.data.date_time_txt.split(":")[1];$("#date").html(e)},error:function(t,e,a){alert("Error! Couldn't retrieve Time")}})},p=function(t){let e=t;switch(t){case"AL":e="Albania";break;case"AZ":e="Azerbaijan";break;case"GA":e="Gabon";break;case"ID":e="Indonesia";break;case"IL":e="Israel";break;case"MD":e="Moldova";break;case"MN":e="Mongolia";break;case"ME":e="Montenegro";break;case"NE":e="Niger";break;case"PA":e="Panama";break;case"PE":e="Peru";break;case"SK":e="Slovakia";break;case"SD":e="Sudan";break;case"TN":e="Tunisia"}$.ajax({url:"libs/php/getCountryFlag.php",type:"POST",dataType:"json",data:{countryName:e,country:t},success:function(t){const e=t.data[0].annotations;"ok"==t.status.name&&($("#textFlag").html(e.flag),$("#textSmallFlag").html(e.flag),$("#textSymbol").html(e.currency.symbol),$("#textCurrencyName").html(e.currency.name),$("#textCurrencyCode").html(e.currency.iso_code),$("#textCallingCode").html(e.callingcode),$("#textTimezone").html(e.timezone.name))},error:function(t,e,a){alert("Error! Couldn't retrieve Flag and other informations from OpenCage")}})},d=function(t){$.ajax({url:"libs/php/getExchangeRate.php",type:"POST",dataType:"json",success:function(e){const a=e.data.rates[t].toFixed(2);"ok"==e.status.name&&$("#textExchRate").html(a)},error:function(t,e,a){alert("Error! Couldn't get Exchange rate from openExchangeRate")}})},m=function(t){$("#textWikipedia").html(`<a href="https://en.wikipedia.org/wiki/${t}" target="_blank">en.wikipedia.org/wiki/${t}</a>`),$("#textGoogle").html(`<a href="https://www.google.com/search?q=${t}" target="_blank">www.google.com/search?q=${t}</a>`)},u=function(t){$.ajax({url:"libs/php/getCovidData.php",type:"POST",dataType:"json",data:{country:t},success:function(t){if("ok"==t.status.name){const e=t.data[0],a=e.lastUpdate.split("T")[0];$("#textConfirmed").html(e.confirmed),$("#textRecovered").html(e.recovered),$("#textCritical").html(e.critical),$("#textDeaths").html(e.deaths),$("#textDate").html(a)}},error:function(t,e,a){alert("Error! Couldn't get Covid Data")}})},h=function(t){$.ajax({url:"libs/php/getPictures.php",type:"POST",dataType:"json",data:{country:t.split(" ").join("%20")},success:function(t){if("ok"==t.status.name){$(".pictures-section").html("");const e=e=>{$(".pictures-section").append(`<li href="#modal-media-image" uk-toggle id=pic${e+1}><img src="${t.data[e].urls.small}" alt="pic-${e+1}" id="pic-${e+1}"/></li>`),$("#pic"+(e+1)).on("click",()=>{$("#modal-pic-container").html(`<img src="${t.data[e].urls.regular}" alt="pic-${e+1}" class="modal-picture"/>`)})};for(let t=0;t<10;t++)e(t)}},error:function(t,e,a){alert("Error! Couldn't get pictures from Unsplash")}})},f=function(t){o=L.geoJSON(t,{style:function(t){return{color:"#004290",weight:2}}}).addTo(g),g.fitBounds(o.getBounds())},g=L.map("map",{zoomControl:!1});L.tileLayer("https://{s}.tile.openstreetmap.fr/hot//{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(g),L.control.zoom({position:"bottomright"}).addTo(g),$.ajax({url:"libs/php/getNameCodeFromFile.php",dataType:"json",success:function(t){const e=[],a=t.data;$.each(a,t=>{"Kosovo"==a[t].name||"N. Cyprus"==a[t].name||"Somaliland"==a[t].name||e.push(a[t].name)}),e.sort(),$.each(e,t=>{$("#selectCountry").append(`<option value="${e[t]}">${e[t]}</option>`)})},error:function(t,e,a){alert("Error! Couldn't get GeoJson for List")}}),navigator.geolocation?navigator.geolocation.getCurrentPosition((function(t){const{latitude:e}=t.coords,{longitude:a}=t.coords;y(e,a)}),()=>{y(51.5287352,-.3817832)}):alert("Geolocation is not supported in your browser");const y=function(a,n){$.ajax({url:"libs/php/getCountryCode.php",type:"POST",dataType:"json",data:{lat:a,lng:n},success:function(a){"ok"==a.status.name&&(t=a.data.trim(),$.ajax({url:"libs/php/getSingleGeoJsonByCode.php",dataType:"json",data:{code:t},success:function(a){const n=a.data;e=n.name,r=n.geometry,$("#selectCountry").val(e),f(r),s(t),p(t),m(e),u(t),h(e)},error:function(t,e,a){alert("Error! Couldn't get geoJSON")}}))},error:function(t,e,a){alert("Error! Sorry, we have problems to retrieve your location")}})};$("#selectCountry").on("change",()=>{const a=$("#selectCountry").val();$.ajax({url:"libs/php/getSingleGeoJsonByName.php",dataType:"json",data:{name:a},success:function(n){const i=n.data;r=i.geometry,t=i.code,e=i.name,s(t),p(t),m(a),u(t),h(a),g.removeLayer(o),f(r)},error:function(t,e,a){alert("Error! Couldn't get GeoJSON for select form")}})}),$(".info-icon").on("click",()=>{$("#infoCard").css("transform","translateX(0px) "),$("#currencyCard").css("transform","translateX(-390px)"),$("#linksCard").css("transform","translateX(-390px) "),$("#covidCard").css("transform","translateX(-390px) ")}),$(".money-icon").on("click",()=>{$("#infoCard").css("transform","translateX(-390px) "),$("#currencyCard").css("transform","translateX(0px)"),$("#linksCard").css("transform","translateX(-390px) "),$("#covidCard").css("transform","translateX(-390px) ")}),$(".links-icon").on("click",()=>{$("#infoCard").css("transform","translateX(-390px) "),$("#currencyCard").css("transform","translateX(-390px)"),$("#linksCard").css("transform","translateX(0) "),$("#covidCard").css("transform","translateX(-390px) ")}),$(".covid-icon").on("click",()=>{$("#infoCard").css("transform","translateX(-390px) "),$("#currencyCard").css("transform","translateX(-390px)"),$("#linksCard").css("transform","translateX(-390px) "),$("#covidCard").css("transform","translateX(0px) ")}),$(".btn-close__weather").on("click",()=>{$(".weather-container").css("transform","translateX(100%)"),$(".btn-weather-in").css("opacity","1"),$(".btn-weather-in").css("transform","translateX(0)")}),$(".btn-weather-in").on("click",()=>{$(".weather-container").css("transform","translateX(0) "),$(".btn-weather-in").css("opacity","0"),$(".btn-weather-in").css("transform","translateX(-208px) ")}),$(".btn-images").on("click",()=>{$(".slide-images").css("transform","translate(0, 0)")}),$("#btn-images-close").on("click",()=>{$(".slide-images").css("transform","translate(-85vh, 100%)")})}));