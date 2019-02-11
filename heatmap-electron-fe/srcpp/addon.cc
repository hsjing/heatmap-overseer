/**
 * c++ addon in node.js using native abstraction (NAN)
 */

#include <nan.h>    // include native abstraction

// module headers here
#include "async_render.h"  // NOLINT(build/include)

// list dependencies
using v8::FunctionTemplate;
using v8::Handle;
using v8::Object;
using v8::String;
using Nan::GetFunction;
using Nan::New;
using Nan::Set;

// expose access to functions here
NAN_MODULE_INIT(InitAll) {
	// "calculateSync" is the name of the callable method for the addon
	// for example: addon.calculateSync()
	Set(target, New<String>("loadData").ToLocalChecked(),
		GetFunction(New<FunctionTemplate>(CalculateSync)).ToLocalChecked());

	Set(target, New<String>("mapData").ToLocalChecked(),
		GetFunction(New<FunctionTemplate>(CalculateAsync)).ToLocalChecked());
}

NODE_MODULE(addon, InitAll)