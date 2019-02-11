/**
 * @file Session.cpp
 * @author Jing Huang (seojeung.h@gmail.com)
 * @brief Session object
 * manages their threads
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
        std::cout << "Would you like to connect locally? (Y/N)";
        std::cin >> connChoice;
    }

    // Make local connection
    if (connChoice == "Y" || connChoice == "y") {
        /*
        // Specify port number
        std::cout << "Specify port for local connection:";
        std::cin >> portNumber;
        server = "tcp://127.0.0.1:" + portNumber;

        // Specify credentials
        std::cout << "Enter your username:";
        std::cin >> username;

        std::cout << "Enter your password:";
        std::cin >> password;

        std::cout << endl;
        */

        server = "tcp://127.0.0.1:3306";
        username = "root";
        password = "root";

        sessSock->initDBConn(server, username, password, dateStr);

    } else if (connChoice == "N" ||
               connChoice == "n")  // TODO - add some exception handling here
        std::cout << "Goodbye!";
}

// TODO - find better way of doing this?
void CSession::loadDate(void) {
    // Get date of session
    time(&sessDate);
    tm* tm;
    char dateArr[10];
    tm = localtime(&sessDate);

    strftime(dateArr, 10, "%d%b%Y", tm);  // Store workable format in dateArr

    dateStr = dateArr;  // String-ify char array
}

void CSession::collectData(void) {
    while (COLLECT_FLAG) {
        // Collect data into collector buffer
        sessCol->collect();

        // Testing section
        std::cout << "collecting" << std::endl;

        std::cout << sessCol->colBuf[1] << std::endl;

        std::cout << sessCol->colBuf[3] << std::endl;

        // Load into session buffer vector
        for (int i = 0; i < sizeof(sessCol->colBuf); i++) {
            this->sessBuf.push_back(sessCol->colBuf[i]);
        }

        // Delay collection a bit
        usleep(1000000);
    }
}

void CSession::updateTable(void) {}

void CSession::runThreads(void) {
    std::thread collectThread(std::bind(&CSession::collectData, this));
    std::thread socketThread(this->updateTable());  // TODO - does this work?

    collectThread.join();
    socketThread.join();
}

// TODO - separate terminate from destructor?
void CSession::termSession(void) {}
