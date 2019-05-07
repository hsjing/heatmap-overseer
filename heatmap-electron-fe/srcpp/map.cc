// hello.cc
#include <nan.h>
#include <node.h>

#include <iostream>
#include <string>
#include "header/mba.hpp"

namespace demo {

using v8::Array;
using v8::Exception;
using v8::Float32Array;
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

    // the complete heatmap collection (288 heatmaps in total)
    v8::Local<Array> returnHeatmapCollection = v8::Array::New(isolate);

    // a temporary heatmap in the form of a v8 Float32Array (note size is 4 *
    // DIMENSIONS due to 'float' being 4 bytes, we'll directly access the values
    // in memory)
    v8::Local<Float32Array> tempHeatmap = v8::Float32Array::New(
        v8::ArrayBuffer::New(isolate, 4 * DIMENSIONS), 0, DIMENSIONS);

    // wrap tempHeatmap in Nan to expose helper function, namely * operator
    Nan::TypedArrayContents<float> dest(tempHeatmap);

    int nodeCount = coordArray->Length() >> 1;
    int heatmapCount = parentData->Length() - 1;

    std::vector<float> sensorDataVec(nodeCount);

    // fill the coordinate vector with valid coordinate info (size is half of
    // coordinate bucket from js)
    std::vector<std::pair<int, int>> knownCoordVec(nodeCount,
                                                   std::make_pair(-1, -1));

    for (int i = 1; i <= knownCoordVec.size(); i++) {
        knownCoordVec[i - 1].first =
            coordArray->Get((i << 1) - 2)->NumberValue();
        knownCoordVec[i - 1].second =
            coordArray->Get((i << 1) - 1)->NumberValue();
    }

    // construct a 2d grid of vectors containing coordinate of every pixel AND
    // the euclidean distance to each node (note that we use Shepard's IDW
    // interpolation with p = 2, meaning we can directly use the square of the
    // distance during rendering)
    std::vector<std::vector<int>> heatmapGrid(DIMENSIONS,
                                              std::vector<int>(2 + nodeCount));

    // [dist0, dist1... weightN, x, y]
    for (int i = 0; i < heatmapGrid.size(); i++) {
        // pixel x and y are the modulo and dividend of WIDTH, store in last two
        // elements for each pixel
        heatmapGrid[i][nodeCount] = i % WIDTH;
        heatmapGrid[i][nodeCount + 1] = i / WIDTH;

        // fill with squared distance values
        for (int j = 0; j < nodeCount; j++) {
            heatmapGrid[i][j] = distanceSqr(
                heatmapGrid[i][nodeCount], heatmapGrid[i][nodeCount + 1],
                knownCoordVec[j].first, knownCoordVec[j].second);
        }
    }

    // construct heatmap arrays
    std::vector<std::vector<float>> heatmapCollection(
        heatmapCount, std::vector<float>(DIMENSIONS));

    // rendering happens here
    for (int i = 0; i < heatmapCollection.size(); i++) {
        // gather sensor data
        sensorDataArray = Local<Array>::Cast(parentData->Get(i + 1));

        // fill vector with sensor values
        for (int i = 0; i < nodeCount; i++) {
            sensorDataVec[i] = sensorDataArray->Get(i)->NumberValue();
        }

        for (int j = 0; j < DIMENSIONS; j++) {
            float num = 0.0, denom = 0.0;
            for (int k = 0; k < nodeCount; k++) {
                // if a distance of 0 exists, load that data and break;
                if (heatmapGrid[j][k] == 0.0) {
                    num = sensorDataVec[k];
                    denom = 1;
                    break;
                }
                // else calculate using IDW
                else {
                    // sensor data / distance
                    num += float(sensorDataVec[k]) / float(heatmapGrid[j][k]);
                    // 1 / distance
                    denom += 1 / float(heatmapGrid[j][k]);
                }
            }
            (*dest)[j] = num / denom;
            heatmapCollection[i][j] = num / denom;
        }

        returnHeatmapCollection->Set(i, tempHeatmap);
    }

    // float coordLength = heatmapGrid[160900][7];
    // float coordLength = heatmapCollection[0][480000];
    // float coordLength = knownCoordVec[7].first;
    float coordLength = returnHeatmapCollection->Length();
    std::string text = std::to_string(coordLength);

    // args.GetReturnValue().Set(String::NewFromUtf8(isolate, text.c_str()));
    args.GetReturnValue().Set(returnHeatmapCollection);
}

void init(Local<Object> exports) {
    NODE_SET_METHOD(exports, "renderHeatmap", renderHeatmap);
}

// do we need this?
int distanceSqr(int x0, int y0, int x1, int y1) {
    int delX = abs(x1 - x0);
    int delY = abs(y1 - y0);

    return (delX * delX) + (delY * delY);
}

NODE_MODULE(addon, init)
}  // namespace demo