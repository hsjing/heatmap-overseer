#include <ctime>
#include <iostream>
using namespace std;

int main() {
    time_t curr_time = time(0);
    tm* curr_tm;

    curr_tm = localtime(&curr_time);

    cout << curr_tm->tm_hour << ":" << curr_tm->tm_min << ":" << curr_tm->tm_sec
         << endl;

    /*
    char date_string[10];
    char time_string[100];

    string teststr;

    time(&curr_time);
    curr_tm = localtime(&curr_time);

    strftime(date_string, 10, "%d%b%Y", curr_tm);

    teststr = date_string;

    string tableChkQuery = "SHOW TABLES LIKE '%" + teststr + "%'";

    cout << tableChkQuery;
    */
    while (1) {
    };

    return 0;
}