#include <math.h>
#include <iostream>
#include <vector>
using namespace std;

int estPt(int, int, vector, vector, vector);

int main() {
    int a, b;
    float c;
    int x;
    while (1) {
        cout << "Please input the values of a and b: ";
        cin >> a >> b;

        for (x = 0; x < 1000000; x++) {
            c = a * a + b * b;
            c = sqrt(c);

            // cout << "The hypotenuse is: " << c << '.' << endl;
        }
    }
}

int estPt(int ptCol, int ptRow, vector<int> sensRow, vector<int> sensCol,
          vector<int> sensPt) {
    int counter, difX, difY;
    float dist;
    int ptVal;

    for (counter = 0; counter < sensRow.size(); counter++) {
        difX = sensCol.at(counter) - ptCol;
        difY = sensRow.at(counter) - ptRow;

        if ((difX + difY) > 0) {
            dist = sqrt(difX * difX + difY * difY);
        }
    }
}