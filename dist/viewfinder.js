'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _dropZone = require('./views/drop-zone.js');

var _dropZone2 = _interopRequireDefault(_dropZone);

var _eventTravel = require('./lib/event-travel.js');

var _eventTravel2 = _interopRequireDefault(_eventTravel);

var _imageHandler = require('./lib/image-handler.js');

var _imageHandler2 = _interopRequireDefault(_imageHandler);

var _velocityAnimate = require('velocity-animate');

var _velocityAnimate2 = _interopRequireDefault(_velocityAnimate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Viewfinder = function (_React$Component) {
    _inherits(Viewfinder, _React$Component);

    function Viewfinder(props) {
        _classCallCheck(this, Viewfinder);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Viewfinder).call(this, props));

        _this.state = {
            loading: false,
            moving: false
        };


        _this.image = new _imageHandler2.default();
        _this.image.change(_this.updateImage.bind(_this));

        _this.boundMove = _this.move.bind(_this);
        _this.boundEnd = _this.end.bind(_this);
        return _this;
    }

    _createClass(Viewfinder, [{
        key: 'updateImage',
        value: function updateImage() {
            var translate = this.image.hardTranslate();

            if (this.state.loading) {
                this.setState({
                    loading: false
                });
            }

            if (typeof this.props.onChange === 'function') {
                this.props.onChange(this.image);
            }

            if (!this.node) {
                return;
            }

            this.image.scaledOriginal.style.marginLeft = (this.image.img.width * this.image._zoom / -2 + translate.x) * this.props.scale + 'px';
            this.image.scaledOriginal.style.marginTop = (this.image.img.height * this.image._zoom / -2 + translate.y) * this.props.scale + 'px';
        }
    }, {
        key: 'down',
        value: function down(evt) {
            if (this.startEvt) {
                return;
            }

            this.startEvt = new _eventTravel2.default(evt);

            if (this.image.img) {
                this.autoOpen = setTimeout(function () {
                    this.setState({ moving: true });
                }.bind(this), 200);
            }

            window.addEventListener('mousemove', this.boundMove, false);
            window.addEventListener('mouseup', this.boundEnd, false);
        }
    }, {
        key: 'move',
        value: function move(evt) {
            evt.preventDefault();
            this.image.translate(this.startEvt.diff(evt));

            if (this.autoOpen) {
                clearTimeout(this.autoOpen);
                this.autoOpen = null;
            }

            if (this.startEvt.dist(evt) > 5) {
                this.setState({
                    moving: true
                });
            }
        }
    }, {
        key: 'end',
        value: function end() {
            if (this.autoOpen) {
                clearTimeout(this.autoOpen);
                this.autoOpen = null;
            }

            if (!this.state.moving) {
                this.fileInputEl.value = null;
                this.fileInputEl.click();
            } else {
                this.image.commitTranslation();
                this.setState({
                    moving: false
                });
            }

            this.startEvt = null;

            window.removeEventListener('mousemove', this.boundMove);
            window.removeEventListener('mouseup', this.boundEnd);
        }
    }, {
        key: 'onScroll',
        value: function onScroll(evt) {
            evt.preventDefault();
            evt.stopPropagation();

            this.image.zoom(evt.deltaY * 0.04);
        }
    }, {
        key: 'onDrop',
        value: function onDrop(evt) {
            var files = void 0;

            this.setState({
                loading: false
            });

            files = evt.dataTransfer ? evt.dataTransfer.files : evt.target.files;

            if (!files[0].type.match('image.*') || typeof this.props.accept === 'function' && !this.props.accept(files[0])) {
                return;
            }

            this.image.setFile(files[0]);
        }
    }, {
        key: 'componentWillUpdate',
        value: function componentWillUpdate(nextProps, nextState) {
            if (nextProps.scale !== this.props.scale) {
                this.image.scaledOriginal.style.transform = 'scale(' + nextProps.scale + ')';
            }

            if (nextState.moving !== this.state.moving) {
                if (nextState.moving) {
                    (0, _velocityAnimate2.default)(this.image.canvas, {
                        scale: this.props.scale
                    }, 200, [100, 15]);
                } else {
                    (0, _velocityAnimate2.default)(this.image.canvas, {
                        scale: 1
                    }, 200, [100, 15]);
                }
            }
        }
    }, {
        key: 'onStuff',
        value: function onStuff(elem) {
            if (!elem) {
                return;
            }

            this.node = elem;
            this.node.appendChild(this.image.scaledOriginal);
            this.image.scaledOriginal.style.transform = 'scale(' + this.props.scale + ')';
            this.node.appendChild(this.image.canvas);

            this.enterCounter = 0;
            this.image.minSize(this.node.offsetWidth, this.node.offsetHeight);
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var loader = void 0;

            if (this.state.loading) {
                loader = _react2.default.createElement(
                    'div',
                    { className: 'loading' },
                    this.props.loader
                );
            }

            return _react2.default.createElement(
                'div',
                { className: 'viewfinder',
                    ref: this.onStuff.bind(this),
                    onMouseDown: this.down.bind(this),
                    onWheel: this.onScroll.bind(this) },
                _react2.default.createElement(_dropZone2.default, { onDrop: this.onDrop.bind(this) }),
                _react2.default.createElement('input', { type: 'file',
                    ref: function ref(el) {
                        return _this2.fileInputEl = el;
                    },
                    onChange: this.onDrop.bind(this) }),
                loader
            );
        }
    }]);

    return Viewfinder;
}(_react2.default.Component);

Viewfinder.defaultProps = {
    scale: 0.5
};
exports.default = Viewfinder;