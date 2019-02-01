// g++ -std=c++11 array.cpp -o arraytest

#include <math.h>
#include <chrono>
#include <iostream>
#include <vector>
using namespace std;

#define WIDTH 800
#define LENGTH 600

float fastInvSqrt(float x);

int main() {
    // sample matrix of area units in the room
    vector<int> sampleMat(LENGTH * WIDTH, 2);

    // choose some indices to signify sensor point values
    vector<int> sampleInd = {4799, 891, 67589, 171237, 123, 112, 10928, 71823};

    int x, iter, currentX, currentY;
    int ptRow, ptCol;
    int iterRow, iterCol;

    int xDist, yDist;
    float distEff;

    auto start = chrono::high_resolution_clock::now();

    for (x = 0; x < sampleMat.size(); x++) {
        ptRow = x / WIDTH;
        ptCol = x % WIDTH;
        distEff = 0;
        for (iter = 0; iter < sampleInd.size(); iter++) {
            iterRow = sampleInd[iter] / WIDTH;

            iterCol = sampleInd[iter] % WIDTH;

            xDist = abs(iterCol - ptCol);
            yDist = abs(iterRow - ptRow);

            sampleMat[x] += fastInvSqrt(xDist * xDist + yDist * yDist);
        }

        sampleMat[x] = distEff;
        // cout << "Row: " << ptRow << " | " << "Column: " << ptCol << endl;
        // cout << "Dist: " << distEff << endl << endl;
    }

    auto end = chrono::high_resolution_clock::now();

    chrono::duration<double> elapsed = end - start;
    cout << "done in " << elapsed.count() << " seconds";

    while (1)
        ;
}

float fastInvSqrt(float x) {
    union {
        float f;
        uint32_t i;
    } conv;

    float x2;
    const float threehalfs = 1.5F;

    x2 = x * 0.5F;
    conv.f = x;
    conv.i = 0x5f3759df -
             (conv.i >> 1);  // bit level hacking + some truly fucked up shit
    conv.f = conv.f * (threehalfs - (x2 * conv.f * conv.f));
    return conv.f;
}