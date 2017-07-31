'use strict';
var utils = (function () {
    var isSupport = 'getComputedStyle' in window;

    /*
     * toArray：Converts an array of classes to an array
     * @parameter：
     *   likeAry[object]：Class array to convert
     * @return：
     *   ary[Array]：Convert completed array
     * By Team on 2017-04-16 12:44
     */
    function toArray(likeAry) {
        var ary = [];
        try {
            ary = Array.prototype.slice.call(likeAry);
        } catch (e) {
            for (var i = 0, len = likeAry.length; i < len; i++) {
                ary[ary.length] = likeAry[i];
            }
        }
        return ary;
    }

    /*
     * toJSON：Convert JSON string to JSON object
     * @parameter：
     *   str[String]：JSON string
     * @return：
     *   obj[Object]：JSON object
     * By Team on 2017-04-16 12:48
     */
    function toJSON(str) {
        return 'JSON' in window ? JSON.parse(str) : eval('(' + str + ')');
    }

    /*
     * win：Operating browser box model information
     */
    function win(attr, value) {
        if (typeof value === "undefined") {
            return document.documentElement[attr] || document.body[attr];
        }
        document.documentElement[attr] = value;
        document.body[attr] = value;
    }

    /*
     * getCss：Gets the value of the specific style property for the current element
     * @parameter：
     *   curEle[object]：current element
     *   attr[string]：style properties of elements
     * @return：
     *   Style attribute values for elements
     * By Team on 2017-04-23 12:29
     */
    function getCss(curEle, attr) {
        var val = null,
            reg = null;
        if (isSupport) {
            val = window.getComputedStyle(curEle, null)[attr];
        } else {
            //->IE6~8
            switch (attr) {
                case 'filter':
                case 'opacity':
                    val = curEle.currentStyle['filter'];
                    reg = /alpha\(opacity=(.+)\)/i;
                    val = reg.test(val) ? RegExp.$1 / 100 : 1;
                    break;
                default:
                    val = curEle.currentStyle[attr];
            }
        }
        reg = /^-?\d+(\.\d+)?(px|rem|em|pt)?$/i;
        val = reg.test(val) ? parseFloat(val) : val;
        return val;
    }

    /*
     * getCss：Set the style property value for an element，Setting inline styles for elements
     * @parameter：
     *   curEle[object]：current element
     *   attr[string]：style properties of elements
     *   value：set style property value
     * By Team on 2017-04-23 15:36
     */
    function setCss(curEle, attr, value) {
        if (attr === 'float') {
            curEle['style']['cssFloat'] = value;
            curEle['style']['styleFloat'] = value;
            return;
        }
        if (attr === 'opacity') {
            curEle['style']['opacity'] = value;
            curEle['style']['filter'] = 'alpha(opacity=' + value * 100 + ')';
            return;
        }
        var reg = /^(?:width|height|(?:(?:margin|padding)?(?:top|left|right|bottom)))$/i;
        if (reg.test(attr)) {
            !isNaN(value) ? value += 'px' : null;
        }
        curEle['style'][attr] = value;
    }

    /*
     * setGroupCss：Set the style attribute value for the batch
     * @parameter：
     *   curEle[object]：current element
     *   styleCollection[object]：style collection
     * By Team on 2017-04-23 15:36
     */
    function setGroupCss(curEle, styleCollection) {
        for (var key in styleCollection) {
            if (styleCollection.hasOwnProperty(key)) {
                setCss(curEle, key, styleCollection[key]);
            }
        }
    }

    /*
     * css：The style properties of the operating element, including the capture style, the individual settings style, and the batch settings style
     * @parameter：
     *   curEle[object]：current element
     * By Team on 2017-04-23 15:36
     */
    function css() {
        var arg = arguments;
        if (arg.length >= 3) {
            //->SET CSS
            setCss.apply(this, arg);
            return;
        }
        if (arg.length === 2 && typeof arg[1] === 'object') {
            //->SET GROUP CSS
            setGroupCss.apply(this, arg);
            return;
        }
        return getCss.apply(this, arg);
    }

    /*
     * offset：Gets the offset of the current element distance BODY
     * @parameter：
     *   curEle[object]：current element
     * @return：
     *   [object]：{top:xxx,left:xxx}
     * By Team on 2017-04-23 16:43
     */
    function offset(curEle) {
        var l = curEle.offsetLeft,
            t = curEle.offsetTop,
            p = curEle.offsetParent;
        while (p) {
            if (navigator.userAgent.indexOf('MSIE 8') === -1) {
                l += p.clientLeft;
                t += p.clientTop;
            }
            l += p.offsetLeft;
            t += p.offsetTop;
            p = p.offsetParent;
        }
        return {top: t, left: l};
    }

    /*
     * hasClass：Verify that the current element contains a single style class name
     * @parameter：
     *   curEle[object]：current element
     *   cName[string]：class name to validate
     * @return：
     *   [boolean]：true/false
     * By Team on 2017-04-29 11:16
     */
    function hasClass(curEle, cName) {
        return new RegExp('(^| +)' + cName + '( +|$)').test(curEle.className);
    }

    /*
     * hasClass：Adds a class name to the current element
     * @parameter：
     *   curEle[object]：current element
     *   strClass[string]：Need to increase the style class name, can be more than, for example:'xxx','xxx xxx', '  xxx    xxx  '...
     * By Team on 2017-04-29 11:28
     */
    function addClass(curEle, strClass) {
        strClass = strClass.replace(/(^ +| +$)/g, '').split(/ +/g);
        for (var i = 0; i < strClass.length; i++) {
            var curClass = strClass[i];
            if (!hasClass(curEle, curClass)) {
                curEle.className += ' ' + curClass;
            }
        }
    }

    /*
     * removeClass：Remove a class name to the current element
     * @parameter：
     *   curEle[object]：current element
     *   strClass[string]：Need to deleted the style class name, can be more than, for example:'xxx','xxx xxx', '  xxx    xxx  '...
     * By Team on 2017-04-29 11:44
     */
    function removeClass(curEle, strClass) {
        strClass = strClass.replace(/(^ +| +$)/g, '').split(/ +/g);
        for (var i = 0; i < strClass.length; i++) {
            var curClass = strClass[i],
                reg = new RegExp('(^| )' + curClass + '( |$)', 'g');
            hasClass(curEle, curClass) ? curEle.className = curEle.className.replace(/ /g, '  ').replace(reg, ' ') : null;
        }
        curEle.className = curEle.className.replace(/(^ +| +$)/g, '');
    }

    /*
     * toggleClass：If the passing style class name exists in the element, the delete operation is an operation
     * @parameter：
     *   curEle[object]：current element
     *   strClass[string]：class name to be operated
     * By Team on 2017-04-29 12:00
     */
    function toggleClass(curEle, strClass) {
        strClass = strClass.replace(/(^ +| +$)/g, '').split(/ +/g);
        for (var i = 0; i < strClass.length; i++) {
            var curClass = strClass[i];
            hasClass(curEle, curClass) ? removeClass(curEle, curClass) : addClass(curEle, curClass);
        }
    }

    /*
     * byClass：Gets a set of elements by the element's style class，Compatible IE low version browser
     * @parameter：
     *   strClass[string]：class name to be operated
     *   context[HTMLElementObject]：get the range, the default is document
     * @return：
     *   [Array]：All matching results
     * By Team on 2017-04-29 12:56
     */
    function byClass(strClass, context) {
        context = context || document;
        if (isSupport) {
            return toArray(context.getElementsByClassName(strClass));
        }
        //->IE6~8
        var allList = context.getElementsByTagName('*'),
            ary = [],
            reg = null;
        strClass = strClass.replace(/(^ +| +$)/g, '')
            .replace(/ +/g, '@@')
            .replace(/(?:^|@)([\w-]+)(?:@|$)/g, '(?=.*(^| +)$1( +|$).*)');
        reg = new RegExp(strClass);
        for (i = 0; i < allList.length; i++) {
            var cur = allList[i];
            reg.test(cur.className) ? ary[ary.length] = cur : null;
        }
        return ary;
    }

    /*
     * children：Gets all the child nodes of the current container (element), which is filtered in all child elements, and specifies the name of the tag
     * @parameter
     *    curEle[HTMLElement]：current element
     *    tagName[string]：tag name
     * @return
     *    [array]：Collection of elements
     */
    function children(curEle, tagName) {
        var allNodes = curEle.childNodes,
            elementAry = [];
        for (var i = 0; i < allNodes.length; i++) {
            var curNode = allNodes[i];
            if (curNode.nodeType === 1) {
                var curNodeTag = curNode.tagName.toUpperCase();
                if (typeof tagName !== 'undefined') {
                    tagName = tagName.toUpperCase();
                    curNodeTag === tagName ? elementAry[elementAry.length] = curNode : null;
                    continue;
                }
                elementAry[elementAry.length] = curNode;
            }
        }
        return elementAry;
    }

    /*
     * prev：Get older brother element node
     */
    function prev(curEle) {
        if (isSupport) {
            return curEle.previousElementSibling;
        }
        var p = curEle.previousSibling;
        while (p && p.nodeType !== 1) {
            p = p.previousSibling;
        }
        return p;
    }

    /*
     * prevAll：Get all brother element node
     */
    function prevAll(curEle) {
        var ary = [],
            p = prev(curEle);
        while (p) {
            ary.unshift(p);
            p = prev(p);
        }
        return ary;
    }

    /*
     * next：Get next brother element node
     */
    function next(curEle) {
        if (isSupport) {
            return curEle.nextElementSibling;
        }
        var n = curEle.nextSibling;
        while (n && n.nodeType !== 1) {
            n = n.nextSibling;
        }
        return n;
    }

    /*
     * nextAll：Get all brother element node
     */
    function nextAll(curEle) {
        var ary = [],
            n = next(curEle);
        while (n) {
            ary.push(n);
            n = next(n);
        }
        return ary;
    }

    /*
     * siblings：Get all sibling element nodes
     */
    function siblings(curEle) {
        return prevAll(curEle).concat(nextAll(curEle));
    }

    /*
     * index：Gets the index of the current element
     */
    function index(curEle) {
        return prevAll(curEle).length;
    }

    /*
     * firstChild：Gets the first child element in the container
     */
    function firstChild(curEle) {
        if (isSupport) {
            return curEle.firstElementChild;
        }
        var first = curEle.firstChild;
        while (first && first.nodeType !== 1) {
            first = first.nextSibling;
        }
        return first;
    }

    /*
     * lastChild：Gets the last child element in the container
     */
    function lastChild(curEle) {
        if (isSupport) {
            return curEle.lastElementChild;
        }
        var last = curEle.lastChild;
        while (last && last.nodeType !== 1) {
            last = last.previousSibling;
        }
        return last;
    }

    /*
     * prepend：Add a new element to the location of the specified container
     * @parameter
     *   newEle：Newly added elements
     *   container：Specified container
     */
    function prepend(newEle, container) {
        var first = firstChild(container);
        if (first) {
            container.insertBefore(newEle, first);
            return;
        }
        container.appendChild(newEle);
    }

    /*
     * insertAfter：Add a new element to the old element
     * @parameter
     *   newEle：New elements
     *   oldEle：Original element
     */
    function insertAfter(newEle, oldEle) {
        var n = next(oldEle),
            p = oldEle.parentNode;
        if (n) {
            p.insertBefore(newEle, n);
            return;
        }
        p.appendChild(newEle);
    }

    return {
        /*--TOOL--*/
        toArray: toArray,
        toJSON: toJSON,
        win: win,

        /*--CSS OR STYLE--*/
        offset: offset,
        css: css,
        hasClass: hasClass,
        addClass: addClass,
        removeClass: removeClass,
        toggleClass: toggleClass,

        /*--GET ELEMENTS--*/
        byClass: byClass,
        children: children,
        prev: prev,
        next: next,
        prevAll: prevAll,
        nextAll: nextAll,
        siblings: siblings,
        index: index,
        firstChild: firstChild,
        lastChild: lastChild,

        /*--OPERATING ELEMENT--*/
        insertAfter: insertAfter,
        prepend: prepend
    }
})();