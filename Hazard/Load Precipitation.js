var chirps = ee.ImageCollection("UCSB-CHG/CHIRPS/PENTAD"), malawi = ee.FeatureCollection("users/jkafotokoza/Malawi");
// Search for CHIRPS prentad data and load it

// Filter to Year 2017 data
var filtered = chirps.filter(ee.Filter.date('2021-01-01', '2021-01-31'));

print(filtered)

// Reduce image collection (Filtered) using the function sum Find the cumulative rainfall and show on map
var total = filtered.reduce(ee.Reducer.sum())

print(total)

// Specifying how to visualize it 
var visParams = {
  min: 0,
  max: 2000,
  palette: ['white', 'blue']
}

Map.addLayer(total, visParams, 'Total Rainfall')

// Calculate average rainfall for Blantyre
Map.addLayer(malawi); 
