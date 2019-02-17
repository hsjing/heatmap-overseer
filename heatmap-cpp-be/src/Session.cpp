/**
 * @file Session.cpp
 * @author Jing Huang (seojeung.h@gmail.com)
 * @brief Session object
 * @version 0.1
 * @date 2019-01-28
 *
 * @copyright Copyright (c) 2019
 *
 */
#include "../include/Session.h"

CSession::CSession() {
    sessSock = new CDBSocket;
    sessCol = new CCollector;
    this->loadDate();
    nodeCnt = 8;  // TODO - dynamic node detection (current node count is 8)
}

CSession::~CSession() {}

void CSession::initSession(void) {
    string connChoice = "";

    // Prompt for local connection (so far, only local is implemented)
    while (connChoice != "Y" && connChoice != "N") {
        cout << "Would you like to connect locally? (Y/N)";
        cin >> connChoice;
    }

    // Make local connection
    if (connChoice == "Y" || connChoice == "y") {
        /*
        // Specify port number
        cout << "Specify port for local connection:";
        cin >> portNumber;
        server = "tcp://127.0.0.1:" + portNumber;

        // Specify credentials
        cout << "Enter your username:";
        cin >> username;

        cout << "Enter your password:";
        cin >> password;

        cout << endl;
        */

        server = "tcp://127.0.0.1:3306";
        username = "root";
        password = "root";

        sessSock->initDBConn(server, username, password, dateStr);

    } else if (connChoice == "N" ||
               connChoice == "n")  // TODO - add some exception handling here
        cout << "Goodbye!";
}

// TODO - find better way of doing this?
void CSession::loadDate(void) {
    // Get date of session
    time(&sessDate);
    char dateArr[10];
    tm = localtime(&sessDate);

    strftime(dateArr, 10, "%d%b%Y", tm);  // Store workable format in dateArr

    dateStr = dateArr;  // String-ify char array
}

void CSession::collectData(void) {
    while (COLLECT_FLAG) {
        // Collect data into collector buffer
        sessCol->collect();

        // Load into session data buffer
        sessBufMu.lock();
        for (int i = 0; i < sizeof(sessCol->colBuf); i++) {
            this->sessBuf.push_back(sessCol->colBuf[i]);
        }
        sessBufMu.unlock();

        // Delay collection half a second
        usleep(500000);
    }
}

void CSession::updateSocket(void) {
    while (UPDATE_FLAG) {
        // Clone session data buffer
        sessBufMu.lock();
        vector<float> updateBuf = this->sessBuf;
        sessBufMu.unlock();

        // Get current time
        time_t now = time(0);
        tm = localtime(&now);

        string timeStampStr = tm->tm_hour + ":" + tm->tm_min + ":" + tm->tm_sec;

        // Insert into table
        if (sessSock->updateTable(timeStampStr, updateBuf)) {
            cout << "Table updated for " << timeStampStr << endl;
        }
    }
}

void CSession::runThreads(void) {
    // Run the threads
    thread collectThread(bind(&CSession::collectData, this));
    thread socketThread(bind(&CSession::updateTable, this));

    collectThread.join();
    socketThread.join();
}

// TODO - separate terminate from destructor?
void CSession::termSession(void) {}
