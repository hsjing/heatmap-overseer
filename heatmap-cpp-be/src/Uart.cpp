/**
 * @file Uart.cpp
 * @author Jing Huang (seojeung.h@gmail.com)
 * @brief UART Object
 * @version 0.1
 * @date 2019-01-28
 *
 * @copyright Copyright (c) 2019
 *
 */
#include "../include/Uart.h"

CUart::CUart() {
    // Terminate if GPIO incorrectly initiated
    gpioTerminate();

    // Initialize GPIO and filestream
    gpioInitialise();
    uart0_filestream = -1;

    // Open channel at uart0
    if (uart0_filestream = serOpen("/dev/ttyUSB0", 9600, 0) < 0)
        printf("Unable to open UART\n");
}

CUart::~CUart() {
    // Close channel at uart0
    serClose(uart0_filestream);

    // Terminate GPIO and set exit flag
    gpioTerminate();
    EXIT_FLAG = true;
}

void CUart::resetTempBuf(void) {
    tempData = vector<pair<float, float>>(36, std::make_pair(-300.0, -300.0));
}

void CUart::uartRx(void) {
    // If channel is open
    if (uart0_filestream != -1) {
        // Temporary data vector identifier
        int id = -1;

        // Read '1' bytes from 'uart0_filestream' to 'data'
        rxLen = serRead(uart0_filestream, data, 1);

        // Either bad rxLen (-1) or empty (0)
        if (rxLen <= 0) {
        }  // printf("Error reading from UART: %d\n", uart0_filestream);

        // If data in buffer is not yet valid
        else if (data[0] != '.') {
            // Load 'data' into next element in 'rxBuf'
            rxBuf[iter] = data[0];
            iter++;  // Increment iterator
        }

        // If data in buffer is valid
        else if (data[0] == '.') {
            if (rxBuf[0] == 'N') {
                // 2nd element of rxBuf contains the node number
                // This converts that node number from char to int
                id = rxBuf[1] - '0';

                // Analog conversion
                analog = string(rxBuf).substr(4, 5);
                stringstream stream;
                stream << analog;

                // Digital conversion
                char* pEnd;

                copy(rxBuf + 12, rxBuf + 16,
                     digital + 0);  // Copy digital data into 'digital' string
                fDigi1 = strtol(digital, &pEnd,
                                16);  // digital data to nearest degree
                                      // from string to long int
                fDigi2 = strtol(pEnd, &pEnd,
                                16);  // digital data to nearest 0.0625 of
                                      // a degree from string to long int

                // Consolidate digital temperature
                digiTemp = fDigi1 + fDigi2 * 0.0625;

                // Reference tempData's 'id'th element, and loads analog
                // into first of the pair, and digital into second of the pair
                stream >> tempData[id].first;
                tempData[id].second = digiTemp;

                // Reset rxBuf
                memset(rxBuf, 0, sizeof(rxBuf));
            }

            // Otherwise, unhandled error
            else {
                printf("Unhandled error.\n");
            }

            iter = 0;  // Reset iterator
        }
    }
}
