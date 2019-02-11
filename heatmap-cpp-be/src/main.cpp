#include "../include/stdafx.h"

int main() {
    CSession test;

    // Initialize 'test'
    test.initSession();
    test.runThreads();

    // Destructor
    test.~CSession();
}
