webpackJsonp([7,24],{

/***/ 229:
/***/ (function(module, exports) {

module.exports = "<h1>Check the network pane in the dev tools</h1>\n<router></router>\n";

/***/ }),

/***/ 239:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./bar": [
		24,
		4
	],
	"./bar/": [
		24,
		4
	],
	"./bar/index": [
		24,
		4
	],
	"./bar/index.ts": [
		24,
		4
	],
	"./bar/template.html": [
		224,
		16
	],
	"./baz": [
		25,
		3
	],
	"./baz/": [
		25,
		3
	],
	"./baz/index": [
		25,
		3
	],
	"./baz/index.ts": [
		25,
		3
	],
	"./baz/template.html": [
		225,
		15
	],
	"./foo": [
		26,
		2
	],
	"./foo/": [
		26,
		2
	],
	"./foo/index": [
		26,
		2
	],
	"./foo/index.ts": [
		26,
		2
	],
	"./foo/template.html": [
		226,
		14
	],
	"./list": [
		27,
		1
	],
	"./list/": [
		27,
		1
	],
	"./list/index": [
		27,
		1
	],
	"./list/index.ts": [
		27,
		1
	],
	"./list/template.html": [
		227,
		13
	],
	"./qux": [
		28,
		0
	],
	"./qux/": [
		28,
		0
	],
	"./qux/index": [
		28,
		0
	],
	"./qux/index.ts": [
		28,
		0
	],
	"./qux/template.html": [
		228,
		12
	]
};
function webpackAsyncContext(req) {
	var ids = map[req];
	if(!ids)
		return Promise.reject(new Error("Cannot find module '" + req + "'."));
	return __webpack_require__.e(ids[1]).then(function() {
		return __webpack_require__(ids[0]);
	});
};
webpackAsyncContext.keys = function webpackAsyncContextKeys() {
	return Object.keys(map);
};
webpackAsyncContext.id = 239;
module.exports = webpackAsyncContext;

/***/ }),

/***/ 31:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_knockout__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_knockout___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_knockout__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__profiscience_knockout_contrib_router__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__index_html__ = __webpack_require__(229);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__index_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__index_html__);



var lazyLoadPlugin = function (componentName) { return [
    // we return an array that the router understands, so first we'll
    // include the name of the component
    componentName,
    // then some middleware to load that component...
    function () {
        // bail if already loaded
        if (__WEBPACK_IMPORTED_MODULE_0_knockout__["components"].isRegistered(componentName)) {
            return;
        }
        // https://webpack.js.org/guides/code-splitting-import/
        return __webpack_require__(239)("./" + componentName)
            .then(function (exports) { return __WEBPACK_IMPORTED_MODULE_0_knockout__["components"].register(componentName, exports); })
            .catch(function (err) { return console.error('Error fetching component', componentName, err); });
    }
]; };
__WEBPACK_IMPORTED_MODULE_1__profiscience_knockout_contrib_router__["a" /* Router */].usePlugin(lazyLoadPlugin);
__WEBPACK_IMPORTED_MODULE_1__profiscience_knockout_contrib_router__["a" /* Router */].useRoutes({
    '/': 'list',
    '/foo': 'foo',
    '/bar': 'bar',
    '/baz': 'baz',
    '/qux': 'qux'
});
__WEBPACK_IMPORTED_MODULE_0_knockout__["components"].register('lazy-loading', { template: __WEBPACK_IMPORTED_MODULE_2__index_html___default.a });


/***/ })

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9wYWNrYWdlcy9yb3V0ZXIvZXhhbXBsZXMvbGF6eS1sb2FkaW5nL2luZGV4Lmh0bWwiLCJ3ZWJwYWNrOi8vLy4vcGFja2FnZXMvcm91dGVyL2V4YW1wbGVzL2xhenktbG9hZGluZy92aWV3cyBsYXp5IF5cXC5cXC8uKiQiLCJ3ZWJwYWNrOi8vLy4vcGFja2FnZXMvcm91dGVyL2V4YW1wbGVzL2xhenktbG9hZGluZy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHlGOzs7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQzs7Ozs7Ozs7Ozs7Ozs7QUNsSDhCO0FBQ3dDO0FBQ25DO0FBRW5DLElBQU0sY0FBYyxHQUFXLFVBQUMsYUFBcUIsSUFBSztJQUN4RCxpRUFBaUU7SUFDakUsb0NBQW9DO0lBQ3BDLGFBQWE7SUFFYixpREFBaUQ7SUFDakQ7UUFDRSx5QkFBeUI7UUFDekIsRUFBRSxDQUFDLENBQUMsb0RBQWEsQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlDLE1BQU07UUFDUixDQUFDO1FBRUQsdURBQXVEO1FBQ3ZELE1BQU0sQ0FBQyw2QkFBaUIsR0FBRyxhQUFhLENBQUM7YUFDdEMsSUFBSSxDQUFDLFVBQUMsT0FBTyxJQUFLLDJEQUFhLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUMsRUFBOUMsQ0FBOEMsQ0FBQzthQUVqRSxLQUFLLENBQUMsVUFBQyxHQUFHLElBQUssY0FBTyxDQUFDLEtBQUssQ0FBQywwQkFBMEIsRUFBRSxhQUFhLEVBQUUsR0FBRyxDQUFDLEVBQTdELENBQTZELENBQUM7SUFDbEYsQ0FBQztDQUNGLEVBbEJ5RCxDQWtCekQ7QUFFRCxxRkFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUM7QUFFaEMscUZBQU0sQ0FBQyxTQUFTLENBQUM7SUFDZixHQUFHLEVBQUssTUFBTTtJQUNkLE1BQU0sRUFBRSxLQUFLO0lBQ2IsTUFBTSxFQUFFLEtBQUs7SUFDYixNQUFNLEVBQUUsS0FBSztJQUNiLE1BQU0sRUFBRSxLQUFLO0NBQ2QsQ0FBQztBQUVGLG9EQUFhLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRSxFQUFFLFFBQVEsdURBQUUsQ0FBQyIsImZpbGUiOiI3LmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxoMT5DaGVjayB0aGUgbmV0d29yayBwYW5lIGluIHRoZSBkZXYgdG9vbHM8L2gxPlxcbjxyb3V0ZXI+PC9yb3V0ZXI+XFxuXCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wYWNrYWdlcy9yb3V0ZXIvZXhhbXBsZXMvbGF6eS1sb2FkaW5nL2luZGV4Lmh0bWxcbi8vIG1vZHVsZSBpZCA9IDIyOVxuLy8gbW9kdWxlIGNodW5rcyA9IDcgMjQiLCJ2YXIgbWFwID0ge1xuXHRcIi4vYmFyXCI6IFtcblx0XHQyNCxcblx0XHQ0XG5cdF0sXG5cdFwiLi9iYXIvXCI6IFtcblx0XHQyNCxcblx0XHQ0XG5cdF0sXG5cdFwiLi9iYXIvaW5kZXhcIjogW1xuXHRcdDI0LFxuXHRcdDRcblx0XSxcblx0XCIuL2Jhci9pbmRleC50c1wiOiBbXG5cdFx0MjQsXG5cdFx0NFxuXHRdLFxuXHRcIi4vYmFyL3RlbXBsYXRlLmh0bWxcIjogW1xuXHRcdDIyNCxcblx0XHQxNlxuXHRdLFxuXHRcIi4vYmF6XCI6IFtcblx0XHQyNSxcblx0XHQzXG5cdF0sXG5cdFwiLi9iYXovXCI6IFtcblx0XHQyNSxcblx0XHQzXG5cdF0sXG5cdFwiLi9iYXovaW5kZXhcIjogW1xuXHRcdDI1LFxuXHRcdDNcblx0XSxcblx0XCIuL2Jhei9pbmRleC50c1wiOiBbXG5cdFx0MjUsXG5cdFx0M1xuXHRdLFxuXHRcIi4vYmF6L3RlbXBsYXRlLmh0bWxcIjogW1xuXHRcdDIyNSxcblx0XHQxNVxuXHRdLFxuXHRcIi4vZm9vXCI6IFtcblx0XHQyNixcblx0XHQyXG5cdF0sXG5cdFwiLi9mb28vXCI6IFtcblx0XHQyNixcblx0XHQyXG5cdF0sXG5cdFwiLi9mb28vaW5kZXhcIjogW1xuXHRcdDI2LFxuXHRcdDJcblx0XSxcblx0XCIuL2Zvby9pbmRleC50c1wiOiBbXG5cdFx0MjYsXG5cdFx0MlxuXHRdLFxuXHRcIi4vZm9vL3RlbXBsYXRlLmh0bWxcIjogW1xuXHRcdDIyNixcblx0XHQxNFxuXHRdLFxuXHRcIi4vbGlzdFwiOiBbXG5cdFx0MjcsXG5cdFx0MVxuXHRdLFxuXHRcIi4vbGlzdC9cIjogW1xuXHRcdDI3LFxuXHRcdDFcblx0XSxcblx0XCIuL2xpc3QvaW5kZXhcIjogW1xuXHRcdDI3LFxuXHRcdDFcblx0XSxcblx0XCIuL2xpc3QvaW5kZXgudHNcIjogW1xuXHRcdDI3LFxuXHRcdDFcblx0XSxcblx0XCIuL2xpc3QvdGVtcGxhdGUuaHRtbFwiOiBbXG5cdFx0MjI3LFxuXHRcdDEzXG5cdF0sXG5cdFwiLi9xdXhcIjogW1xuXHRcdDI4LFxuXHRcdDBcblx0XSxcblx0XCIuL3F1eC9cIjogW1xuXHRcdDI4LFxuXHRcdDBcblx0XSxcblx0XCIuL3F1eC9pbmRleFwiOiBbXG5cdFx0MjgsXG5cdFx0MFxuXHRdLFxuXHRcIi4vcXV4L2luZGV4LnRzXCI6IFtcblx0XHQyOCxcblx0XHQwXG5cdF0sXG5cdFwiLi9xdXgvdGVtcGxhdGUuaHRtbFwiOiBbXG5cdFx0MjI4LFxuXHRcdDEyXG5cdF1cbn07XG5mdW5jdGlvbiB3ZWJwYWNrQXN5bmNDb250ZXh0KHJlcSkge1xuXHR2YXIgaWRzID0gbWFwW3JlcV07XG5cdGlmKCFpZHMpXG5cdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyByZXEgKyBcIicuXCIpKTtcblx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uZShpZHNbMV0pLnRoZW4oZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oaWRzWzBdKTtcblx0fSk7XG59O1xud2VicGFja0FzeW5jQ29udGV4dC5rZXlzID0gZnVuY3Rpb24gd2VicGFja0FzeW5jQ29udGV4dEtleXMoKSB7XG5cdHJldHVybiBPYmplY3Qua2V5cyhtYXApO1xufTtcbndlYnBhY2tBc3luY0NvbnRleHQuaWQgPSAyMzk7XG5tb2R1bGUuZXhwb3J0cyA9IHdlYnBhY2tBc3luY0NvbnRleHQ7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wYWNrYWdlcy9yb3V0ZXIvZXhhbXBsZXMvbGF6eS1sb2FkaW5nL3ZpZXdzIGxhenkgXlxcLlxcLy4qJFxuLy8gbW9kdWxlIGlkID0gMjM5XG4vLyBtb2R1bGUgY2h1bmtzID0gNyIsImltcG9ydCAqIGFzIGtvIGZyb20gJ2tub2Nrb3V0J1xuaW1wb3J0IHsgUGx1Z2luLCBSb3V0ZXIgfSBmcm9tICdAcHJvZmlzY2llbmNlL2tub2Nrb3V0LWNvbnRyaWItcm91dGVyJ1xuaW1wb3J0IHRlbXBsYXRlIGZyb20gJy4vaW5kZXguaHRtbCdcblxuY29uc3QgbGF6eUxvYWRQbHVnaW46IFBsdWdpbiA9IChjb21wb25lbnROYW1lOiBzdHJpbmcpID0+IFtcbiAgLy8gd2UgcmV0dXJuIGFuIGFycmF5IHRoYXQgdGhlIHJvdXRlciB1bmRlcnN0YW5kcywgc28gZmlyc3Qgd2UnbGxcbiAgLy8gaW5jbHVkZSB0aGUgbmFtZSBvZiB0aGUgY29tcG9uZW50XG4gIGNvbXBvbmVudE5hbWUsXG5cbiAgLy8gdGhlbiBzb21lIG1pZGRsZXdhcmUgdG8gbG9hZCB0aGF0IGNvbXBvbmVudC4uLlxuICAoKSA9PiB7XG4gICAgLy8gYmFpbCBpZiBhbHJlYWR5IGxvYWRlZFxuICAgIGlmIChrby5jb21wb25lbnRzLmlzUmVnaXN0ZXJlZChjb21wb25lbnROYW1lKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gaHR0cHM6Ly93ZWJwYWNrLmpzLm9yZy9ndWlkZXMvY29kZS1zcGxpdHRpbmctaW1wb3J0L1xuICAgIHJldHVybiBpbXBvcnQoJy4vdmlld3MvJyArIGNvbXBvbmVudE5hbWUpXG4gICAgICAudGhlbigoZXhwb3J0cykgPT4ga28uY29tcG9uZW50cy5yZWdpc3Rlcihjb21wb25lbnROYW1lLCBleHBvcnRzKSlcbiAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICAuY2F0Y2goKGVycikgPT4gY29uc29sZS5lcnJvcignRXJyb3IgZmV0Y2hpbmcgY29tcG9uZW50JywgY29tcG9uZW50TmFtZSwgZXJyKSlcbiAgfVxuXVxuXG5Sb3V0ZXIudXNlUGx1Z2luKGxhenlMb2FkUGx1Z2luKVxuXG5Sb3V0ZXIudXNlUm91dGVzKHtcbiAgJy8nOiAgICAnbGlzdCcsXG4gICcvZm9vJzogJ2ZvbycsXG4gICcvYmFyJzogJ2JhcicsXG4gICcvYmF6JzogJ2JheicsXG4gICcvcXV4JzogJ3F1eCdcbn0pXG5cbmtvLmNvbXBvbmVudHMucmVnaXN0ZXIoJ2xhenktbG9hZGluZycsIHsgdGVtcGxhdGUgfSlcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3BhY2thZ2VzL3JvdXRlci9leGFtcGxlcy9sYXp5LWxvYWRpbmcvaW5kZXgudHMiXSwic291cmNlUm9vdCI6IiJ9