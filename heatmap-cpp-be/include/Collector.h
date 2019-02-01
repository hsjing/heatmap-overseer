/**
 * @file Collector.h
 * @author Jing Huang (seojeung.h@gmail.com)
 * @brief Collector header
 * @version 0.1
 * @date 2019-01-28
 *
 * @copyright Copyright (c) 2019
 *
 */
#pragma once

#include "stdafx.h"

class CUart;  // Forward declare to avoid cross referencing issues

class CCollector {
   private:
    bool colExitFlag = 0;  // Exit flag

   public:
    CUart *colUart;  // Collector UART connection object

    float colBuf[8];  // Collector buffer to receive valid temp data from UART
                      // (data should be already sorted here)

    /**
     * @brief Construct a new CCollector object
     *
     */
    CCollector();

    /**
     * @brief Destroy the CCollector object
     *
     */
    ~CCollector();

    /**
     * @brief Collect data into local buffer
     *
     */
    void collect(void);
};