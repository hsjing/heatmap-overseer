#include <algorithm>
#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main() {
    /*
    vector<pair<float, float>> vec = {{1, 2}, {3, 4}, {5, 6}, {7, 8}, {9, 10}};
    vector<float> lin_vec;

    transform(vec.begin(), vec.end(), back_inserter(lin_vec),
              [&lin_vec](const pair<float, float>& p) {
                  lin_vec.push_back(p.first);
                  return p.second;
              });

    // pair<float, float> X(3, 4);

    float X = 4;

    if (std::binary_search(lin_vec.begin(), lin_vec.end(), X))
        std::cout << "yes\n";

    for (const auto i : lin_vec) std::cout << i << ' ';
    */

    vector<float> updateBuf = {1, 2, 3, 4, 5};
    vector<string> strBuf(updateBuf.size());
    transform(updateBuf.begin(), updateBuf.end(), strBuf.begin(),
              [](const float& val) { return to_string(val); });

    // for (const auto i : strBuf) std::cout << i << ' ';

    cout << strBuf[0];

    while (1)
        ;
}