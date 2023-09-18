function uspsToFips(uspsAbbreviation) {
    // Find the state object with the given USPS abbreviation
    const state = states.find((state) => state.USPS === uspsAbbreviation);
  
    if (state) {
      // Convert the FIPS code to a 0-padded string
      const paddedFIPS = state.FIPS.toString().padStart(2, '0');
      return paddedFIPS;
    } else {
      // Handle the case where the USPS abbreviation is not found
      return null;
    }
  }

  function fipsToUsps(fipsCode) {
    // Find the state object with the given FIPS code
    const state = states.find((state) => state.FIPS === fipsCode);
  
    if (state) {
      return state.USPS;
    } else {
      // Handle the case where the FIPS code is not found
      return fipsCode;
    }
  }
  
  function hideIntro(){
    const allElements = document.querySelectorAll('.content');
    allElements.forEach((element) => {
      element.classList.remove('hidden');
    });
  
    // Add the 'hidden' class to the element(s) with the class 'districtInsights'
    const districtInsightsElements = document.querySelectorAll('.districtInsights');
    districtInsightsElements.forEach((element) => {
      element.classList.add('hidden');
    });
  }
  
  function showIntro(){
    const allElements = document.querySelectorAll('.districtInsights');
    allElements.forEach((element) => {
      element.classList.remove('hidden');
    });
  
    // Add the 'hidden' class to the element(s) with the class 'districtInsights'
    const districtInsightsElements = document.querySelectorAll('.content');
    districtInsightsElements.forEach((element) => {
      element.classList.add('hidden');
  });
  }
    let currentState = '';
    let currentDistrict = '';
  // Get the URL hash (e.g., "#state=California")
    const hash = window.location.hash;
    // Parse the hash to extract the "state" attribute
    const stateMatch = hash.match(/#state=([^&]+)/);
    // Check if the "state" attribute was found in the hash
    if (stateMatch && stateMatch[1]) {
        currentState = uspsToFips(stateMatch[1]);
    } else {
        console.log('State attribute not found in URL hash.');
    }

    const hashWithoutHashSign = hash.slice(1);

    // Split the hash by '&' to get an array of attribute-value pairs
    const attributeValuePairs = hashWithoutHashSign.split('&');

    // Initialize a variable to store the district value
    let d = null;

    // Iterate through the attribute-value pairs
    attributeValuePairs.forEach(pair => {
    const [key, value] = pair.split('=');
    
    if (key === 'district') {
        d = value;
        return; // Exit the loop early if district is found
    }
    });

    // Check if the "district" attribute was found in the hash
    if (d !== null) {
        currentDistrict = currentState + d;
        loadData();
    } else {
        currentDistrict = currentState + '00';
        loadData();
    }

    
function setHtml(id, html){
    document.getElementById(id).innerHTML = html;
}
  
  
  function loadData(){
    console.log(currentState, currentDistrict, typeof currentDistrict)
    if(!myMap.has(currentDistrict)) {
      showIntro();
      return;
    }
    hideIntro();
    let districtData = myMap.get(currentDistrict);
    
    if(Object.keys(districtData).length < 10){
        setHtml('representative', getValueAtIndex(districtData, 0))
        setHtml('representativeParty', getValueAtIndex(districtData, 1))
        setHtml('representativeExperience', getValueAtIndex(districtData, 2))
        setHtml('representativeCollege', getValueAtIndex(districtData, 3))
        setHtml('representativeOffice', getValueAtIndex(districtData, 4))
        setHtml('representativeReside', getValueAtIndex(districtData, 5) + ', ' + fipsToUsps(currentState))
        setHtml('representativeBirth', getValueAtIndex(districtData, 6))
        return;
    }

    setHtml('representative', getValueAtIndex(districtData, 37))
    setHtml('representativeParty', getValueAtIndex(districtData, 38))
    setHtml('representativeExperience', getValueAtIndex(districtData, 39))
    setHtml('representativeCollege', getValueAtIndex(districtData, 40))
    setHtml('representativeOffice', getValueAtIndex(districtData, 41))
    setHtml('representativeReside', getValueAtIndex(districtData, 42) + ', ' + fipsToUsps(currentState))
    setHtml('representativeBirth', getValueAtIndex(districtData, 43))
  }
  
  console.log(Object.keys(transformObjectKeys(myMap.get('3618'))))
  console.log(getValueAtIndex(myMap.get('3618'), 2));
  
  //** MODIFY THIS SECTION
  // Specify YOUR Mapbox default access token
  var accessToken = 'pk.eyJ1IjoiYWFyb25kZW5uaXMiLCJhIjoiem5LLURoYyJ9.T3tswGTI5ve8_wE-a02cMw';
  
  //** MODIFY THIS SECTION
  // Specify YOUR uploaded Mapbox Studio style URL
  var styleURL = 'mapbox://styles/aarondennis/cioafmhk70047adnmt3gz2kd0';
  var mapId = 'aarondennis.cd-114-2015'; // used by the click handler only
  
  
  // Use GeoViewport and the window size to determine and appropriate center and zoom for the continental US
  var continentalView = function(w,h) { return geoViewport.viewport([-128.8, 23.6, -65.4, 50.2], [w, h]); }
  var continental = continentalView(window.innerWidth/4, window.innerHeight/4);
  
  //** INTERACTIVE MENU
  // Create an object to list all the possible districts for a given state or territory
  var stateList = states.map(function(d) { return { name: d.Name, abbr: d.USPS }; });
  var possibleDistricts = {};
  stateList.map(function(d) { possibleDistricts[d.abbr] = [] });
  
  //** INTERACTIVE MENU
  // For each state, add the numbers of its districts
  for (d in bboxes) {
    possibleDistricts[d.slice(0,2)].push(d.slice(2,d.length));
  }
  
  //** INTERACTIVE MENU
  // Sort in ascending order each state's list of districts
  for (d in possibleDistricts) {
    possibleDistricts[d].sort(function(a,b) {
      if (b === "") { return 1 } else { return parseInt(a) - parseInt(b); }
    });
    // For states with only one district, make the list of districts only contain an at-large choice
    if (possibleDistricts[d].length === 2) possibleDistricts[d] = ['00'];
  }
  
  //** INTERACTIVE MENU
  // Add an option to the interactive State menu for each state
  $('#state')
      .append($("<option>United States</option>"))
  
  stateList.map(function(d) {
    $('#state')
      .append($("<option></option>")
        .attr('value', d.abbr).text(d.name));
  })
  
  //** INTERACTIVE MENU
  // Create an event listener that responds to the selection of a state from the menu
  $('#state').change(function() {
    if (this.value === '' || this.value === 'United States') { 
      window.location.hash = '#' 
      hideIntro();
    }
    else {
      var hash = window.location.hash;
      var newHash = 'state=' + this.value;
      window.location.hash = newHash;
    }
  
    currentState = this.value;
    // Whenever the state changes we assume that it is at-large (0100, 0200), if this is not the case then it will change when the district changes
    currentDistrict = uspsToFips(currentState) + '00';
    loadData();
  });
  
  //** INTERACTIVE MENU
  // Create an event listener that responds to the selection of a district from the menu
  $('#district').change(function() {
    var hash = window.location.hash;
    var currentDistrictIndex = hash.indexOf('&district=');
    var newHash = currentDistrictIndex >= 0 ?
      hash.slice(0,currentDistrictIndex) + '&district=' + this.value :
      hash + '&district=' + this.value ;
    window.location.hash = newHash;
  
    currentDistrict = uspsToFips(currentState) + this.value;
    loadData();
  });
  
  // Checks for support of Mapbox GL. Works with most modern browsers.
  if (mapboxgl.supported({ failIfMajorPerformanceCaveat: true })) {
  
    // Initialize the map
    mapboxgl.accessToken = accessToken;
    var map = new mapboxgl.Map({
        container: 'map',
        style: styleURL,
        center: continental.center,
        zoom: continental.zoom
    });
  
    // Once map is fully loaded...
    map.on('load', function() {
  
      // Retrieve the JSON styling object for the map
      var baseStyle = map.getStyle()
  
      // Add zoom and rotation controls to the map
      map.addControl(new mapboxgl.Navigation({ position: 'bottom-left' }));
  
      // Disable using touch gestures for map rotation
      map.touchZoomRotate.disableRotation();
  
      // Given a state postal abbreviation and a US Census district number, focus the map on that area
      function focusMap(stateAbbr, districtCode) {
        //** INTERACTIVE MENU
        // Set the interactive menu to focus on the state and district code, if provided
        $('#state').val(stateAbbr);
        $('#district').empty();
        $('#district')
            .append($("<option></option>"))
        possibleDistricts[stateAbbr].map(function(d) {
          $('#district')
            .append($("<option></option>")
              .attr('value', d).text(d));
        });
        if (districtCode) $('#district').val(districtCode);
  
        // For each district color layer in the map, apply some filters...
        for (var i = 1; i <= 5; i++) {
  
          // The filter that filters based on color is the one we want to preserve
          // If there are already multiple filters applied, it will be the last one
          var exisitingFilter = map.getFilter('districts_' + i);
          if (exisitingFilter[0] === 'all') {
            exisitingFilter = exisitingFilter[exisitingFilter.length - 1];
          }
  
          // Create a fresh filter to be applied
          var filter = ['all'];
  
          // Add filters for the focus state and district number
          if (stateAbbr) filter.push(['==', 'state', stateAbbr]);
          if (districtCode) filter.push(['==', 'number', districtCode]);
  
          // Add the existing color filter
          var layerFilter = filter.concat([exisitingFilter]);
  
          // Set new layer filter for each district layer in the map
          map.setFilter('districts_' + i, layerFilter);
          map.setFilter('districts_' + i + '_boundary', layerFilter);
          map.setFilter('districts_' + i + '_label', layerFilter);
  
        }
  
        // Create a generic filter for the focus state and district number that does not include color filtering
        var boundaryFilter = ['all'];
        if (stateAbbr) boundaryFilter.push(['==', 'state', stateAbbr]);
        if (districtCode) boundaryFilter.push(['==', 'number', districtCode]);
  
        // Apply the generic filter to the boundary lines
        map.setFilter('districts_boundary_line', boundaryFilter);
  
        // Determine current window height and width and whether the bbox should focus on a single district
        var height = window.innerHeight,
            width = window.innerWidth,
            districtAbbr = districtCode ? districtCode : '';
  
        // Determine the best center and zoom level for the new map focus and then go there
        var view = geoViewport.viewport(bboxes[stateAbbr + districtAbbr], [width/3, height/2]);
        map.jumpTo(view);
  
      }
  
      // Check the URL hash to determine how the map should be focused
      function checkHash() {
        // If a URL hash is found...
        if(window.location.hash) {
  
          // Grab the URL hash
          var hash = window.location.hash;
  
          // Split up the hash string into its components
          var hashData = hash.substring(1).split('&').map(function(d) { return d.split('=') });
  
          // Determine state or district based on the hash data
          var state, district;
          hashData.map(function(d) {
            if (d[0] === 'state') state = d[1];
            if (d[0] === 'district') district = d[1];
          })
  
          // If a state or state and district were found in the URL hash, focus the map to this location
          if (state || (state && district)) focusMap(state, district);
  
        } else {
          // If there is no URL hash...
          // And if its not the first time the page is loading...
          if (!initial) {
  
            // Reset the map style to its original style object and jump back to the continental view
            map.setStyle(baseStyle);
            map.jumpTo(continentalView(window.innerWidth/4, window.innerHeight/4));
  
            //** INTERACTIVE MENU
            // Empty the list of districts because no state is selected
            $('#district').empty();
            showIntro();
          }
        }
      }
  
      // When the URL hash changes, call the checkHash function
      window.onhashchange = checkHash;
  
      // Record that it initial page load and the hash still needs to be checked
      var initial = true;
      checkHash();
  
      // Record that it is no longer the initial page load
      initial = false;
  
      // A click handler that shows what was under the cursor where
      // the user clicked.
      map.on("click", function(e) {
        var district = null;
  
        if (1) {
          // The map control provides a client-side-only way to determine what
          // is under the cursor. We restrict the query to only the layers that
          // provide congressional district polygons. Note that this only scans
          // features that are currently shown on the map. So if you've filtered
          // the districts so only a state or a single district is showing, this
          // will restrict the query to those districts.
          var features = map.queryRenderedFeatures(
            e.point,
            {
              layers: ["districts_1", "districts_2", "districts_3", "districts_4", "districts_5"]
            });
          if (features.length > 0)
            // The feature properties come from the original GeoJSON uploaded to Mapbox.
            district = features[0].properties;
  
        } else {
          // Use the Mapbox tilequery API instead.
          //
          // This is an example of how you would use the API in a server-side
          // environment where you don't have the map control, or as a part
          // of geocoding where you have lat/lng coordinates.
          //
          // Note that, from the Mapbox API docs:
          // "Use of this endpoint is rate limited to 600 requests per minute."
          $.ajax({
            url: 'https://api.mapbox.com/v4/' + mapId + '/tilequery/' + e.lngLat.lng + ',' + e.lngLat.lat + '.json?radius=0&access_token=' + accessToken,
            method: 'GET',
            success: function(resp) {
              if (resp.type == "FeatureCollection" && resp.features.length > 0)
                // resp is always a FeatureCollection, just sanity checking, but it might
                // be empty. If it's not empty, it will contain a single Feature
                // (whose geometry is a Polygon) represending the boundaries of a
                // congressional district. Its properties come from the original
                // GeoJSON uploaded to Mapbox.
                district = resp.features[0].properties;
            }
          });
        }
  
        // Ok now we have the district either from the client-side query or the
        // API.
        if (district) {
          // district.state now holds the two-letter USPS state abbreviation,
          // and district.number now holds a zero-padded two-digit district
          // number (00 for at-large districts). title_long and title_short
          // have strings useful for display (e.g. "VA 8" and "Virginia’s 8th
          // Congressional District", respectively).
          alert("That's " + district.state + "-" + district.number + ", i.e." + district.title_long + ".");
  
        } else {
          alert("You clicked on a location that is not within a U.S. congressional district.")
        }
      })
  
    });
  
  } else {
  
    // If Mapbox GL is not supported
    // Log this information to the console (perhaps an alert that the website is not fully featured would be better?)
    console.log('Mapbox GL not supported');
  
    // Initialize the map
    L.mapbox.accessToken = accessToken;
    var map = L.mapbox.map('map').setView(continental.center, continental.zoom);
    L.mapbox.styleLayer(styleURL).addTo(map);
  
    // Redefine the focusMap function from above
    function focusMap(stateAbbr, districtCode) {
      var height = window.innerHeight,
          width = window.innerWidth,
          districtAbbr = districtCode ? districtCode : '';
  
      var view = geoViewport.viewport(bboxes[stateAbbr + districtAbbr], [width/2, height/2]);
      map.setView([view.center[1], view.center[0]], view.zoom + 1);
  
    }
  
    // Redefine the checkHash function from above
    function checkHash() {
      if(window.location.hash) {
        var hash = window.location.hash;
        var hashData = hash.substring(1).split('&').map(function(d) { return d.split('=') });
  
        var state, district;
        hashData.map(function(d) {
          if (d[0] === 'state') state = d[1];
          if (d[0] === 'district') district = d[1];
        })
  
        if (state || (state && district)) focusMap(state, district);
      }
    }
  
    // Create an event listener for changes in the URL hash
    window.onhashchange = checkHash;
    checkHash();
  
  }