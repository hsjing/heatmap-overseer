#pragma once

#pragma once

#include <algorithm>
#include <cmath>
#include <iostream>
#include <vector>

namespace nearest {

struct Point2 {
    double x;
    double y;

    bool operator==(const Point2& rhp) { return x == rhp.x && y == rhp.y; }
};

// Return N closest points to first Point2 in vector in order
std::vector<Point2> nearestN(const std::vector<Point2>& points, int N);

// Return N closest points to a reference Point2, in order - all
// within maximum distance threshold
std::vector<Point2> nearestN(const std::vector<Point2>& points, int N,
                             const Point2& reference, double distanceThreshold);

}  // namespace nearest