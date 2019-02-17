/**
 * @file DBSocket.h
 * @author Jing Huang (seojeung.h@gmail.com)
 * @brief DBSocket header
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

class CDBSocket {
   private:
    // SQL access pointers
    sql::Driver *dbDriver;
    sql::Connection *dbConn;
    sql::Statement *dbStmt;
    sql::ResultSet *dbRes;

   public:
    /**
     * @brief Construct a new CDBSocket object
     *
     */
    CDBSocket();

    /**
     * @brief Destroy the CDBSocket object
     *
     */
    ~CDBSocket();

    /**
     * @brief Initiate the database connection
     *
     * @param serv Server IP
     * @param uname Username
     * @param pass Password
     * @param date Date of session
     */
    void initDBConn(string serv, string uname, string pass, string date);

    /**
     * @brief Attempts to make a table corresponding to the current session date
     *
     * @param currDateStr The current date
     * @return int Operation status
     */
    int makeTable(string currDateStr);

    /**
     * @brief Checks whether table exists for current date
     *
     * @param currDateStr The current date
     * @return int Operation status
     */
    int checkTable(string currDateStr);

    /**
     * @brief Inserts current buffer of data into table and timestamp it
     *
     * @param timeStamp Timestamp string
     * @param sessionBuffer Current temperature data buffer
     * @return int Operation status
     */
    int updateTable(string timeStamp, vector<float> sessionBuffer);
};
