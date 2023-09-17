// Function to create and retrieve the map
function getObjectMap() {
  // Attempt to retrieve the map from local storage
  const mapJSON = localStorage.getItem('districtMap');

  if (mapJSON) {
    // If it exists in local storage, parse it and return the map
    return new Map(JSON.parse(mapJSON));
  } else {
    // Otherwise, create the map and store it in local storage
    let collectedData = {};

for(let district of districtEcs){
    let id = district['District_ID']
    if(id in collectedData){ // If there is already a key for the district id in the collective dataset

        // Combine the existing object with the object from the districtEcs array
        delete district['District_ID'];
       collectedData[id] = Object.assign({}, collectedData[id], district) 
    }
    else{
        delete district['District_ID'];
        collectedData[id] = district;
    }
}


for(let district of economicAcs){
    let id = district['District_ID']
    if(id in collectedData){ // If there is already a key for the district id in the collective dataset

        // Combine the existing object with the object from the districtEcs array
        delete district['District_ID'];
       collectedData[id] = Object.assign({}, collectedData[id], district) 
    }
    else{
        delete district['District_ID'];
        collectedData[id] = district;
    }
}


for(let district of houseMembers){
    let id = district['District_ID']
    if(id in collectedData){ // If there is already a key for the district id in the collective dataset

        // Combine the existing object with the object from the districtEcs array
        delete district['District_ID'];
       collectedData[id] = Object.assign({}, collectedData[id], district) 
    }
    else{
        delete district['District_ID'];
        collectedData[id] = district;
    }
}

for(let district of housingAcs){
    let id = district['District_ID']
    if(id in collectedData){ // If there is already a key for the district id in the collective dataset

        // Combine the existing object with the object from the districtEcs array
        delete district['District_ID'];
       collectedData[id] = Object.assign({}, collectedData[id], district) 
    }
    else{
        delete district['District_ID'];
        collectedData[id] = district;
    }
}

for(let district of socialAcs){
    let id = district['District_ID']
    if(id in collectedData){ // If there is already a key for the district id in the collective dataset

        // Combine the existing object with the object from the districtEcs array
        delete district['District_ID'];
       collectedData[id] = Object.assign({}, collectedData[id], district) 
    }
    else{
        delete district['District_ID'];
        collectedData[id] = district;
    }
}

    let objectMap = new Map(Object.entries(collectedData));

    // Store the map in local storage
    localStorage.setItem('districtMap', JSON.stringify(Array.from(objectMap.entries())));

    return objectMap;
  }
}

// Call the function to retrieve or create the map
const myMap = getObjectMap();

function transformObjectKeys(obj) {
    const keys = Object.keys(obj);
  
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const parts = key.split(' ');
      const firstPart = parts[0];
  
      if (/^\d+$/.test(firstPart)) {
        // If the first part is a valid integer, replace it with the index
        obj[i + ' ' + parts.slice(1).join(' ')] = obj[key];
        delete obj[key];
      } else {
        // If not, add the index to the beginning of the string and add a space
        obj[i + ' ' + key] = obj[key];
        delete obj[key];
      }
    }
  
    return obj;
  }

  function getValueAtIndex(obj, index) {
    const keys = Object.keys(obj);
  
    if (index >= 0 && index < keys.length) {
      const key = keys[index];
      return obj[key];
    } else {
      // Handle the case where the index is out of range
      return undefined;
    }
  }