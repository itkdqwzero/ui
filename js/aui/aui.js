/* aui plugin based on jQuery */
if (!window.aui) { window.aui = {}; }
/* dialog */
aui.dialog = {
    alert: function (t, c, fn, url) { var args = { icon: 'boxIcon boxIcon-alert', btn: [{ name: "ok", text: "确 定", url: url}], title: t, html: c, action: fn }; return aui.dialog.init(args); },
    success: function (t, c, fn, url) { var args = { icon: 'boxIcon boxIcon-success', btn: [{ name: "ok", text: "确 定", url: url}], title: t, html: c, action: fn }; return aui.dialog.init(args); },
    warning: function (t, c, fn, url) { var args = { icon: 'boxIcon boxIcon-warning', btn: [{ name: "ok", text: "确 定", url: url}], title: t, html: c, action: fn }; return aui.dialog.init(args); },
    error: function (t, c, fn, url) { var args = { icon: 'boxIcon boxIcon-error', btn: [{ name: "ok", text: "确 定", url: url}], title: t, html: c, action: fn }; return aui.dialog.init(args); },
    confirm: function (t, c, fn, url) { var args = { icon: 'boxIcon boxIcon-confirm', btn: [{ name: "ok", text: "确 定", url: url }, { name: "cancel", text: "取 消"}], title: t, html: c, action: fn }; return aui.dialog.init(args); },
    push: function (t, c, fn) { var args = { cover: false, drag: false, dragGhost: false, fixed: true, animateShow: { type: "bottom", speed: 500 }, animateHide: { type: "right", speed: 300 }, offset: { left: "right", top: "bottom" }, title: t, html: c, callback: fn }; return aui.dialog.init(args); },
    html: function (t, c, w, h, btn, fn, u) { var args = { title: t, url: u, width: w, height: h, html: c, btn: btn, action: fn }; return aui.dialog.init(args); },
    url: function (t, u, w, h, btn, fn, c) { var args = { animate: false, cover: false, title: t, url: u, width: w, height: h, html: c, btn: btn, action: fn }; return aui.dialog.init(args); },
    tip: function (type, c, time, fn) { type = type.split('-'); var pos = "middle"; if (type[1] != undefined) { pos = type[1]; }; type = type[0]; var args = { cover: false, drag: false, dragGhost: false, type: 'tip', icon: 'boxTip boxTip-' + type, offset: { left: "center", top: pos }, fixed: true, html: c, tipStay: time, callback: fn }; return aui.dialog.init(args); },
    remove: function (id) { if (id === undefined) { for (var i in aui.dialog.g) { id = aui.dialog.g[i].id; aui.dialog._close(id); } } },
    g: {},
    init: function (args) {
        var params = {
            id: Math.ceil(Math.random() * 100000000000).toString(),
            target: null,

            type: 'box',
            cls: 'p10 oya',
            title: "",
            icon: "",
            html: '',
            url: '',
            btn: [],
            action: function () { return true; },

            cover: true,
            fixed: false,
            drag: true,
            dragGhost: true,
            resize: false,
            animate: true,
            form: false,

            dragIn: "body",
            dragLimit: { gapLeft: 0, gapTop: 0, maxLeft: 0, maxTop: 0 },

            resizeDir: "hv",
            resizeTarget: false,
            resizeLimit: { gapHeight: 0, gapWidth: 0, cutWidth: 0, cutHeight: 0 },


            animateShow: { type: "fade", speed: 500 },
            animateHide: { type: "top", speed: 300 },
            tipStay: 3000,

            width: 0,
            height: 0,
            offset: { left: "center", top: "middle" },
            zIndex: 20000,
            WHTL: {},
            whtl: {},
            afterShow: function () { return false; },
            callback: function () { return false; }
        };
        var id = args.id != undefined ? args.id : params.id;
        this.g[id] = {};
        $.extend(this.g[id], params, args);
        switch (this.g[id].type) {
            case "box": this._create_box(id); break;
            case "tip": this._create_tip(id); break;
        }
        return id;
    },
    _whtl: function (dragIn) {
        if (dragIn == "body") {
            var doc = $(document);
            return { top: doc.scrollTop(), left: doc.scrollLeft(), width: document.documentElement.clientWidth, height: document.documentElement.clientHeight }
        } else {
            var w = $(dragIn).width();
            var h = $(dragIn).height();
            var offset = $(dragIn).offset();
            return { top: offset.top, left: offset.left, width: w, height: h };
        };

    },
    _create_box: function (id) {
        var g = this.g[id];
        var drag_cls = g.drag ? "cursor-m" : "";
        var w = g.width == 0 ? "auto" : g.width + "px";
        var h = g.height == 0 ? "auto" : g.height + "px";
        var fixed = g.fixed ? "pf-tl" : "pa-tl";
        var html_content = '';
        if (g.url == "") {
            html_content = '<div ' + (g.form ? '' : 'id="J_html' + id + '"') + ' class="' + g.cls + '" style="width:' + w + ';height:' + h + '">' + (g.form ? '<form id="J_form' + id + '">' : '') + (g.icon != "" ? '<i class="fl ' + g.icon + '"></i><div style="margin-left:50px;" id="J_html' + id + '"></div>' : '') + (g.form ? '</form>' : '') + '</div>';
        } else {
            html_content = '<div id="J_html' + id + '"></div><iframe frameborder="0" src="' + g.url + '" id="J_iframe' + id + '" style="width:' + w + ';height:' + h + '"></iframe>';
        }
        var html_resize = g.resize ? '<i class="boxResize" id="J_resize_handle' + id + '"></i>' : "";
        var html_ghost = g.dragGhost ? '<div id="J_ghost' + id + '" class="boxGhost" style="z-index:' + g.zIndex + '; top:0px; left: 0px;"></div>' : "";
        var html_cover = g.cover ? '<div id="J_cover' + id + '" class="boxCover" style="z-index:' + g.zIndex + ';"></div>' : "";
        var html_btn = ''; for (var i = 0; i < g.btn.length; i++) { html_btn += '<a href="' + (g.btn[i].url == undefined ? 'javascript:;' : g.btn[i].url + '" target="_blank') + '" class="boxBtn-a" onclick="aui.dialog._click(\'' + id + '\',\'' + g.btn[i].name + '\')"><span class="boxBtn-span">' + g.btn[i].text + '</span></a>'; };
        var tmp_box = [html_cover,
        '<div id="J_box', id, '" class="J_dialog_box dn ', fixed, '" style="z-index:', g.zIndex, ';"><table class="table"><tbody>',
        '<tr><td class="boxTd boxTd-lt"></td><td class="boxTd boxTd-t"><div id="J_drag_handle', id, '" class="boxTd-title ', drag_cls, '">', g.title, '<a id="J_close', id, '" class="boxTd-close" title="关闭" href="javascript:;" onclick="aui.dialog._click(\'', id, '\',\'close\')"></a></div></td><td class="boxTd boxTd-rt"></td></tr>',
        '<tr><td class="boxTd boxTd-l"></td><td class="boxTd-c" id="J_content', id, '">', html_content, '<div class="boxBtn">', html_btn, '</div></td><td class="boxTd boxTd-r"></td></tr>',
        '<tr><td class="boxTd boxTd-lb"></td><td class="boxTd boxTd-b"></td><td class="boxTd boxTd-rb"></td></tr>',
        '</tbody></table>', html_resize, '</div>', html_ghost
    ];

        var html = tmp_box.join("");
        $('body').append(html);
        $('#J_html' + id).html(g.html);
        //
        g.target = $('#J_box' + id);
        if (g.drag) {
            g.drag = $('#J_drag_handle' + id);
            g.drag.mousedown(function (e) {
                if (e.which == 1 && e.target.tagName != "A") {
                    aui.dialog._drag_mouseDown(id, e);
                    return false;
                };
            });
        };
        if (g.resize) {
            g.resize = $('#J_resize_handle' + id);
            g.resizeTarget = $('#J_html' + id);
            g.resize.mousedown(function (e) {
                e.preventDefault();
                aui.dialog._resize_mouseDown(id, e);
            });
        };
        if (g.dragGhost) {
            g.dragGhost = $('#J_ghost' + id);
        } else {
            g.dragGhost = g.target
        };
        if (g.cover) {
            g.cover = $('#J_cover' + id);
        };
        this._show(id);
        g.callback(g);
    },
    _create_tip: function (id) {
        var g = this.g[id];
        var html = '<div id="J_tip' + id + '" class="pf-tl m20-t" style="z-index:' + g.zIndex + ';"><table class="table"><tr><td class="boxTip boxTip-l"></td><td class="boxTip boxTip-c"><i class="' + g.icon + '"></i><span class="p10-rl">' + g.html + '</span></td><td class="boxTip boxTip-r"></td></tr></table></div>';
        $('body').append(html);
        g.target = $('#J_tip' + id);
        aui.dialog._show(id);
        setTimeout(function () { g.callback(g); aui.dialog._close(id); }, g.tipStay);
    },
    _show: function (id) {
        var g = this.g[id];
        g.WHTL = this._whtl(g.dragIn);
        g.whtl = this._whtl(g.target);
        switch (g.offset.left) {
            case "left": g.whtl.left = g.WHTL.left; break;
            case "center": g.whtl.left = g.WHTL.left + (g.WHTL.width - g.whtl.width) / 2; break;
            case "right": g.whtl.left = g.WHTL.left + g.WHTL.width - g.whtl.width - 2; break;
            default: g.whtl.left = g.WHTL.left + g.offset.left; break;
        };
        switch (g.offset.top) {
            case "top": g.whtl.top = g.WHTL.top + 20; if (g.fixed) { g.whtl.top = 0; }; break;
            case "middle": g.whtl.top = g.WHTL.top + (g.WHTL.height - g.whtl.height) / 2; break;
            case "bottom": g.whtl.top = g.WHTL.top + g.WHTL.height + g.whtl.height - 2; if (g.fixed) { g.whtl.top = g.WHTL.height - g.whtl.height - 2; }; break;
            default: g.whtl.top = g.WHTL.top + g.offset.top; break;
        };
        g.target.css({ "top": g.whtl.top, "left": g.whtl.left });
        if (!g.animate) {
            g.target.show();
        } else {
            switch (g.animateShow.type) {
                case "fade": g.target.css({ "top": g.whtl.top - g.whtl.height }).show().animate({ "top": g.whtl.top }, { duration: g.animateShow.speed, complete: function () { g.afterShow(g); } }); break;
                case "top": g.target.css({ "top": g.WHTL.top - g.whtl.height }); g.target.animate({ "top": g.whtl.top, "opacity": "show" }, { duration: g.animateShow.speed, complete: function () { g.afterShow(g); } }); break;
                case "bottom": g.target.css({ "top": g.whtl.top + g.whtl.height }); g.target.animate({ "top": g.whtl.top, "opacity": "show" }, { duration: g.animateShow.speed, complete: function () { g.afterShow(g); } }); break;
                case "left": g.target.css({ "left": g.WHTL.left - g.whtl.width }); g.target.animate({ "left": g.whtl.left, "opacity": "show" }, { duration: g.animateShow.speed, complete: function () { g.afterShow(g); } }); break;
                case "right": g.target.css({ "left": g.WHTL.width + g.whtl.width }); g.target.animate({ "left": g.whtl.left, "opacity": "show" }, { duration: g.animateShow.speed, complete: function () { g.afterShow(g); } }); break;
                default: g.target.show(); break;
            }
        }
    },
    _close: function (id) {
        var g = this.g[id];
        if (!g.animate) {
            g.target.hide();
            aui.dialog._close_remove(id);
        } else {
            switch (g.animateHide.type) {
                case "top": g.target.animate({ "top": g.whtl.top - g.whtl.height, "opacity": "hide" }, { duration: g.animateHide.speed, complete: function () { aui.dialog._close_remove(id); } }); break;
                case "bottom": g.target.animate({ "top": g.whtl.top + g.whtl.height, "opacity": "hide" }, { duration: g.animateHide.speed, complete: function () { aui.dialog._close_remove(id); } }); break;
                case "left": g.target.animate({ "left": g.whtl.left - g.whtl.width, "opacity": "hide" }, { duration: g.animateHide.speed, complete: function () { aui.dialog._close_remove(id); } }); break;
                case "right": if ($.browser.version == "6.0") { g.target.hide(); aui.dialog._close_remove(id); } else { g.target.animate({ "left": g.whtl.left + g.whtl.width, "opacity": "hide" }, { duration: g.animateHide.speed, complete: function () { aui.dialog._close_remove(id); } }) }; break;
                case "fade": g.target.animate({ "top": g.whtl.top - g.whtl.height, "opacity": "hide" }, { duration: g.animateHide.speed, complete: function () { aui.dialog._close_remove(id); } }); break;
                default: g.target.hide(); aui.dialog._close_remove(id); break;
            }
        }
    },
    _close_remove: function (id) {
        var g = this.g[id];
        g.target.remove();
        if (g.dragGhost) { g.dragGhost.remove(); }
        if (g.cover) { g.cover.fadeOut(g.animateHide.speed, function () { $(this).remove(); }); }
        delete (this.g[id]);
    },
    _click: function (id, btn) {
        if (this.g[id].action(id, btn) !== false) { aui.dialog._close(id); };
    },
    _drag_mouseDown: function (id, e) {
        var g = this.g[id];
        g.WHTL = this._whtl(g.dragIn);
        g.dragLimit = { gapLeft: e.clientX - g.whtl.left, gapTop: e.clientY - g.whtl.top, maxTop: g.WHTL.height + g.WHTL.top - g.whtl.height - 2, maxLeft: g.WHTL.width + g.WHTL.left - g.whtl.width - 2 };
        g.dragGhost.css(g.whtl).show();
        if (g.dragGhost[0].setCapture) {
            g.dragGhost[0].setCapture();
            g.dragGhost.mousemove(function (e) { e.preventDefault(); aui.dialog._drag_mouseMove(id, e); }).mouseup(function () { e.preventDefault(); aui.dialog._drag_mouseUp(id); });
        } else {
            $(document).mousemove(function (e) { e.preventDefault(); aui.dialog._drag_mouseMove(id, e); }).mouseup(function () { e.preventDefault(); aui.dialog._drag_mouseUp(id); });
        };
    },
    _drag_mouseMove: function (id, e) {
        var g = this.g[id];
        var moveLeft = e.clientX - g.dragLimit.gapLeft;
        var moveTop = e.clientY - g.dragLimit.gapTop;
        moveLeft <= g.WHTL.left ? moveLeft = g.WHTL.left : moveLeft >= g.dragLimit.maxLeft && (moveLeft = g.dragLimit.maxLeft);
        moveTop <= g.WHTL.top ? moveTop = g.WHTL.top : moveTop > g.dragLimit.maxTop && (moveTop = g.dragLimit.maxTop);
        g.dragGhost.css({ top: moveTop, left: moveLeft });
    },
    _drag_mouseUp: function (id) {
        var g = this.g[id];
        g.whtl = this._whtl(g.dragGhost);
        if (g.dragGhost !== g.target) { g.dragGhost.hide(); }
        if (g.animate) {
            g.target.animate({ "top": g.whtl.top, "left": g.whtl.left }, { duration: 400 });
        } else {
            g.target.css({ "top": g.whtl.top, "left": g.whtl.left });
        };
        if (g.dragGhost[0].releaseCapture) {
            g.dragGhost[0].releaseCapture();
            g.dragGhost.off("mousemove").off("mouseup");
        } else {
            $(document).off("mousemove").off("mouseup");
        };
    },
    _resize_mouseDown: function (id, e) {
        var g = this.g[id];
        g.WHTL = this._whtl(g.dragIn);
        g.resizeLimit = { gapHeight: g.WHTL.height + g.WHTL.top - g.whtl.top, gapWidth: g.WHTL.width + g.WHTL.left - g.whtl.left, cutWidth: g.whtl.width - g.resizeTarget.width(), cutHeight: g.whtl.height - g.resizeTarget.height() };
        g.dragGhost.css(g.whtl).show();
        if (g.dragGhost[0].setCapture) {
            g.dragGhost[0].setCapture();
            g.dragGhost.mousemove(function (e) { e.preventDefault(); aui.dialog._resize_mouseMove(id, e); }).mouseup(function () { e.preventDefault(); aui.dialog._resize_mouseUp(id); });
        } else {
            $(document).mousemove(function (e) { e.preventDefault(); aui.dialog._resize_mouseMove(id, e); }).mouseup(function () { e.preventDefault(); aui.dialog._resize_mouseUp(id); });
        };
    },
    _resize_mouseMove: function (id, e) {
        var g = this.g[id];
        var w = e.clientX + g.WHTL.left - g.whtl.left;
        var h = e.clientY + g.WHTL.top - g.whtl.top;
        w <= 50 ? w = 50 : w >= g.resizeLimit.gapWidth && (w = g.resizeLimit.gapWidth);
        h <= 50 ? h = 50 : h >= g.resizeLimit.gapHeight && (h = g.resizeLimit.gapHeight);
        if (g.resizeDir.indexOf('v') != -1) {
            g.dragGhost.css("height", h);
        };
        if (g.resizeDir.indexOf('h') != -1) {
            g.dragGhost.css("width", w);
        };
    },
    _resize_mouseUp: function (id) {
        var g = this.g[id];
        g.whtl = this._whtl(g.dragGhost);
        g.dragGhost.hide();
        var w = g.whtl.width - g.resizeLimit.cutWidth;
        var h = g.whtl.height - g.resizeLimit.cutHeight;
        if (g.animate) {
            g.resizeTarget.animate({ "width": w, "height": h }, { duration: 600 });
        } else {
            g.resizeTarget.css({ "width": w, "height": h });
        };
        if (g.dragGhost[0].releaseCapture) {
            g.dragGhost[0].releaseCapture();
            g.dragGhost.off("mousemove").off("mouseup");
        } else {
            $(document).off("mousemove").off("mouseup");
        };
    }
};
/* drag */
aui.drag = {
    g: {},
    init: function (args) {
        var params = {
            id: Math.ceil(Math.random() * 100000000000).toString(),
            target: '',
            dragIn: 'body',
            dragLimit: { gapLeft: 0, gapTop: 0, minLeft: 0, minTop: 0, maxLeft: 0, maxTop: 0 },
            WHTL: {},
            whtl: {}
        };
        var id = args.id != undefined ? args.id : params.id;
        this.g[id] = {};
        $.extend(this.g[id], params, args);
        this.g[id].target = $(this.g[id].target);
        this.g[id].target.mousedown(function (e) {
            if (e.which == 1) {
                aui.drag._mouseDown(id, e);
                return false;
            };
        });
        return id;
    },
    _mouseDown: function (id, e) {
        var g = this.g[id];
        g.WHTL = this._whtl(g.dragIn);
        g.whtl = this._whtl(g.target);
        if (g.target.css('position') == 'fixed') {
            g.whtl.top = g.whtl.top - g.WHTL.top;
            g.whtl.left = g.whtl.left - g.WHTL.left;
        }
        g.dragLimit = { gapLeft: e.clientX, gapTop: e.clientY, minTop: 5 - g.whtl.height, minLeft: 5 - g.whtl.width, maxTop: g.WHTL.height - 5, maxLeft: g.WHTL.width - 5 };
        if (g.target[0].setCapture) {
            g.target[0].setCapture();
            g.target.mousemove(function (e) { e.preventDefault(); aui.drag._mouseMove(id, e); }).mouseup(function () { e.preventDefault(); aui.drag._mouseUp(id); });
        } else {
            $(document).mousemove(function (e) { e.preventDefault(); aui.drag._mouseMove(id, e); }).mouseup(function () { e.preventDefault(); aui.drag._mouseUp(id); });
        };
    },
    _mouseMove: function (id, e) {
        var g = this.g[id];
        var moveLeft = e.clientX - g.dragLimit.gapLeft + g.whtl.left;
        var moveTop = e.clientY - g.dragLimit.gapTop + g.whtl.top;
        moveLeft <= g.dragLimit.minLeft ? moveLeft = g.dragLimit.minLeft : moveLeft >= g.dragLimit.maxLeft && (moveLeft = g.dragLimit.maxLeft);
        moveTop <= g.dragLimit.minTop ? moveTop = g.dragLimit.minTop : moveTop >= g.dragLimit.maxTop && (moveTop = g.dragLimit.maxTop);
        g.target.css({ top: moveTop, left: moveLeft });

    },
    _mouseUp: function (id) {
        var g = this.g[id];
        if (g.target[0].releaseCapture) {
            g.target[0].releaseCapture();
            g.target.off("mousemove").off("mouseup");
        } else {
            $(document).off("mousemove").off("mouseup");
        };
    },
    _whtl: function (dragIn) {
        if (dragIn == "body") {
            var doc = $(document);
            return { top: doc.scrollTop(), left: doc.scrollLeft(), width: document.documentElement.clientWidth, height: document.documentElement.clientHeight }
        } else {
            var w = $(dragIn).width();
            var h = $(dragIn).height();
            var offset = $(dragIn).position();
            return { top: offset.top, left: offset.left, width: w, height: h };
        };
    }
};
/* input */
aui.input = {
    number: {
        g: {},
        init: function (args) {
            var params = {
                id: Math.ceil(Math.random() * 100000000000).toString(),
                target: "",
                fixed: -1,
                min: false,
                max: false,
                keyup: function (g, which) {
                    if (ui.tool.array.is_in(which, [37, 38, 39, 40, 189, 190]) == -1) {
                        g.change(g);
                    }
                },
                change: function (gg) {
                    var val = $(gg.target).val();
                    if (isNaN(val)) { val = val.replace(/[^\d-]/g, "") }
                    val = Number(val);
                    if (gg.fixed != -1) {
                        val = val.toFixed(gg.fixed);
                    }
                    if (gg.min !== false) {
                        val = val > gg.min ? val : gg.min;
                    }
                    if (gg.max !== false) {
                        val = val < gg.max ? val : gg.max;
                    }
                    $(gg.target).val(val).change();
                }
            };
            var id = args.id != undefined ? args.id : params.id;
            this.g[id] = {};
            $.extend(this.g[id], params, args);
            this._on(id);
            return id;
        },
        _on: function (id) {
            var g = this.g[id];
            $(g.target).keyup(function (e) {
                if (!e.ctrlKey && !e.altKey && e.which != 116) {
                    e.preventDefault();
                    g.keyup(g, e.which);
                };
            }).blur(function () {
                g.change(g);
            });
        }
    },
    limit: {
        g: {},
        init: function (args) {
            var params = {
                id: Math.ceil(Math.random() * 100000000000).toString(),
                target: "",
                min: 0,
                max: 1000,
                length: 0,
                status: true,
                callback: function (g) { },
                keyup: function (g, which) {
                    if (ui.tool.array.is_in(which, [37, 38, 39, 40, 189, 190]) == -1) {
                        g.change(g);
                    }
                },
                change: function () {
                    var g = this;
                    var val = $(g.target).val();
                    g.length = val.length;
                    g.status = true;
                    if (g.min > g.length || g.max < g.length) {
                        g.status = false;
                    }
                    g.callback(g);
                }
            };
            var id = args.id != undefined ? args.id : typeof args.target == "string" ? args.target : params.id;
            this.g[id] = {};
            $.extend(this.g[id], params, args);
            this.g[id].min = parseInt(this.g[id].min);
            this.g[id].max = parseInt(this.g[id].max);
            this._on(id);
            return id;
        },
        _on: function (id) {
            var g = this.g[id];
            $(g.target).keyup(function (e) {
                if (!e.ctrlKey && !e.altKey && e.which != 116) {
                    e.preventDefault();
                    g.keyup(g, e.which);
                };
            }).blur(function () {
                g.change();
            });
        }
    }
};
/* grid */
aui.grid = {
    g: {},
    init: function (args) {
        var params = {
            id: Math.ceil(Math.random() * 100000000000).toString(),
            target: "",
            thead: "",
            evenCls: "gd-tr-even",
            hover: true,
            hoverCls: "gd-tr-hover",
            resize: true,
            resizeSpan: "pa-tr dib w5px h100 cursor-col-r",
            resizeDiv: "bgG2 w3px pa-tl zi3000 dn",
            resizeIndex: 0,
            resizeStart: 0,
            resizeEnd: 1,
            sort: false
        }
        var id = args.id != undefined ? args.id : params.id;
        this.g[id] = {};
        $.extend(this.g[id], params, args);
        if (this.g[id].thead == '') { this.g[id].thead = $(this.g[id].target).children('thead').children('tr').eq(0); };

        if (this.g[id].hover) { this._hover(id); };
        if (this.g[id].resize) { this._resize(id); };
        if (this.g[id].sort) { this._sort(id); };
        return id;
    },
    _hover: function (id) {
        var g = this.g[id];
        $(g.target).find('tbody tr').each(function (i) {
            if (i % 2 == 1) { $(this).addClass(g.evenCls); }
            $(this).hover(function () { $(this).addClass(g.hoverCls); }, function () { $(this).removeClass(g.hoverCls); })
        });
    },
    _resize: function (id) {
        var g = this.g[id];
        $(g.thead).find('th > div').each(function (i) {
            $(this).append('<span class="' + g.resizeSpan + '" jmark="' + i + '"></span>');
        });
        $('body').append('<div class="' + g.resizeDiv + '" id="J_resize_div_' + id + '"></div>');
        g.resizeDiv = $('#J_resize_div_' + id);
        $(g.thead).find('.cursor-col-r').each(function () {
            $(this).mousedown(function (e) {
                if (e.which == 1) {
                    aui.grid._resize_mouseDown(id, this);
                    return false;
                };
            });
        });
    },
    _resize_mouseDown: function (id, obj) {
        var g = this.g[id];
        var offset = $(obj).offset();
        g.resizeIndex = $(obj).attr('jmark');
        g.resizeStart = offset.left;
        $(g.resizeDiv).css({ "height": $(g.target).height(), "top": offset.top, "left": offset.left }).show();
        if (g.resizeDiv[0].setCapture) {
            g.resizeDiv[0].setCapture();
            g.resizeDiv.mousemove(function (e) { e.preventDefault(); aui.grid._resize_mouseMove(id, e); }).mouseup(function () { aui.grid._resize_mouseUp(id); });
        } else {
            $(document).mousemove(function (e) { e.preventDefault(); aui.grid._resize_mouseMove(id, e); }).mouseup(function () { aui.grid._resize_mouseUp(id); });
        };
    },
    _resize_mouseMove: function (id, e) {
        var g = this.g[id];
        g.resizeEnd = e.clientX - g.resizeStart;
        g.resizeDiv.css({ left: e.clientX });
    },
    _resize_mouseUp: function (id) {
        var g = this.g[id];
        if (g.resizeDiv[0].releaseCapture) {
            g.resizeDiv[0].releaseCapture();
            g.resizeDiv.off("mousemove").off("mouseup");
        } else {
            $(document).off("mousemove").off("mouseup");
        };
        g.resizeDiv.hide();
        $(g.thead).children('th').eq(g.resizeIndex).css({ "width": "+=" + g.resizeEnd });
    }
};
/* height */
aui.height = {
    auto: function (args) {
        var g = {
            target: '#J_body',
            siblings: ['#J_header', '#J_footer'],
            adjust: 0,
            resizeFn: function () { return true; }
        };
        $.extend(g, args);
        $(window).on('resize', function () {
            if (g.resizeFn() === false) { return false; };
            _auto();
        });
        function _auto() {
            $(g.target).css({ "height": "auto" });
            var autoHeight = $(g.target).height();
            var siblingsHeight = 0;
            for (var i = g.siblings.length; i--; ) {
                siblingsHeight += $(g.siblings[i]).outerHeight()
            }
            var lastheight = $(window).outerHeight() - siblingsHeight;
            var marginpadding = $(g.target).outerHeight() - autoHeight;
            var minusHeight = lastheight - marginpadding + g.adjust;
            minusHeight = minusHeight < autoHeight ? autoHeight : minusHeight;
            if (autoHeight < minusHeight) {
                $(g.target).height(minusHeight);
            };
        }
        _auto();
    }
};
/* image */
aui.image = {
    swiper: function (images, src, args) {
        ui.require.key(['swiper'], function () {
            var index = 0;
            if (typeof src != 'undefined') {
                src = typeof src == 'string' ? src : $(src).attr('src');
                index = ui.tool.array.is_in(src, images);
                index = index == -1 ? 0 : index;
            }
            var html = '<div class="image-swiper-c">';
            html += '<div class="swiper-container image-swiper-container"><div class="swiper-wrapper image-swiper-wrapper">';
            for (var i = 0, ii = images.length; i < ii; i++) {
                html += '<div class="swiper-slide image-swiper-slide">';
                html += '<img class="pa-cc" src="' + images[i] + '">';
                html += '</div>';
            }
            html += '</div></div>';
            html += '<div class="image-pagination"></div>';
            html += '</div>';
            var params = {
                html: html,
                maskCls: 'maskContent maskContent-N',
                afterCreate: function () {
                    var swiper = new Swiper('.image-swiper-container', {
                        initialSlide: index,
                        pagination: '.image-pagination',
                        loop: true,
                        grabCursor: true,
                        paginationClickable: true
                    });
                }
            };
            $.extend(params, args);
            aui.mask.init(params);
        });
    },
    load: function (url, fn) {
        var img = new Image();
        img.src = url;
        if (img.complete) {
            fn(img);
            return;
        }
        img.onload = function () {
            img.onload = null;
            fn(img);
        }
    }
};
/* mask */
aui.mask = {
    g: {},
    init: function (args) {
        var params = {
            id: Math.ceil(Math.random() * 100000000000).toString(),
            container: "body",
            closeBtn: false,
            html: '',
            url: '',
            index: 2500,
            coverCls: 'maskCover',
            maskCls: 'maskContent',
            target: false,
            cover: false,
            afterCreate: function () { },
            beforeClose: function () { },
            afterClose: function () { }
        }
        var id = args.id != undefined ? args.id : params.id;
        this.g[id] = {};
        $.extend(this.g[id], params, args);
        this._html(id);
        return id;
    },
    _html: function (id) {
        var g = this.g[id];
        var h = '<div id="J_maskCover' + id + '" class="' + g.coverCls + '" style="z-index:' + (g.index - 1) + ';"></div>';
        h += '<div id="J_mask' + id + '" class="' + g.maskCls + '" style="z-index:' + (g.index + 1) + ';">';
        h += '<div class="w100 h100 oya" id="J_maskContent' + id + '">';
        if (g.closeBtn) {
            h += '<div class="maskClose"><i id="J_maskClose" class="maskClose-btn" onclick="aui.mask.close(\'' + id + '\')"></i></div>';
        }
        if (g.html != '') {
            h += g.html;
        };
        if (g.url != '') {
            h += '<iframe class="w100 h100" frameborder="0" scrolling="0" src="' + g.url + '"></iframe>';
        };
        h += '</div>';
        h += '</div>';
        $(g.container).append(h);
        g.target = $("#J_mask" + id);
        g.cover = $("#J_maskCover" + id);
        if (!g.closeBtn) {
            g.cover.click(function () {
                aui.mask.close(id);
            });
        };
        g.afterCreate(g);
    },
    close: function (id) {
        if (id == undefined) { for (var i in this.g) { id = i; }; }
        var g = aui.mask.g[id];
        if (g == undefined || g.beforeClose(g) === false) { return false; };
        g.cover.remove();
        g.target.remove();
        g.afterClose(g);
        delete this.g[id];
    }
};
/* page */
aui.page = {
    g: {},
    init: function (target, args, fn) {
        if (args == undefined || args == "" || args.total == 0) { $(target).html(''); return false; };
        var params = {
            id: Math.ceil(Math.random() * 100000000000).toString(),
            target: target,
            total: 0,
            rows: 10,
            page: 1,
            pages: 1,
            callback: function (g) { fn(g); }
        }
        var id = params.id;
        this.g[id] = {};
        $.extend(this.g[id], params, args);
        var g = this.g[id];
        g.target = $(g.target);
        g.total = parseInt(g.total);
        g.rows = parseInt(g.rows);
        g.page = parseInt(g.page);
        g.pages = Math.ceil(g.total / g.rows);
        aui.page._html(id);
        return id;
    },
    _html: function (id) {
        var g = this.g[id];
        var html = [
					'<div class="J_page_jump fr dib f12 cp w60px h25px lh25 tc cW bgGreen2 bG-trb bGreen b-radius5-tr b-radius5-br">跳转</div>',
					'<div class="J_page_input fr dib w60px bgW h25px bG-tbl bGreen b-radius5-tl b-radius5-bl">',
						'<input class="J_page_value bN bgN lh25 w50px tc cG4" type="text" value="',g.page,'">',
					'</div>',
					'<div class="fr p50-r">',
						'<div class="J_page_prev dib w20px h25px btn-green tc p3-r vm">',
							'<i class="dib i-triangle10W-l"></i>',
						'</div>',
						'<div class="dib p10-rl cG4 lh25 vm"><span class="J_page_current dib p10-rl">', g.page, '</span><span class="dib p10-rl">/</span><span class="J_page_total dib p10-rl">', g.pages, '</span></div>',
						'<div class="J_page_next dib w20px h25px btn-green tc p3-l vm">',
							'<i class="dib i-triangle10W-r"></i>',
						'</div>',
					'</div>'
    	          ].join('');
        g.target.html(html);
        //
        g.target.find('.J_page_prev').click(function () {
            g.page = g.page - 1;
            if (g.page < 1) {
                g.page = 1;
                return false;
            }
            aui.page.click(id);
        })
        g.target.find('.J_page_next').click(function () {
            g.page = g.page + 1;
            if (g.page > g.pages) {
                g.page = g.pages;
                return false;
            }
            aui.page.click(id);
        });
        aui.input.number.init({
            target: g.target.find('.J_page_value'),
            min: 1,
            max: g.pages,
            fixed: 0
        });
        g.target.find('.J_page_jump').click(function () {
            g.page = g.target.find('.J_page_value').val();
            aui.page.click(id);
        });
        g.target.find('.J_page_value').keyup(function (e) {
            if(e.which==13){
            	g.target.find('.J_page_jump').click();
            }
        }).focus(function(){
        	$(this).removeClass('cG4');
        	$(this).val('');
        	
        }).blur(function(){
        	$(this).addClass('cG4');
        });
    },
    click: function (id) {
        var g = this.g[id];
        g.callback(g);
    }
};
/* scroll */
aui.scroll = {
    independent: function (target) {
        ui.require.key(['mousewheel'], function () {
            $(target).mousewheel(function (event, delta) {
                var st = $(target).scrollTop();
                st = st - 40 * delta;
                $(target).scrollTop(st);
                return false;
            });
        })
    }
};
/* select */
aui.select = {
    g: {},
    init: function (args) {
        var params = {
            id: '',
            value: '',
            values: {},
            url: '',
            target: {},
            targethtml: '<a class="select-arrow-b-a J_class" href="javascript:;" id="J_target"><span class="vm" id="J_target_txt"></span><i class="select-arrow-b"></i></a>',
            targetclass: {},
            handleclass: [],
            handlehtml: function (json) {
                var html = '';
                for (var j in json) {
                    html += '<a class="dib p5 aG m5 tc" data-value="' + j + '" href="javascript:;">' + json[j] + '</a>';
                }
                return html;
            },
            track: true,
            type: 'inside',
            horizontal: 'center',
            vertical: 'bottom',
            left: [],
            top: [],
            delayHide: 400,
            beforeShow: function () { }, //(g)
            beforeClick: function () { }, //(g, value, txt)
            afterClick: function () { }, //(g, value, txt)
            afterShow: function () { },
            afterHide: function () { },
            _toggleArgs: {},
            _current: { target: '', value: '', data: {} }
        };
        var id = args.id;
        this.g[id] = {};
        $.extend(this.g[id], params, args);
        //
        var g = this.g[id];
        g.id = $(g.id);
        g.rank = {};
        g.relation = {};
        g.key = [];
        var i = 0;
        var _k = '';
        for (var k in g.target) {
            if (_k != '') { g.relation[_k] = k; }
            g.key.push(k);
            g.rank[k] = i;
            g.values[k] = '';
            _k = k;
            i++;
        };
        if (typeof g.value == "object") {
            g._current.value = g.value[0];
            aui.select._init(g, 0);
            aui.select._ajax(g, function () {
                g.afterClick(g);
            });
            for (var i = 0; i < g.value.length - 1; i++) {
                if (g.value[i + 1] == '') { continue; }
                var k = g.key[i];
                var tid = g._toggleArgs[k];
                aui.select._html(aui.toggle.g[tid], g, k);
                aui.toggle.g[tid].target.children('[data-value="' + g.value[i + 1] + '"]').click();
            }
        } else {
            g._current.value = g.value;
            aui.select._init(g, 0);
        }
        return this.g[id];
    },
    reset: function (id, value, show) {
        var g = this.g[id];
        for (var k in g.target) { g.values[k] = ''; };
        g._current.value = value;
        aui.select._init(g, 0);
        if (show === true) {
            var k = g.key[0];
            var tid = g._toggleArgs[k];
            aui.toggle.g[tid].handle.click();
        }
    },
    _init: function (g, i) {
        var k = g.key[i];
        var _k = '#' + k;
        g._current.target = k;
        var select = g.targethtml.replace(/J_target/g, k).replace(/J_class/g, g.targetclass[i]);
        if (i == 0) { g.id.html(select); } else { $('#' + g.key[i - 1]).after(select); }
        $(_k).data("current", { "target": g._current.target, "value": g._current.value });
        $(_k + '_txt').html(g.target[k]);
        g._toggleArgs[k] = aui.toggle.init({
            handle: _k,
            target: _k + '_select',
            track: true,
            horizontal: g.horizontal,
            vertical: g.vertical,
            left: g.left[i],
            top: g.top[i],
            delayHide: g.delayHide,
            targethtml: '<div class="select-bg-loading ' + g.handleclass[i] + '" id="' + k + '_select"></div>',
            type: g.type,
            beforeShow: function (args) {
                var current = args.handle.data('current');
                g._current.value = current.value;
                g._current.target = current.target;
                for (var j in g.rank) {
                    if (j != k) {
                        $('#' + j + '_select').hide();
                    }
                };
                return g.beforeShow(g);
            },
            afterShow: function (args) {
                aui.select._ajax(g, function () {
                    aui.select._html(args, g, k);
                });
            },
            afterHide: function (args) {
                g.afterHide(args);
            }
        });
    },
    _ajax: function (g, fn) {
        ui.ajax(g.url, function (json) {
            g._current.data = json;
            fn(g);
        }, 'POST', { "id": g._current.value }, 'json', { "ajaxloading": false, "cachekey": "J_select_" + g._current.value });
    },
    _html: function (args, g, k) {
        if (k == undefined) { return false; }
        var json = g._current.data;
        if (json == '') { return false; };
        var tid = g._toggleArgs[k];
        var _k = '#' + k;
        $(_k).data("current", { "target": g._current.target, "value": g._current.value }).show();
        var html = g.handlehtml(json);
        args.target.html(html);
        if (args.type == 'inside' && $(window).width() > 640) {
            args.target.stop().animate({ "left": $(_k).position().left });
        }
        var animateleft = args.target.width() + args.target.offset().left - $(window).width();
        if (animateleft > 0) {
            args.target.stop().animate({ "left": 0 });
        };

        g.afterShow(g, tid);
        args.target.removeClass('select-bg-loading');
        args.target.children().each(function () {
            $(this).click(function () {
                var dataval = $(this).data('value');
                var txt = $(this).html();
                for (var j in g.rank) {
                    if (g.rank[j] > g.rank[k]) {
                        $('#' + j + '_txt').html(g.target[j]);
                        $('#' + j).hide();
                        g.values[j] = '';
                    };
                };
                $(_k + '_txt').html(txt);
                g._current.value = dataval;
                if (g.beforeClick(g, this) === false) { return false; }
                g.values[k] = g._current.value;
                if (g.relation[k] == undefined) {
                    $('.select-handel-c').hide();
                    return false;
                }
                g._current.target = g.relation[k];
                aui.select._ajax(g, function () {
                    if (g.afterClick(g, this) === false) { return false; }
                    if (g._current.data.length != 0 && $('#' + g._current.target).length == 0) {
                        aui.select._init(g, g.rank[g._current.target]);
                    };
                    aui.select._html(args, g, g._current.target);
                    if (args.type == 'inside') {
                        args.target.animate({ "top": $('#' + g._current.target).position().top + $('#' + g._current.target).outerHeight() + 5 });
                    };
                });
            });
        })
    }
};
aui.selectajax = {
    g: {},
    on: function (args) {
        var params = {
            id: Math.ceil(Math.random() * 100000000000).toString(),
            name: {},
            url: '',
            cls: [],
            data: {},
            remove: [],
            params: function (g) { return g.data; },
            callback: function () { },
            _current: '',
            _val: ''
        };
        var id = params.id;
        this.g[id] = {};
        $.extend(this.g[id], params, args);
        var g = this.g[id];
        g.relation = {};
        g.key = [];
        var i = 0;
        var _k = '';
        for (var k in g.name) {
            if (_k != '') { g.relation[_k] = k; }
            g.key.push(k);
            _k = k;
            i++;
        };
        for (var i = 0; i < g.key.length; i++) {
            g.remove[i] = true;
            if ($('#J_' + g.key[i]).length != 0) {
                aui.selectajax._ajax(g, i);
                g.remove[i] = false;
            }
        };
        return this.g[id];
    },
    _ajax: function (g, i) {
        var k = g.key[i];
        var k2 = g.key[i + 1];
        $('#J_' + k).change(function () {
            g._current = k;
            g._val = $(this).val();
            if (g._val == '') {
                aui.selectajax.reset(g, i);
            } else {
                if (k2 != undefined) {
                    g.data.id = g._val;
                    g.data = g.params(g);
                    ui.ajax(g.url, function (json) {
                        //根据后台提供数据重新修改
                        if (json.success) {
                            if ($('#J_' + k2).length == 0) {
                                var cls = typeof g.cls == "object" ? g.cls[i] : g.cls;
                                $('#J_' + g._current).after('<select class="' + cls + '" id="J_' + k2 + '" name="' + k2 + '"></select>');
                                aui.selectajax._ajax(g, i + 1);
                            };
                            var option = '<option value="">' + g.name[k2] + '</option>';
                            //重新修改
                            for (var j = 0, jj = json.data.length; j < jj; j++) {
                                var a = json.data[j];
                                option += '<option value="' + a.id + '">' + a.name + '</option>';
                            };
                            $('#J_' + k2).html(option);
                        }
                    }, 'POST', g.data, 'json', { "cachekey": k + g._val, "ajaxloading": true });
                }
            };
            g.callback(g);
        });
    },
    reset: function (g, i) {
        for (var j = i + 1; j < g.key.length; j++) {
            if (g.remove[i]) {
                $('#J_' + k).remove();
            } else {
                var k = g.key[j];
                $('#J_' + k).html('<option value="">' + g.name[k] + '</option>');
            }
        };
    }
};
/* toggle */
aui.toggle = {
    g: {},
    init: function (args) {
        var params = {
            id: Math.ceil(Math.random() * 100000000000).toString(),
            target: "",
            handle: "",
            targethtml: "",
            type: 'inside',
            mode: "click",
            timeoutId: 0,
            delayShow: null,
            delayHide: 400,
            hover: true,
            track: false,
            animate: '',
            animateShow: 'fast',
            animateHide: 'fast',
            beforeShow: function () { },
            afterShow: function () { },
            beforeHide: function () { },
            afterHide: function () { },
            callback: function () { }
        };
        var id = args.id != undefined ? args.id : params.id;
        this.g[id] = {};
        $.extend(this.g[id], params, args);
        this.g[id].handle = $(this.g[id].handle);
        if (this.g[id].targethtml != '') {
            if (this.g[id].type == 'inside') { this.g[id].handle.parent().append(this.g[id].targethtml); }
            if (this.g[id].type == 'outside') { $('body').append(this.g[id].targethtml); }
        };
        //此处一定在targethtml下方
        this.g[id].target = $(this.g[id].target);
        switch (this.g[id].mode) {
            case "hover": this._hover(id); break;
            case "click": this._click(id); break;
            case "focus": this._focus(id); break;
        };
        this.g[id].callback(this.g[id]);
        return id;
    },
    _hover: function (id) {
        var g = this.g[id];
        g.handle.hover(function () {
            clearTimeout(g.timeoutId); if (g.delayShow != undefined) { g.timeoutId = setTimeout("aui.toggle.show('" + id + "')", g.delayShow); } else { aui.toggle.show(id) };
        }, function () {
            clearTimeout(g.timeoutId); g.timeoutId = setTimeout("aui.toggle.hide('" + id + "')", g.delayHide);
        });
        if (g.hover) {
            g.target.hover(function () { clearTimeout(g.timeoutId); }, function () { g.timeoutId = setTimeout("aui.toggle.hide('" + id + "')", g.delayHide); });
        };
    },
    _click: function (id) {
        var g = this.g[id];
        g.handle.click(function () {
            if (g.target.is(':visible')) {
                aui.toggle.hide(id);
            } else {
                clearTimeout(g.timeoutId); if (g.delayShow != undefined) { g.timeoutId = setTimeout("aui.toggle.show('" + id + "')", g.delayShow); } else { aui.toggle.show(id) };
            };
        });
        if (g.hover) {
            g.target.hover(function () { clearTimeout(g.timeoutId); }, function () { g.timeoutId = setTimeout("aui.toggle.hide('" + id + "')", g.delayHide); });
        }
    },
    _focus: function (id) {
        var g = this.g[id];
        g.handle.focus(function () {
            clearTimeout(g.timeoutId); if (g.delayShow != undefined) { g.timeoutId = setTimeout("aui.toggle.show('" + id + "')", g.delayShow); } else { aui.toggle.show(id) };
        }).blur(function () {
            clearTimeout(g.timeoutId); g.timeoutId = setTimeout("aui.toggle.hide('" + id + "')", g.delayHide);
        });
    },
    show: function (id) {
        var g = this.g[id];
        switch (g.animate) {
            case "slide": if (g.beforeShow(g) === false) { return false; }; g.target.slideDown(g.animateShow, function () { g.afterShow(g); }); break;
            case "fade": if (g.beforeShow(g) === false) { return false; }; g.target.fadeIn(g.animateShow, function () { g.afterShow(g); }); break;
            default: if (g.beforeShow(g) === false) { return false; }; g.target.fadeIn(g.animateShow, function () { g.afterShow(g); }); break;
        };
        if (g.track) { aui.track.lock(g); };
    },
    hide: function (id) {
        var g = this.g[id];
        switch (g.animate) {
            case "slide": if (g.beforeHide(g) === false) { return false; }; g.target.slideUp(g.animateHide, function () { g.afterHide(g); }); break;
            case "fade": if (g.beforeHide(g) === false) { return false; }; g.target.fadeOut(g.animateHide, function () { g.afterHide(g); }); break;
            default: if (g.beforeHide(g) === false) { return false; }; g.target.hide(); g.afterHide(g); break;
        };
    }
};
/* track */
aui.track = {
    lock: function (args) {
        var g = {
            target: '',
            handle: '',
            type: 'inside',
            horizontal: 'left',
            vertical: 'bottom',
            left: 0,
            top: 0,
            width: 0,
            height: 0
        };

        $.extend(g, args);
        g.p = g.type == 'inside' ? $(g.handle).position() : $(g.handle).offset();
        g.h_w = $(g.handle).outerWidth();
        g.h_h = $(g.handle).outerHeight();
        g.t_w = $(g.target).outerWidth();
        g.t_h = $(g.target).outerHeight();
        if (typeof g.left == 'string') {
            var _p = $(g.left).offset().left + $(g.left).width() / 2;
            var _c = $(g.handle).offset().left + g.h_w / 2;
            g.left = _p - _c;
        }
        var whtl = {
            "min-width": '+=' + g.width + 'px',
            "min-height": '+=' + g.height + 'px',
            "top": _position_y() + g.top,
            "left": _position_x() + g.left
        }
        $(g.target).css(whtl).show();
        function _position_x() {
            var v = 0;
            switch (g.horizontal) {
                case "left": v = g.p.left; break;
                case "center": v = g.p.left + g.h_w / 2 - g.t_w / 2; break;
                case "right": v = g.p.left - (g.t_w - g.h_w); break;
            }
            return v;
        };
        function _position_y() {
            var v = 0;
            switch (g.vertical) {
                case "top": v = g.p.top - g.h_h; break;
                case "middle": v = g.p.top + g.h_h / 2 - g.t_h / 2; break;
                case "bottom": v = g.p.top + g.h_h; break;
            }
            return v;
        }
    }
};
/* time */
aui.time = {
    countdown: {
        g: {},
        init: function (args) {
            var params = {
                id: Math.ceil(Math.random() * 100000000000).toString(),
                target: "",
                time: "",
                cls: ['dib p3-rl', 'dib p3-rl', 'dib p3-rl', 'dib p3-rl'],
                text: ['天', '时', '分', '秒'],
                timeid: 0,
                callback: function () { }
            }
            var id = args.id != undefined ? args.id : params.id;
            this.g[id] = {};
            $.extend(this.g[id], params, args);
            var g = this.g[id];
            if (typeof g.time != "object") {
                var time = parseInt(g.time);
                if (time <= 0) { return false; }

                var s = 1000, m = s * 60, h = m * 60, d = h * 24;
                g.time = [];
                g.time[0] = Math.floor(time / d);
                g.time[1] = Math.floor((time - g.time[0] * d) / h);
                g.time[2] = Math.floor((time - g.time[0] * d - g.time[1] * h) / m);
                g.time[3] = Math.floor((time - g.time[0] * d - g.time[1] * h - g.time[2] * m) / s);
            }
            g.timeid = setInterval(function () {
                aui.time.countdown._change(id, 'second');
            }, 1000);
            return id;
        },
        _html: function (id) {
            var g = this.g[id];
            var html = '';
            for (var i = 0, ii = g.time.length; i < ii; i++) {
                var show = true;
                var hide = true;
                for (var j = 0, jj = i; j <= jj; j++) {
                    if (g.time[j] != 0) { hide = false; }
                }
                if (hide) { show = false; }
                if (show) {
                    html += '<span class="' + g.cls[i] + '">' + this._str(g.time[i]) + '</span><span class="' + g.cls[i] + '">' + g.text[i] + '</span>';
                };
            }
            $(g.target).html(html);
        },
        _change: function (id, type) {
            var g = this.g[id];
            if (type == "second") {
                if (g.time[3] == 0) {
                    this._change(id, "mini");
                }
                else {
                    g.time[3] -= 1;
                }
            };
            if (type == "mini") {
                if (g.time[2] == 0) {
                    this._change(id, "hour");
                }
                else {
                    g.time[2] -= 1;
                    g.time[3] = 59;
                }
            };
            if (type == "hour") {
                if (g.time[1] == 0) {
                    this._change(id, "day");
                }
                else {
                    g.time[1] -= 1;
                    g.time[2] = 59;
                }
            };
            if (type == "day") {
                if (g.time[0] == 0 && g.time[1] == 0 && g.time[2] == 0 && g.time[3] == 0) {
                    g.callback(g);
                }
                else {
                    g.time[0] -= 1;
                    g.time[1] = 23;
                    g.time[2] = 59;
                    g.time[3] = 59;
                }
            };
            this._html(id);
        },
        _str: function (val) {
            return val < 10 ? "0" + val : val.toString();
        }
    }
};
/* validate */
aui.validate = {
    not_empty: function (kv, target) {
        var error = '';
        for (var i in kv) {
            var v = '';
            if (typeof target == 'string') {
                v = $.trim($(target).find(i).val());
            } else {
                v = target[i];
            }
            if (v == '') { error += kv[i]; continue; };
        }
        if (error == '') { return true; } else { return error; }
    },
    is_email: function (val) {
        var regx = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        return regx.test(val);
    },
    is_mobile: function (val) {
        var regx = /^1\d{10}$/;
        return regx.test(val);
    },
    is_url: function (val) {
        var regx = /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
        return regx.test(val);
    },
    is_date: function (val) {
        return !/Invalid|NaN/.test(new Date(val).toString());
    },
    is_number: function (val) {
        var regx = /^\d+$/;
        return regx.test(val);
    },
    is_idcard: function (val, minYear, maxYear) {
        var rt = _check(val);
        var error = '';
        if (rt === true) {
            return true;
        } else {
            switch (rt) {
                case 1: error = "不是数字信息"; break;
                case 2: error = "位数不正确"; break;
                case 3: error = "年份不正确"; break;
                case 4: error = "日期不正确"; break;
                case 5: error = "末尾校验码不正确"; break;
            };
            return "身份证号" + error;
        }
        function _check(val) {//判断居民身份证号输入是否正确
            var length = val.length;
            var lastword = val.charAt(length - 1);
            for (var i = 0; i < length - 1; i++) { var c = val.charAt(i); if (c > "9" || c < "0") { return 1; } };
            if (length != 18) { return 2; }
            //if (length != 15 && length != 18) { return 2; }
            //if (length == 15) { var s1 = val.substring(0, 6); var s2 = "19" + val.substring(6, 15) + "0"; val = s1 + s2; };
            var year = isYearValid(parseInt(val.substring(6, 10)));
            if (year == -1) { return 3; };
            var month = parseFloat(val.substring(10, 12));
            var day = isDayValid(year, month, parseInt(val.substring(12, 14)));
            if (day == -1) { return 4; }
            if ((lastword > "9" || lastword < "0") && lastword != "X" && lastword != "x") { return 5; };
            return true;
        }
        function isYearValid(year) { //判断居民身份证号年份的合法性
            var retyear = year;
            if (minYear == undefined) { minYear = 1900; }
            if (maxYear == undefined) { maxYear = 2100; }
            if (year == 0 || year < minYear || year > maxYear) retyear = -1;
            return retyear;
        }
        function isDayValid(year, month, day) {//判断日期和月份的合法性
            var retday = day;
            if (day < 1 || day > 31 || month < 1 || month > 12) {
                retday = -1;
            }
            else {
                if (day == 31 && (month == 2 || month == 4 || month == 6 || month == 9 || month == 11)) {
                    retday = -1;
                }
                else {
                    if (month == 2 && day > 28 && !(day == 29 && year % 4 == 0 && (year % 100 !== 0 || year % 400 == 0))) {
                        retday = -1;
                    }
                }
            }
            return retday;
        }
    }
}

