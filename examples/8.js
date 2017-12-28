webpackJsonp([8,19],{

/***/ 219:
/***/ (function(module, exports) {

module.exports = "<router></router>";

/***/ }),

/***/ 34:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_knockout__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_knockout___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_knockout__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__profiscience_knockout_contrib_router__ = __webpack_require__(84);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__index_html__ = __webpack_require__(219);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__index_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__index_html__);



var authMiddleware = function (ctx) {
    var isLoginPage = ctx.path === '/login';
    var isLoggedIn = sessionStorage.getItem('authenticated');
    if (!isLoggedIn && !isLoginPage) {
        ctx.redirect('//login');
    }
    else if (isLoggedIn && isLoginPage) {
        ctx.redirect('//');
    }
};
// globally registered auth middleware, runs for every route
__WEBPACK_IMPORTED_MODULE_1__profiscience_knockout_contrib_router__["a" /* Router */].use(authMiddleware);
__WEBPACK_IMPORTED_MODULE_1__profiscience_knockout_contrib_router__["a" /* Router */].useRoutes({
    '/': 'home',
    '/login': 'login',
    '/logout': function (ctx) {
        sessionStorage.removeItem('authenticated');
        ctx.redirect('/login');
    }
});
__WEBPACK_IMPORTED_MODULE_0_knockout__["components"].register('home', {
    template: '<a data-bind="path: \'/logout\'">Logout</a>'
});
__WEBPACK_IMPORTED_MODULE_0_knockout__["components"].register('login', {
    viewModel: /** @class */ (function () {
        function class_1() {
        }
        class_1.prototype.login = function () {
            sessionStorage.setItem('authenticated', 'true');
            __WEBPACK_IMPORTED_MODULE_1__profiscience_knockout_contrib_router__["a" /* Router */].update('/').catch(function (err) { return console.error('Error navigating', err); }); // tslint:disable-line no-console
        };
        return class_1;
    }()),
    template: "\n    <h1>Login</h1>\n    <button data-bind=\"click: login\">Login</button>\n  "
});
__WEBPACK_IMPORTED_MODULE_0_knockout__["components"].register('simple-auth', { template: __WEBPACK_IMPORTED_MODULE_2__index_html___default.a });


/***/ })

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9wYWNrYWdlcy9yb3V0ZXIvZXhhbXBsZXMvc2ltcGxlLWF1dGgvaW5kZXguaHRtbCIsIndlYnBhY2s6Ly8vLi9wYWNrYWdlcy9yb3V0ZXIvZXhhbXBsZXMvc2ltcGxlLWF1dGgvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxxQzs7Ozs7Ozs7Ozs7Ozs7QUNBOEI7QUFDK0Q7QUFDMUQ7QUFFbkMsSUFBTSxjQUFjLEdBQWUsVUFBQyxHQUF1QjtJQUN6RCxJQUFNLFdBQVcsR0FBRyxHQUFHLENBQUMsSUFBSSxLQUFLLFFBQVE7SUFDekMsSUFBTSxVQUFVLEdBQUcsY0FBYyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUM7SUFFMUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLEdBQUcsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDO0lBQ3pCLENBQUM7SUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsVUFBVSxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUM7UUFDckMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7SUFDcEIsQ0FBQztBQUNILENBQUM7QUFFRCw0REFBNEQ7QUFDNUQscUZBQU0sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDO0FBRTFCLHFGQUFNLENBQUMsU0FBUyxDQUFDO0lBQ2YsR0FBRyxFQUFFLE1BQU07SUFDWCxRQUFRLEVBQUUsT0FBTztJQUNqQixTQUFTLEVBQUUsVUFBQyxHQUFHO1FBQ2IsY0FBYyxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUM7UUFDMUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUM7SUFDeEIsQ0FBQztDQUNGLENBQUM7QUFFRixvREFBYSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUU7SUFDN0IsUUFBUSxFQUFFLDZDQUE2QztDQUN4RCxDQUFDO0FBRUYsb0RBQWEsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFO0lBQzlCLFNBQVM7UUFBRTtRQUtYLENBQUM7UUFKUSx1QkFBSyxHQUFaO1lBQ0UsY0FBYyxDQUFDLE9BQU8sQ0FBQyxlQUFlLEVBQUUsTUFBTSxDQUFDO1lBQy9DLHFGQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFDLEdBQUcsSUFBSyxjQUFPLENBQUMsS0FBSyxDQUFDLGtCQUFrQixFQUFFLEdBQUcsQ0FBQyxFQUF0QyxDQUFzQyxDQUFDLEVBQUMsaUNBQWlDO1FBQzdHLENBQUM7UUFDSCxjQUFDO0lBQUQsQ0FBQztJQUNELFFBQVEsRUFBRSxpRkFHVDtDQUNGLENBQUM7QUFFRixvREFBYSxDQUFDLFFBQVEsQ0FBQyxhQUFhLEVBQUUsRUFBRSxRQUFRLHVEQUFFLENBQUMiLCJmaWxlIjoiOC5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gXCI8cm91dGVyPjwvcm91dGVyPlwiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcGFja2FnZXMvcm91dGVyL2V4YW1wbGVzL3NpbXBsZS1hdXRoL2luZGV4Lmh0bWxcbi8vIG1vZHVsZSBpZCA9IDIxOVxuLy8gbW9kdWxlIGNodW5rcyA9IDggMTkiLCJpbXBvcnQgKiBhcyBrbyBmcm9tICdrbm9ja291dCdcbmltcG9ydCB7IENvbnRleHQsIElDb250ZXh0LCBNaWRkbGV3YXJlLCBSb3V0ZXIgfSBmcm9tICdAcHJvZmlzY2llbmNlL2tub2Nrb3V0LWNvbnRyaWItcm91dGVyJ1xuaW1wb3J0IHRlbXBsYXRlIGZyb20gJy4vaW5kZXguaHRtbCdcblxuY29uc3QgYXV0aE1pZGRsZXdhcmU6IE1pZGRsZXdhcmUgPSAoY3R4OiBDb250ZXh0ICYgSUNvbnRleHQpID0+IHtcbiAgY29uc3QgaXNMb2dpblBhZ2UgPSBjdHgucGF0aCA9PT0gJy9sb2dpbidcbiAgY29uc3QgaXNMb2dnZWRJbiA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ2F1dGhlbnRpY2F0ZWQnKVxuXG4gIGlmICghaXNMb2dnZWRJbiAmJiAhaXNMb2dpblBhZ2UpIHtcbiAgICBjdHgucmVkaXJlY3QoJy8vbG9naW4nKVxuICB9IGVsc2UgaWYgKGlzTG9nZ2VkSW4gJiYgaXNMb2dpblBhZ2UpIHtcbiAgICBjdHgucmVkaXJlY3QoJy8vJylcbiAgfVxufVxuXG4vLyBnbG9iYWxseSByZWdpc3RlcmVkIGF1dGggbWlkZGxld2FyZSwgcnVucyBmb3IgZXZlcnkgcm91dGVcblJvdXRlci51c2UoYXV0aE1pZGRsZXdhcmUpXG5cblJvdXRlci51c2VSb3V0ZXMoe1xuICAnLyc6ICdob21lJyxcbiAgJy9sb2dpbic6ICdsb2dpbicsXG4gICcvbG9nb3V0JzogKGN0eCkgPT4ge1xuICAgIHNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oJ2F1dGhlbnRpY2F0ZWQnKVxuICAgIGN0eC5yZWRpcmVjdCgnL2xvZ2luJylcbiAgfVxufSlcblxua28uY29tcG9uZW50cy5yZWdpc3RlcignaG9tZScsIHtcbiAgdGVtcGxhdGU6ICc8YSBkYXRhLWJpbmQ9XCJwYXRoOiBcXCcvbG9nb3V0XFwnXCI+TG9nb3V0PC9hPidcbn0pXG5cbmtvLmNvbXBvbmVudHMucmVnaXN0ZXIoJ2xvZ2luJywge1xuICB2aWV3TW9kZWw6IGNsYXNzIHtcbiAgICBwdWJsaWMgbG9naW4oKSB7XG4gICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdhdXRoZW50aWNhdGVkJywgJ3RydWUnKVxuICAgICAgUm91dGVyLnVwZGF0ZSgnLycpLmNhdGNoKChlcnIpID0+IGNvbnNvbGUuZXJyb3IoJ0Vycm9yIG5hdmlnYXRpbmcnLCBlcnIpKSAvLyB0c2xpbnQ6ZGlzYWJsZS1saW5lIG5vLWNvbnNvbGVcbiAgICB9XG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gICAgPGgxPkxvZ2luPC9oMT5cbiAgICA8YnV0dG9uIGRhdGEtYmluZD1cImNsaWNrOiBsb2dpblwiPkxvZ2luPC9idXR0b24+XG4gIGBcbn0pXG5cbmtvLmNvbXBvbmVudHMucmVnaXN0ZXIoJ3NpbXBsZS1hdXRoJywgeyB0ZW1wbGF0ZSB9KVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vcGFja2FnZXMvcm91dGVyL2V4YW1wbGVzL3NpbXBsZS1hdXRoL2luZGV4LnRzIl0sInNvdXJjZVJvb3QiOiIifQ==