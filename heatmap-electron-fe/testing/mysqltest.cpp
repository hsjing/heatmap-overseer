#include <cstring>
#include <iomanip>
#include <iostream>
#include <string>

using namespace std;

int main() {
    string a = "21Jan2019";
    string tableMakStmt =
        "CREATE TABLE IF NOT EXISTS " + a +
        "(stamp TIME, N1 float, N2 float, N3 float, N4 float, N5 float, "
        "N6 float, N7 float, N8 float);";

    cout << tableMakStmt;
    while (1)
        ;
}
