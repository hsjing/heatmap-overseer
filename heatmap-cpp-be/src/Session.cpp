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
    std::string connChoice = "";

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

        // Clear vector
        sessBuf.clear();

        // Push elements into vector
        for (int i = 0; i < sessCol->colBuf.size(); i++) {
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

        vector<string> strBuf(updateBuf.size());
        transform(updateBuf.begin(), updateBuf.end(), strBuf.begin(),
                  [](const float& val) { return to_string(val); });

        // Get current time
        time_t now = time(0);
        tm = localtime(&now);

        std::string timeStampStr = to_string(tm->tm_hour) + ":" +
                                   to_string(tm->tm_min) + ":" +
                                   to_string(tm->tm_sec);

        // Testing
        for (const auto i : updateBuf) cout << i << endl;

        // Insert into table
        if (sessSock->updateTable(dateStr, timeStampStr, strBuf))
            cout << "Table updated for " << timeStampStr << endl;
        else
            cout << "Table couldn't be updated" << endl;

        usleep(10000000);
    }
}

void CSession::runThreads(void) {
    // Run the threads
    thread collectThread(bind(&CSession::collectData, this));

    usleep(1000000);  // Wait for collector first
    thread socketThread(bind(&CSession::updateSocket, this));

    collectThread.join();
    socketThread.join();
}

// TODO - separate terminate from destructor?
void CSession::termSession(void) {}
