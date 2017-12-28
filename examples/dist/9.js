webpackJsonp([9,20],{

/***/ 231:
/***/ (function(module, exports) {

module.exports = "<style>\n  router {\n    display: block;\n    border: 1px solid red;\n    padding: 10px;\n    margin: 10px;\n  }\n</style>\n\nThese paths exist outside any router, so '/' is good\n<br>\n<a data-bind=\"path: '/foo'\">/foo</a>\n<a data-bind=\"path: '/bar'\">/bar</a>\n\n<router></router>\n";

/***/ }),

/***/ 33:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_knockout__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_knockout___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_knockout__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__profiscience_knockout_contrib_router__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__index_html__ = __webpack_require__(231);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__index_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__index_html__);



function createOuterTemplate(foo) {
    return "\n    <h1>" + foo + "</h1>\n\n    These begin with '/', so they route using the current (containing) router\n    <br>\n    <a data-bind=\"path: '/foo'\">/foo</a>\n    <a data-bind=\"path: '/bar'\">/bar</a>\n\n    <br>\n    <br>\n\n    This begins with './', so it is routed using the child (adjacent) router\n    <br>\n    <a data-bind=\"path: './baz'\">./baz</a>\n\n    <br>\n    <br>\n\n    This begins with '//', so it is routed using the root router\n    <br>\n    <a data-bind=\"path: '//" + foo + "/qux'\">//" + foo + "/qux</a>\n\n    <router></router>\n  ";
}
function createInnerTemplate(foo) {
    return "\n    <h2>" + foo + "</h2>\n\n    These begin with '/', so they route using the current (containing) router\n    <br>\n    <a data-bind=\"path: '/baz'\">/baz</a>\n    <a data-bind=\"path: '/qux'\">/qux</a>\n  ";
}
__WEBPACK_IMPORTED_MODULE_0_knockout___default.a.components.register('empty', { template: '<span></span>' });
__WEBPACK_IMPORTED_MODULE_0_knockout___default.a.components.register('foo', { template: createOuterTemplate('foo') });
__WEBPACK_IMPORTED_MODULE_0_knockout___default.a.components.register('bar', { template: createOuterTemplate('bar') });
__WEBPACK_IMPORTED_MODULE_0_knockout___default.a.components.register('baz', { template: createInnerTemplate('baz') });
__WEBPACK_IMPORTED_MODULE_0_knockout___default.a.components.register('qux', { template: createInnerTemplate('qux') });
__WEBPACK_IMPORTED_MODULE_1__profiscience_knockout_contrib_router__["a" /* Router */].useRoutes({
    '/': 'empty',
    '/foo': ['foo',
        {
            '/': 'empty',
            '/baz': 'baz',
            '/qux': 'qux'
        }
    ],
    '/bar': ['bar',
        {
            '/': 'empty',
            '/baz': 'baz',
            '/qux': 'qux'
        }
    ]
});
__WEBPACK_IMPORTED_MODULE_0_knockout___default.a.components.register('path-binding', { template: __WEBPACK_IMPORTED_MODULE_2__index_html___default.a });


/***/ })

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9wYWNrYWdlcy9yb3V0ZXIvZXhhbXBsZXMvcGF0aC1iaW5kaW5nL2luZGV4Lmh0bWwiLCJ3ZWJwYWNrOi8vLy4vcGFja2FnZXMvcm91dGVyL2V4YW1wbGVzL3BhdGgtYmluZGluZy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHFDQUFxQyxxQkFBcUIsNEJBQTRCLG9CQUFvQixtQkFBbUIsS0FBSyxpTDs7Ozs7Ozs7Ozs7Ozs7QUNBekc7QUFDcUM7QUFDM0I7QUFFbkMsNkJBQTZCLEdBQUc7SUFDOUIsTUFBTSxDQUFDLGVBQ0MsR0FBRyxnZUFtQmdCLEdBQUcsa0JBQVksR0FBRywwQ0FHNUM7QUFDSCxDQUFDO0FBRUQsNkJBQTZCLEdBQUc7SUFDOUIsTUFBTSxDQUFDLGVBQ0MsR0FBRyxpTUFNVjtBQUNILENBQUM7QUFFRCxnREFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQWUsRUFBRSxDQUFDO0FBRTlELGdEQUFFLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsRUFBRSxRQUFRLEVBQUUsbUJBQW1CLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztBQUN2RSxnREFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLEVBQUUsUUFBUSxFQUFFLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7QUFDdkUsZ0RBQUUsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxFQUFFLFFBQVEsRUFBRSxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO0FBQ3ZFLGdEQUFFLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsRUFBRSxRQUFRLEVBQUUsbUJBQW1CLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztBQUV2RSxxRkFBTSxDQUFDLFNBQVMsQ0FBQztJQUNmLEdBQUcsRUFBRSxPQUFPO0lBQ1osTUFBTSxFQUFFLENBQUMsS0FBSztRQUNaO1lBQ0UsR0FBRyxFQUFFLE9BQU87WUFDWixNQUFNLEVBQUUsS0FBSztZQUNiLE1BQU0sRUFBRSxLQUFLO1NBQ2Q7S0FDRjtJQUNELE1BQU0sRUFBRSxDQUFDLEtBQUs7UUFDWjtZQUNFLEdBQUcsRUFBRSxPQUFPO1lBQ1osTUFBTSxFQUFFLEtBQUs7WUFDYixNQUFNLEVBQUUsS0FBSztTQUNkO0tBQ0Y7Q0FDRixDQUFDO0FBRUYsZ0RBQUUsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRSxFQUFFLFFBQVEsdURBQUUsQ0FBQyIsImZpbGUiOiI5LmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxzdHlsZT5cXG4gIHJvdXRlciB7XFxuICAgIGRpc3BsYXk6IGJsb2NrO1xcbiAgICBib3JkZXI6IDFweCBzb2xpZCByZWQ7XFxuICAgIHBhZGRpbmc6IDEwcHg7XFxuICAgIG1hcmdpbjogMTBweDtcXG4gIH1cXG48L3N0eWxlPlxcblxcblRoZXNlIHBhdGhzIGV4aXN0IG91dHNpZGUgYW55IHJvdXRlciwgc28gJy8nIGlzIGdvb2RcXG48YnI+XFxuPGEgZGF0YS1iaW5kPVxcXCJwYXRoOiAnL2ZvbydcXFwiPi9mb288L2E+XFxuPGEgZGF0YS1iaW5kPVxcXCJwYXRoOiAnL2JhcidcXFwiPi9iYXI8L2E+XFxuXFxuPHJvdXRlcj48L3JvdXRlcj5cXG5cIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3BhY2thZ2VzL3JvdXRlci9leGFtcGxlcy9wYXRoLWJpbmRpbmcvaW5kZXguaHRtbFxuLy8gbW9kdWxlIGlkID0gMjMxXG4vLyBtb2R1bGUgY2h1bmtzID0gOSAyMCIsImltcG9ydCBrbyBmcm9tICdrbm9ja291dCdcbmltcG9ydCB7IFJvdXRlciB9IGZyb20gJ0Bwcm9maXNjaWVuY2Uva25vY2tvdXQtY29udHJpYi1yb3V0ZXInXG5pbXBvcnQgdGVtcGxhdGUgZnJvbSAnLi9pbmRleC5odG1sJ1xuXG5mdW5jdGlvbiBjcmVhdGVPdXRlclRlbXBsYXRlKGZvbykge1xuICByZXR1cm4gYFxuICAgIDxoMT4ke2Zvb308L2gxPlxuXG4gICAgVGhlc2UgYmVnaW4gd2l0aCAnLycsIHNvIHRoZXkgcm91dGUgdXNpbmcgdGhlIGN1cnJlbnQgKGNvbnRhaW5pbmcpIHJvdXRlclxuICAgIDxicj5cbiAgICA8YSBkYXRhLWJpbmQ9XCJwYXRoOiAnL2ZvbydcIj4vZm9vPC9hPlxuICAgIDxhIGRhdGEtYmluZD1cInBhdGg6ICcvYmFyJ1wiPi9iYXI8L2E+XG5cbiAgICA8YnI+XG4gICAgPGJyPlxuXG4gICAgVGhpcyBiZWdpbnMgd2l0aCAnLi8nLCBzbyBpdCBpcyByb3V0ZWQgdXNpbmcgdGhlIGNoaWxkIChhZGphY2VudCkgcm91dGVyXG4gICAgPGJyPlxuICAgIDxhIGRhdGEtYmluZD1cInBhdGg6ICcuL2JheidcIj4uL2JhejwvYT5cblxuICAgIDxicj5cbiAgICA8YnI+XG5cbiAgICBUaGlzIGJlZ2lucyB3aXRoICcvLycsIHNvIGl0IGlzIHJvdXRlZCB1c2luZyB0aGUgcm9vdCByb3V0ZXJcbiAgICA8YnI+XG4gICAgPGEgZGF0YS1iaW5kPVwicGF0aDogJy8vJHtmb299L3F1eCdcIj4vLyR7Zm9vfS9xdXg8L2E+XG5cbiAgICA8cm91dGVyPjwvcm91dGVyPlxuICBgXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUlubmVyVGVtcGxhdGUoZm9vKSB7XG4gIHJldHVybiBgXG4gICAgPGgyPiR7Zm9vfTwvaDI+XG5cbiAgICBUaGVzZSBiZWdpbiB3aXRoICcvJywgc28gdGhleSByb3V0ZSB1c2luZyB0aGUgY3VycmVudCAoY29udGFpbmluZykgcm91dGVyXG4gICAgPGJyPlxuICAgIDxhIGRhdGEtYmluZD1cInBhdGg6ICcvYmF6J1wiPi9iYXo8L2E+XG4gICAgPGEgZGF0YS1iaW5kPVwicGF0aDogJy9xdXgnXCI+L3F1eDwvYT5cbiAgYFxufVxuXG5rby5jb21wb25lbnRzLnJlZ2lzdGVyKCdlbXB0eScsIHsgdGVtcGxhdGU6ICc8c3Bhbj48L3NwYW4+JyB9KVxuXG5rby5jb21wb25lbnRzLnJlZ2lzdGVyKCdmb28nLCB7IHRlbXBsYXRlOiBjcmVhdGVPdXRlclRlbXBsYXRlKCdmb28nKSB9KVxua28uY29tcG9uZW50cy5yZWdpc3RlcignYmFyJywgeyB0ZW1wbGF0ZTogY3JlYXRlT3V0ZXJUZW1wbGF0ZSgnYmFyJykgfSlcbmtvLmNvbXBvbmVudHMucmVnaXN0ZXIoJ2JheicsIHsgdGVtcGxhdGU6IGNyZWF0ZUlubmVyVGVtcGxhdGUoJ2JheicpIH0pXG5rby5jb21wb25lbnRzLnJlZ2lzdGVyKCdxdXgnLCB7IHRlbXBsYXRlOiBjcmVhdGVJbm5lclRlbXBsYXRlKCdxdXgnKSB9KVxuXG5Sb3V0ZXIudXNlUm91dGVzKHtcbiAgJy8nOiAnZW1wdHknLFxuICAnL2Zvbyc6IFsnZm9vJyxcbiAgICB7XG4gICAgICAnLyc6ICdlbXB0eScsXG4gICAgICAnL2Jheic6ICdiYXonLFxuICAgICAgJy9xdXgnOiAncXV4J1xuICAgIH1cbiAgXSxcbiAgJy9iYXInOiBbJ2JhcicsXG4gICAge1xuICAgICAgJy8nOiAnZW1wdHknLFxuICAgICAgJy9iYXonOiAnYmF6JyxcbiAgICAgICcvcXV4JzogJ3F1eCdcbiAgICB9XG4gIF1cbn0pXG5cbmtvLmNvbXBvbmVudHMucmVnaXN0ZXIoJ3BhdGgtYmluZGluZycsIHsgdGVtcGxhdGUgfSlcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3BhY2thZ2VzL3JvdXRlci9leGFtcGxlcy9wYXRoLWJpbmRpbmcvaW5kZXgudHMiXSwic291cmNlUm9vdCI6IiJ9