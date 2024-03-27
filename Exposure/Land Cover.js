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


//Grassland
var grassland_value = 30;
var grasslandMask = land_cover.eq(grassland_value);
var grasslandOnly = grasslandMask.updateMask(grasslandMask);
var visualization = {
  min: 0,
  max: 1,
  palette: ['#ffff4c'] // Display cropland as yellow.
};
Map.addLayer(grasslandOnly, visualization, 'Grassland');

//Tree cover
var treecover_value = 10;
var treecoverMask = land_cover.eq(treecover_value);
var treecoverOnly = treecoverMask.updateMask(treecoverMask);
var visualization = {
  min: 0,
  max: 1, 
  palette: ['#006400']
};
Map.addLayer(treecoverOnly, visualization, 'Tree cover');

//Mangroves
var mangroves_value = 95;
var mangrovesMask = land_cover.eq(mangroves_value);
var mangrovesOnly = mangrovesMask.updateMask(mangrovesMask);
var visualization = {
  min: 0,
  max: 1,
  palette: ['#00cf75']
};
Map.addLayer(mangrovesOnly, visualization, 'Mangroves')



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

// coral reef

var data_coral = ee.Image('ACA/reef_habitat/v2_0');

// Select the relevant band from your image that contains the habitat information.
var coralBand = data_coral.select('benthic'); 

// Assuming '15' represents coral habitats
var coralValue = 15;

// Create a mask where coral habitats are represented by '15'
var coralMask = coralBand.eq(coralValue);

// Apply the mask to the selected band to keep only coral habitats
var coralOnly = coralBand.updateMask(coralMask);

// Define visualization parameters including the palette for the single-band image
var visParams = {
    palette: ['FF0000'] // Cyan color for coral
};

// Add the single-band, masked layer to the map with visualization parameters
Map.addLayer(coralOnly, visParams, 'Coral Extent');

// Chlorophyll concentration (possible proxy for ocean producitivity)
var chlorophyll = ee.ImageCollection('JAXA/GCOM-C/L3/OCEAN/CHLA/V3')
                .filterDate('2021-12-01', '2022-01-01')
                // filter to daytime data only
                .filter(ee.Filter.eq('SATELLITE_DIRECTION', 'D'));

// Multiply with slope coefficient
var image = chlorophyll.mean().multiply(0.0016).log10();

var vis = {
  bands: ['CHLA_AVE'],
  min: -2,
  max: 2,
  palette: [
    '3500a8','0800ba','003fd6',
    '00aca9','77f800','ff8800',
    'b30000','920000','880000'
  ]
};
Map.addLayer(image, vis, 'Chlorophyll-a concentration');

