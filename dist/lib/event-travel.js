"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventTravel = function () {
    function EventTravel(evt) {
        _classCallCheck(this, EventTravel);

        this.x = 0;
        this.y = 0;

        this.x = evt.pageX;
        this.y = evt.pageY;
    }

    _createClass(EventTravel, [{
        key: "diff",
        value: function diff(evt) {
            return {
                x: evt.pageX - this.x,
                y: evt.pageY - this.y
            };
        }
    }, {
        key: "dist",
        value: function dist(evt) {
            var travel = this.diff(evt);

            return Math.sqrt(travel.x * travel.x + travel.y * travel.y);
        }
    }]);

    return EventTravel;
}();

exports.default = EventTravel;