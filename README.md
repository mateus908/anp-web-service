# anp-web-service
Web service that serves as an API for collecting ANP's data

API that provides Fuel price and other info from ANP's website (http://www.anp.gov.br/preco/prc/Resumo_Por_Estado_Municipio.asp)

# Installation

1. On root folder for Node libraries installation
$ npm install

2. On 'config/config.json', set the Database info

3. Put the web service up
$ npm start

4. Routes:
Welcome page: 'localhost:3000/api/v1/'
Fuel prices API: 'localhost:3000/api/v1/prices'
Web scrap the ANP's website and save on DB: 'localhost:3000/api/v1/prices'
