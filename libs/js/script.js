"use strict";

$(document).ready(function () {
  //////////////////////PRELOADER///////////////////////

  $(window).on("load", function () {
    $("#preloader").length &&
      $("#preloader")
        .delay(100)
        .fadeOut("slow", function () {
          $(this).remove();
        });
  });

  //////////////////////////VARIABLES/////////////////////////////////
  let countryCode = "";
  let countryName = "";
  let countryCapital = "";
  let countrygeoJSON = "";
  let currencyCode = "";
  let addedGeoJSON = "";

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////FUNCTIONS/////////////////////////////////////

  ////////////////RETRIEVE MAIN INFO AND DISPLAY IN CARD WITH GEONAMES/////////////////////////

  const retrieveMainInfo = function (countryCode) {
    $.ajax({
      url: "libs/php/getCountryInfo.php",
      type: "POST",
      dataType: "json",
      data: {
        lang: "en",
        country: countryCode,
      },
      success: function (result) {
        // console.log(JSON.stringify(result));

        const temp = result["data"][0];
        if (result.status.name == "ok") {
          const formatPopulation = Number(temp["population"]).toLocaleString(
            "en-US"
          );
          const formatArea = Number(temp["areaInSqKm"]).toLocaleString("en-US");

          $("#textCountry").html(temp["countryName"]);
          $("#textCapital").html(temp["capital"]);
          $("#textContinent").html(temp["continent"]);
          $("#textPopulation").html(formatPopulation);
          $("#textLanguages").html(temp["languages"]);
          $("#textArea").html(formatArea);

          currencyCode = temp["currencyCode"];
          countryCapital = temp["capital"];

          retrieveExchangeRate(currencyCode);
          getTheDate();
          retrieveWeatherCapitalCity(countryCode, countryCapital);
          getTheDateForTimezone(countryCapital);
        }
      },
      error: function (result, a, e) {
        alert("Error! Couldn't get informations from Geonames");
      },
    });
  };

  //////////////////RETRIEVE LOCAL WEATHER WITH OPENWEATHER////////////////////////

  const retrieveWeatherCapitalCity = function (countryCode, capitalCity) {
    $.ajax({
      url: "libs/php/getCapitalWeather.php",
      type: "POST",
      dataType: "json",
      data: {
        city: capitalCity,
        countryCode: countryCode,
      },
      success: function (result) {
        // console.log(JSON.stringify(result));
        const temp = result["data"];
        if (result.status.name == "ok") {
          $("#weatherHeader").html("Weather in ");
          // $("#localization").css("display", "none");
          // $("#compass").css("display", "none");
          $("#weatherLocation").html(temp["name"]);
          $("#weatherCountry").html(", " + temp["sys"]["country"] + "<br>");
          $("#weatherLat").html("Lat: " + temp["coord"]["lat"]);
          $("#weatherLng").html("Lon: " + temp["coord"]["lon"]);
          $("#weatherFeels").html(
            "temperature:<br><span class='weather-emoji'>🌡</span><br>" +
              (temp["main"]["feels_like"] - 273.15).toFixed(2) +
              "°C"
          );
          $("#weatherHumidity").html(
            "humidity:<br><span class='weather-emoji'>💧</span><br>" +
              temp["main"]["humidity"] +
              "%"
          );
          $("#weatherWind").html(
            "wind:<br><span class='weather-emoji'>💨</span><br>" +
              temp["wind"]["speed"] +
              "Km/h"
          );
          $("#weatherVisibility").html(
            "visibility:<br><span class='weather-emoji'>🏞</span><br>" +
              temp["visibility"] / 1000 +
              "Km"
          );

          const capitalizedWeather =
            temp["weather"]["0"]["description"][0].toUpperCase() +
            temp["weather"]["0"]["description"].substring(1);

          $("#weatherWeather").html(capitalizedWeather);

          const iconCode = temp["weather"]["0"]["icon"];
          let iconEmoji = "";

          switch (iconCode) {
            case "01d":
              iconEmoji = "☀️";
              break;
            case "01n":
              iconEmoji = "🌙";
              break;
            case "02d":
              iconEmoji = "⛅️";
              break;
            case "02n":
              iconEmoji = "☁️";
              break;
            case "03d":
              iconEmoji = "☁️";
              break;
            case "03n":
              iconEmoji = "☁️";
              break;
            case "04d":
              iconEmoji = "☁️";
              break;
            case "04n":
              iconEmoji = "☁️";
              break;
            case "09d":
              iconEmoji = "🌦";
              break;
            case "09n":
              iconEmoji = "🌦";
              break;
            case "10d":
              iconEmoji = "🌧";
              break;
            case "10n":
              iconEmoji = "🌧";
              break;
            case "11d":
              iconEmoji = "🌩";
              break;
            case "11n":
              iconEmoji = "🌩";
              break;
            case "13d":
              iconEmoji = "❄️";
              break;
            case "13n":
              iconEmoji = "❄️";
              break;
            case "50d":
              iconEmoji = "☁️";
              break;
            case "50n":
              iconEmoji = "☁️";
              break;
            default:
              iconEmoji = "";
          }

          $("#weatherIcon").html(iconEmoji);
        }
      },
      error: function (result, a, e) {
        alert("Error! Couldn't get weather from Openweather");
      },
    });
  };

  ////////////////////////RETRIEVE DATES///////////

  const getPostfixToDate = (num) => {
    if (num[0] === "0") {
      num = num.replace("0", "");
    }
    if (num == "1" || num == "21" || num == "31") {
      return num + "st";
    } else if (num == "2" || num == "22") {
      return num + "nd";
    } else if (num == "3" || num == "23") {
      return num + "rd";
    } else {
      return num + "th";
    }
  };

  //used in exchange rate
  const getTheDate = (timezone) => {
    let d = new Date();

    const day = d.toDateString().split(" ")[0];
    const month = d.toDateString().split(" ")[1];
    const dayNum = getPostfixToDate(d.toDateString().split(" ")[2]);
    const year = d.toDateString().split(" ")[3];
    const time =
      d.toTimeString().split(" ")[0].split(":")[0] +
      ":" +
      d.toTimeString().split(" ")[0].split(":")[1];

    $("#dateEx").html(
      day + ", " + month + " " + dayNum + ", " + year + " - " + time
    );
  };

  const getTheDateForTimezone = (capital) => {
    $.ajax({
      url: "libs/php/getTimezoneByCity.php",
      type: "POST",
      dataType: "json",
      data: {
        capital: capital,
      },
      success: function (result) {
        // console.log(result);
        // console.log(JSON.stringify(result["data"]["date_time_txt"]));
        const reformatDate =
          result["data"]["date_time_txt"].split(",")[0] +
          ", " +
          result["data"]["date_time_txt"].split(",")[1].split(" ")[1] +
          " " +
          getPostfixToDate(
            result["data"]["date_time_txt"].split(",")[1].split(" ")[2]
          ) +
          ", " +
          result["data"]["date_time_txt"]
            .split(",")[2]
            .split(":")[0]
            .split(" ")[1] +
          " - " +
          result["data"]["date_time_txt"]
            .split(",")[2]
            .split(":")[0]
            .split(" ")[2] +
          ":" +
          result["data"]["date_time_txt"].split(",")[2].split(":")[1];

        $("#date").html(reformatDate);
      },
      error: function (result, a, e) {
        alert("Error! Couldn't retrieve Time");
      },
    });
  };

  /////////////////RETRIEVE FLAG & CURRENCY OPENCAGE///////////////////////////
  const retrieveFlagCurrency = function (countryCode) {
    //sorting exceptional cases that don't retrieve with only countrycode
    let countryTemp = countryCode;
    switch (countryCode) {
      case "AL":
        countryTemp = "Albania";
        break;
      case "AZ":
        countryTemp = "Azerbaijan";
        break;
      case "GA":
        countryTemp = "Gabon";
        break;
      case "ID":
        countryTemp = "Indonesia";
        break;
      case "IL":
        countryTemp = "Israel";
        break;
      case "MD":
        countryTemp = "Moldova";
        break;
      case "MN":
        countryTemp = "Mongolia";
        break;
      case "ME":
        countryTemp = "Montenegro";
        break;
      case "NE":
        countryTemp = "Niger";
        break;
      case "PA":
        countryTemp = "Panama";
        break;
      case "PE":
        countryTemp = "Peru";
        break;
      case "SK":
        countryTemp = "Slovakia";
        break;
      case "SD":
        countryTemp = "Sudan";
        break;
      case "TN":
        countryTemp = "Tunisia";
        break;
    }

    $.ajax({
      url: "libs/php/getCountryFlag.php",
      type: "POST",
      dataType: "json",
      data: {
        countryName: countryTemp,
        country: countryCode,
      },
      success: function (result) {
        // console.log(JSON.stringify(result));
        const temp = result["data"]["0"]["annotations"];
        if (result.status.name == "ok") {
          $("#textFlag").html(temp["flag"]);
          $("#textSmallFlag").html(temp["flag"]);
          $("#textSymbol").html(temp["currency"]["symbol"]);
          $("#textCurrencyName").html(temp["currency"]["name"]);
          $("#textCurrencyCode").html(temp["currency"]["iso_code"]);
          $("#textCallingCode").html(temp["callingcode"]);
          $("#textTimezone").html(temp["timezone"]["name"]);
        }
      },
      error: function (result, a, e) {
        alert(
          "Error! Couldn't retrieve Flag and other informations from OpenCage"
        );
      },
    });
  };

  /////////////////RETRIEVE EXCHANGE RATE OPENEXCHANGERATES///////////////////////////

  const retrieveExchangeRate = function (currencyCode) {
    $.ajax({
      url: "libs/php/getExchangeRate.php",
      type: "POST",
      dataType: "json",

      success: function (result) {
        // console.log(result["data"]["rates"][currencyCode]);
        const exchangerate = result["data"]["rates"][currencyCode].toFixed(2);
        const formatExchangeRate = Number(exchangerate).toLocaleString("en-US");

        if (result.status.name == "ok") {
          $("#textExchRate").html(formatExchangeRate);
        }
      },
      error: function (result, a, e) {
        alert("Error! Couldn't get Exchange rate from openExchangeRate");
      },
    });
  };

  /////////////////RETRIEVE WIKIPEDIA///////////////////////////

  const retrieveLinks = function (countryName) {
    $("#textWikipedia").html(
      `<a href="https://en.wikipedia.org/wiki/${countryName}" target="_blank">en.wikipedia.org/wiki/${countryName}</a>`
    );
    $("#textGoogle").html(
      `<a href="https://www.google.com/search?q=${countryName}" target="_blank">www.google.com/search?q=${countryName}</a>`
    );
  };

  /////////////////RETRIEVE COVID DATA POSTMAN API///////////////////////////

  const retrieveCovidData = function (countryCode) {
    $.ajax({
      url: "libs/php/getCovidData.php",
      type: "POST",
      dataType: "json",
      data: {
        country: countryCode,
      },
      success: function (result) {
        // console.log(JSON.stringify(result["data"][0]));
        if (result.status.name == "ok") {
          const subData = result["data"][0];

          const formatConfirmed = Number(subData["confirmed"]).toLocaleString(
            "en-US"
          );
          const formatRecovered = Number(subData["recovered"]).toLocaleString(
            "en-US"
          );
          const formatCritical = Number(subData["critical"]).toLocaleString(
            "en-US"
          );
          const formatDeaths = Number(subData["deaths"]).toLocaleString(
            "en-US"
          );

          $("#textConfirmed").html(formatConfirmed);
          $("#textRecovered").html(formatRecovered);
          $("#textCritical").html(formatCritical);
          $("#textDeaths").html(formatDeaths);

          const lupdate = subData["lastUpdate"].split("T")[0];

          let month = lupdate.split("-")[1];
          switch (month) {
            case "01":
              month = "January";
              break;
            case "02":
              month = "February";
              break;
            case "03":
              month = "March";
              break;
            case "04":
              month = "April";
              break;
            case "05":
              month = "May";
              break;
            case "06":
              month = "June";
              break;
            case "07":
              month = "July";
              break;
            case "08":
              month = "August";
              break;
            case "09":
              month = "September";
              break;
            case "10":
              month = "October";
              break;
            case "11":
              month = "November";
              break;
            case "12":
              month = "December";
              break;
          }
          const reFormatDate =
            month +
            " " +
            getPostfixToDate(lupdate.split("-")[2]) +
            ", " +
            lupdate.split("-")[0];
          $("#textDate").html(reFormatDate);
        }
      },
      error: function (result, a, e) {
        alert("Error! Couldn't get Covid Data");
      },
    });
  };

  /////////////////RETRIEVE PICTURES FROM UNSPLASH///////////////////////////

  const retrievePictures = function (countryName) {
    $.ajax({
      url: "libs/php/getPictures.php",
      type: "POST",
      dataType: "json",
      data: {
        country: countryName.split(" ").join("%20"),
      },
      success: function (result) {
        // console.log(JSON.stringify(result));
        if (result.status.name == "ok") {
          $(".pictures-section").html("");
          const getPic = (i) => {
            $(".pictures-section").append(
              `<li href="#modal-media-image" uk-toggle id=pic${
                i + 1
              }><img src="${result["data"][i]["urls"]["small"]}" alt="pic-${
                i + 1
              }" id="pic-${i + 1}"/></li>`
            );
            $(`#pic${i + 1}`).on("click", () => {
              $("#modal-pic-container").html(
                `<img src="${result["data"][i]["urls"]["regular"]}" alt="pic-${
                  i + 1
                }" class="modal-picture"/>`
              );
            });
          };

          for (let i = 0; i < 10; i++) {
            getPic(i);
          }
        }
      },
      error: function (result, a, e) {
        alert("Error! Couldn't get pictures from Unsplash");
      },
    });
  };

  ///////////////Create Select List//////////////////////
  const createSelectList = function () {
    $.ajax({
      url: "libs/php/getNameCodeFromFile.php",
      dataType: "json",
      success: function (data) {
        // console.log(JSON.stringify(data["data"][0]));
        // console.log(JSON.stringify(data));

        //Retrieve json data and place name in the select tag
        const countriesArray = [];
        const temp = data["data"];
        $.each(temp, (country) => {
          if (
            temp[country]["name"] == "Kosovo" ||
            temp[country]["name"] == "N. Cyprus" ||
            temp[country]["name"] == "Somaliland"
          ) {
          } else {
            countriesArray.push(temp[country]["name"]);
          }
        });
        countriesArray.sort();

        ////////////////////CREATE SELECT LIST////////////////
        $.each(countriesArray, (country) => {
          $("#selectCountry").append(
            `<option value="${countriesArray[country]}">${countriesArray[country]}</option>`
          );
        });
      },
      error: function (result, a, e) {
        alert("Error! Couldn't get GeoJson for List");
      },
    });
  };

  //////////////REMOVE MAP HIGHLIGHT///////////////////////////

  const removeMap = function () {
    map.removeLayer(addedGeoJSON);
  };

  //////////////UPDATE MAP/////////////////////////////////////
  const updateMap = function (geoJSON) {
    addedGeoJSON = L.geoJSON(geoJSON, {
      style: function (feature) {
        return { color: "#004290", weight: 2 };
      },
    }).addTo(map);

    map.fitBounds(addedGeoJSON.getBounds());
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////////LOADING SITE////////////////////////////////////////////////

  //////////////////////DISPLAY MAP///////////////////////////
  const map = L.map("map", {
    zoomControl: false,
  });

  L.tileLayer("https://{s}.tile.openstreetmap.fr/hot//{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  //add zoom control with your options
  L.control
    .zoom({
      position: "bottomright",
    })
    .addTo(map);

  ////////////////////CREATE SELECT LIST////////////////
  createSelectList();

  //////////////////////////INITIALIZE MAP WITH GEOLOCATION///////////////////////////////////////////////////////////////////////////////////////////////////////

  /////////////////////CONDITIONAL TO GEOLOCATION///////////////////
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const { latitude } = position.coords;
        const { longitude } = position.coords;

        // retrieveLocalWeather(latitude, longitude);
        initialize(latitude, longitude);

        // L.marker([latitude, longitude]).addTo(map);
        // $(".weather-container ").css("opacity", "1");
        // $(".weather-container ").css("display", "grid");
      },
      () => {
        //COORDINATES OF LONDON
        const latitude = 51.5287352;
        const longitude = -0.3817832;

        initialize(latitude, longitude);
      }
    );
  } else {
    alert("Geolocation is not supported in your browser");
  }

  const initialize = function (latitude, longitude) {
    //////////////////////RETRIEVE COUNTRY CODE FROM LOCATION///////////////////
    $.ajax({
      url: "libs/php/getCountryCode.php",
      type: "POST",
      dataType: "json",
      data: { lat: latitude, lng: longitude },
      success: function (result) {
        // console.log(JSON.stringify(result));
        if (result.status.name == "ok") {
          countryCode = result["data"].trim();

          //////////RETRIEVE GEOJSON FROM LOCATION////////////
          $.ajax({
            url: "libs/php/getSingleGeoJsonByCode.php",
            dataType: "json",
            data: { code: countryCode },
            success: function (data) {
              // console.log(JSON.stringify(data));
              const temp = data["data"];

              countryName = temp["name"];
              countrygeoJSON = temp["geometry"];

              $("#selectCountry").val(countryName);

              //update map
              updateMap(countrygeoJSON);

              //GET INFO
              retrieveMainInfo(countryCode);
              retrieveFlagCurrency(countryCode);
              retrieveLinks(countryName);
              retrieveCovidData(countryCode);

              retrievePictures(countryName);
            },
            error: function (t, a, e) {
              alert("Error! Couldn't get geoJSON");
            },
          });
        }
      },
      error: function (result, a, e) {
        alert("Error! Sorry, we have problems to retrieve your location");
      },
    });
  };

  //////////RETRIEVE COUNTRY FROM LIST AND insert in MAP//////////////////
  $("#selectCountry").on("change", () => {
    const selectedCountry = $("#selectCountry").val();
    $.ajax({
      url: "libs/php/getSingleGeoJsonByName.php",
      dataType: "json",
      data: { name: selectedCountry },
      success: function (data) {
        // console.log(JSON.stringify(data));
        const temp = data["data"];

        //update variables
        countrygeoJSON = temp["geometry"];
        countryCode = temp["code"];
        countryName = temp["name"];

        //load cards
        retrieveMainInfo(countryCode);
        retrieveFlagCurrency(countryCode);
        retrieveLinks(selectedCountry);
        retrieveCovidData(countryCode);

        retrievePictures(selectedCountry);

        //update map
        removeMap();
        updateMap(countrygeoJSON);
      },
      error: function (t, a, e) {
        alert("Error! Couldn't get GeoJSON for select form");
      },
    });
  });

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////CARD ANIMATIONS////////////////////////////////

  $(".info-icon").on("click", () => {
    $("#infoCard").css("transform", "translateX(0px) ");
    $("#currencyCard").css("transform", "translateX(-390px)");
    $("#linksCard").css("transform", "translateX(-390px) ");
    $("#covidCard").css("transform", "translateX(-390px) ");
  });
  $(".money-icon").on("click", () => {
    $("#infoCard").css("transform", "translateX(-390px) ");
    $("#currencyCard").css("transform", "translateX(0px)");
    $("#linksCard").css("transform", "translateX(-390px) ");
    $("#covidCard").css("transform", "translateX(-390px) ");
  });
  $(".links-icon").on("click", () => {
    $("#infoCard").css("transform", "translateX(-390px) ");
    $("#currencyCard").css("transform", "translateX(-390px)");
    $("#linksCard").css("transform", "translateX(0) ");
    $("#covidCard").css("transform", "translateX(-390px) ");
  });
  $(".covid-icon").on("click", () => {
    $("#infoCard").css("transform", "translateX(-390px) ");
    $("#currencyCard").css("transform", "translateX(-390px)");
    $("#linksCard").css("transform", "translateX(-390px) ");
    $("#covidCard").css("transform", "translateX(0px) ");
  });

  ////////////////////ANIMATION WEATHER SECTION//////////////////////////////////////

  $(".btn-close__weather").on("click", () => {
    $(".weather-container").css("transform", "translateX(100%)");
    $(".btn-weather-in").css("opacity", "1");
    $(".btn-weather-in").css("transform", "translateX(0)");
  });
  $(".btn-weather-in").on("click", () => {
    $(".weather-container").css("transform", "translateX(0) ");
    $(".btn-weather-in").css("opacity", "0");
    $(".btn-weather-in").css("transform", "translateX(-208px) ");
  });

  //////////////////////ANIMATION PICTURES//////////////////////

  $(".btn-images").on("click", () => {
    $(".slide-images").css("transform", "translate(0, 0)");
  });
  $("#btn-images-close").on("click", () => {
    $(".slide-images").css("transform", "translate(-85vh, 100%)");
  });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
