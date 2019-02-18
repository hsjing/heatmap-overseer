/**
 * @file DBSocket.cpp
 * @author Jing Huang (seojeung.h@gmail.com)
 * @brief DBSocket object
 * @version 0.1
 * @date 2019-01-28
 *
 * @copyright Copyright (c) 2019
 *
 */
#include "../include/DBSocket.h"

CDBSocket::CDBSocket() {
    this->dbDriver = get_driver_instance();  // Retrieve instance of Connection
                                             // from Driver object
    cout << "Connection driver version " << dbDriver->getMajorVersion() << "."
         << dbDriver->getMinorVersion() << endl;
}

CDBSocket::~CDBSocket() {
    // Delete all handlers except Driver (handled by SQL connector)
    delete dbConn;
    delete dbStmt;
    delete dbRes;
}

void CDBSocket::initDBConn(string serv, string uname, string pass,
                           string date) {
    cout << "Trying to establish connection to " << serv << " ..." << endl;

    try {
        // Create connection object
        dbConn = dbDriver->connect(serv, uname, pass);
        cout << "Connection established, selecting database..." << endl;

        // Connect to database
        dbConn->setSchema("heatmap");
        cout << "Database selected!" << endl;

    } catch (sql::SQLException& e) {
        ExpHandle("initDBConn", e);
    }

    cout << "Connection established!" << endl;

    if (this->makeTable(date)) {
        cout << "Table for " << date << " successfully created!" << endl;
    }
}

int CDBSocket::makeTable(string currDateStr) {
    // If table for the date is not found, one is created
    if (!(this->checkTable(currDateStr))) {
        string tableMakStmt =
            "CREATE TABLE IF NOT EXISTS " + currDateStr +
            "(stamp VARCHAR(8), N1 float, N2 float, N3 float, N4 "
            "float, N5 float, N6 float, N7 float, N8 float);";

        sql::SQLString tableMakQuery(tableMakStmt);

        dbStmt = dbConn->createStatement();

        // Try/catch block
        try {
            dbRes = dbStmt->executeQuery(tableMakQuery);  // Execute query

            // Delete handlers
            delete dbConn;
            delete dbStmt;
            return 1;  // New table created

        } catch (sql::SQLException e) {
            ExpHandle("makeTable", e);

            // Any exception return -1
            return -1;  // Exception
        }
    } else
        return 0;  // Table already exists
}

int CDBSocket::checkTable(string currDateStr) {
    // TODO - Not sure if SQLstring object can be concatenated, so using
    // hackish workaround for now
    string tableChkStmt = "SHOW TABLES LIKE '" + currDateStr + "'";
    sql::SQLString tableChkQuery(tableChkStmt);

    // Prepare statement
    dbStmt = dbConn->createStatement();

    // Execute and handle exceptions
    try {
        dbRes = dbStmt->executeQuery(tableChkQuery);  // Execute query

        // Check to see if the table queried is within the result set (and ONLY
        // that table)
        return (dbRes->next()) ? 1 : 0;

        // Delete handlers
        delete dbConn;
        delete dbStmt;

    } catch (sql::SQLException e) {
        ExpHandle("checkTable", e);

        // Any exception return -1
        return -1;
    }
}

int CDBSocket::updateTable(string currDateStr, string timeStamp, vector<string> sessionBuffer) {
    
    //cout << sessionBuffer[1] << endl;
    
    string updateStmt =
        "INSERT INTO " + currDateStr + " VALUES (" + "'" + timeStamp + "'," +
        "'" + sessionBuffer[0] + "'," + "'" + sessionBuffer[1] + "'," + "'" +
        sessionBuffer[2] + "'," + "'" + sessionBuffer[3] + "'," + "'" +
        sessionBuffer[4] + "'," + "'" + sessionBuffer[5] + "'," + "'" +
        sessionBuffer[6] + "'," + "'" + sessionBuffer[7] + "');";

    sql::SQLString updateQuery(updateStmt);
    

    // Prepare statement
    dbStmt = dbConn->createStatement();

    try {
        dbRes = dbStmt->executeQuery(updateQuery);  // Execute query

        delete dbConn;
        delete dbStmt;
        return 1;
        
    } catch (sql::SQLException e) {
        ExpHandle("updateTable", e);

        return -1;
    }
}
