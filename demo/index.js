(function () {

    var space = 5;

    /**
     * 获取鼠标悬停的锚点
     *
     * @param  {Array} pos 鼠标坐标
     * @return {string} 返回匹配的锚点名
     */
    function anchorFromPoint(pos) {
        if (!pos) {
            return;
        }
        var anchors = resizer.getAnchors();
        for (var key in anchors) {
            if (jmaths.pointToPoint(pos, anchors[key]) <= space) {
                return key;
            }
        }
    }

    /**
     * 获取鼠标按键
     *
     * @param {Event} e 事件对象
     * @return {number} 返回鼠标按钮值，左键:1,中键:2,右键:3
     */
    function getMouseButton(e) {
        return e.which || e.button &&
            (e.button & 1 ? 1 : (e.button & 2 ? 3 : (e.button & 4 ? 2 : 0)));
    }

    /**
     * 获取鼠标相对元素位置
     *
     * @param {HTMLElement} element 元素对象
     * @param {Array} pos 鼠标相对于 document 的位置
     * @return {Array} 返回鼠标相对位置
     */
    function relativePos(element, pos) {
        var box = element.getBoundingClientRect();
        return [
            pos[0] - box.left,
            pos[1] - box.top
        ];
    }

    var canvas = document.querySelector('.canvas');
    var resizer = jsizes.create({
        x: 50,
        y: 50,
        width: 200,
        height: 200
    });

    /**
     * 鼠标悬停锚点
     */
    var hoverAnchor;

    /**
     * 设置悬停锚点
     *
     * @param {string} value 锚点名
     */
    function setHoverAnchor(value) {
        if (hoverAnchor === value) {
            return;
        }
        hoverAnchor = value;
        render();
    }

    /**
     * 鼠标按下的位置，为 null 表示未按下
     */
    var downPos;

    /**
     * 鼠标按下的锚点名
     */
    var downAnchor;

    /**
     * 设置按下的锚点
     *
     * @param {string} value 按下的锚点名
     */
    function setDownAnchor(value) {
        if (downAnchor === value) {
            return;
        }
        downAnchor = value;
        render();
    }

    var debugCanvas = jpaths.create({
        parent: document.querySelector('.canvas'),
        fill: '#ff0',
        stroke: 'gray'
    });

    var anchorCanvas = jpaths.create({
        parent: document.querySelector('.canvas')
    });

    var hoverCanvas = jpaths.create({
        parent: document.querySelector('.canvas'),
        fill: 'green',
        stroke: 'blue'
    });

    function boxPath(space) {
        return jpaths.format('m -#{space},-#{space} h #{space2} v #{space2} h -#{space2} z', {
            space: space,
            space2: space * 2
        });
    }

    function render() {
        var handlers = resizer.getAnchors();
        // console.log(JSON.stringify(handlers, null, '  '));
        handlers.box = boxPath(space);
        handlers.hover = handlers[hoverAnchor];

        anchorCanvas.attr({
            path: jpaths.format([
                'M #{r} #{box}',
                'M #{c} #{box}',
                'M #{n} #{box}',
                'M #{e} #{box}',
                'M #{w} #{box}',
                'M #{s} #{box}',
                'M #{ne} #{box}',
                'M #{nw} #{box}',
                'M #{sw} #{box}',
                'M #{se} #{box}',
            ].join(' '), handlers)
        });

        debugCanvas.attr({
            path: jpaths.format([
                'M #{n} L #{r}',
                'M #{ne} L #{nw} #{sw} #{se} Z',
            ].join(' '), handlers)
        });

        if (handlers.hover) {
            hoverCanvas.attr({
                path: jpaths.format([
                    'M #{hover} #{box}',
                ].join(' '), handlers)
            });
        }
        else {
            hoverCanvas.attr({
                path: ''
            });
        }
    }
    render();

    document.querySelector('button').addEventListener('click', function (e) {
        resizer.resize(active, offset);
        render();
    });

    canvas.addEventListener('mousemove', function (e) {
        var target = e.target || e.srcElement;
        var pos = relativePos(target, [e.clientX, e.clientY]);
        if (downAnchor) { // 如果存在被按下的锚点
            resizer.resize(downAnchor, pos);
            render();
        }
        else {
            setHoverAnchor(anchorFromPoint(pos));
        }
    });

    function cleanDown() {
        downPos = null;
        downAnchor = null;
    }
    document.addEventListener('mouseup', cleanDown);

    window.addEventListener('blur', cleanDown);

    canvas.addEventListener('losecapture', cleanDown);

    canvas.addEventListener('mousedown', function (e) {
        var target = e.target || e.srcElement;
        var pos = relativePos(target, [e.clientX, e.clientY]);
        switch (getMouseButton(e)) {
        case 1:
            downPos = pos;
            setDownAnchor(anchorFromPoint(pos));
            break;
        }
    });
})();
