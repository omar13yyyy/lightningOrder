/*
 * binaryTree.cpp
 *
 *  Created on: Aug 25, 2024
 *      Author: omar
 */

#include "BinaryTree.h"

struct binaryTreeNode *BinaryTree::createNode()
{

    struct binaryTreeNode *newNode = (struct binaryTreeNode *)malloc(
        sizeof(struct binaryTreeNode));
    newNode->left = 0;

    newNode->right = 0;
    newNode->children = 0;
    newNode->parent = 0;
    newNode->level = 0;
    // TODO init here if you add to binaryTreeNode

    return newNode;
}
struct binaryTreeNode *BinaryTree::addItem(struct binaryTreeNode *parentItem, struct binaryTreeNode *lastNode,
                                           bool *item, int index, char length)
{

    if (index < length)
    {

        if (item[index])
        {
            if (lastNode->left)
            {
                return addItem(parentItem,lastNode->left, item, index + 1, length);
            }
            else
            {
                struct binaryTreeNode *tempNode = createNode();
                lastNode->left = tempNode;
                return addItem(parentItem,tempNode, item, index + 1, length);
            }
        }
        else
        {
            if (lastNode->right)
            {
                return addItem(parentItem,lastNode->right, item, index + 1, length);
            }
            else
            {

                struct binaryTreeNode *tempNode = createNode();
                lastNode->right = tempNode;
                return addItem(parentItem,tempNode, item, index + 1, length);
            }
        }
    }
    else
    {
        lastNode->parent = parentItem;
        return lastNode;
    }
}

struct binaryTreeNode *BinaryTree::checkItem(struct binaryTreeNode *root,
                                             bool *item, int index, char length)
{

    if (index < length)
    {

        if (item[index])
        {
            if (root->left)
            {
                return checkItem(root->left, item, index + 1, length);
            }
            else
            {
                if (root->right)
                {
                    return checkItem(root->right, item, index + 1, length);
                }
            }
        }
    }
}

void BinaryTree::addChild(char *arr, int length,
                          struct intIntPointer *child)
{
    struct binaryTreeNode *root = this->root;
    for (int i = 0; i < length; i++)
    {
        if (arr[i] <= this->encodingLength)
            root = addItem(root,root, item[arr[i]], 0, arr[i]);
        else
            root = addItem(root,root, item[0], 0, 1);
    }

    if (root->children)
    {
        root->children->addItem(child);
    }
    else
    {
        root->children = new DynamicIntIntArray(5);
        root->children->addItem(child);
    }
}
/*
DynamicIntIntArray *BinaryTree::check(char *arr, int length,
                                      struct children *child, int numberOfIgrone, DynamicIntIntArray *dca)
{
    struct binaryTreeNode *root = this->root;
    struct binaryTreeNode *root2 = this->root;
    struct binaryTreeNode *root3 = this->root;
    struct binaryTreeNode *root4 = this->root;
    struct binaryTreeNode *root5 = this->root;
    for (int i = 0; i < length; i++)
    {
        root = checkItem(root, item[0], 0, 1);
        if (numberOfIgrone > 0)
        {
            root2 = checkItem(root, item[0], 0, 1);
            root3 = checkItem(root, item[0], 0, 1);
            root4 = checkItem(root, item[0], 0, 1);
            root5 = checkItem(root, item[0], 0, 1);
        }
    }
}
    */
BinaryTree::BinaryTree(int encodingLength)
{
    this->encodingLength = encodingLength;
    this->item = (bool **)malloc(sizeof(bool *) * encodingLength);
    for (int i = 0; i < encodingLength; i++)
    {

        item[i] = (bool *)malloc(sizeof(bool) * (i + 1));

        for (int j = 0; j < i + 1; j++)
        {

            if (i == j)
            {
                item[i][j] = 0;
            }
            else
                item[i][j] = 1;
        }
    }
    root = createNode();
}

BinaryTree::~BinaryTree()
{
}
