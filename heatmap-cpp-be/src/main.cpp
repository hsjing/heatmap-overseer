#include "../include/stdafx.h"

int main() {
    CSession test;

    // Initialize 'test'
    test.initSession();
    test.runThreads();

    /*
    if (test.sessSock->checkTable(test.dateStr))
        cout << "Table for " << test.dateStr << " exists." << endl;
    else
        cout << "Table for " << test.dateStr << " does not exist." << endl;

    while (1) {
    };
    */

    // Destructor
    test.~CSession();
}
