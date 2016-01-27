'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function observer() {
    var cache = [];
    var ret = function ret(cb) {
        if (typeof cb !== 'function') {
            return;
        }

        cache.push(cb);
    };

    ret.fire = function () {
        var ni = undefined;

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        for (ni = 0; ni < cache.length; ni++) {
            cache[ni].apply(this, args);
        }
    };

    ret.remove = function (cb) {
        var ni = undefined;

        for (ni = 0; ni < cache.length; ni++) {
            if (cache[ni] === cb) {
                cache.splice(ni, 1);
                break;
            }
        }
    };

    ret.clear = function () {
        cache = [];
    };

    return ret;
}

var ImageHandler = function () {
    function ImageHandler() {
        _classCallCheck(this, ImageHandler);

        this.change = null;
        this.canvas = null;
        this.scaledOriginal = null;
        this.minWidth = 0;
        this.minHeight = 0;
        this._zoom = 0;
        this._translate = {
            x: 0,
            y: 0,
            r: 0
        };
        this._offset = {
            x: 0,
            y: 0,
            r: 0
        };

        this.change = observer();

        this.canvas = document.createElement('canvas');
        this.scaledOriginal = document.createElement('canvas');
    }

    _createClass(ImageHandler, [{
        key: 'minSize',
        value: function minSize(w, h) {
            this.minWidth = w;
            this.minHeight = h;

            this.hardZoom();
        }
    }, {
        key: 'draw',
        value: function draw() {
            var ctx = this.canvas.getContext('2d'),
                t = this.hardTranslate();

            this.canvas.width = this.minWidth;
            this.canvas.height = this.minHeight;

            ctx.save();
            ctx.translate((this.canvas.width - this.img.width * this._zoom) / 2 + t.x, (this.canvas.height - this.img.height * this._zoom) / 2 + t.y);
            ctx.scale(this._zoom, this._zoom);

            ctx.drawImage(this.img, 0, 0);
            ctx.restore();

            this.change.fire();
        }
    }, {
        key: 'drawScaledOriginal',
        value: function drawScaledOriginal() {
            var ctx = undefined;

            this.scaledOriginal.width = this.img.width * this._zoom;
            this.scaledOriginal.height = this.img.height * this._zoom;
            ctx = this.scaledOriginal.getContext('2d');
            ctx.save();
            ctx.scale(this._zoom, this._zoom);
            ctx.drawImage(this.img, 0, 0);
            ctx.restore();
        }
    }, {
        key: 'setFile',
        value: function setFile(file) {
            var reader = new FileReader(),
                img = document.createElement('img');

            img.onload = function () {
                this._translate.x = this._translate.y = 0;
                this._offset.x = this._offset.y = 0;
                this._zoom = 0;

                // this is needed to keep jpegs from flashing
                // on drag
                this.img = document.createElement('canvas');
                this.img.width = img.width;
                this.img.height = img.height;
                this.img.getContext('2d').drawImage(img, 0, 0);

                this.hardZoom();

                this.draw();
                this.drawScaledOriginal();
            }.bind(this);

            reader.onload = function (evt) {
                img.src = evt.target.result;
            }.bind(this);

            reader.readAsDataURL(file);
        }
    }, {
        key: 'hardTranslate',
        value: function hardTranslate() {
            var halfImgHeight = this.img.height * this._zoom / 2,
                halfCanvasHeight = this.minHeight / 2,
                halfImgWidth = this.img.width * this._zoom / 2,
                halfCanvasWidth = this.minWidth / 2;
            var x = this._translate.x + this._offset.x,
                y = this._translate.y + this._offset.y;

            if (halfImgHeight - halfCanvasHeight < y) {
                y = halfImgHeight - halfCanvasHeight;
            }

            if (halfCanvasHeight - halfImgHeight > y) {
                y = halfCanvasHeight - halfImgHeight;
            }

            if (halfImgWidth - halfCanvasWidth < x) {
                x = halfImgWidth - halfCanvasWidth;
            }

            if (halfCanvasWidth - halfImgWidth > x) {
                x = halfCanvasWidth - halfImgWidth;
            }

            return { x: x, y: y };
        }
    }, {
        key: 'hardZoom',
        value: function hardZoom() {
            var zoom = undefined;

            if (!this.img) {
                return;
            }

            if (!this.minWidth || !this.minHeight) {
                return;
            }

            if (this.img.width / this.img.height > this.minWidth / this.minHeight) {
                zoom = this.minHeight / this.img.height;
            } else {
                zoom = this.minWidth / this.img.width;
            }

            if (this._zoom < zoom) {
                this._zoom = zoom;
            }
        }
    }, {
        key: 'translate',
        value: function translate(point) {
            if (!this.img) {
                return;
            }

            if (!this.minWidth || !this.minHeight) {
                return;
            }

            if (point.hasOwnProperty('x')) {
                this._translate.x = point.x;
            }

            if (point.hasOwnProperty('y')) {
                this._translate.y = point.y;
            }

            if (point.hasOwnProperty('r')) {
                this._translate.r = point.r;
            }

            this.draw();
        }
    }, {
        key: 'commitTranslation',
        value: function commitTranslation() {
            if (!this.img) {
                return;
            }

            if (!this.minWidth || !this.minHeight) {
                return;
            }

            this._offset.x += this._translate.x;
            this._offset.y += this._translate.y;
            this._offset.r += this._translate.r;

            this._translate.x = 0;
            this._translate.y = 0;
            this._translate.r = 0;

            this._offset = this.hardTranslate();

            this.draw();
        }
    }, {
        key: 'zoom',
        value: function zoom(by) {
            this._zoom += by;
            this.hardZoom();
            this.draw();
            this.drawScaledOriginal();
        }
    }, {
        key: 'out',
        value: function out() {
            var _zoom = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

            var t = this.hardTranslate(),
                canvas = document.createElement('canvas'),
                zoom = this._zoom * _zoom;
            var ctx = undefined;

            canvas.width = this.minWidth * _zoom;
            canvas.height = this.minHeight * _zoom;

            ctx = canvas.getContext('2d');
            ctx.save();
            ctx.translate((canvas.width - this.img.width * zoom) / 2 + t.x * _zoom, (canvas.height - this.img.height * zoom) / 2 + t.y * _zoom);
            ctx.scale(zoom, zoom);
            ctx.drawImage(this.img, 0, 0);
            ctx.restore();

            return canvas.toDataURL('image/png');
        }
    }]);

    return ImageHandler;
}();

exports.default = ImageHandler;