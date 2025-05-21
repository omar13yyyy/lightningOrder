/*
 * DynamicIntArray.cpp
 *
 *  Created on: Aug 26, 2024
 *      Author: omar
 */

 #include "DynamicIntIntArray.h"

 DynamicIntIntArray::DynamicIntIntArray() {
     this->size = 100;
     this->n = 100;
     array = (struct intIntPointer**) malloc(sizeof(struct intIntPointer*) * n);
 
 }
 
 DynamicIntIntArray::DynamicIntIntArray(unsigned short int n) {
     array = (struct intIntPointer**) malloc(sizeof(struct intIntPointer*) * n);
     this->n = n;
     this->size = n;
 
 }
 void DynamicIntIntArray::print() {
     for (int i = 0; i <= lastIndex; i++) {
         std::cout << array[i] << std::endl;
     }
 
 }
 void DynamicIntIntArray::addItem(struct intIntPointer* item) {
     this->lastIndex++;
     if (lastIndex >= size)
         resize();
     array[this->lastIndex] = item;
 
 }
 
 void DynamicIntIntArray::resize() {
     this->size = size + n;
     array = (struct intIntPointer**) realloc(array, sizeof(struct intIntPointer*) * (size));
 
     return;
 }


 DynamicIntIntArray::~DynamicIntIntArray() {
 }
 