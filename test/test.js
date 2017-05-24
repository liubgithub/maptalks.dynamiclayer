describe('#DynamicLayer', function () {
    var container;
    var map;
    var layer;
    var center = new maptalks.Coordinate(118.846825, 32.046534);

    beforeEach(function () {
        container = document.createElement('div');
        container.style.width = '800px';
        container.style.height = '600px';
        document.body.appendChild(container);
        var option = {
            zoom: 17,
            center: center
        };
        map = new maptalks.Map(container, option);
    });

    afterEach(function () {
        map.remove();
        document.body.innerHTML = '';
    });

    it('add', function (done) {
        var size = map.getSize();
        layer = new maptalks.DynamicLayer('v', '');
        layer.prepareToDraw = function () {
            return [size.width, size.height];
        };

        layer.draw = function (context, view, w, h) {
            expect(view.extent.isValid()).to.be.ok();
            expect(view.northWest).to.be.ok();
            expect(view.zoom).to.be.eql(map.getZoom());
            expect(w).to.be.eql(size.width);
            expect(h).to.be.eql(size.height);
            context.fillStyle = '#f00';
            context.fillRect(0, 0, w, h);
        };
        layer.on('layerload', function () {
            expect(layer).to.be.painted(0, 0, [255, 0, 0]);
            done();
        });
        layer.addTo(map);
    });
});
