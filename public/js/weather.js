import 'dotenv/config';
import axios from "axios";
const defaultLocation = 'London';
// Get current weather data for the default location
export const getDefaultWeather = async () => {
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${defaultLocation}&appid=${process.env.WEATHERAPI}&units=metric`);

        if(response.status === 200) {
            return response.data;
        }
    }catch(error) {
        console.log(error);
    }
}

// Get forcast weather 
export const getDefaultForcast = async (defaultLocation) => {
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${defaultLocation}&appid=${process.env.WEATHERAPI}&units=metric`);

        if (response.status === 200) {
            const forecastData = response.data;
            const forecastItems = [];

            var options = {
                day: '2-digit',
                month: '2-digit',
            };

            for (var i = 0; i < forecastData.list.length; i += 8) {
                var forecastItem = forecastData.list[i];
                var forecastDate = new Date(forecastItem.dt * 1000); // Convert to milliseconds
                var forecastDay = forecastDate.toLocaleDateString('en-US', options);
                var forecastTemperature = forecastItem.main.temp;
                var forecastDescription = forecastItem.weather[0].description;
                var forecastIcon = forecastItem.weather[0].icon;

                forecastItems.push({
                    day: forecastDay,
                    temperature: forecastTemperature,
                    description: forecastDescription,
                    icon: forecastIcon,
                });
            }
            return forecastItems; // Return the forecastItems array
        }
    } catch (error) {
        console.log(error);
    }
}

// CUSTOMISE LOCATION
export const customiseLocation = async(input) => {
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${input}&appid=${process.env.WEATHERAPI}&units=metric`);
        if(response.status === 200) {
            return response.data;
        }
    }catch(error) {
        console.log(error);
    }
}

// CUSTOMISE FORECAST 
// Get forcast weather 
export const customiseForecastData = async (input) => {
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${input}&appid=${process.env.WEATHERAPI}&units=metric`);

        if (response.status === 200) {
            const forecastData = response.data;
            const forecastItems = [];

            var options = {
                day: '2-digit',
                month: '2-digit',
            };

            for (var i = 0; i < forecastData.list.length; i += 8) {
                var forecastItem = forecastData.list[i];
                var forecastDate = new Date(forecastItem.dt * 1000); // Convert to milliseconds
                var forecastDay = forecastDate.toLocaleDateString('en-US', options);
                var forecastTemperature = forecastItem.main.temp;
                var forecastDescription = forecastItem.weather[0].description;
                var forecastIcon = forecastItem.weather[0].icon;

                forecastItems.push({
                    day: forecastDay,
                    temperature: forecastTemperature,
                    description: forecastDescription,
                    icon: forecastIcon,
                });
            }
            return forecastItems; // Return the forecastItems array
        }
    } catch (error) {
        console.log(error);
    }
}