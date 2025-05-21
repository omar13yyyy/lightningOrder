
#include "GeoHashing.h"

// دالة لتحويل الإحداثية إلى GeoQuad باستخدام 7 خانات
string GeoHashing::encodeToQuadrants(double latitude, double longitude, int precision = 20) {
    double latMin = -90.0, latMax = 90.0;
    double lonMin = -180.0, lonMax = 180.0;
    std::string quadrantCode = "";

    for (int i = 0; i < precision; i++) {
        // تقسيم خط العرض (lat)
        double latMid = (latMin + latMax) / 2.0;
        if (latitude > latMid) {
            quadrantCode += "1";  // شمال
            latMin = latMid;
        } else {
            quadrantCode += "3";  // جنوب
            latMax = latMid;
        }

        // تقسيم خط الطول (lon)
        double lonMid = (lonMin + lonMax) / 2.0;
        if (longitude > lonMid) {
            quadrantCode += "2";  // شرق
            lonMin = lonMid;
        } else {
            quadrantCode += "4";  // غرب
            lonMax = lonMid;
        }
    }

    return quadrantCode;
}
