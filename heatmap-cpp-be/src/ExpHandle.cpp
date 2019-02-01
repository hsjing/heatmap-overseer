#include "../include/ExpHandle.h"

void ExpHandle(std::string funct, sql::SQLException& e) {
    std::cout << "# ERR: SQLException in " << funct;
    std::cout << ", # ERR: " << e.what() << endl;
    std::cout << " (MYSQL error code :" << e.getErrorCode();
    std::cout << ", SQLState: " << e.getSQLState() << " )" << endl;
}