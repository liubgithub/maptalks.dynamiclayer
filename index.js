import * as maptalks from 'maptalks';

export class DynamicLayer extends maptalks.CanvasLayer {
    constructor(id, url, options) {
        const _options = options || {};
        super(id, options);
        this.layerOptions = _options;
        this.serviceUrl = url;
        return this;
    }

    _checkUrl(str) {
        if (str instanceof String) {
            const r = str.substr(str.length - 2, 1);
            if (r === '/') {
                return false;
            } else return true;
        } else return false;
    }

    prepareToDraw() {
        const _map = this.getMap();
        if (!_map) return undefined;
        const _size = _map.getSize();
        return _size;
    }

    draw(context, view, size) {
        const me = this;
        const url = this.serviceUrl;
        const proxyUrl = '../proxy/proxy.ashx';
        const requestUrl = proxyUrl;
        if (this._checkUrl(url)) {
            console.log('service url is invalid');
            return;
        }
        const _map = this.getMap();
        const _size = size;
        const _extent = _map.getExtent();
        const bbox = _extent.xmin + ',' + _extent.ymin + ',' + _extent.xmax + ',' + _extent.ymax;
        const layerSize = _size.width + ',' + _size.height;
        const layers = (!this.layerOptions.layerId) ? '' : 'show:' + this.layerOptions.layerId;
        const filter = '/export?bbox=' + bbox + '&bboxSR=&layers=' + layers + '&layerDefs=&size=' + layerSize + '&imageSR=&format=png&transparent=true&dpi=&time=&layerTimeOptions=&dynamicLayers=&gdbVersion=&mapScale=&f=json';
        maptalks.Ajax.post({ url: requestUrl }, 'url=' + encodeURIComponent(url) + '&filter=' + encodeURIComponent(filter), function (err, response) {
            if (err) return;
            const data = maptalks.Util.parseJSON(response);
            const img = new Image(_size.width, _size.height);
            img.src = data.href;
            img.onload = function () {
                context.drawImage(img, 0, 0, _size.width, _size.height);
                me.completeRender();
                me.fire('drawend', { img : img } );
            };
        });
    }
}
