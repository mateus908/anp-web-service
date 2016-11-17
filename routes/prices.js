var express = require('express');
var request = require("request");
var cheerio = require('cheerio');
var router = express.Router();
var models = require('../models');

//-----------------------------------------------------------------------------
// Array with States and Fuel names
//-----------------------------------------------------------------------------

  var stateNames = new Array(
    "Acre", "Alagoas", "Amapa", "Amazonas", "Bahia", "Ceara", "Distrito Federal",
    "Espirito Santo", "Goias", "Maranhao", "Mato Grosso", "Mato Grosso Do Sul",
    "Minas Gerais", "Para", "Paraiba", "Parana", "Pernambuco", "Piaui", "Rio De Janeiro",
    "Rio Grande Do Norte", "Rio Grande Do Sul", "Rondonia", "Roraima", "Santa Catarina",
    "Sao Paulo", "Sergipe", "Tocantins"
  );

  var stateSelection = new Array(
    "AC*ACRE", "AL*ALAGOAS", "AP*AMAPA", "AM*AMAZONAS", "BA*BAHIA", "CE*CEARA", "DF*DISTRITO@FEDERAL",
    "ES*ESPIRITO@SANTO", "GO*GOIAS", "MA*MARANHAO", "MT*MATO@GROSSO", "MS*MATO@GROSSO@DO@SUL",
    "MG*MINAS@GERAIS", "PA*PARA", "PB*PARAIBA", "PR*PARANA", "PE*PERNAMBUCO", "PI*PIAUI", "RJ*RIO@DE@JANEIRO",
    "RN*RIO@GRANDE@DO@NORTE", "RS*RIO@GRANDE@DO@SUL", "RO*RONDONIA", "RR*RORAIMA", "SC*SANTA@CATARINA",
    "SP*SAO@PAULO", "SE*SERGIPE", "TO*TOCANTINS"
  );

  var fuelNames = new Array("Gasolina", "Etanol", "GNV", "Diesel", "Diesel S10", "GLP");

  var fuelSelection = new Array("487*Gasolina", "643*Etanol", "476*GNV", "532*Diesel", "812*Diesel@S10", "462*GLP");

//-----------------------------------------------------------------------------
// API Implementation
//-----------------------------------------------------------------------------

// GET prices listing
router.get('/', function(req, res, next) {
  var states = new Array();

  var statistics = new Array();

  var statistic = {
    fueltype: '',
    consumer_price: {
      cp_avgPrice: 0.0,
      cp_stdDeviation: 0.0,
      cp_minPrice: 0.0,
      cp_maxPrice: 0.0,
      cp_avgMargin: 0.0
    },
    distribution_price: {
      dp_avgPrice: 0.0,
      dp_stdDeviation: 0.0,
      dp_minPrice: 0.0,
      dp_maxPrice: 0.0
    }
  }

  var state = models.State.findAll({
    attributes: ['name']
  }).then(function(states){
    //res.json(states);
  });
});

// Web Scraper
router.get('/web-scraper', function(req, res, next) {
  //var states = new Array();

  var stateNames = new Array(
    "Acre", "Alagoas", "Amapa", "Amazonas", "Bahia", "Ceara", "Distrito Federal",
    "Espirito Santo", "Goias", "Maranhao", "Mato Grosso", "Mato Grosso Do Sul",
    "Minas Gerais", "Para", "Paraiba", "Parana", "Pernambuco", "Piaui", "Rio De Janeiro",
    "Rio Grande Do Norte", "Rio Grande Do Sul", "Rondonia", "Roraima", "Santa Catarina",
    "Sao Paulo", "Sergipe", "Tocantins"
  );

  var stateSelection = new Array(
    "AC*ACRE", "AL*ALAGOAS", "AP*AMAPA", "AM*AMAZONAS", "BA*BAHIA", "CE*CEARA", "DF*DISTRITO@FEDERAL",
    "ES*ESPIRITO@SANTO", "GO*GOIAS", "MA*MARANHAO", "MT*MATO@GROSSO", "MS*MATO@GROSSO@DO@SUL",
    "MG*MINAS@GERAIS", "PA*PARA", "PB*PARAIBA", "PR*PARANA", "PE*PERNAMBUCO", "PI*PIAUI", "RJ*RIO@DE@JANEIRO",
    "RN*RIO@GRANDE@DO@NORTE", "RS*RIO@GRANDE@DO@SUL", "RO*RONDONIA", "RR*RORAIMA", "SC*SANTA@CATARINA",
    "SP*SAO@PAULO", "SE*SERGIPE", "TO*TOCANTINS"
  );

  var fuelNames = new Array("Gasolina", "Etanol", "GNV", "Diesel", "Diesel S10", "GLP");

  var fuelSelection = new Array("487*Gasolina", "643*Etanol", "476*GNV", "532*Diesel", "812*Diesel@S10", "462*GLP");

  var currentState;
  // search for attributes
  models.State.findOne({ where: {name: 'Acre'} }).then(function(state) {
    if (state !== null) {
      currentState = state;
    } else {
      res.json({status: 'DB:State ' + 'Acre' + ' not found'});
    }
  })

  var currentFuel;
  // search for attributes
  models.FuelType.findOne({ where: {name: 'Gasolina'} }).then(function(fuel) {
    if (fuel !== null) {
      currentFuel = fuel;
    } else {
      //TODO
      res.json({status: 'DB:FuelType ' + 'Gasolina' + ' not found'});
    }
  })

  var options = {
    method: 'POST',
    url: 'http://www.anp.gov.br/preco/prc/Resumo_Por_Estado_Municipio.asp',
    headers: {
      'postman-token': '7a575b04-03c4-ca8c-fea1-90da9b9abe90',
      'cache-control': 'no-cache',
      'content-type': 'application/x-www-form-urlencoded'
    },
    form: {
      selSemana: '908*De 06/11/2016 a 12/11/2016',
      desc_Semana: 'de 06/11/2016 a 12/11/2016',
      cod_Semana: '908',
      selEstado: 'AC*ACRE',
      selCombustivel: '487*Gasolina' 
    }
  };
  
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    var $ = cheerio.load(body);

    // Define the variables we're going to capture
    /*
    var cities = new Array();

    var state = {
      state_name : "Acre",
      cities : [],
      dates : {
        from: "2016-11-06",
        to: "2016-11-12"
      }
    };
    */

    $('.lincol').filter(function(){
      var data = $(this);

      data.parent().prev().nextAll().each(function() {
        /*
        var city = {
          name: "",
          statistics: {}
        }
        */

        var city_name = $(this).children().first().children().first().text();
        var tdElem = $(this).children().first().next().next();

        models.City
        .findOrCreate({where: {name: city_name, state_pk: currentState.id}})
        .spread(function(city, created) {
          console.log(created);
          console.log(city.id);
          console.log(city.name);

          var consumer_price = {
            cp_avgPrice: 0.0,
            cp_stdDeviation: 0.0,
            cp_minPrice: 0.0,
            cp_maxPrice: 0.0,
            cp_avgMargin: 0.0
          };
          var distribution_price = {
            dp_avgPrice: 0.0,
            dp_stdDeviation: 0.0,
            dp_minPrice: 0.0,
            dp_maxPrice: 0.0
          };

          consumer_price.cp_avgPrice = parseFloat(tdElem.text().replace(',', '.'));
          tdElem = tdElem.next();
          consumer_price.cp_stdDeviation = parseFloat(tdElem.text().replace(',', '.'));
          tdElem = tdElem.next();
          consumer_price.cp_minPrice = parseFloat(tdElem.text().replace(',', '.'));
          tdElem = tdElem.next();
          consumer_price.cp_maxPrice = parseFloat(tdElem.text().replace(',', '.'));
          tdElem = tdElem.next();
          consumer_price.cp_avgMargin = parseFloat(tdElem.text().replace(',', '.'));
          tdElem = tdElem.next();

          distribution_price.dp_avgPrice = parseFloat(tdElem.text().replace(',', '.'));
          tdElem = tdElem.next();
          distribution_price.dp_stdDeviation = parseFloat(tdElem.text().replace(',', '.'));
          tdElem = tdElem.next();
          distribution_price.dp_minPrice = parseFloat(tdElem.text().replace(',', '.'));
          tdElem = tdElem.next();
          distribution_price.dp_maxPrice = parseFloat(tdElem.text().replace(',', '.'));
          tdElem = tdElem.next();

          models.Statistic
          .findOrCreate({where: {
            city_pk: city.id, fuel_type_pk: currentFuel.id
          }, defaults: {
            // Consumer Price
            cp_avgPrice: consumer_price.cp_avgPrice,
            cp_stdDeviation: consumer_price.cp_stdDeviation,
            cp_minPrice: consumer_price.cp_minPrice,
            cp_maxPrice: consumer_price.cp_maxPrice,
            cp_avgMargin: consumer_price.cp_avgMargin,
            // Distribution Price
            dp_avgPrice: distribution_price.dp_avgPrice,
            dp_stdDeviation: distribution_price.dp_stdDeviation,
            dp_minPrice: distribution_price.dp_minPrice,
            dp_maxPrice: distribution_price.dp_maxPrice
          }})
          .spread(function(statistic, created) {
            console.log(created);
          });
        });
        
        //city.name = $(this).children().first().children().first().text();

        /*
        city.statistics = statistic;
        console.log(JSON.stringify(city));
        cities.push(city);
        */
      })
    });

    /*
    state.cities = cities;
    states.push(state);
    res.json(states);*/
    res.json({status: 'OK'});
  });
});

module.exports = router;
