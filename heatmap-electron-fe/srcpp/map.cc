// hello.cc
#include <node.h>

#include <iostream>
#include <string>
#include "header/mba.hpp"

namespace demo {

using v8::Array;
using v8::Exception;
using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Number;
using v8::Object;
using v8::String;
using v8::Value;

#define WIDTH 800
#define HEIGHT 600
#define DIMENSIONS 480000

// prototype
int distanceSqr(int, int, int, int);

void renderHeatmap(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();

    if (args.Length() != 1) {
        isolate->ThrowException(Exception::TypeError(
            String::NewFromUtf8(isolate, "Wrong number of arguments")));
        return;
    }

    // decouple v8 array into something workable
    v8::Local<Array> parentData = Local<Array>::Cast(args[0]);
    v8::Local<Array> coordArray = Local<Array>::Cast(parentData->Get(0));
    v8::Local<Array> sensorDataArray;

    int nodeCount = coordArray->Length() >> 1;
    int heatmapCount = parentData->Length() - 1;

    std::vector<float> sensorDataVec(nodeCount);

    // fill the coordinate vector with valid coordinate info (size is half of
    // coordinate bucket from js)
    std::vector<std::pair<int, int>> knownCoordVec(nodeCount,
                                                   std::make_pair(-1, -1));

    for (int i = 1; i <= knownCoordVec.size(); i++) {
        knownCoordVec[i - 1].first = coordArray->Get(i - 1)->NumberValue();
        knownCoordVec[i - 1].second =
            coordArray->Get((i << 1) - 1)->NumberValue();
    }

    // construct a 2d grid of vectors containing coordinate of every pixel AND
    // the distance to each known node (total of 2 + nodeCount elements in each)
    std::vector<std::vector<int>> heatmapGrid(DIMENSIONS,
                                              std::vector<int>(2 + nodeCount));

    // [distToNode0, distToNode1... distToNodeN, x, y]
    for (int i = 0; i < heatmapGrid.size(); i++) {
        // pixel x and y are the modulo and dividend of WIDTH
        heatmapGrid[i][nodeCount] = i % WIDTH;
        heatmapGrid[i][nodeCount + 1] = i / WIDTH;

        for (int j = 0; j < nodeCount; j++) {
            heatmapGrid[i][j] = distanceSqr(
                heatmapGrid[i][nodeCount], heatmapGrid[i][nodeCount + 1],
                knownCoordVec[j].first, knownCoordVec[j].second);
        }
    }

    // construct heatmap arrays
    std::vector<std::vector<int>> heatmapCollection(
        heatmapCount, std::vector<int>(DIMENSIONS));

    // rendering happens here
    for (int i = 0; i < heatmapCount; i++) {
        // gather sensor data
        sensorDataArray = Local<Array>::Cast(parentData->Get(i + 1));

        // fill vector with sensor values
        for (int i = 0; i < nodeCount; i++) {
            sensorDataVec[i] = sensorDataArray->Get(i)->NumberValue();
        }

        for (int j = 0; j < DIMENSIONS; j++) {
            for (int k = 0; k < nodeCount; k++) {
            }
            // assignment is faster if we ensure there is no size mismatch
            // heatmapCollection[i][j] = heatmapGrid[j].first;
        }
    }

    int coordLength = sensorDataVec[7];
    std::string text = std::to_string(coordLength);

    args.GetReturnValue().Set(String::NewFromUtf8(isolate, text.c_str()));
}

void init(Local<Object> exports) {
    NODE_SET_METHOD(exports, "renderHeatmap", renderHeatmap);
}

int distanceSqr(int x0, int y0, int x1, int y1) {
    int delX = abs(x1 - x0);
    int delY = abs(y1 - y0);

    return delX * delX + delY * delY;
}

NODE_MODULE(addon, init)
}  // namespace demo