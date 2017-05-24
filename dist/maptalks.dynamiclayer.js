/*!
 * maptalks.dynamiclayer v2.0.0
 * LICENSE : MIT
 * (c) 2016-2017 maptalks.org
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('maptalks')) :
	typeof define === 'function' && define.amd ? define(['exports', 'maptalks'], factory) :
	(factory((global.maptalks = global.maptalks || {}),global.maptalks));
}(this, (function (exports,maptalks) { 'use strict';

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var DynamicLayer = function (_maptalks$CanvasLayer) {
    _inherits(DynamicLayer, _maptalks$CanvasLayer);

    function DynamicLayer(id, url, options) {
        var _ret;

        _classCallCheck(this, DynamicLayer);

        var _options = options || {};

        var _this = _possibleConstructorReturn(this, _maptalks$CanvasLayer.call(this, id, options));

        _this.layerOptions = _options;
        _this.serviceUrl = url;
        return _ret = _this, _possibleConstructorReturn(_this, _ret);
    }

    DynamicLayer.prototype._checkUrl = function _checkUrl(str) {
        if (str instanceof String) {
            var r = str.substr(str.length - 2, 1);
            if (r === '/') {
                return false;
            } else return true;
        } else return false;
    };

    DynamicLayer.prototype.prepareToDraw = function prepareToDraw() {
        var _map = this.getMap();
        if (!_map) return undefined;
        var _size = _map.getSize();
        return _size;
    };

    DynamicLayer.prototype.draw = function draw(context, view, size) {
        var me = this;
        var url = this.serviceUrl;
        var proxyUrl = '../proxy/proxy.ashx';
        var requestUrl = proxyUrl;
        if (this._checkUrl(url)) {
            console.log('service url is invalid');
            return;
        }
        var _map = this.getMap();
        var _size = size;
        var _extent = _map.getExtent();
        var bbox = _extent.xmin + ',' + _extent.ymin + ',' + _extent.xmax + ',' + _extent.ymax;
        var layerSize = _size.width + ',' + _size.height;
        var layers = !this.layerOptions.layerId ? '' : 'show:' + this.layerOptions.layerId;
        var filter = '/export?bbox=' + bbox + '&bboxSR=&layers=' + layers + '&layerDefs=&size=' + layerSize + '&imageSR=&format=png&transparent=true&dpi=&time=&layerTimeOptions=&dynamicLayers=&gdbVersion=&mapScale=&f=json';
        maptalks.Ajax.post({ url: requestUrl }, 'url=' + encodeURIComponent(url) + '&filter=' + encodeURIComponent(filter), function (err, response) {
            if (err) return;
            var data = maptalks.Util.parseJSON(response);
            var img = new Image(_size.width, _size.height);
            img.src = data.href;
            img.onload = function () {
                context.drawImage(img, 0, 0, _size.width, _size.height);
                me.completeRender();
                me.fire('drawend', { img: img });
            };
        });
    };

    return DynamicLayer;
}(maptalks.CanvasLayer);

exports.DynamicLayer = DynamicLayer;

Object.defineProperty(exports, '__esModule', { value: true });

})));
