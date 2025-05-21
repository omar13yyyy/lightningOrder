/*
 * DynamicIntArray.h
 *
 *  Created on: Aug 26, 2024
 *      Author: omar
 */

 #ifndef ALGORATHIMIA_GEOHASHING_H_
 #define ALGORATHIMIA_GEOHASHING_H_
 #include<iostream>
//#include <cmath>
#include <string>
 using namespace std;

 class GeoHashing {
 
 public:
    string static encodeToQuadrants(double latitude, double longitude, int precision ) ;

 };
 
 #endif /* ALGORATHIMIA_GeoHashing_H_ */
 