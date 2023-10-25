import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import { countries, currencies } from './public/js/data.js';
import { getDefaultWeather, getDefaultForcast, customiseLocation, customiseForecastData } from './public/js/weather.js';

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false })); // Parse URL-encoded data
app.use(bodyParser.json()); // Parse JSON data
app.set('view engine', 'ejs');


app.get('/',(req,res)=> {
    const locals = {
        title: "Travellet"
      }
    res.render('../views/index.ejs',{locals,countries:countries,currencies:currencies});
})

app.get('/topack',(req,res)=> {
    const locals = {
        title: "To-Pack List"
      }
    res.render('../views/topack.ejs',locals);
})

app.get('/expense',(req,res)=> {
    const locals = {
        title: "Expense Record"
      }
    res.render('../views/expense.ejs',{locals,currencies:currencies})
})

app.get('/weather', async (req, res) => {
    try {
        const weatherData = await getDefaultWeather();
        const forecastData = await getDefaultForcast('London'); // Renamed to forecastData
  
        if (weatherData && forecastData) {
            // Define options here or import them from where they are defined
  
            const forecastItems = forecastData;
  
            const locals = {
                title: "Weather",
                defaultLocation: 'London',
                temperature: weatherData.main.temp,
                description: weatherData.weather[0].description,
                imgicon: weatherData.weather[0].icon,
                forecastItems: forecastItems
            };
  
            res.render('../views/weather.ejs', locals);
        } else {
            res.status(500).send("Failed to fetch weather data");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Failed to fetch weather data");
    }
  });
  
  
  app.post('/weather', async (req, res) => {
    const input = req.body.location;
    try {
      const customWeatherData = await customiseLocation(input);
      const customForecastData = await customiseForecastData(input);
  
      if (customWeatherData && customForecastData) {
        const locals = {
          title: "Weather",
          defaultLocation: input,
          temperature: customWeatherData.main.temp,
          description: customWeatherData.weather[0].description,
          imgicon: customWeatherData.weather[0].icon,
          forecastItems: customForecastData, 
        };
        res.render('../views/weather.ejs', locals);
      } else {
        res.status(500).send("Failed to fetch weather data");
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Failed to fetch weather data");
    }
  })

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });