#include <ctime>
#include <iostream>
using namespace std;

int main() {
    time_t curr_time;
    tm* curr_tm;
    char date_string[10];
    char time_string[100];

    string teststr;

    time(&curr_time);
    curr_tm = localtime(&curr_time);

    strftime(date_string, 10, "%d%b%Y", curr_tm);

    teststr = date_string;

    string tableChkQuery = "SHOW TABLES LIKE '%" + teststr + "%'";

    cout << tableChkQuery;

    while (1) {
    };

    return 0;
}