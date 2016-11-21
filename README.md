# anp-web-service
Web service that collects data from ANP Website and provides it as an API (http://www.anp.gov.br/preco/prc/Resumo_Por_Estado_Index.asp)

# Installation

1. On root folder for Node libraries installation
`$ npm install`

2. On 'config/config.json', set the Database info

3. Setup the databse with migrations and seeders:
Create all the necessary tables on the DB: `./node_modules/.bin/sequelize db:migrate`
Fill the 'states' table with basic info: `./node_modules/.bin/sequelize db:seed --seed seeders/20161115013456-StateSeeder.js`
Fill the 'states' table with basic info: `./node_modules/.bin/sequelize db:seed --seed seeders/20161114181126-FuelTypeSeeder.js`

3. Put the web service up
`$ npm start`

4. Routes:

Welcome page (for testing purposes): 'localhost:3005/api/v1/'

Fuel prices API (returns JSON with all the data): 'localhost:3005/api/v1/prices'

Web scrap the ANP's website and save on DB: 'localhost:3005/api/v1/prices/web-scraper'
