#include "../include/ExpHandle.h"

void ExpHandle(string funct, sql::SQLException& e) {
    cout << endl << "# ERR: SQLException in " << funct;
    cout << ", # ERR: " << e.what() << endl;
    cout << " (MYSQL error code :" << e.getErrorCode();
    cout << ", SQLState: " << e.getSQLState() << " )" << endl;
}