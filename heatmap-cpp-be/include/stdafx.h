#pragma once

#include <fcntl.h>
//#include <mysql/mysql.h>
#include <pigpio.h>
#include <stdio.h>
#include <stdlib.h>
#include <termios.h>
#include <unistd.h>
#include <cstring>
#include <ctime>
#include <iomanip>
#include <iostream>
#include <sstream>
#include <string>
#include <vector>

#include <cmath>

// threading
#include <mutex>
#include <thread>

// using mysql connector
#include <cppconn/driver.h>
#include <cppconn/exception.h>
#include <cppconn/resultset.h>
#include <cppconn/statement.h>

// modules here
#include "Collector.h"
#include "DBSocket.h"
#include "Session.h"
#include "Uart.h"
