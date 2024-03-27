// code for Land Cover Classification

var admin1 = ee.FeatureCollection("FAO/GAUL_SIMPLIFIED_500m/2015/level1");

var Dominica = admin1.filter(ee.Filter.eq('ADM0_NAME', 'Dominica'));
Map.addLayer(Dominica);

//Population count
var pop_count= ee.ImageCollection('CIESIN/GPWv411/GPW_Population_Count').first();
var raster = pop_count.select('population_count');
var raster_vis = {
  'max': 1000.0,
  'palette': [
    'ffffe7',
    '86a192',
    '509791',
    '307296',
    '2c4484',
    '000066'
  ],
  'min': 0.0
};
Map.setCenter(79.1, 19.81, 3);
Map.addLayer(raster, raster_vis, 'population_count');
Map.setCenter(-61.370976, 15.414999, 10);

// Global Human Settlement
var image = ee.Image("JRC/GHSL/P2023A/GHS_BUILT_C/2018");
var built = image.select('built_characteristics');
Map.setCenter(-61.370976, 15.414999, 10);
Map.addLayer(built, {}, 'Multitemporal Built-up Characteristics');


//Land cover
var land_cover = ee.ImageCollection('ESA/WorldCover/v100').first();

var visualization = {
  bands: ['Map'],
};

Map.addLayer(land_cover, visualization, 'Landcover');

print(land_cover)

//Crop land
var croplandValue = 40;

// Create a mask that isolates the cropland.
var croplandMask = land_cover.eq(croplandValue);

// Update the mask of the croplandMask to itself, which masks out everything but the cropland.
var croplandOnly = croplandMask.updateMask(croplandMask);

// Define visualization parameters.
var visualization = {
  min: 0,
  max: 1,
  palette: ['00FF00'] // Display cropland as green.
};

// Add the cropland layer to the map.
Map.addLayer(croplandOnly, visualization, 'Cropland');

print(croplandOnly);


// Elevation

var elev = ee.Image('CGIAR/SRTM90_V4');
var elevation = elev.select('elevation');
var slope = ee.Terrain.slope(elevation);
Map.addLayer(slope, {min: 0, max: 60}, 'slope');

// Create a mask for pixels with elevation less than or equal to 10 meters
var elevationMask = elevation.lte(10);

// Apply the mask to the elevation data
var filteredElevation = elevation.updateMask(elevationMask);
Map.addLayer(filteredElevation, {min: 0, max: 10, palette: ['0000FF', '00FFFF']}, 'Low Elevation');

ciao 