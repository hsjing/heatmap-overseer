/**
 * @file Session.h
 * @author Jing Huang (seojeung.h@gmail.com)
 * @brief Session header
 * @version 0.1
 * @date 2019-01-28
 *
 * @copyright Copyright (c) 2019
 *
 */
#pragma once

using namespace std;

#include "stdafx.h"

#include "mysql_connection.h"

#define FAIL 0
#define PASS 1
#define TRUE 1
#define FALSE 0

// Forward declare to avoid cross referencing issues
class CDBSocket;
class CCollector;

class CSession {
   private:
    std::tm *tm;  // C++ time pointer

    time_t sessDate;  // Session date

    vector<float> sessBuf;  // Temporary session buffer

    mutex sessBufMu;  // Session data buffer locking

   public:
    string server, username, password, portNumber;  // Access credentials
    string dateStr;  // Session date in string form

    bool EXIT_FLAG;
    bool COLLECT_FLAG;
    bool UPDATE_FLAG;

    int nodeCnt;  // Number of active nodes expected in the session

    CDBSocket *sessSock;  // Session communication socket object
    CCollector *sessCol;  // Session collector object

    /**
     * @brief Construct a new CSession object
     *
     */
    CSession();

    /**
     * @brief Destroy the CSession object
     *
     * NOTE: Make sure to clean up all SQL handlers EXCEPT Driver after
     * completing a session. Refer to:
     * https://dev.mysql.com/doc/connector-cpp/1.1/en/connector-cpp-examples-connecting.html
     *
     */
    ~CSession();

    /**
     * @brief Initializes session
     *
     */
    void initSession(void);

    /**
     * @brief Terminates session
     *
     */
    void termSession(void);

    /**
     * @brief Loads the session's date
     *
     */
    void loadDate(void);

    /**
     * @brief Collect and loads data into buffer
     *
     */
    void collectData(void);

    /**
     * @brief Updates the table through connection socket
     *
     */
    void updateSocket(void);

    /**
     * @brief Runs the collector/socket threads
     *
     */
    void runThreads(void);
};
