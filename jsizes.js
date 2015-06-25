(function jsizes(exportName) {

    

    var exports = exports || {};

    /**
     * 对称点
     *
     * @type {Object}
     */
    var symmetrys = {};
    'n|s,w|e,nw|se,ne|sw'.split(',').forEach(function (item) {
        var arr = item.split('|');
        symmetrys[arr[0]] = arr[1];
        symmetrys[arr[1]] = arr[0];
    });

    /**
     * 创建改变大小控件
     *
     * @param {Object} options 配置项
     * @param {number} options.x 横坐标
     * @param {number} options.y 纵坐标
     * @param {number} options.width 宽度
     * @param {number} options.height 高度
     * @param {number} options.angle 角度，单位：弧度
     * @return {Object} 返回改变大小控件实例
     */
    function create(options) {
        options = options || {};

        var x = options.x || 0;
        var y = options.y || 0;
        var width = options.width || 100;
        var height = options.height || 100;
        var angle = options.angle || 0;

        var instance = {};

        /**
         * 获取锚点集合
         *
         * @param {number=} newAngle 角度
         * @return {Object} 返回锚点集合
         */
        function getAnchors(newAngle) {
            /**
             *     r
             *(x,y)|
             * nw--n--ne(x + w, y)
             *  |  |  |
             *  w--c--e (x + w, y + h / 2)
             *  |  |  |
             * sw--s--se(x + w, y + h)
             */

            if (typeof newAngle === 'undefined') {
                newAngle = angle;
            }
            var center = [x + width / 2, y + height / 2];

            var n = [center[0], y];
            var s = [center[0], y + height];
            var w = [x, center[1]];
            var e = [x + width, center[1]];

            var nw = [w[0], n[1]];
            var ne = [e[0], n[1]];
            var se = [e[0], s[1]];
            var sw = [w[0], s[1]];

            var r = [center[0], y - 35];

            return {
                c: center,

                r: jmaths.rotatePoint(r, center, newAngle),

                n: jmaths.rotatePoint(n, center, newAngle),
                s: jmaths.rotatePoint(s, center, newAngle),
                w: jmaths.rotatePoint(w, center, newAngle),
                e: jmaths.rotatePoint(e, center, newAngle),

                nw: jmaths.rotatePoint(nw, center, newAngle),
                ne: jmaths.rotatePoint(ne, center, newAngle),
                se: jmaths.rotatePoint(se, center, newAngle),
                sw: jmaths.rotatePoint(sw, center, newAngle)
            }
        }
        instance.getAnchors = getAnchors;

        /**
         * 改变大小
         *
         * @param {string} anchor 锚点名称 n|e|w|s...
         * @param {Array} point 锚点新的位置
         * @param {number} options.minWidth 最小宽度，默认 20
         * @param {number} options.minHeight 最小高度，默认 20
         * @return {boolean} 返回是否改变
         */
        instance.resize = function resize(anchor, point, options) {
            var anchors = getAnchors();
            var center = anchors['c'];
            if (anchor === 'c') { // 中心点整体移动
                x += point[0] - center[0];
                y += point[1] - center[1];
                return instance;
            }
            if (anchor === 'r') { // 旋转角度
                angle = jmaths.pointToAngle(center, point) + 0.5 * Math.PI;
                return instance;
            }

            var symmetry = symmetrys[anchor];
            if (!symmetry) {
                return instance;
            }

            options = options || {};
            var minWidth = options.minWidth || 20;
            var minHeight = options.minHeight || 20;

            var $anchors = getAnchors(0);
            var $point = jmaths.rotatePoint(point, center, -angle);

            var from = anchors[symmetry];
            var $from = $anchors[symmetry];

            var $temp = $from.slice();
            if (/w/.test(anchor)) {
                $temp[0] = Math.min($temp[0] - minWidth, $point[0]);
            }
            if (/e/.test(anchor)) {
                $temp[0] = Math.max($temp[0] + minWidth, $point[0]);
            }
            if (/n/.test(anchor)) {
                $temp[1] = Math.min($temp[1] - minHeight, $point[1]);
            }
            if (/s/.test(anchor)) {
                $temp[1] = Math.max($temp[1] + minHeight, $point[1]);
            }
            var temp = jmaths.rotatePoint($temp, center, angle);
            var newCenter = jmaths.bezier([temp, from], 0.5);
            switch (anchor) {
            case 'e':
            case 'w':
                width = jmaths.pointToPoint($temp, $from);
                break;
            case 's':
            case 'n':
                height = jmaths.pointToPoint($temp, $from);
                break;
            default:
                width = Math.abs($temp[0] - $from[0]);
                height = Math.abs($temp[1] - $from[1]);
                break;
            }
            x = newCenter[0] - width / 2;
            y = newCenter[1] - height / 2;
            return instance;
        };

        /**
         * 克隆一个实例
         *
         * @return {Object} 返回克隆实例
         */
        function clone() {
            return create({
                x: x,
                y: y,
                width: width,
                height: height,
                angle: angle
            });
        }
        instance.clone = clone;

        /**
         * 更新实例数据
         *
         * @param {Object} options 配置项
         */
        function update(options) {
            options = options || {};
            x = options.x || x;
            y = options.y || y;
            width = options.width || width;
            height = options.height || height;
            angle = options.angle || angle;
            return instance;
        }
        instance.update = update;

        /**
         * 获取前矩形信息
         *
         * @return {Object} 返回当前矩形信息
         */
        function getRect() {
            return {
                x: x,
                y: y,
                width: width,
                height: height,
                angle: angle
            };
        }
        instance.getRect = getRect;
        return instance;
    }
    exports.create = create;

    /**
     * 通过锚点改变矩形大小或角度
     *
     * @param {Object} options 矩形信息
     * @param {string} anchor 锚点名
     * @param {Array} point 新锚点坐标
     * @return {Object} 返回改变后的矩形信息
     */
    function resize(options, anchor, point) {
        return create(options).resize(anchor, point).getRect();
    }
    exports.resize = resize;

    if (typeof define === 'function') {
        if (define.amd || define.cmd) {
            define(function () {
                return exports;
            });
        }
    }
    else if (typeof module !== 'undefined' && module.exports) {
        module.exports = exports;
    }
    else {
        window[exportName] = exports;
    }

})('jsizes');
