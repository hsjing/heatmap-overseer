#include "../include/stdafx.h"

int main() {
    /* UART testing
    CUart uart_test;  // Test CUart object
    int count = 0;

    while (true) {
        uart_test.uartRx();  // Repeatedly receive from RX
        // count++;    // Uptick counter
    }

    uart_test.~CUart();  // Terminate
    */

    // MYSQL testing

    // Instantiate session object 'test'
    CSession test;

    // Initialize 'test'
    test.initSession();

    if (test.sessSock->checkTable(test.dateStr))
        cout << "Table for " << test.dateStr << " exists." << endl;
    else
        cout << "Table for " << test.dateStr << " does not exist." << endl;

    while (1) {
    };

    // Destructor
    test.~CSession();
}
