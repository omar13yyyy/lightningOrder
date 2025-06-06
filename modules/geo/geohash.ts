const EARTH_RADIUS_KM = 6371;
function kmToLat(km) {
  return (km / EARTH_RADIUS_KM) * (180 / Math.PI);
}

function kmToLng(km, latitude) {
  return (
    ((km / EARTH_RADIUS_KM) * (180 / Math.PI)) /
    Math.cos((latitude * Math.PI) / 180)
  );
}

export function encodeToQuadrants(latitude, longitude, precision = 20) {
  let latMin = -90.0,
    latMax = 90.0;
  let lonMin = -180.0,
    lonMax = 180.0;
  let quadrantCode = "";

  for (let i = 0; i < precision; i++) {
    const latMid = (latMin + latMax) / 2.0;
    if (latitude > latMid) {
      quadrantCode += "1"; // شمال
      latMin = latMid;
    } else {
      quadrantCode += "3"; // جنوب
      latMax = latMid;
    }

    const lonMid = (lonMin + lonMax) / 2.0;
    if (longitude > lonMid) {
      quadrantCode += "2"; // شرق
      lonMin = lonMid;
    } else {
      quadrantCode += "4"; // غرب
      lonMax = lonMid;
    }
  }
  let CompressQuadrantCode = "";
  for (let i = 0; i < quadrantCode.length; i += 2) {
    if (quadrantCode[i] + quadrantCode[i + 1] == "13") {
      CompressQuadrantCode += 1;
    } else if (quadrantCode[i] + quadrantCode[i + 1] == "24") {
      CompressQuadrantCode += 2;
    }
    if (quadrantCode[i] + quadrantCode[i + 1] == "34") {
      CompressQuadrantCode += 3;
    } else if (quadrantCode[i] + quadrantCode[i + 1] == "34") {
      CompressQuadrantCode += 4;
    }
  }
  return quadrantCode;
}
/*
13 → شمال غرب1
14 → شمال شرق 2
23 → جنوب غرب3
24 → جنوب شرق 4

*/
export function generateNeighborsByDistance(
  latitude,
  longitude,
  precision = 20,
  distanceKm,
  slice = 24
) {
  const neighbors: any = [];

  // إزاحة 0 و +distanceKm و -distanceKm للخط عرض وخط طول
  const latOffsets = [0, kmToLat(distanceKm), -kmToLat(distanceKm)];
  const lngOffsets = [
    0,
    kmToLng(distanceKm, latitude),
    -kmToLng(distanceKm, latitude),
  ];

  for (const dLat of latOffsets) {
    for (const dLng of lngOffsets) {
      const newLat = latitude + dLat;
      const newLng = longitude + dLng;
      neighbors.push(encodeToQuadrants(newLat, newLng, precision).slice(slice));
    }
  }

  return neighbors;
}
export function generateNeighbors(location_code) {
  let neighbors: string[] = [];

  location_code = location_code.slice(0, -24);
  //neighbors.push(location_code)
  console.log("location_code +", location_code);
  let firstFromLeft = location_code.slice(-1);
  let lastTwoFromLeft = location_code.slice(-2);
  let secondFromLeft = lastTwoFromLeft.slice(0, -1);
  location_code = location_code.slice(0, -2);
  neighbors.push(location_code + lastTwoFromLeft);

  console.log("location_code +", location_code);
  console.log("firstFromLeft +", firstFromLeft);
  console.log("secondFromLeft +", secondFromLeft);
  if (secondFromLeft == 1 && firstFromLeft == 1) {
    neighbors.push(location_code + "12");
    neighbors.push(location_code + "13");
    neighbors.push(location_code + "14");



    neighbors.push(location_code + "22");
    neighbors.push(location_code + "24");
    neighbors.push(location_code + "33");
    neighbors.push(location_code + "34");
    neighbors.push(location_code + "44");

  } else if (secondFromLeft == 1 && firstFromLeft == 2) {
    neighbors.push(location_code + "11");
    neighbors.push(location_code + "13");
    neighbors.push(location_code + "14");


    neighbors.push(location_code + "21");
    neighbors.push(location_code + "23");
    neighbors.push(location_code + "33");
    neighbors.push(location_code + "34");
    neighbors.push(location_code + "43");

  } else if (secondFromLeft == 1 && firstFromLeft == 3) {
    neighbors.push(location_code + "11");
    neighbors.push(location_code + "12");
    neighbors.push(location_code + "14");

    neighbors.push(location_code + "22");
    neighbors.push(location_code + "24");
    neighbors.push(location_code + "42");
    neighbors.push(location_code + "31");
    neighbors.push(location_code + "32");


  } else if (secondFromLeft == 1 && firstFromLeft == 4) {
    neighbors.push(location_code + "11");
    neighbors.push(location_code + "12");
    neighbors.push(location_code + "13");

    neighbors.push(location_code + "21");
    neighbors.push(location_code + "23");
    neighbors.push(location_code + "41");
    neighbors.push(location_code + "31");
    neighbors.push(location_code + "32");



  } else if (secondFromLeft == 2 && firstFromLeft == 1) {
    neighbors.push(location_code + "22");
    neighbors.push(location_code + "23");
    neighbors.push(location_code + "24");


    neighbors.push(location_code + "12");
    neighbors.push(location_code + "14");
    neighbors.push(location_code + "43");
    neighbors.push(location_code + "44");
    neighbors.push(location_code + "34");

  } else if (secondFromLeft == 2 && firstFromLeft == 2) {
    neighbors.push(location_code + "21");
    neighbors.push(location_code + "23");
    neighbors.push(location_code + "24");


    neighbors.push(location_code + "33");
    neighbors.push(location_code + "43");
    neighbors.push(location_code + "44");
    neighbors.push(location_code + "11");
    neighbors.push(location_code + "13");

  } else if (secondFromLeft == 2 && firstFromLeft == 3) {
    neighbors.push(location_code + "21");
    neighbors.push(location_code + "22");
    neighbors.push(location_code + "24");

    neighbors.push(location_code + "12");
    neighbors.push(location_code + "14");
    neighbors.push(location_code + "41");
    neighbors.push(location_code + "42");
    neighbors.push(location_code + "32");

  } else if (secondFromLeft == 2 && firstFromLeft == 4) {
    neighbors.push(location_code + "21");
    neighbors.push(location_code + "22");
    neighbors.push(location_code + "23");


    neighbors.push(location_code + "41");
    neighbors.push(location_code + "42");
    neighbors.push(location_code + "11");
    neighbors.push(location_code + "13");
    neighbors.push(location_code + "31");
  } else if (secondFromLeft == 3 && firstFromLeft == 1) {
    neighbors.push(location_code + "32");
    neighbors.push(location_code + "33");
    neighbors.push(location_code + "34");


    neighbors.push(location_code + "13");
    neighbors.push(location_code + "14");
    neighbors.push(location_code + "24");
    neighbors.push(location_code + "42");
    neighbors.push(location_code + "44");
  } else if (secondFromLeft == 3 && firstFromLeft == 2) {
    neighbors.push(location_code + "31");
    neighbors.push(location_code + "33");
    neighbors.push(location_code + "34");


        neighbors.push(location_code + "13");
    neighbors.push(location_code + "14");
    neighbors.push(location_code + "23");
    neighbors.push(location_code + "41");
    neighbors.push(location_code + "43");
    
  } else if (secondFromLeft == 3 && firstFromLeft == 3) {
    neighbors.push(location_code + "31");
    neighbors.push(location_code + "32");
    neighbors.push(location_code + "34");



        neighbors.push(location_code + "22");
    neighbors.push(location_code + "12");
    neighbors.push(location_code + "22");
    neighbors.push(location_code + "42");
    neighbors.push(location_code + "44");
  } else if (secondFromLeft == 3 && firstFromLeft == 4) {
    neighbors.push(location_code + "31");
    neighbors.push(location_code + "32");
    neighbors.push(location_code + "33");



    neighbors.push(location_code + "41");
    neighbors.push(location_code + "43");
    neighbors.push(location_code + "21");
    neighbors.push(location_code + "12");
    neighbors.push(location_code + "21");
  } else if (secondFromLeft == 4 && firstFromLeft == 1) {
    neighbors.push(location_code + "42");
    neighbors.push(location_code + "43");
    neighbors.push(location_code + "44");

        
    neighbors.push(location_code + "23");
    neighbors.push(location_code + "24");
    neighbors.push(location_code + "14");
    neighbors.push(location_code + "32");
    neighbors.push(location_code + "34");

  } else if (secondFromLeft == 4 && firstFromLeft == 2) {
    neighbors.push(location_code + "41");
    neighbors.push(location_code + "43");
    neighbors.push(location_code + "44");


        neighbors.push(location_code + "23");
    neighbors.push(location_code + "24");
    neighbors.push(location_code + "13");
    neighbors.push(location_code + "31");
    neighbors.push(location_code + "33");
  } else if (secondFromLeft == 4 && firstFromLeft == 3) {
    neighbors.push(location_code + "41");
    neighbors.push(location_code + "42");
    neighbors.push(location_code + "44");


        neighbors.push(location_code + "34");
    neighbors.push(location_code + "32");
    neighbors.push(location_code + "22");
    neighbors.push(location_code + "21");
    neighbors.push(location_code + "12");
  } else if (secondFromLeft == 4 && firstFromLeft == 4) {
    neighbors.push(location_code + "41");
    neighbors.push(location_code + "42");
    neighbors.push(location_code + "43");


    neighbors.push(location_code + "31");
    neighbors.push(location_code + "33");
    neighbors.push(location_code + "11");
    neighbors.push(location_code + "21");
    neighbors.push(location_code + "22");
  }
  return neighbors;
}
export function decodeFromQuadrants(quadrantCode) {
  let latMin = -90.0,
    latMax = 90.0;
  let lonMin = -180.0,
    lonMax = 180.0;

  // كل خطوتين هما رمز واحد: lat direction, lon direction
  for (let i = 0; i < quadrantCode.length; i += 2) {
    const latChar = quadrantCode[i];
    const lonChar = quadrantCode[i + 1];

    const latMid = (latMin + latMax) / 2;
    if (latChar === "1") {
      latMin = latMid; // شمال => نصف شمالي
    } else if (latChar === "3") {
      latMax = latMid; // جنوب => نصف جنوبي
    } else {
      throw new Error("رمز غير صالح في اتجاه الشمال/الجنوب");
    }

    const lonMid = (lonMin + lonMax) / 2;
    if (lonChar === "2") {
      lonMin = lonMid; // شرق => نصف شرقي
    } else if (lonChar === "4") {
      lonMax = lonMid; // غرب => نصف غربي
    } else {
      throw new Error("رمز غير صالح في اتجاه الشرق/الغرب");
    }
  }

  // مركز المربع
  const latitude = (latMin + latMax) / 2;
  const longitude = (lonMin + lonMax) / 2;

  return { latitude, longitude };
}

export function haversineDistanceKm(lat1, lon1, lat2, lon2) {
  const toRadians = (angle) => (angle * Math.PI) / 180;

  const R = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
