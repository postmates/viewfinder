'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DropZone = function (_React$Component) {
    _inherits(DropZone, _React$Component);

    function DropZone() {
        var _Object$getPrototypeO;

        var _temp, _this, _ret;

        _classCallCheck(this, DropZone);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(DropZone)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.state = {
            isDragActive: false,
            isDragReject: false
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(DropZone, [{
        key: 'onDragEnter',
        value: function onDragEnter(evt) {
            var files = [],
                allFilesAccepted = false;

            evt.preventDefault();

            ++this.enterCounter;

            if (evt.dataTransfer && evt.dataTransfer.items) {
                files = Array.prototype.slice.call(files);
            }

            if (files.length === 1 && files[0].type.match('image.*') && (typeof this.props.accept !== 'function' || this.props.accept(files[0]))) {
                allFilesAccepted = true;
            }

            this.setState({
                isDragActive: allFilesAccepted,
                isDragReject: !allFilesAccepted
            });
        }
    }, {
        key: 'onDragOver',
        value: function onDragOver(evt) {
            evt.preventDefault();
            evt.stopPropagation();
            return false;
        }
    }, {
        key: 'onDragLeave',
        value: function onDragLeave(evt) {
            evt.preventDefault();

            if (--this.enterCounter > 0) {
                return;
            }

            this.setState({
                isDragActive: false,
                isDragReject: false
            });
        }
    }, {
        key: 'onDrop',
        value: function onDrop(evt) {
            evt.preventDefault();

            this.enterCounter = 0;

            this.setState({
                isDragActive: false,
                isDragReject: false
            });

            if (typeof this.props.onDrop === 'function') {
                this.props.onDrop(evt);
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var drop = void 0;

            if (this.state.isDragActive) {
                drop = this.props.dropIcon || _react2.default.createElement('div', { className: 'drop-icon' });
            }

            return _react2.default.createElement(
                'div',
                { className: 'drop-zone',
                    onDragEnter: this.onDragEnter.bind(this),
                    onDragOver: this.onDragOver.bind(this),
                    onDragLeave: this.onDragLeave.bind(this),
                    onDrop: this.onDrop.bind(this) },
                drop
            );
        }
    }]);

    return DropZone;
}(_react2.default.Component);

exports.default = DropZone;