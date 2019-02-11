#include "async_render.h"

using namespace std;

void mapPointValues (vector< vector<int> > coordinates) {
    

}



int fast_int_abs(int x) {
    int store = x >> 31;
    return (x ^ store) - store;
}

void mapData (vector< vector<int> > coordinates) {
    int row, column;
    for (row = 0; row < coordinates.size(); row++) {
        for (column = 0; column < coordinates[row].size(); column++) {
            //calculate each element here
        }
    }
}

int estPt ( int ptCol, int ptRow,
            vector<int> sensRow, vector<int> sensCol, vector<int> sensPtVal
            ) {
    int counter, difX, difY;
    float dist;
    int ptVal;

    for (counter = 0; counter < sensRow.size(); counter++) {
        difX = sensCol.at(counter) - ptCol;
        difY = sensRow.at(counter) - ptRow;

        if ( (difX + difY) != 0) {
            dist = sqrt(difX * difX + difY * difY);
        }

    }

    return 8;

}


