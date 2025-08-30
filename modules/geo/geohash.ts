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
  // ضبط الحدود والالتفاف في الطول
  latitude = Math.max(-90, Math.min(90, latitude));
  longitude = ((longitude + 180) % 360 + 360) % 360 - 180;

  let latMin = -90,  latMax =  90;
  let lonMin = -180, lonMax = 180;
  let code = "";

  for (let i = 0; i < precision; i++) {
    const latMid = (latMin + latMax) / 2;
    const isNorth = latitude >= latMid;   // التعادل يُدفع للشمال
    if (isNorth) latMin = latMid; else latMax = latMid;

    const lonMid = (lonMin + lonMax) / 2;
    const isEast = longitude >= lonMid;   // التعادل يُدفع للشرق
    if (isEast) lonMin = lonMid; else lonMax = lonMid;

    // فهرس رباعي: 0..3 وفق ترتيب NE, NW, SE, SW
    const idx = (isNorth ? 0 : 2) + (isEast ? 0 : 1);
    code += "1234"[idx]; // 1=NE, 2=NW, 3=SE, 4=SW
  }
  return code;
}
/*
13 → شمال غرب1
14 → شمال شرق 2
23 → جنوب غرب3
24 → جنوب شرق 4

*/
export function generateNeighbors(code, wrapNS = true) {
code = code.slice(0, 8);
  const L = code.length;
  const { x, y } = decodeToXY(code);
  const size = 1 << L;

  // deltas بالترتيب: N, NE, E, SE, S, SW, W, NW
  const deltas = [
    [ 0,  1],
    [ 1,  1],
    [ 1,  0],
    [ 1, -1],
    [ 0, -1],
    [-1, -1],
    [-1,  0],
    [-1,  1],
  ];

  const res = [code]; // ابدأ بالنص الأصلي
  for (const [dx, dy] of deltas) {
    const nx = (x + dx + size) % size; // التفاف شرق/غرب دائمًا
    let ny = y + dy;

    if (wrapNS) {
      ny = (ny % size + size) % size;   // التفاف شمال/جنوب إن طُلِب
      res.push(encodeXY(nx, ny, L));
    } else {
      if (ny < 0 || ny >= size) continue; // تجاهل الجار خارج النطاق
      res.push(encodeXY(nx, ny, L));
    }
  }
  return res;
}

// --------- أدوات ترميز/فك ترميز (1=NE, 2=NW, 3=SE, 4=SW) ---------
function decodeToXY(s) {
  let x = 0, y = 0;
  for (const ch of s) {
    x <<= 1; y <<= 1;
    if (ch === "1") { y |= 1; x |= 1; }      // NE
    else if (ch === "2") { y |= 1; }         // NW
    else if (ch === "3") { x |= 1; }         // SE
    // "4" => SW: لا شيء
  }
  return { x, y };
}

function encodeXY(x, y, L) {
  let out = "";
  for (let i = L - 1; i >= 0; i--) {
    const yb = (y >> i) & 1;
    const xb = (x >> i) & 1;
    if (yb && xb) out += "1";       // NE
    else if (yb && !xb) out += "2"; // NW
    else if (!yb && xb) out += "3"; // SE
    else out += "4";                // SW
  }
  return out;
}

export function decodeFromQuadrants(quadrantCode) {
  let latMin = -90.0,
    latMax = 90.0;
  let lonMin = -180.0,
    lonMax = 180.0;

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
