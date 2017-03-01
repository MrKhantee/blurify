export default class blurify {
    constructor(options) {
        this.blur = options.blur || 6;

        if (options.selector) {
            this.selector = options.selector;
            this.$els = [...document.querySelectorAll(this.selector)];
            preloadImages(this.$els).done(images => {
                images.map(image => {
                    console.log(this.getDataURL(image).slice(0, 100));
                    image.src = this.getDataURL(image);
                    console.log(image);
                });
            });
        } else {
            options.image.src = this.getDataURL(options.image);
        }
    }

    blurify(canvas, blur) {
        let ctx = canvas.getContext('2d');
        ctx.globalAlpha = 0.5;
        for (let y = -blur; y <= blur; y += 2) {
            for (let x = -blur; x <= blur; x += 2) {
                ctx.drawImage(canvas, x, y);
                if (x >= 0 && y >= 0) ctx.drawImage(canvas, -(x - 1), -(y - 1));
            }
        }
        ctx.globalAlpha = 1;
    }

    getDataURL(image) {
        let canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d');

        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);
        this.blurify(canvas, this.blur);
        return canvas.toDataURL(`image/jpeg`);
    }
}

function preloadImages(images) {
    let newimages = [],
        loadedImagesCount = 0,
        postAction = function () {};

    images = (typeof images != 'object') ? [images] : images;

    function imageLoadPost() {
        loadedImagesCount++;
        if (loadedImagesCount == images.length) postAction(newimages);
    }

    images.map((image, i) => {
        newimages[i] = new Image();
        newimages[i].src = image.src;
        newimages[i].onload = function () {
            imageLoadPost();
        };
        newimages[i].onerror = function () {
            imageLoadPost();
        };
    });

    return {
        done(callback) {
            postAction = callback || postAction;
        },
    };
}
