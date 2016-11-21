var express = require('express');
var request = require("request");
var cheerio = require('cheerio');
var router = express.Router();
var models = require('../models');

//-----------------------------------------------------------------------------
// Arrays with States and Fuel names
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

// Enable CORS
router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// GET prices listing
router.get('/', function(req, res, next) {
  models.State.findAll({
    include: [{
        model: models.City, attributes: ['name'], include: [{
          model: models.Statistic, include: [{
            model: models.FuelType
          }]
        }]
    }]
  }).then(function(states) {
    //console.log(JSON.stringify(states));
    var anp_info = new Array();

    states.forEach(function(state) {
      var currentState = {
        name: state.name,
        cities: [],
        dates: {
          date_from: state.date_from.getDate(), // Wrong date format
          date_to: state.date_to.getDate()      // Wrong date format
        }
      };

      state.Cities.forEach(function(city) {
        currentCity = {
            name: city.name,
            statistics: [],
            stations: []
        };

        city.Statistics.forEach(function(statistic) {
          var currentStatistic = {
            fueltype: statistic.FuelType.name,
            consumer_price: {
              cp_avgPrice: statistic.cp_avgPrice,
              cp_stdDeviation: statistic.cp_stdDeviation,
              cp_minPrice: statistic.cp_minPrice,
              cp_maxPrice: statistic.cp_maxPrice,
              cp_avgMargin: statistic.cp_avgMargin
            },
            distribution_price: {
              dp_avgPrice: statistic.dp_avgPrice,
              dp_stdDeviation: statistic.dp_stdDeviation,
              dp_minPrice: statistic.dp_minPrice,
              dp_maxPrice: statistic.dp_maxPrice
            }
          }

          currentCity.statistics.push(currentStatistic);
        });

        currentState.cities.push(currentCity);
      });

      anp_info.push(currentState);
    });
    
    res.json(anp_info);
  })
});

// Web Scraper
router.get('/web-scraper', function(req, res, next) {
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
      'postman-token': '1aa745e8-9d05-2421-e1fe-db7c3f3e2e52',
      'cache-control': 'no-cache',
      'content-type': 'application/x-www-form-urlencoded'
    },
    form: {
      selSemana: '909*De 13/11/2016 a 19/11/2016',
      selEstado: 'AC*ACRE',
      selCombustivel: '487*Gasolina'
    }
  };
  
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    var $ = cheerio.load(body);

    $('.lincol').filter(function(){
      var data = $(this);

      data.parent().prev().nextAll().each(function() {

        var city_name = $(this).children().first().children().first().text();
        var tdElem = $(this).children().first().next().next();

        var cod_city = $(this).children().first().children().first().attr("href");
        var patt = new RegExp(/\d+\*(\w\@|\w)+/);
        cod_city = patt.exec(cod_city)[0];
        console.log(cod_city);

        // Scrap Cities info from ANP
        models.City
        .findOrCreate({where: {name: city_name, state_pk: currentState.id}})
        .spread(function(city, created) {
          //console.log(created);
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

          // Scrap Stations info from ANP
          var options_station = {
            method: 'POST',
            url: 'http://www.anp.gov.br/preco/prc/Resumo_Semanal_Posto.asp',
            headers: {
              'postman-token': 'ee751e0c-d005-852a-9a6d-0dcaab1f18ce',
              'cache-control': 'no-cache',
              'content-type': 'application/x-www-form-urlencoded'
              },
            form: {
              cod_Semana: '909',
              cod_combustivel: '487',
              selMunicipio: cod_city
            }
          };

          request(options_station, function (error_station, response_station, body_station) {
            if (error_station) throw new Error(error_station);
            var $b_station = cheerio.load(body_station);

            $b_station('#postos_nota_fiscal').filter(function(){
              var data_station = $(this);

              data_station.children().first().children().first().children().first().nextAll().each(function() {
                var station_price = {
                  name: '',
                  address: '',
                  area: '',
                  flag: '',
                  sellPrice: 0.0,
                  buyPrice: 0.0,
                  saleMode: '',
                  provider: '',
                  date: '2016-11-21'
                };
                var tdElem_station = $(this).children().first();

                station_price.name = tdElem_station.text();
                tdElem_station = tdElem_station.next();

                station_price.address = tdElem_station.text();
                tdElem_station = tdElem_station.next();

                station_price.area = tdElem_station.children().first().text();
                tdElem_station = tdElem_station.next();

                station_price.flag = tdElem_station.text();
                tdElem_station = tdElem_station.next();

                station_price.sellPrice = parseFloat(tdElem_station.text().replace(',', '.'));
                tdElem_station = tdElem_station.next();

                station_price.buyPrice = parseFloat(tdElem_station.text().replace(',', '.'));
                tdElem_station = tdElem_station.next();

                station_price.saleMode = tdElem_station.text();
                tdElem_station = tdElem_station.next();

                station_price.provider = tdElem_station.text();
                tdElem_station = tdElem_station.next();

                //station_price.date = tdElem_station.text();

                models.Station
                .findOrCreate({where: {
                  name: station_price.name, city_pk: city.id
                }, defaults: {
                  name: station_price.name,
                  address: station_price.address,
                  area: station_price.area,
                  flag: station_price.flag
                }})
                .spread(function(station, created) {
                  console.log(created);

                  models.StationPrice
                  .findOrCreate({where: {
                    station_pk: station.id, fuel_type_pk: currentFuel.id
                  }, defaults: {
                    sellPrice: station_price.sellPrice,
                    buyPrice: station_price.buyPrice,
                    saleMode: station_price.saleMode,
                    provider: station_price.provider,
                    date: station_price.date
                  }})
                  .spread(function(stationPrice, created) {
                    console.log(created);
                  });
                });
              });
            });
          });
        });
      })
    });

    res.json({status: 'OK'});
  });
});

module.exports = router;
