/*
 * binaryTree.h
 *
 *  Created on: Aug 25, 2024
 *      Author: omar
 */

#ifndef STRUCTURES_BINARYTREE_H_
#define STRUCTURES_BINARYTREE_H_
#include <iostream>
#include "DynamicIntIntArray.h"
#include "DynamicIntIntArray.h"

struct binaryTreeNode
{
    struct binaryTreeNode *left;
    struct binaryTreeNode *right;
    struct binaryTreeNode *parent;
    int level;
    DynamicIntIntArray *children;
};

class BinaryTree
{
private:
    struct binaryTreeNode *createNode();
    struct binaryTreeNode *addItem(struct binaryTreeNode *parentItem,struct binaryTreeNode *lastNode, bool *item,
                                   int index, char length);
    bool **item;
    int encodingLength;
    struct binaryTreeNode * checkItem(struct binaryTreeNode *root,
                                     bool *item, int index, char length);

public:
    BinaryTree(int encodingLength);
    DynamicIntIntArray *check(char *arr, int length, struct children *child,
                              int numberOfIgrone, DynamicIntIntArray *dca);
    void addChild(char *arr, int length,
                                 struct intIntPointer *child);
    struct binaryTreeNode *root;


    virtual ~BinaryTree();
};

#endif /* STRUCTURES_BINARYTREE_H_ */
