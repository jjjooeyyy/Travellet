// Index Display chart
// Get input from local storage
let savedRecord = JSON.parse(localStorage.getItem("items"));

console.log(savedRecord);

// Generate Chart
const ctx = document.getElementById("myChart").getContext("2d");
const chart = new Chart(ctx, {
  type: "doughnut",
  data: {
    labels: [],
    datasets: [
      {
        data: [1, 1, 1, 1, 1],
        backgroundColor: [],
        hoverOffset: 5,
      },
    ],
  },
});

// Function to generate and update the chart
async function generateChart(chart, savedRecord) {
  // Reset category totals before calculating again
  let totalFood = 0;
  let totalTransport = 0;
  let totalActivity = 0;
  let totalAccommodation = 0;
  let totalShopping = 0;

  // Get the select element for display currency
  const targetCurrency = document.getElementById("convertTo");

  // Convert Currency
  async function convertCurrency(amount, currency, targetCurrency) {
    return new Promise((resolve, reject) => {
      const requestURL = `https://v6.exchangerate-api.com/v6/cfe8752aed0f25c766e89aa7/pair/${currency}/${targetCurrency}`;
      const request = new XMLHttpRequest();
      request.open("GET", requestURL);
      request.responseType = "json";

      request.onload = function () {
        
        if (request.status === 200) {
          const response = request.response;
          console.log("Conversion API response:", response); // Log the response

          if (response.result === 'success') {
            const convertedAmount = amount * response.conversion_rate;
            console.log("Converted amount:", convertedAmount);

            if (isNaN(convertedAmount) || !isFinite(convertedAmount)) {
              console.log("Conversion result is not a valid number.");
              reject(new Error("Conversion result is not a valid number."));
            } else {
              console.log("Conversion was successful.");
              resolve(Math.ceil(convertedAmount));
            }
          } else {
            console.log("Conversion failed:", response.error);
            reject(new Error("Conversion failed: " + response.error));
          }
        } else {
          console.log("Request failed with status:", request.status);
          reject(new Error(`Request failed with status: ${request.status}`));
        }
      };

      request.onerror = function () {
        reject(new Error("Request failed"));
      };
      request.send();
    });
  }

  // Iterate over the expense data and update category totals
  for (const key in savedRecord) {
    const item = savedRecord[key];
    const category = item.category;
    const amount = item.amount;
    const currency = item.currency;
    const targetCurrencyValue = targetCurrency.value;

    try {
      const convertedAmount = await convertCurrency(
        amount,
        currency,
        targetCurrencyValue
      );

      // Update the category totals based on the expense category
      switch (category) {
        case "Food":
          totalFood += convertedAmount;
          break;
        case "Transport":
          totalTransport += convertedAmount;
          break;
        case "Activity":
          totalActivity += convertedAmount;
          break;
        case "Accommodation":
          totalAccommodation += convertedAmount;
          break;
        case "Shopping":
          totalShopping += convertedAmount;
          break;
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Update the chart data
  chart.data.labels = [
    "Food",
    "Transport",
    "Activity",
    "Accommodation",
    "Shopping",
  ];

  chart.data.datasets[0].data = [
    totalFood,
    totalTransport,
    totalActivity,
    totalAccommodation,
    totalShopping,
  ];

  chart.data.datasets[0].backgroundColor = [
    "rgb(212, 173, 252)",
    "rgb(160, 195, 210)",
    "rgb(179, 200, 144)",
    "rgb(246, 117, 168)",
    "rgb(255, 231, 160)",
  ];
  chart.update();
}

// Call the generateChart function passing the chart instance and savedItems data
generateChart(chart, savedRecord);

// Add event listener for the currency selection change
const selectDisplayCurrency = document.getElementById("convertTo");
selectDisplayCurrency.addEventListener("change", function () {
  generateChart(chart, savedRecord);
});
