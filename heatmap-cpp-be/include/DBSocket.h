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
    int test;

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
    void initDBConn(std::string serv, std::string uname, std::string pass,
                    std::string date);

    /**
     * @brief Attempts to make a table corresponding to the current session date
     *
     * @param currDateStr The current date
     * @return int Operation status
     */
    int makeTable(std::string currDateStr);

    /**
     * @brief
     *
     * @param currDateStr The current date
     * @return int Operation status
     */
    int checkTable(std::string currDateStr);
};
