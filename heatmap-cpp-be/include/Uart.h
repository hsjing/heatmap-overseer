/**
 * @file Uart.h
 * @author Jing Huang (seojeung.h@gmail.com)
 * @brief UART header
 * @version 0.1
 * @date 2019-01-28
 *
 * @copyright Copyright (c) 2019
 *
 */
#pragma once

#include "stdafx.h"

class CUart {
   private:
    char uart0_filestream;

    int rxLen,     // Receiving buffer length
        iter = 0;  // Buffer iterator

    char rxBuf[256],   // Receiver buffer
        txBuf[20],     // Transmit buffer
        *pTxBuf,       // Transmit buffer pointer
        digital[256],  // Digital buffer
        data[1];       // Data buffer

    std::string analog;  // Analog data string

    float fDigi1,  // Digital data to nearest degree
        fDigi2,    // Digital data to nearest 0.0625 of a degree
        digiTemp,  // Digital temperature
        anaProc,   // Analog processed to be stored
        digiProc;  // Digital processed to be stored

    int EXIT_FLAG = false;  // Process exit flag

   public:
    CUart();   // Constructor
    ~CUart();  // Destructor

    std::vector<pair<float, float>> tempData = std::vector<pair<float, float>>(
        36);  // Temperature data vector, each node represented by vector
              // element and each element has a pair of values (analog and
              // digital)

    /**
     * @brief Receive from UART
     *
     */
    void uartRx(void);

    /**
     * @brief Transmit to UART
     *
     */
    void uartTx(void);

    /**
     * @brief Terminates current UART instance
     *
     */
    void termUart(void);

    /**
     * @brief Wipe and dummify temperature buffer
     *
     */
    void resetTempBuf(void);
};
