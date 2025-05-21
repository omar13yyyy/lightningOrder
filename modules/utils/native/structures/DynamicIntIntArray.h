/*
 * DynamicIntArray.h
 *
 *  Created on: Aug 26, 2024
 *      Author: omar
 */

 #ifndef STRUCTURES_DYNAMICINTINTARRAY_H_
 #define STRUCTURES_DYNAMICINTINTARRAY_H_
 #include<iostream>
 struct intIntPointer {
	int id;
	int *related ;
    int  relatedLength ;

};
 class DynamicIntIntArray {
 
 public:
 DynamicIntIntArray();
 DynamicIntIntArray(unsigned short int n);
 
     virtual ~DynamicIntIntArray();
     unsigned short int n;
     struct intIntPointer **array;
     int size;
     int lastIndex = -1;
     void resize();
     void addItem(struct intIntPointer * item);
     void print();
 };
 
 #endif /* STRUCTURES_DynamicIntIntArray_H_ */
 