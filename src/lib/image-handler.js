function observer() {
    let cache = [];
    const ret = function(cb) {
        if (typeof cb !== 'function') {
            return;
        }

        cache.push(cb);
    };

    ret.fire = function(...args) {
        let ni;

        for (ni = 0; ni < cache.length; ni++) {
            cache[ni].apply(this, args);
        }
    };

    ret.remove = function(cb) {
        let ni;

        for (ni = 0; ni < cache.length; ni++) {
            if (cache[ni] === cb) {
                cache.splice(ni, 1);
                break;
            }
        }
    };

    ret.clear = function() {
        cache = [];
    };

    return ret;
}

class ImageHandler {
    change = null;
    canvas = null;
    scaledOriginal = null;

    minWidth = 0;
    minHeight = 0;

    _zoom = 0;
    _translate = {
        x: 0,
        y: 0,
        r: 0
    };
    _offset = {
        x: 0,
        y: 0,
        r: 0
    };

    constructor() {
        this.change = observer();

        this.canvas = document.createElement('canvas');
        this.scaledOriginal = document.createElement('canvas');
    }

    minSize(w, h) {
        this.minWidth = w;
        this.minHeight = h;

        this.hardZoom();
    }

    draw() {
        const ctx = this.canvas.getContext('2d'),
            t = this.hardTranslate();

        this.canvas.width = this.minWidth;
        this.canvas.height = this.minHeight;

        ctx.save();
        ctx.translate(
            (this.canvas.width - (this.img.width * this._zoom)) / 2 + t.x,
            (this.canvas.height - (this.img.height * this._zoom)) / 2 + t.y
        );
        ctx.scale(this._zoom, this._zoom);

        ctx.drawImage(this.img, 0, 0);
        ctx.restore();

        this.change.fire();
    }

    drawScaledOriginal() {
        let ctx;

        this.scaledOriginal.width = this.img.width * this._zoom;
        this.scaledOriginal.height = this.img.height * this._zoom;
        ctx = this.scaledOriginal.getContext('2d');
        ctx.save();
        ctx.scale(this._zoom, this._zoom);
        ctx.drawImage(this.img, 0, 0);
        ctx.restore();
    }

    setFile(file) {
        const reader = new FileReader(),
            img = document.createElement('img');

        img.onload = function() {
            this._translate.x = this._translate.y = 0;
            this._offset.x = this._offset.y = 0;
            this._zoom = 0;

            // this is needed to keep jpegs from flashing
            // on drag
            this.img = document.createElement('canvas');
            this.img.width = img.width;
            this.img.height = img.height;
            this.img.getContext('2d')
                .drawImage(img, 0, 0);

            this.hardZoom();

            this.draw();
            this.drawScaledOriginal();
        }.bind(this);

        reader.onload = function(evt) {
            img.src = evt.target.result;
        }.bind(this);

        reader.readAsDataURL(file);
    }

    hardTranslate() {
        const halfImgHeight = (this.img.height * this._zoom) / 2,
            halfCanvasHeight = this.minHeight / 2,
            halfImgWidth = (this.img.width * this._zoom) / 2,
            halfCanvasWidth = this.minWidth / 2;
        let x = this._translate.x + this._offset.x,
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

    hardZoom() {
        let zoom;

        if (!this.img) {
            return;
        }

        if (!this.minWidth || !this.minHeight) {
            return;
        }

        if (
            this.img.width / this.img.height >
            this.minWidth / this.minHeight
        ) {
            zoom = this.minHeight / this.img.height;
        } else {
            zoom = this.minWidth / this.img.width;
        }

        if (this._zoom < zoom) {
            this._zoom = zoom;
        }
    }

    translate(point) {
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

    commitTranslation() {
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

    zoom(by) {
        this._zoom += by;
        this.hardZoom();
        this.draw();
        this.drawScaledOriginal();
    }

    out(...args) {
        const t = this.hardTranslate();
        let zoom = this._zoom,
            cb, canvas, ctx;

        if (args.length === 2) {
            zoom *= args[0];
            cb = args[1];
        } else {
            cb = args[0];
        }

        if (typeof cb !== 'function') {
            return;
        }

        canvas = document.createElement('canvas');
        canvas.width = this.minWidth * zoom;
        canvas.height = this.minHeight * zoom;

        ctx = canvas.getContext('2d');
        ctx.save();
        ctx.translate(
            (this.canvas.width - (this.img.width * zoom)) / 2 + t.x,
            (this.canvas.height - (this.img.height * zoom)) / 2 + t.y
        );
        ctx.scale(zoom, zoom);
        ctx.drawImage(this.img, 0, 0);
        ctx.restore();

        canvas.toBlob(cb, "image/png", 1);
    }
}

export default ImageHandler;
