PTM_RATIO = 32;
RADIAN_TO_DEGREE = 180 / Math.PI;
DEGREE_TO_RADIAN = Math.PI / 180;
IMAGE_TYPES = [".png", ".jpg", ".bmp", ".jpeg", ".gif"];
SOUND_TYPES = [".mp3", ".ogg", ".wav", ".mp4", ".m4a"];
DEFAULT_SOUNDS_FOLDER = "res/music/";
H_ALIGHS = ["left", "center", "right"];
RESET_FRAME_ON_RECYCLE = !0;
var TileValue = TileValue || {
    WALKABLE: 0,
    BLOCK1: 1,
    BLOCK2: 2,
    BLOCK3: 3,
    BLOCK4: 4,
    BLOCK5: 5
},
flax = flax || {};
window.flax = flax;
flax.version = 2.45;
flax.gameVersion = 0;
flax.minToolVersion = 2;
flax.languages = "zh en de fr it es tr pt ru".split(" ");
flax.landscape = !1;
flax.stageRect = null;
flax.designedStageSize = null;
flax.osVersion = "unknown";
flax.assetsManager = null;
flax.inputManager = null;
flax.mousePos = null;
flax.currentSceneName = null;
flax.currentScene = null;
flax.prevSceneName = null;
flax.buttonSound = null;
flax.frameInterval = 1 / 60;
flax.pointZero = {
    x: 0,
    y: 0
};
flax._scenesDict = {};
flax._soundEnabled = !0;
flax._inited = !1;
flax._orientationTip = null;
flax.onDeviceRotate = null;
flax.onScreenResize = null;
flax.onSceneExit = null;
flax.onSceneEnter = null;
flax._addResVersion = function(a) {
    return cc.sys.isNative || "string" != typeof a || flax.isSoundFile(a) || -1 < a.indexOf("?v\x3d") ? a: a + "?v\x3d" + (flax.gameVersion || cc.game.config.version)
};
flax._removeResVersion = function(a) {
    if (cc.sys.isNative || "string" != typeof a || flax.isSoundFile(a)) return a;
    var b = a.indexOf("?v\x3d"); - 1 < b && (a = a.substr(0, b));
    return a
};
flax.isDomainAllowed = function() {
    if (cc.sys.isNative) return ! 0;
    var a = document.domain,
    b = cc.game.config.domainAllowed;
    return flax.isLocalDebug() || null == b || 0 == b.length || -1 < b.indexOf(a)
};
flax.isLocalDebug = function() {
    if (cc.sys.isNative) return ! 1;
    var a = document.domain;
    return "localhost" == a || 0 == a.indexOf("192.168.")
};
if (!cc.sys.isNative && (flax.isLocalDebug() && (flax.gameVersion = 1 + Math.floor(999998 * Math.random())), setTimeout(function() {
    var a = document.body.style.backgroundColor,
    b = null;
    null === cc.game.config || void 0 === cc.game.config ? console.log('---"Flax.js:cc.game" has no "config" property at present! No influence!!!---') : (b = document.getElementById(cc.game.config.id), b.style.backgroundColor = a);
    a = a.replace("rgb(", "");
    a = a.replace(")", "");
    a = a.split(",");
    flax.bgColor = cc.color(parseInt(a[0]), parseInt(a[1]), parseInt(a[2]))
},
0.01), cc.sys.isMobile)) {
    var __hideBottomBar = function() {
        document.body.scrollTop = 0
    },
    orientationEvent = "onorientationchange" in window ? "orientationchange": "resize";
    window.addEventListener(orientationEvent, __hideBottomBar, !0);
    __hideBottomBar()
}
flax.init = function(a, b, c) {
    if (!flax._inited) {
        flax._inited = !0;
        console.log("Flax inited, version: " + flax.version);
        null == a && (a = cc.sys.isMobile ? cc.ResolutionPolicy.NO_BORDER: cc.ResolutionPolicy.SHOW_ALL);
        flax.language && flax.language.init();
        flax.fetchUserData && flax.fetchUserData(b);
        flax._checkOSVersion();
        b = c ? c.width: cc.game.config.width;
        c = c ? c.height: cc.game.config.height;
        if (!b || !c) throw "Please set the game width and height in the project.json!";
        if (cc.sys.isNative) cc.view.setDesignResolutionSize(b, c, a);
        else {
            var d = document.getElementById(cc.game.config.id);
            d.width = b = b || d.width;
            d.height = c = c || d.height;
            cc.view.adjustViewPort(!0);
            cc.view.setDesignResolutionSize(b, c, a);
            cc.view.resizeWithBrowserSize(!0)
        }
        flax.designedStageSize = cc.size(b, c);
        flax.frameInterval = 1 / cc.game.config.frameRate;
        flax.assetsManager = flax.AssetsManager.create();
        flax.stageRect = cc.rect(cc.visibleRect.bottomLeft.x, cc.visibleRect.bottomLeft.y, cc.visibleRect.width, cc.visibleRect.height);
        flax.onDeviceRotate = new signals.Signal;
        flax.onScreenResize = new signals.Signal;
        flax.onSceneExit = new signals.Signal;
        flax.onSceneEnter = new signals.Signal;
        cc.sys.isNative || window.addEventListener("resize",
        function() {
            flax.stageRect = cc.rect(cc.visibleRect.bottomLeft.x, cc.visibleRect.bottomLeft.y, cc.visibleRect.width, cc.visibleRect.height);
            flax.onScreenResize.dispatch()
        },
        !1)
    }
};
flax.createDisplay = function(a, b, c, d, e) {
    return flax.assetsManager.createDisplay(a, b, c, d, e)
};
flax.addListener = function(a, b, c, d) {
    flax.inputManager.addListener(a, b, c, d)
};
flax.removeListener = function(a, b, c) {
    flax.inputManager.removeListener(a, b, c)
};
flax.addModule = function(a, b, c) {
    if (null == b) throw "Module can not be null!";
    for (var d in b) if (0 == d.indexOf("on")) {
        var e = "__" + d,
        f = e + "Num";
        void 0 === a.prototype[f] ? a.prototype[f] = 0 : a.prototype[f]++;
        a.prototype[e + a.prototype[f]] = b[d]
    } else ! 0 !== c && a.prototype[d] || (e = b[d], !e || "function" !== typeof e.get && "function" !== typeof e.set ? a.prototype[d] = e: "function" === typeof e.clone ? a.prototype[d] = e.clone() : Object.defineProperty(a.prototype, d, e))
};
flax.callModuleFunction = function(a, b, c) {
    b = "__" + b;
    var d = a[b + "Num"];
    if (void 0 !== d) for (; 0 <= d;) a[b + d](c),
    d--;
    else if (a[b]) a[b](c)
};
flax.callModuleOnEnter = function(a) {
    flax.callModuleFunction(a, "onEnter")
};
flax.callModuleOnExit = function(a) {
    flax.callModuleFunction(a, "onExit")
};
flax._checkOSVersion = function() {
    if (!cc.sys.isNative) {
        var a = navigator.userAgent,
        b;
        a.match(/iPad/i) || a.match(/iPhone/i) || a.match(/iPod/i) ? (b = a.indexOf("OS "), cc.sys.os = cc.sys.OS_IOS, -1 < b && (flax.osVersion = a.substr(b + 3, 3).replace("_", "."))) : a.match(/Android/i) && (b = a.indexOf("Android "), cc.sys.os = cc.sys.OS_ANDROID, -1 < b && (flax.osVersion = a.substr(b + 8, 3)))
    }
};
flax.registerScene = function(a, b, c) {
    c || (c = []);
    c instanceof Array || (c = [c]);
    flax._scenesDict[a] = {
        scene: b,
        res: c
    }
};
flax.replaceScene = function(a, b, c) {
    if (flax.isDomainAllowed()) {
        flax.currentSceneName && flax.onSceneExit.dispatch(flax.currentSceneName);
        flax.ObjectPool && flax.ObjectPool.release();
        flax.BulletCanvas && flax.BulletCanvas.release();
        cc.director.resume();
        flax.prevSceneName = flax.currentSceneName;
        flax.currentSceneName = a;
        flax.stopPhysicsWorld && flax.stopPhysicsWorld();
        flax.inputManager && flax.inputManager.removeFromParent();
        flax.clearDraw && flax.clearDraw(!0);
        var d = flax._scenesDict[a];
        if (null == d) throw "Please register the scene: " + a + " firstly!";
        flax.language && flax.language.checkRes(d.res);
        if (flax._fontResources) for (var e in flax._fontResources) d.res.push({
            type: "font",
            name: e,
            srcs: flax._fontResources[e]
        });
        flax.preload(d.res,
        function() {
            if (flax.language) flax.language.onLoaded(d.res);
            if (flax._fontResources) {
                for (var a = d.res.length; a--;)"object" == typeof d.res[a] && d.res.splice(a, 1);
                flax._fontResources = null
            }
            flax.currentScene = new d.scene;
            a = !1;
            if (b) {
                if (!c || 0 > c) c = 0.5;
                var e = b.create(c, flax.currentScene);
                e && (a = !0, cc.director.runScene(e))
            }
            a || cc.director.runScene(flax.currentScene);
            flax.inputManager = new flax.InputManager;
            flax.currentScene.addChild(flax.inputManager, 999999);
            flax._checkDeviceOrientation();
            flax.onSceneEnter.dispatch(flax.currentSceneName)
        })
    }
};
flax.refreshScene = function() {
    flax.currentSceneName && flax.replaceScene(flax.currentSceneName)
};
flax._soundResources = {};
flax.preload = function(a, b, c, d) {
    if (null != a && 0 != a.length) {
        "string" === typeof a && (a = [a]);
        for (var e = !1,
        f = [], g = a.length; g--;) {
            var k = a[g];
            if (null == k) throw "There is a null resource!";
            if (null == cc.loader.getRes(k) && null == flax._soundResources[k]) if ("string" != typeof k || ".flax" != cc.path.extname(k) || !cc.sys.isNative && !1 !== cc.game.config.useFlaxRes) e = !0,
            f.unshift(flax._addResVersion(k));
            else {
                cc.sys.isNative && cc.log("***Warning: .flax is not support JSB for now, use .plist + .png insteadly!");
                var m = cc.path.changeBasename(k, ".plist"),
                k = cc.path.changeBasename(k, ".png");
                null == cc.loader.getRes(k) && (f.unshift(flax._addResVersion(m)), f.unshift(flax._addResVersion(k)), e = !0)
            }
        }
        if (e) {
            var n = flax.nameToObject(cc.game.config.preloader || "flax.Preloader"); ! 0 === c && (n = flax.ResPreloader);
            n = new n;
            n.initWithResources(f,
            function() { ! 0 === c && (flax.inputManager.removeMask(n), n.removeFromParent());
                if (!cc.sys.isNative) for (var a = f.length; a--;) {
                    var e = f[a];
                    flax.isSoundFile(e) && (flax._soundResources[e] = "loaded");
                    var g = cc.loader.getRes(e);
                    if (g) {
                        var k = flax._removeResVersion(e);
                        cc.loader.cache[k] = g;
                        flax.isImageFile(k) && cc.sys.capabilities.opengl && cc.textureCache.handleLoadedTexture(k);
                        cc.loader.release(e)
                    }
                }
                b.apply(d)
            }); ! 0 === c ? (flax.currentScene.addChild(n, 999999), flax.inputManager.addMask(n)) : cc.director.runScene(n);
            return n
        }
    }
    b.apply(d)
};
flax.setSoundEnabled = function(a) {
    if (flax._soundEnabled != a) {
        flax._soundEnabled = a;
        var b = cc.audioEngine;
        a ? (b.resumeMusic(), flax._lastMusic && (flax.playMusic(flax._lastMusic, !0), flax._lastMusic = null)) : (b.pauseMusic(), b.stopAllEffects())
    }
};
flax.getSoundEnabled = function() {
    return flax._soundEnabled
};
flax._lastMusic = null;
flax.playMusic = function(a, b, c) {
    var d = cc.audioEngine;
    d.stopMusic(!0 === c);
    flax._soundEnabled ? d.playMusic(a, b) : flax._lastMusic = a
};
flax.stopMusic = function(a) {
    cc.audioEngine.stopMusic(!0 === a)
};
flax.pauseMusic = function() {
    cc.audioEngine.pauseMusic()
};
flax.resumeMusic = function() {
    cc.audioEngine.resumeMusic()
};
flax.playEffect = function(a) {
    if (flax._soundEnabled) return cc.audioEngine.playEffect(a)
};
flax.stopEffect = function(a) {
    var b = cc.audioEngine;
    null != a ? b.stopEffect(a) : b.stopAllEffects()
};
flax.playSound = function(a) {
    return flax.playEffect(a)
};
flax._checkDeviceOrientation = function() {
    if (!cc.sys.isNative) {
        if (!flax._orientationTip && cc.sys.isMobile) {
            if (cc.game.config.rotateImg) {
                flax._orientationTip = cc.LayerColor.create(flax.bgColor, cc.visibleRect.width + 10, cc.visibleRect.height + 10);
                var a = new cc.Sprite(cc.game.config.rotateImg);
                a.setPosition(cc.visibleRect.center);
                flax._orientationTip.__icon = a;
                flax._orientationTip.addChild(a)
            }
            window.addEventListener("onorientationchange" in window ? "orientationchange": "resize", flax._showOrientaionTip, !0);
            flax._showOrientaionTip()
        }
        flax._orientationTip && (flax._orientationTip.removeFromParent(), flax.currentScene.addChild(flax._orientationTip, Number.MAX_VALUE))
    }
};
flax._oldGamePauseState = !1;
flax._showOrientaionTip = function() {
    var a = 90 == Math.abs(window.orientation),
    b = cc.game.config.landscape;
    flax._orientationTip && (flax._orientationTip.visible = b != a, flax._orientationTip.__icon.rotation = a ? -90 : 0, document.body.scrollTop = 0, flax._orientationTip.visible ? (flax.landscape != a && (flax._oldGamePauseState = cc.director.isPaused()), cc.director.pause()) : flax._oldGamePauseState || cc.director.resume(), flax.inputManager.enabled = !flax._orientationTip.visible);
    flax.landscape = a;
    flax.onDeviceRotate.dispatch(flax.landscape)
};
flax.getAngle = function(a, b, c) {
    var d = 0,
    e = 0;
    a && (d = a.x, e = a.y);
    return flax.getAngle1(b.x - d, b.y - e, c)
};
flax.getAngle1 = function(a, b, c) {
    void 0 === c && (c = !0);
    a = Math.atan2(a, b);
    0 > a && (a += 2 * Math.PI);
    c && (a *= RADIAN_TO_DEGREE);
    return a
};
flax.getDistance = function(a, b) {
    var c = b.x - (null == a ? 0 : a.x),
    d = b.y - (null == a ? 0 : a.y);
    return Math.sqrt(c * c + d * d)
};
flax.getPointOnCircle = function(a, b, c) {
    c = (90 - c) * DEGREE_TO_RADIAN;
    var d = a ? a.y: 0;
    return {
        x: (a ? a.x: 0) + b * Math.cos(c),
        y: d + b * Math.sin(c)
    }
};
flax.getPosition = function(a, b) {
    var c = a.getPosition();
    a.parent && (b && (c = a.parent.convertToWorldSpace(c)), b instanceof cc.Sprite && (c = b.convertToNodeSpace(c)));
    return c
};
flax.getRotation = function(a, b) {
    if (!1 == b) return a.rotation;
    for (var c = 0,
    d = a; d && (c += d.rotation, d = d.parent, d !== b););
    return c
};
flax.getScale = function(a, b) {
    if (!1 == b) return {
        x: a.scaleX,
        y: a.scaleY
    };
    for (var c = 1,
    d = 1,
    e = a; e && (c *= e.scaleX, d *= e.scaleY, e = e.parent, e !== b););
    return {
        x: c,
        y: d
    }
};
flax.getRect = function(a, b) {
    var c;
    if (a.getRect) return c = a.getRect(b);
    if ((a instanceof cc.Layer || a instanceof cc.Scene) && !(cc.EditBox && a instanceof cc.EditBox)) return flax.stageRect;
    null == b && (b = !0);
    c = a.getContentSize();
    var d = flax.getScale(a, b),
    e = a.getPosition();
    if (a.parent) if (b) b != a.parent && (e = a.parent.convertToWorldSpace(e), b instanceof cc.Node && (e = b.convertToNodeSpace(e)));
    else return c.width *= Math.abs(d.x),
    c.height *= Math.abs(d.y),
    cc.rect(0, 0, c.width, c.height);
    var f = a.getAnchorPoint();
    return c = cc.rect(e.x - c.width * d.x * f.x, e.y - c.height * d.y * f.y, c.width * Math.abs(d.x), c.height * Math.abs(d.y))
};
flax._strToRect = function(a) {
    a = a.split(",");
    return cc.rect(parseFloat(a[0]), parseFloat(a[1]), parseFloat(a[2]), parseFloat(a[3]))
};
flax.ifTouched = function(a, b) {
    if (null == a || !(a instanceof cc.Node)) return ! 1;
    if (a.mainCollider) return a.mainCollider.containsPoint(b);
    var c = flax.getRect(a, !0);
    return cc.rectContainsPoint(c, b)
};
flax.ifCollide = function(a, b) {
    return a.mainCollider.checkCollision(b.mainCollider)
};
flax.isFlaxDisplay = function(a) {
    return a instanceof flax.FlaxSprite || a instanceof flax.FlaxSpriteBatch || a instanceof flax.Image || flax.Scale9Image && a instanceof flax.Scale9Image
};
flax.isFlaxSprite = function(a) {
    return a instanceof flax.FlaxSprite || a instanceof flax.FlaxSpriteBatch
};
flax.isMovieClip = function(a) {
    return a instanceof flax.MovieClip || a instanceof flax.MovieClipBatch
};
flax.isButton = function(a) {
    return a instanceof flax.Button || a instanceof flax.SimpleButton
};
flax.isChildOf = function(a, b) {
    if (null == a || null == b || a == b) return ! 1;
    for (var c = a.parent; c;) {
        if (c == b) return ! 0;
        c = c.parent
    }
    return ! 1
};
flax.findParentWithClass = function(a, b) {
    for (var c = a; c;) {
        if (c instanceof b) return c;
        c = c.parent
    }
    return null
};
flax.findChildWithClass = function(a, b) {
    for (var c = a.children,
    d = c.length,
    e; d--;) if (e = c[d], e instanceof b || (e = flax.findChildWithClass(e, b))) return e;
    return null
};
flax.getUrlVars = function() {
    var a = {};
    if (cc.sys.isNative) return a;
    for (var b = window.location.search.substring(1).split("\x26"), c = 0; c < b.length; c++) {
        var d = b[c].split("\x3d");
        a[d[0]] = decodeURIComponent(d[1])
    }
    return a
};
flax.nameToObject = function(a, b) {
    if (void 0 == a || "" == a) return null;
    b = b || "function";
    for (var c = a.split("."), d = window || this, e = 0, f = c.length; e < f; e++) try {
        d = d[c[e]]
    } catch(g) {
        break
    }
    return typeof d !== b ? null: d
};
flax.createBGLayer = function(a, b) {
    null == b && (b = cc.color(255, 255, 255, 255));
    var c = cc.LayerColor.create(b, cc.visibleRect.width, cc.visibleRect.height);
    a.addChild(c, 0);
    return c
};
flax.shuffleArray = function(a, b) {
    if (void 0 === b || 0 >= b || b > a.length) b = a.length;
    for (var c = b - 1; 0 <= c; c--) {
        var d = 0 | cc.rand() % (c + 1),
        e = a[c];
        a[c] = a[d];
        a[d] = e
    }
};
flax.restrictValue = function(a, b, c) {
    a = Math.max(b, a);
    return a = Math.min(c, a)
};
flax.numberSign = function(a) {
    return 0 == a ? 0 : 0 < a ? 1 : -1
};
flax.randInt = function(a, b) {
    return a + Math.floor(Math.random() * (b - a))
};
flax.getRandomInArray = function(a, b) {
    if (null == a) return null;
    if (null == b) {
        var c = flax.randInt(0, a.length);
        return a[c]
    }
    for (var d = Math.random(), e = 0, c = 0; c < b.length && (0 >= b[c] || (e += b[c], !(d <= e))); c++);
    return a[c]
};
flax.isImageFile = function(a) {
    if ("string" != typeof a) return ! 1;
    a = cc.path.extname(a);
    return - 1 < IMAGE_TYPES.indexOf(a)
};
flax.isSoundFile = function(a) {
    if ("string" != typeof a) return ! 1;
    a = cc.path.extname(a);
    return - 1 < SOUND_TYPES.indexOf(a)
};
flax.copyProperties = function(a, b) {
    if (null != a && null != b) for (var c in a) try {
        b[c] = a[c]
    } catch(d) {}
};
flax.createDInts = function(a, b) {
    isNaN(b) && (b = 0);
    for (var c = [], d = -1, e = b - 1, f = b; ++d < a;) 0 == d % 2 ? c.push(++e) : c.push(--f);
    return c
};
flax.utf8ToUnicode = function(a) {
    if (a) {
        for (var b = "",
        c = a.length,
        d = 0,
        e = c,
        f, g, k; d < c;) if (f = a.charCodeAt(d), 0 == (f & 128)) {
            if (1 > e) break;
            b += String.fromCharCode(f & 127);
            d++;
            e -= 1
        } else if (192 == (f & 224)) {
            g = a.charCodeAt(d + 1);
            if (2 > e || 128 != (g & 192)) break;
            b += String.fromCharCode((f & 63) << 6 | g & 63);
            d += 2;
            e -= 2
        } else if (224 == (f & 240)) {
            g = a.charCodeAt(d + 1);
            k = a.charCodeAt(d + 2);
            if (3 > e || 128 != (g & 192) || 128 != (k & 192)) break;
            b += String.fromCharCode((f & 15) << 12 | (g & 63) << 6 | k & 63);
            d += 3;
            e -= 3
        } else break;
        return 0 != e ? "": b
    }
};
flax.formatTime = function(a, b) {
    if (1 >= b) return a + "";
    b || (b = 2);
    var c = 0;
    2 < b && (c = Math.floor(a / 3600));
    var d = Math.floor((a - 3600 * c) / 60),
    e = a - 3600 * c - 60 * d;
    10 > c && (c = "0" + c);
    10 > d && (d = "0" + d);
    10 > e && (e = "0" + e);
    return 2 < b ? c + ":" + d + ":" + e: d + ":" + e
};
flax.generateUid = function(a, b) {
    var c = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(""),
    d = [],
    e;
    b = b || c.length;
    if (a) for (e = 0; e < a; e++) d[e] = c[0 | Math.random() * b];
    else {
        var f;
        d[8] = d[13] = d[18] = d[23] = "-";
        d[14] = "4";
        for (e = 0; 36 > e; e++) d[e] || (f = 0 | 16 * Math.random(), d[e] = c[19 == e ? f & 3 | 8 : f])
    }
    return d.join("")
};
flax.homeUrl = "http://flax.so";
flax.goHomeUrl = function() {
    var a = cc.game.config.homeUrl || flax.homeUrl; ! cc.sys.isNative && a && window.open(a)
};
function SignalBinding(a, b, c, d, e) {
    this._listener = b;
    this._isOnce = c;
    this.context = d;
    this._signal = a;
    this._priority = e || 0
}
SignalBinding.prototype = {
    actived: !0,
    params: null,
    execute: function(a) {
        var b;
        this.actived && this._listener && (a = this.params ? this.params.concat(a) : a, b = this._listener.apply(this.context, a), this._isOnce && this.detach());
        return b
    },
    detach: function() {
        return this.isBound() ? this._signal.remove(this._listener, this.context) : null
    },
    isBound: function() {
        return !! this._signal && !!this._listener
    },
    isOnce: function() {
        return this._isOnce
    },
    getListener: function() {
        return this._listener
    },
    getSignal: function() {
        return this._signal
    },
    _destroy: function() {
        delete this._signal;
        delete this._listener;
        delete this.context
    },
    toString: function() {
        return "[SignalBinding isOnce:" + this._isOnce + ", isBound:" + this.isBound() + ", actived:" + this.actived + "]"
    }
};
function validateListener(a, b) {
    if ("function" !== typeof a) throw Error("listener is a required param of {fn}() and should be a Function.".replace("{fn}", b));
}
function Signal() {
    this._bindings = [];
    this._prevParams = null;
    var a = this;
    this.dispatch = function() {
        Signal.prototype.dispatch.apply(a, arguments)
    }
}
Signal.prototype = {
    VERSION: "::VERSION_NUMBER::",
    memorize: !1,
    _shouldPropagate: !0,
    actived: !0,
    _registerListener: function(a, b, c, d) {
        var e = this._indexOfListener(a, c);
        if ( - 1 !== e) {
            if (a = this._bindings[e], a.isOnce() !== b) throw Error("You cannot add" + (b ? "": "Once") + "() then add" + (b ? "Once": "") + "() the same listener without removing the relationship first.");
        } else a = new SignalBinding(this, a, b, c, d),
        this._addBinding(a);
        this.memorize && this._prevParams && a.execute(this._prevParams);
        return a
    },
    _addBinding: function(a) {
        var b = this._bindings.length;
        do--b;
        while (this._bindings[b] && a._priority <= this._bindings[b]._priority);
        this._bindings.splice(b + 1, 0, a)
    },
    _indexOfListener: function(a, b) {
        for (var c = this._bindings.length,
        d; c--;) if (d = this._bindings[c], d._listener === a && d.context === b) return c;
        return - 1
    },
    has: function(a, b) {
        return - 1 !== this._indexOfListener(a, b)
    },
    add: function(a, b, c) {
        validateListener(a, "add");
        return this._registerListener(a, !1, b, c)
    },
    addOnce: function(a, b, c) {
        validateListener(a, "addOnce");
        return this._registerListener(a, !0, b, c)
    },
    remove: function(a, b) {
        validateListener(a, "remove");
        var c = this._indexOfListener(a, b); - 1 !== c && (this._bindings[c]._destroy(), this._bindings.splice(c, 1));
        return a
    },
    removeAll: function() {
        for (var a = this._bindings.length; a--;) this._bindings[a]._destroy();
        this._bindings.length = 0
    },
    getNumListeners: function() {
        return this._bindings.length
    },
    halt: function() {
        this._shouldPropagate = !1
    },
    dispatch: function(a) {
        if (this.actived) {
            var b = Array.prototype.slice.call(arguments),
            c = this._bindings.length,
            d;
            this.memorize && (this._prevParams = b);
            if (c) {
                d = this._bindings.slice();
                this._shouldPropagate = !0;
                do c--;
                while (d[c] && this._shouldPropagate && !1 !== d[c].execute(b))
            }
        }
    },
    forget: function() {
        this._prevParams = null
    },
    dispose: function() {
        this.removeAll();
        delete this._bindings;
        delete this._prevParams
    },
    toString: function() {
        return "[Signal active:" + this.actived + " numListeners:" + this.getNumListeners() + "]"
    }
};
var signals = Signal;
signals.Signal = Signal; (function(a) {
    "function" === typeof define && define.amd ? define(function() {
        return signals
    }) : "undefined" !== typeof module && module.exports ? module.exports = signals: a.signals = signals
})(this);
flax.__drawNode = null;
flax.createDrawNode = function(a, b) {
    flax.__drawNode && flax.__drawNode.parent && !a || (null == flax.__drawNode && (flax.__drawNode = cc.DrawNode.create()), flax.currentScene && (a || (a = flax.currentScene), flax.__drawNode.parent && flax.__drawNode.parent != a && (flax.__drawNode.removeFromParent(), flax.__drawNode.clear()), null == flax.__drawNode.parent && a.addChild(flax.__drawNode), flax.__drawNode.zIndex = b || 99999))
};
flax.clearDraw = function(a) {
    null != flax.__drawNode && (flax.__drawNode.clear(), !0 === a && (flax.__drawNode.removeFromParent(), flax.__drawNode = null))
};
flax.drawLine = function(a, b, c, d) {
    flax.createDrawNode();
    null == c && (c = 1);
    null == d && (d = cc.color(255, 0, 0, 255));
    flax.__drawNode.drawSegment(a, b, c, d)
};
flax.drawRay = function(a, b, c, d, e) {
    flax.drawLine(a, flax.getPointOnCircle(a, c, b), d, e)
};
flax.drawRect = function(a, b, c, d) {
    flax.createDrawNode();
    null == b && (b = 1);
    null == c && (c = cc.color(255, 0, 0, 255));
    var e = cc.pAdd(cc.p(a.x, a.y), cc.p(a.width, a.height));
    flax.__drawNode.drawRect(cc.p(a.x, a.y), e, d, b, c)
};
flax.drawStageRect = function() {
    var a = h = 2;
    flax.drawRect(cc.rect(flax.stageRect.x + a, flax.stageRect.y + h, flax.stageRect.width - 2 * a, flax.stageRect.height - 2 * h))
};
flax.drawCircle = function(a, b, c, d) {
    flax.createDrawNode();
    null == c && (c = 1);
    null == d && (d = cc.color(255, 0, 0, 255));
    flax.__drawNode.drawCircle(a, b, 360, 360, !1, c, d)
};
flax.drawDot = function(a, b, c) {
    flax.createDrawNode();
    null == b && (b = 3);
    null == c && (c = cc.color(255, 0, 0, 255));
    flax.__drawNode.drawDot(a, b, c)
};
var InputType = {
    press: "onPress",
    up: "onUp",
    click: "onClick",
    move: "onMouseMove",
    keyPress: "onKeyPress",
    keyUp: "onKeyUp"
};
flax.InputManager = cc.Node.extend({
    enabled: !0,
    nullEnabled: !1,
    inTouching: !1,
    inDragging: !1,
    justDragged: !1,
    justDragDist: 0,
    _masks: [],
    _callbacks: {},
    _keyboardCallbacks: {},
    _keyboardListener: null,
    _touchListeners: null,
    ctor: function() {
        cc.Node.prototype.ctor.call(this);
        this._masks = [];
        this.inTouching = !1;
        this._callbacks = {};
        this._keyboardCallbacks = {};
        this._keyboardListener = null;
        this._touchListeners = {}
    },
    onEnter: function() {
        this._super();
        var a = this;
        if (!cc.sys.isMobile) {
            var b = cc.EventListener.create({
                event: cc.EventListener.MOUSE,
                onMouseMove: function(b) {
                    a.inDragging = 0 == b.getButton();
                    if (a.justDragged = a.inDragging) a.justDragDist += cc.pLength(b.getDelta());
                    a.inDragging || a._dispatchOne(a, b, {
                        target: a,
                        currentTarget: a
                    },
                    InputType.move);
                    flax.mousePos = b.getLocation()
                }
            });
            cc.eventManager.addListener(b, this)
        }
        b = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: !1,
            onTouchBegan: function(b, d) {
                flax.mousePos = b.getLocation();
                if (!a.nullEnabled || !a.enabled) return ! 1;
                a.inDragging = !1;
                a.justDragged = !1;
                a.justDragDist = 0;
                a.inTouching = !0;
                a._dispatchOne(a, b, d, InputType.press);
                return ! 0
            },
            onTouchEnded: function(b, d) {
                a.nullEnabled && (a.inDragging = !1, a.inTouching = !1, a._dispatchOne(a, b, d, InputType.up), a._dispatchOne(a, b, d, InputType.click))
            },
            onTouchMoved: function(b, d) {
                flax.mousePos = b.getLocation();
                a.nullEnabled && (a.inDragging = !0, a.justDragged = !0, a.justDragDist += cc.pLength(b.getDelta()), a._dispatchOne(a, b, d, InputType.move))
            }
        });
        cc.eventManager.addListener(b, this)
    },
    onExit: function() {
        this._super();
        this.removeAllTouchListeners();
        this.removeAllKeyboardListeners();
        this.removeAllMasks();
        this.inTouching = !1
    },
    addMask: function(a) { - 1 < this._masks.indexOf(a) || (this._masks.push(a), a.__isInputMask = !0)
    },
    removeMask: function(a) {
        var b = this._masks.indexOf(a); - 1 < b && (this._masks.splice(b, 1), a.__isInputMask = !1)
    },
    removeAllMasks: function() {
        for (var a = this._masks.length; a--;) this._masks[a].__isInputMask = !1,
        this._masks.splice(a, 1);
        this._masks.length = 0
    },
    _compareRealZIndex: function(a, b) {
        if (!a.parent || !b.parent) return 1;
        if (a.parent == b.parent) return this._childIsOnFront(a, b);
        for (var c = null,
        d = 0,
        e = [], f = a.parent; f;) e.push(f),
        f = f.parent;
        for (var g = [], f = b.parent; f;) {
            d = e.indexOf(f);
            if ( - 1 < d) {
                c = f;
                break
            }
            g.push(f);
            f = f.parent
        }
        e = e.slice(0, d);
        return this._childIsOnFront(e[e.length - 1] || a, g[g.length - 1] || b, c) ? 1 : -1
    },
    _childIsOnFront: function(a, b, c) {
        null == c && (c = a.parent);
        return c.children.indexOf(a) > c.children.indexOf(b)
    },
    addListener: function(a, b, c, d) {
        if (null == b) throw "Event callback can not be null!";
        var e = c == InputType.keyPress || c == InputType.keyUp;
        null == a && (a = this, e || cc.log("Listening target is null, make sure you want to listen to the full screen input!"));
        if (e) {
            e = this._keyboardCallbacks[c];
            null == e && (e = [], this._keyboardCallbacks[c] = e);
            for (var f = e.length; f--;) if (e[f].func == b) return;
            e.push({
                func: b,
                context: d || a
            });
            this._keyboardListener || this._createKeyboardListener()
        } else {
            c = null == c ? InputType.click: c;
            null == a.__instanceId && (a.__instanceId = ClassManager.getNewInstanceId());
            e = this._callbacks[a.__instanceId];
            null == e && (e = [], this._callbacks[a.__instanceId] = e, a != this && (f = this._createListener(a, !0), this._touchListeners[a.__instanceId] = f));
            for (f = e.length; f--;) if (e[f].type == c && e[f].func == b) return;
            e.push({
                type: c,
                func: b,
                context: d || a
            })
        }
    },
    removeListener: function(a, b, c) {
        null == a && (a = this);
        var d = this._callbacks[a.__instanceId];
        if (d && (null == c || c != InputType.keyPress && c != InputType.keyUp)) {
            var e = null,
            f = d.length;
            if (b || c) for (; f--;) e = d[f],
            c && e.type != c || b && e.func != b || d.splice(f, 1);
            if (0 == d.length || !b && !c) delete this._callbacks[a.__instanceId],
            this._touchListeners[a.__instanceId] && delete this._touchListeners[a.__instanceId]
        }
        if (b && (null == c || c == InputType.keyPress || c == InputType.keyUp) && (null == c ? (d = this._keyboardCallbacks[InputType.keyPress] || [], d = d.concat(this._keyboardCallbacks[InputType.keyUp] || [])) : d = this._keyboardCallbacks[c], d && d.length)) for (f = d.length; f--;) e = d[f],
        e.func == b && d.splice(f, 1)
    },
    removeAllTouchListeners: function() {
        this._callbacks = {};
        for (var a in this._touchListeners) cc.eventManager.removeListener(this._touchListeners[a]),
        delete this._touchListeners[a]
    },
    removeAllKeyboardListeners: function() {
        this._keyboardCallbacks = {};
        this._keyboardListener && (this._keyboardListener = null)
    },
    handleTouchBegan: function(a, b) {
        if (!this.enabled) return ! 1;
        var c = b.getCurrentTarget();
        if (this._ifTargetIgnore(c, a)) return ! 1;
        var d = a.getLocation();
        if (!this._ifNotMasked(c, d)) return ! 1;
        b.currentTarget = c;
        b.target = this._findRealTarget(c, d) || c;
        if ((c instanceof cc.Layer || c instanceof flax.MovieClip) && b.target == c) return ! 1;
        this._dispatch(c, a, b, InputType.press);
        return ! 0
    },
    handleTouchEnded: function(a, b) {
        var c = b.getCurrentTarget();
        b.currentTarget = c;
        b.target = this._findRealTarget(c, a.getLocation()) || c;
        this._dispatch(c, a, b, InputType.up);
        flax.ifTouched(c, a.getLocation()) && this._dispatch(c, a, b, InputType.click)
    },
    handleTouchMoved: function(a, b) {
        var c = b.getCurrentTarget();
        this._dispatch(c, a, b, InputType.move)
    },
    _createListener: function(a, b) {
        var c = this,
        d = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: b,
            onTouchBegan: function(a, b) {
                return c.handleTouchBegan(a, b)
            },
            onTouchEnded: function(a, b) {
                c.handleTouchEnded(a, b)
            },
            onTouchMoved: function(a, b) {
                c.handleTouchMoved(a, b)
            },
            onTouchCancelled: function(a, b) {
                c.handleTouchEnded(a, b)
            }
        });
        cc.eventManager.addListener(d, a);
        return d
    },
    _createKeyboardListener: function() {
        var a = this;
        this._keyboardListener = {
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function(b, c) {
                a._dispatchKeyboardEvent(b, InputType.keyPress)
            },
            onKeyReleased: function(b, c) {
                a._dispatchKeyboardEvent(b, InputType.keyUp)
            }
        };
        cc.eventManager.addListener(this._keyboardListener, this)
    },
    _ifNotMasked: function(a, b) {
        for (var c = this._masks.length,
        d = null,
        d = null; c--;) if (d = this._masks[c], a != d && !flax.isChildOf(a, d) && !flax.isChildOf(d, a) && !this._ifTargetIgnore(d) && 1 == this._compareRealZIndex(d, a) && (d = this._findRealTarget(d, b))) return ! 1;
        return ! 0
    },
    _findRealTarget: function(a, b) {
        a instanceof Array || (a = [a]);
        for (var c = null,
        d = a.length; d--;) if (c = a[d], !this._ifTargetIgnore(c)) {
            if (0 < c.children.length && (this._temp = this._findRealTarget(c.children, b))) return this._temp;
            if (flax.ifTouched(c, b)) return c
        }
        return null
    },
    _ifTargetIgnore: function(a, b) {
        return null == a || !(a instanceof cc.Scene || a.parent) || !this._ifTargetVisible(a) || a.isMouseEnabled && !1 === a.isMouseEnabled() || b && !flax.ifTouched(a, b.getLocation()) ? !0 : !1
    },
    _ifTargetVisible: function(a) {
        for (; a;) {
            if (!a.visible) return ! 1;
            a = a.parent
        }
        return ! 0
    },
    _dispatch: function(a, b, c, d) {
        for (var e = []; a;) {
            var f = this._callbacks[a.__instanceId];
            f && f.length && e.push(a);
            a = a.parent
        }
        for (f = 0; f < e.length; f++) a = e[f],
        this._dispatchOne(a, b, c, d)
    },
    _dispatchOne: function(a, b, c, d) {
        var e = this._callbacks[a.__instanceId];
        if (e && e.length) {
            c.currentTarget = a;
            c.inputType = d;
            a = null;
            for (var f = [], g = e.length; g--;) a = e[g],
            a.type == d && f.push(a);
            for (g = f.length; g--;) a = f[g],
            a.func.apply(a.context, [b, c])
        }
    },
    _dispatchKeyboardEvent: function(a, b) {
        var c = this._keyboardCallbacks[b];
        if (c && c.length) {
            for (var d = this._getNativeKeyName(a), e = null, f = [], g = c.length; g--;) e = c[g],
            f.push(e);
            for (g = f.length; g--;) e = f[g],
            e.func.apply(e.context, [d])
        }
    },
    _getNativeKeyName: function(a) {
        var b = Object.getOwnPropertyNames(flax.KEY),
        c = "",
        d;
        for (d in b) if (flax.KEY[b[d]] == a) {
            c = b[d];
            break
        }
        return c
    }
});
flax.KEY = {
    none: 0,
    back: 6,
    menu: 18,
    backspace: 8,
    tab: 9,
    enter: 13,
    shift: 16,
    ctrl: 17,
    alt: 18,
    pause: 19,
    capslock: 20,
    escape: 27,
    space: 32,
    pageup: 33,
    pagedown: 34,
    end: 35,
    home: 36,
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    select: 41,
    insert: 45,
    Delete: 46,
    0 : 48,
    1 : 49,
    2 : 50,
    3 : 51,
    4 : 52,
    5 : 53,
    6 : 54,
    7 : 55,
    8 : 56,
    9 : 57,
    a: 65,
    b: 66,
    c: 67,
    d: 68,
    e: 69,
    f: 70,
    g: 71,
    h: 72,
    i: 73,
    j: 74,
    k: 75,
    l: 76,
    m: 77,
    n: 78,
    o: 79,
    p: 80,
    q: 81,
    r: 82,
    s: 83,
    t: 84,
    u: 85,
    v: 86,
    w: 87,
    x: 88,
    y: 89,
    z: 90,
    num0: 96,
    num1: 97,
    num2: 98,
    num3: 99,
    num4: 100,
    num5: 101,
    num6: 102,
    num7: 103,
    num8: 104,
    num9: 105,
    "*": 106,
    "+": 107,
    "-": 109,
    numdel: 110,
    "/": 111,
    f1: 112,
    f2: 113,
    f3: 114,
    f4: 115,
    f5: 116,
    f6: 117,
    f7: 118,
    f8: 119,
    f9: 120,
    f10: 121,
    f11: 122,
    f12: 123,
    numlock: 144,
    scrolllock: 145,
    ";": 186,
    semicolon: 186,
    equal: 187,
    "\x3d": 187,
    ",": 188,
    comma: 188,
    dash: 189,
    ".": 190,
    period: 190,
    forwardslash: 191,
    grave: 192,
    "[": 219,
    openbracket: 219,
    backslash: 220,
    "]": 221,
    closebracket: 221,
    quote: 222,
    dpadLeft: 1E3,
    dpadRight: 1001,
    dpadUp: 1003,
    dpadDown: 1004,
    dpadCenter: 1005
};
/*
 zlib.js 2012 - imaya [ https://github.com/imaya/zlib.js ] The MIT License */
(function() {
    function a(a, b) {
        var c = a.split("."),
        d = g;
        c[0] in d || !d.execScript || d.execScript("var " + c[0]);
        for (var e; c.length && (e = c.shift());) c.length || void 0 === b ? d = d[e] ? d[e] : d[e] = {}: d[e] = b
    }
    function b(a) {
        var b = a.length,
        c = 0,
        d = Number.POSITIVE_INFINITY,
        e, f, g, m, n, p, r, s, t;
        for (s = 0; s < b; ++s) a[s] > c && (c = a[s]),
        a[s] < d && (d = a[s]);
        e = 1 << c;
        f = new(k ? Uint32Array: Array)(e);
        g = 1;
        m = 0;
        for (n = 2; g <= c;) {
            for (s = 0; s < b; ++s) if (a[s] === g) {
                p = 0;
                r = m;
                for (t = 0; t < g; ++t) p = p << 1 | r & 1,
                r >>= 1;
                r = g << 16 | s;
                for (t = p; t < e; t += n) f[t] = r; ++m
            }++g;
            m <<= 1;
            n <<= 1
        }
        return [f, c, d]
    }
    function c(a, b) {
        this.g = [];
        this.h = 32768;
        this.c = this.f = this.d = this.k = 0;
        this.input = k ? new Uint8Array(a) : a;
        this.l = !1;
        this.i = n;
        this.q = !1;
        if (b || !(b = {})) b.index && (this.d = b.index),
        b.bufferSize && (this.h = b.bufferSize),
        b.bufferType && (this.i = b.bufferType),
        b.resize && (this.q = b.resize);
        switch (this.i) {
        case m:
            this.a = 32768;
            this.b = new(k ? Uint8Array: Array)(32768 + this.h + 258);
            break;
        case n:
            this.a = 0;
            this.b = new(k ? Uint8Array: Array)(this.h);
            this.e = this.v;
            this.m = this.s;
            this.j = this.t;
            break;
        default:
            throw Error("invalid inflate mode");
        }
    }
    function d(a, b) {
        for (var c = a.f,
        d = a.c,
        e = a.input,
        f = a.d,
        g = e.length; d < b;) {
            if (f >= g) throw Error("input buffer is broken");
            c |= e[f++] << d;
            d += 8
        }
        a.f = c >>> b;
        a.c = d - b;
        a.d = f;
        return c & (1 << b) - 1
    }
    function e(a, b) {
        for (var c = a.f,
        d = a.c,
        e = a.input,
        f = a.d,
        g = e.length,
        k = b[0], m = b[1]; d < m && !(f >= g);) c |= e[f++] << d,
        d += 8;
        e = k[c & (1 << m) - 1];
        g = e >>> 16;
        a.f = c >> g;
        a.c = d - g;
        a.d = f;
        return e & 65535
    }
    function f(a) {
        function c(a, b, f) {
            var g, k = this.p,
            m, n;
            for (n = 0; n < a;) switch (g = e(this, b), g) {
            case 16:
                for (m = 3 + d(this, 2); m--;) f[n++] = k;
                break;
            case 17:
                for (m = 3 + d(this, 3); m--;) f[n++] = 0;
                k = 0;
                break;
            case 18:
                for (m = 11 + d(this, 7); m--;) f[n++] = 0;
                k = 0;
                break;
            default:
                k = f[n++] = g
            }
            this.p = k;
            return f
        }
        var f = d(a, 5) + 257,
        g = d(a, 5) + 1,
        m = d(a, 4) + 4,
        n = new(k ? Uint8Array: Array)(r.length),
        p;
        for (p = 0; p < m; ++p) n[r[p]] = d(a, 3);
        if (!k) for (p = m, m = n.length; p < m; ++p) n[r[p]] = 0;
        m = b(n);
        n = new(k ? Uint8Array: Array)(f);
        p = new(k ? Uint8Array: Array)(g);
        a.p = 0;
        a.j(b(c.call(a, f, m, n)), b(c.call(a, g, m, p)))
    }
    var g = this,
    k = "undefined" !== typeof Uint8Array && "undefined" !== typeof Uint16Array && "undefined" !== typeof Uint32Array && "undefined" !== typeof DataView,
    m = 0,
    n = 1;
    c.prototype.u = function() {
        for (; ! this.l;) {
            var a = d(this, 3);
            a & 1 && (this.l = !0);
            a >>>= 1;
            switch (a) {
            case 0:
                var a = this.input,
                b = this.d,
                c = this.b,
                e = this.a,
                g = a.length,
                p = void 0,
                r = void 0,
                s = c.length,
                r = void 0;
                this.c = this.f = 0;
                if (b + 1 >= g) throw Error("invalid uncompressed block header: LEN");
                p = a[b++] | a[b++] << 8;
                if (b + 1 >= g) throw Error("invalid uncompressed block header: NLEN");
                r = a[b++] | a[b++] << 8;
                if (p === ~r) throw Error("invalid uncompressed block header: length verify");
                if (b + p > a.length) throw Error("input buffer is broken");
                switch (this.i) {
                case m:
                    for (; e + p > c.length;) {
                        r = s - e;
                        p -= r;
                        if (k) c.set(a.subarray(b, b + r), e),
                        e += r,
                        b += r;
                        else for (; r--;) c[e++] = a[b++];
                        this.a = e;
                        c = this.e();
                        e = this.a
                    }
                    break;
                case n:
                    for (; e + p > c.length;) c = this.e({
                        o: 2
                    });
                    break;
                default:
                    throw Error("invalid inflate mode");
                }
                if (k) c.set(a.subarray(b, b + p), e),
                e += p,
                b += p;
                else for (; p--;) c[e++] = a[b++];
                this.d = b;
                this.a = e;
                this.b = c;
                break;
            case 1:
                this.j(E, K);
                break;
            case 2:
                f(this);
                break;
            default:
                throw Error("unknown BTYPE: " + a);
            }
        }
        return this.m()
    };
    var p = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15],
    r = k ? new Uint16Array(p) : p,
    p = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 258, 258],
    u = k ? new Uint16Array(p) : p,
    p = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0],
    t = k ? new Uint8Array(p) : p,
    p = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577],
    v = k ? new Uint16Array(p) : p,
    p = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13],
    w = k ? new Uint8Array(p) : p,
    p = new(k ? Uint8Array: Array)(288),
    s,
    J;
    s = 0;
    for (J = p.length; s < J; ++s) p[s] = 143 >= s ? 8 : 255 >= s ? 9 : 279 >= s ? 7 : 8;
    var E = b(p),
    p = new(k ? Uint8Array: Array)(30);
    s = 0;
    for (J = p.length; s < J; ++s) p[s] = 5;
    var K = b(p);
    c.prototype.j = function(a, b) {
        var c = this.b,
        f = this.a;
        this.n = a;
        for (var g = c.length - 258,
        k, m, n; 256 !== (k = e(this, a));) if (256 > k) f >= g && (this.a = f, c = this.e(), f = this.a),
        c[f++] = k;
        else for (k -= 257, n = u[k], 0 < t[k] && (n += d(this, t[k])), k = e(this, b), m = v[k], 0 < w[k] && (m += d(this, w[k])), f >= g && (this.a = f, c = this.e(), f = this.a); n--;) c[f] = c[f++-m];
        for (; 8 <= this.c;) this.c -= 8,
        this.d--;
        this.a = f
    };
    c.prototype.t = function(a, b) {
        var c = this.b,
        f = this.a;
        this.n = a;
        for (var g = c.length,
        k, m, n; 256 !== (k = e(this, a));) if (256 > k) f >= g && (c = this.e(), g = c.length),
        c[f++] = k;
        else for (k -= 257, n = u[k], 0 < t[k] && (n += d(this, t[k])), k = e(this, b), m = v[k], 0 < w[k] && (m += d(this, w[k])), f + n > g && (c = this.e(), g = c.length); n--;) c[f] = c[f++-m];
        for (; 8 <= this.c;) this.c -= 8,
        this.d--;
        this.a = f
    };
    c.prototype.e = function() {
        var a = new(k ? Uint8Array: Array)(this.a - 32768),
        b = this.a - 32768,
        c,
        d,
        e = this.b;
        if (k) a.set(e.subarray(32768, a.length));
        else for (c = 0, d = a.length; c < d; ++c) a[c] = e[c + 32768];
        this.g.push(a);
        this.k += a.length;
        if (k) e.set(e.subarray(b, b + 32768));
        else for (c = 0; 32768 > c; ++c) e[c] = e[b + c];
        this.a = 32768;
        return e
    };
    c.prototype.v = function(a) {
        var b, c = this.input.length / this.d + 1 | 0,
        d, e, f, g = this.input,
        m = this.b;
        a && ("number" === typeof a.o && (c = a.o), "number" === typeof a.r && (c += a.r));
        2 > c ? (d = (g.length - this.d) / this.n[2], f = d / 2 * 258 | 0, e = f < m.length ? m.length + f: m.length << 1) : e = m.length * c;
        k ? (b = new Uint8Array(e), b.set(m)) : b = m;
        return this.b = b
    };
    c.prototype.m = function() {
        var a = 0,
        b = this.b,
        c = this.g,
        d, e = new(k ? Uint8Array: Array)(this.k + (this.a - 32768)),
        f,
        g,
        m,
        n;
        if (0 === c.length) return k ? this.b.subarray(32768, this.a) : this.b.slice(32768, this.a);
        f = 0;
        for (g = c.length; f < g; ++f) for (d = c[f], m = 0, n = d.length; m < n; ++m) e[a++] = d[m];
        f = 32768;
        for (g = this.a; f < g; ++f) e[a++] = b[f];
        this.g = [];
        return this.buffer = e
    };
    c.prototype.s = function() {
        var a, b = this.a;
        k ? this.q ? (a = new Uint8Array(b), a.set(this.b.subarray(0, b))) : a = this.b.subarray(0, b) : (this.b.length > b && (this.b.length = b), a = this.b);
        return this.buffer = a
    };
    a("Zlib.RawInflate", c);
    a("Zlib.RawInflate.prototype.decompress", c.prototype.u);
    var p = {
        ADAPTIVE: n,
        BLOCK: m
    },
    G,
    C;
    if (Object.keys) s = Object.keys(p);
    else for (G in s = [], J = 0, p) s[J++] = G;
    J = 0;
    for (C = s.length; J < C; ++J) G = s[J],
    a("Zlib.RawInflate.BufferType." + G, p[G])
}).call(this);
flax._flaxLoader = {
    load: function(a, b, c, d) {
        cc.loader.loadBinary(a,
        function(b, c) {
            a = flax._removeResVersion(a);
            for (var g = (new Zlib.RawInflate(c)).decompress(), k = "", m = g.length, n = 0; n < m; n++) k += String.fromCharCode(g[n]);
            c = k.split("data:image/gif;base64,");
            k = cc.path.changeBasename(a, ".plist");
            g = cc.path.changeBasename(a, ".png");
            cc.loader.cache[k] = JSON.parse(c[0]);
            k = new Image;
            k.src = "data:image/gif;base64," + c[1];
            cc.loader.cache[g] = k;
            cc.textureCache.handleLoadedTexture(g);
            flax.assetsManager.addAssets(a);
            b ? d(b) : d(null, "Not reachable!");
            cc.loader.release(a);
            cc.loader.cache[a] = "loaded!"
        })
    }
};
cc.sys.isNative || cc.loader.register(["flax"], flax._flaxLoader);
flax = flax || {};
flax.languages = "zh en de fr it es tr pt ru".split(" ");
flax._assetsClassMap = {
    btn: "flax.SimpleButton",
    button: "flax.SimpleButton",
    progress: "flax.ProgressBar",
    jpg: "flax.Image",
    png: "flax.Image",
    scrollPane: "flax.ScrollPane",
    gun: "flax.Gunner",
    soundBtn: "flax.SimpleSoundButton"
};
flax._assetsMcClassMap = {
    button: "flax.Button",
    scrollPane: "flax.MCScrollPane",
    gun: "flax.MCGunner",
    gun1: "flax.MCGunner",
    soundBtn: "flax.SoundButton"
};
flax.ASSET_NONE = 0;
flax.ASSET_ANIMATOR = 1;
flax.ASSET_MOVIE_CLIP = 2;
flax.ASSET_IMAGE = 3;
flax.registerClass = function(a, b) {
    flax._assetsClassMap[a] = b
};
flax.registerMcClass = function(a, b) {
    flax._assetsMcClassMap[a] = b
};
flax.AssetsManager = cc.Class.extend({
    framesCache: null,
    displaysCache: null,
    displayDefineCache: null,
    mcsCache: null,
    subAnimsCache: null,
    fontsCache: null,
    toolsVersion: null,
    init: function() {
        this.framesCache = {};
        this.displaysCache = {};
        this.displayDefineCache = {};
        this.mcsCache = {};
        this.subAnimsCache = {};
        this.fontsCache = {};
        this.toolsVersion = {}
    },
    getAssetType: function(a, b) {
        if (this.getMc(a, b)) return flax.ASSET_MOVIE_CLIP;
        var c = this.getDisplayDefine(a, b);
        return c ? "jpg" == c.type || "png" == c.type ? flax.ASSET_IMAGE: "share" == c.type ? this.getAssetType(this._getSharedPlist(a, c), b) : flax.ASSET_ANIMATOR: flax.ASSET_NONE
    },
    createDisplay: function(a, b, c, d, e) {
        if (null == a || null == b) throw "Please give me assetsFile and assetID!";
        null == e && c && (e = c["class"]);
        if (c && "string" === typeof c || e && "string" !== typeof e) throw "Params error: maybe you are using the old api, please use the latest!";
        this.addAssets(a);
        var f = this.getSubAnims(a, b);
        f.length && (b = b + "$" + f[0]);
        var g = this.getDisplayDefine(a, b);
        if (g && "share" == g.type) return this.createDisplay(this._getSharedPlist(a, g), b, c, d, e);
        f = null;
        if (e && (f = flax.nameToObject(e), null == f)) throw "The class: " + e + " doesn't exist!";
        if (null == f) {
            var k = !1;
            null == g && (g = this.getMc(a, b), k = !0);
            if (g) {
                e = g.type;
                "null" == e && "jpg" != b && "png" != b && (e = b);
                f = flax.nameToObject(e);
                if (null == f) {
                    e = k ? flax._assetsMcClassMap[e] : flax._assetsClassMap[e];
                    if ("flax.Image" == e && g.scale9 && (e = "flax.Scale9Image", null == flax.Scale9Image)) throw "Please add module of 'gui' or 'ccui'(cocos 3.10 later) into project.json if you want to use Scale9Image!";
                    f = flax.nameToObject(e)
                }
                null == f && (f = k ? flax.MovieClip: flax.Animator, e = k ? "flax.MovieClip": "flax.Animator", k && c && !0 === c.batch && (f = flax.MovieClipBatch, e = "flax.MovieClipBatch"))
            } else throw "There is no display with assetID: " + b + " in assets file: " + a + ", or make sure the display is not a BLANK symbol!";
        }
        null == c && (c = {});
        g = null;
        k = c.parent;
        delete c.parent; ! 0 === d ? g = flax.ObjectPool.get(a, e, b).fetch(b, k, c) : (g = f.create ? f.create(a, b) : new f(a, b), g.attr(c), k && k.addChild(g), g.clsName = e);
        return g
    },
    cloneDisplay: function(a, b, c) {
        if (!flax.isFlaxDisplay(a)) throw "cloneDisplay only support flax type display!";
        b = this.createDisplay(a.assetsFile, a.assetID, {
            parent: c ? a.parent: null
        },
        b, a.clsName);
        c && b.setPosition(a.getPosition());
        b.setScale(a.getScale());
        b.setRotation(a.rotation);
        b.zIndex = a.zIndex;
        return b
    },
    removeAssets: function(a) {
        delete this.framesCache[a];
        delete this.displaysCache[a];
        delete this.displayDefineCache[a];
        delete this.mcsCache[a];
        delete this.subAnimsCache[a];
        delete this.fontsCache[a];
        var b = a;
        ".flax" == cc.path.extname(a) && (b = cc.path.changeBasename(b, ".plist"));
        cc.spriteFrameCache.removeSpriteFramesFromFile(b);
        cc.loader.release(b);
        cc.loader.release(cc.path.changeBasename(b, ".png"))
    },
    removeAllAssets: function() {
        for (var a in this.framesCache) this.removeAssets(a)
    },
    addAssets: function(a) {
        if ("undefined" !== typeof this.framesCache[a]) return ! 1;
        var b = a;
        ".flax" == cc.path.extname(a) && (b = cc.path.changeBasename(b, ".plist"));
        var c = cc.loader.getRes(b);
        if (null == c) throw "Make sure you have pre-loaded the resource: " + a;
        var d = c.metadata.version || c.metadata.flaxVersion;
        this.toolsVersion[a] = d || 0;
        if (!d || d < flax.minToolVersion) throw "The resource: " + a + " was exported with the old version of Flax, please do it with current version!";
        d = c.metadata.fps;
        cc.spriteFrameCache.addSpriteFrames(b);
        cc.loader.cache[b] = "loaded!";
        var b = [],
        e = c.frames,
        f;
        for (f in e) b.push(f);
        b.sort();
        this.framesCache[a] = b;
        c.displays && this._parseDisplays(a, c.displays, d);
        c.mcs && this._parseMovieClips(a, c.mcs, d);
        c.fonts && this._parseFonts(a, c.fonts);
        return ! 0
    },
    _parseDisplays: function(a, b, c) {
        var d = [],
        e = null,
        f;
        for (f in b) d.push(f),
        e = b[f],
        e.anchors && (e.anchors = this._parseFrames(e.anchors)),
        e.colliders && (e.colliders = this._parseFrames(e.colliders)),
        e.scale9 && (e.scale9 = flax._strToRect(e.scale9)),
        e.fps = c || cc.game.config.frameRate,
        this.displayDefineCache[a + f] = e,
        this._parseSubAnims(a, f);
        this.displaysCache[a] = d
    },
    _parseMovieClips: function(a, b, c) {
        for (var d in b) {
            var e = b[d];
            e.anchors && (e.anchors = this._parseFrames(e.anchors));
            e.colliders && (e.colliders = this._parseFrames(e.colliders));
            var f, g = e.children,
            k;
            for (k in g) f = g[k],
            f.frames = this._strToArray(f.frames);
            e.fps = c || cc.game.config.frameRate;
            this.mcsCache[a + d] = e;
            this._parseSubAnims(a, d)
        }
    },
    _parseFonts: function(a, b) {
        for (var c in b) this.fontsCache[a + c] = b[c]
    },
    _parseSubAnims: function(a, b) {
        var c = b.split("$"),
        d = c[0],
        c = c[1];
        if (d && c && "" != d && "" != c) {
            var d = a + d,
            e = this.subAnimsCache[d];
            null == e && (e = [], this.subAnimsCache[d] = e);
            e.push(c)
        }
    },
    _parseFrames: function(a) {
        var b = {},
        c;
        for (c in a) b[c] = this._strToArray(a[c]);
        return b
    },
    _strToArray: function(a) {
        a = a.split("|");
        for (var b = -1,
        c = []; ++b < a.length;) {
            var d = a[b];
            "null" === d ? c.push(null) : "" === d ? c.push(c[b - 1]) : c.push(d)
        }
        return c
    },
    _getSharedPlist: function(a, b) {
        return a.slice(0, a.indexOf("/")) + "/" + b.url + ".plist"
    },
    getFrameNames: function(a, b, c) {
        this.addAssets(a);
        a = this.framesCache[a];
        if (null == a) return []; - 1 == b && (b = 0); - 1 == c && (c = a.length - 1);
        return a.slice(parseInt(b), parseInt(c) + 1)
    },
    getFrameNamesOfDisplay: function(a, b) {
        var c = this.getDisplayDefine(a, b);
        if (null == c) throw "There is no display named: " + b + " in assetsFile: " + a;
        return this.getFrameNames(a, c.start, c.end)
    },
    getDisplayDefine: function(a, b) {
        this.addAssets(a);
        return this.displayDefineCache[a + b]
    },
    getDisplayNames: function(a) {
        this.addAssets(a);
        return this.displaysCache[a] || []
    },
    getRandomDisplayName: function(a) {
        a = this.getDisplayNames(a);
        var b = Math.floor(Math.random() * a.length);
        return a[b]
    },
    getMc: function(a, b) {
        this.addAssets(a);
        return this.mcsCache[a + b]
    },
    getSubAnims: function(a, b) {
        this.addAssets(a);
        return this.subAnimsCache[a + b] || []
    },
    getFont: function(a, b) {
        this.addAssets(a);
        return this.fontsCache[a + b]
    },
    getToolVersion: function(a) {
        return this.toolsVersion[a] || 0
    }
});
flax.AssetsManager.create = function() {
    var a = new flax.AssetsManager;
    a.init();
    return a
};
flax.language = {
    current: null,
    index: -1,
    _dict: null,
    _toLoad: null,
    init: function() {
        var a = cc.game.config.language;
        null == a || "" == a ? null == this.current && (a = cc.sys.language, this.update(a)) : this.update(a)
    },
    checkRes: function(a) {
        this._toLoad && -1 == a.indexOf(this._toLoad) && a.push(this._toLoad)
    },
    onLoaded: function(a) {
        if (this._toLoad) {
            this._dict = cc.loader.getRes(this._resPath());
            var b = a.indexOf(this._toLoad); - 1 < b && a.splice(b, 1);
            this._toLoad = null
        }
    },
    getStr: function(a, b) {
        if (null == this._dict) return cc.log("Warning: there is no language defined: " + this.current),
        null;
        var c = this._dict[a];
        if (null == c) cc.log("Warning: there is no language string for key: " + a);
        else if (b) for (a in b) c = c.replace(RegExp("{" + a + "}", "g"), b[a]);
        return c
    },
    update: function(a) {
        null != a && "" != a && a != this.current && (this.current = a, cc.game.config.languages && cc.game.config.languages.length && (flax.languages = cc.game.config.languages), this.index = flax.languages.indexOf(a), -1 == this.index && cc.log("Invalid language: " + a), cc.game.config.languageJson && (this._toLoad = this._resPath(a)))
    },
    _resPath: function(a) {
        return "res/locale/" + (a || this.current) + ".json"
    }
};
flax.updateLanguage = function(a) {
    return flax.language.update(a)
};
flax.getLanguageStr = function(a, b) {
    return flax.language.getStr(a, b)
};
flax._getLanguagePath = function(a) {
    return flax.language._resPath(a)
};
flax.ColliderType = {
    rect: "Rect",
    circle: "Circle",
    polygon: "Poly"
};
flax.Collider = cc.Class.extend({
    name: null,
    owner: null,
    type: flax.ColliderType.rect,
    physicsBody: null,
    physicsFixture: null,
    physicsContact: null,
    _center: null,
    _width: 0,
    _height: 0,
    _rotation: 0,
    _localRect: null,
    _polygons: null,
    ctor: function(a, b) {
        a = a.split(",");
        this.type = a[0];
        this._center = cc.p(parseFloat(a[1]), parseFloat(a[2]));
        this._width = parseFloat(a[3]);
        this._height = parseFloat(a[4]);
        this._rotation = parseFloat(a[5]);
        if (6 < a.length) {
            this._polygons = [];
            for (var c = a[6].split("'"), d = 0; d < c.length - 1; d += 2) {
                var e = {
                    x: parseFloat(c[d]),
                    y: parseFloat(c[d + 1])
                };
                this._polygons.push(e)
            }
        } ! 1 === b && (this._center.x += this._width / 2, this._center.y += this._height / 2);
        this._localRect = cc.rect(this._center.x - this._width / 2, this._center.y - this._height / 2, this._width, this._height)
    },
    setOwner: function(a) {
        this.owner != a && (this.owner = a, this.owner.retain())
    },
    createPhysics: function(a, b, c, d, e, f) {
        if (this.physicsFixture) return this.physicsFixture;
        var g = this.physicsBody = this.owner.physicsBody;
        if (null == g) throw "Please CreatePhysics in its owner firstly!";
        var k = this.getSize(),
        m = this.getCenter(),
        n = flax.getPosition(this.owner, !0),
        p = null;
        if (this.type == flax.ColliderType.circle) p = new Box2D.Collision.Shapes.b2CircleShape,
        p.SetRadius(0.5 * k.width * flax.getScale(this.owner, !0).x / PTM_RATIO),
        n = cc.pSub(m, n),
        p.SetLocalPosition(cc.pMult(n, 1 / PTM_RATIO));
        else if (this.type == flax.ColliderType.rect || this.type == flax.ColliderType.polygon) {
            if (this.type == flax.ColliderType.rect) for (this._polygons = [cc.p( - 0.5 * k.width, -0.5 * k.height), cc.p(0.5 * k.width, -0.5 * k.height), cc.p(0.5 * k.width, 0.5 * k.height), cc.p( - 0.5 * k.width, 0.5 * k.height)], k = 0; k < this._polygons.length; k++) m = this._polygons[k],
            m.x += this._center.x,
            m.y += this._center.y;
            for (var p = new Box2D.Collision.Shapes.b2PolygonShape,
            r = [], k = 0; k < this._polygons.length; k++) m = cc.p(this._polygons[k]),
            m = this.owner.convertToWorldSpace(m),
            m.x -= n.x,
            m.y -= n.y,
            m.x /= PTM_RATIO,
            m.y /= PTM_RATIO,
            r.push(m);
            p.SetAsArray(r)
        } else throw "The physics type: " + this.type + " is not supported!";
        n = new Box2D.Dynamics.b2FixtureDef;
        n.shape = p;
        null == a && (a = 0);
        n.density = a;
        null == b && (b = 0.2);
        n.friction = b;
        null == c && (c = 0);
        n.restitution = c;
        n.isSensor = d;
        null == e && (e = 1);
        null == f && (f = 65535);
        n.filter.categoryBits = e;
        n.filter.maskBits = f;
        this.physicsFixture = g.CreateFixture(n);
        this.physicsFixture.SetUserData(this);
        return this.physicsFixture
    },
    destroyPhysics: function() {
        this.physicsFixture && (flax.removePhysicsFixture(this.physicsFixture), this.physicsBody = this.physicsFixture = null);
        this.owner && (this.owner.release(), this.owner = null)
    },
    checkCollision: function(a) {
        if (a.type == this.type && this.type == flax.ColliderType.rect) return cc.rectIntersectsRect(this.getRect(!0), a.getRect(!0));
        if (a.type == this.type && this.type == flax.ColliderType.circle) {
            var b = this.getCenter(!0),
            c = a.getCenter(!0);
            return cc.pDistance(b, c) <= (this.getSize().width + a.getSize().width) / 2
        }
        if (this.type == flax.ColliderType.rect && a.type == flax.ColliderType.circle) return this._ifRectCollidCircle(this.getRect(!0), a.getRect(!0));
        if (this.type == flax.ColliderType.circle && a.type == flax.ColliderType.rect) return this._ifRectCollidCircle(a.getRect(!0), this.getRect(!0));
        if (this.type == flax.ColliderType.polygon && a.type == flax.ColliderType.rect || this.type == flax.ColliderType.polygon && a.type == flax.ColliderType.circle) return a._ifPolyCollidPoly(this);
        if (a.type == flax.ColliderType.polygon) return this._ifPolyCollidPoly(a)
    },
    containPoint: function(a) {
        return this.containsPoint(a)
    },
    containsPoint: function(a) {
        a = this.owner.convertToNodeSpace(a);
        return this.type == flax.ColliderType.rect ? cc.rectContainsPoint(this._localRect, a) : this.type == flax.ColliderType.polygon ? this._polyContainsPoint(a) : cc.pDistance(a, this._center) <= this._width / 2
    },
    _ifPolyCollidPoly: function(a) {
        for (var b = !1,
        c = a._polygons.length,
        d = Math.floor(c / 2), e = 0, c = c - 1; e <= d && !(c < e); e++, c--) {
            b = a.owner.convertToWorldSpace(a._polygons[e]);
            if (b = this.containsPoint(b)) break;
            if (e === c) break;
            b = a.owner.convertToWorldSpace(a._polygons[c]);
            if (b = this.containsPoint(b)) break
        }
        return b
    },
    _polyContainsPoint: function(a) {
        for (var b = !1,
        c = this._polygons.length,
        d = 0,
        e = c - 1; d < c; e = d++) {
            var f = this._polygons[d],
            e = this._polygons[e];
            f.y > a.y !== e.y > a.y && a.x < (e.x - f.x) * (a.y - f.y) / (e.y - f.y) + f.x && (b = !b)
        }
        return b
    },
    _ifRectCollidCircle: function(a, b) {
        var c = Math.abs(b.x + b.width / 2 - (a.x + a.width / 2)),
        d = Math.abs(b.y + b.height / 2 - (a.y + a.height / 2));
        if (c > a.width / 2 + b.width / 2 || d > a.height / 2 + b.width / 2) return ! 1;
        if (c <= a.width / 2 || d <= a.height / 2) return ! 0;
        c -= a.width / 2;
        d -= a.height / 2;
        return c * c + d * d <= b.width / 2 * b.width / 2
    },
    getRect: function(a) {
        null == a && (a = !0);
        if (!a) return this._localRect;
        var b = this.getCenter(a);
        a = this.getSize(a);
        return cc.rect(b.x - a.width / 2, b.y - a.height / 2, a.width, a.height)
    },
    getCenter: function(a) {
        var b = this.owner.convertToWorldSpace(this._center);
        this.owner.parent && (!1 === a ? b = this.owner.parent.convertToNodeSpace(b) : a instanceof cc.Node && (b = a.convertToNodeSpace(b)));
        return b
    },
    getSize: function(a) {
        var b = flax.getScale(this.owner, a);
        a = this._width * Math.abs(b.x);
        b = this._height * Math.abs(b.y);
        return {
            width: a,
            height: b
        }
    },
    debugDraw: function() {
        var a = this.getRect(!0);
        if (this.type == flax.ColliderType.rect) flax.drawRect(a);
        else {
            var b = cc.DrawNode.create();
            flax.currentScene && flax.currentScene.addChild(b, 99999);
            var c = cc.color(255, 0, 0, 255),
            d = cc.color(0, 255, 0, 122);
            if (this.type == flax.ColliderType.circle) b.drawCircle(this.getCenter(!0), a.width / 2, 0, 360, !1, 1, c, d);
            else {
                for (var e = a = null,
                f = null,
                g = 0; g < this._polygons.length - 1; g++) e = cc.p(this._polygons[g]),
                e = this.owner.convertToWorldSpace(e),
                0 == g && (a = cc.p(e)),
                f = cc.p(this._polygons[g + 1]),
                f = this.owner.convertToWorldSpace(f),
                b.drawSegment(e, f, 1, c, d);
                b.drawSegment(f, a, 1, c, d)
            }
        }
    }
});
flax.addMainCollider = function(a) {
    a.mainCollider || (a.mainCollider = new flax.Collider("Rect,0,0," + a.width + "," + a.height + ",0", !1), a.mainCollider.setOwner(a))
};
flax.onCollideStart = new signals.Signal;
flax.onCollideEnd = new signals.Signal;
flax.onCollidePre = new signals.Signal;
flax.onCollidePost = new signals.Signal;
flax._physicsWorld = null;
flax._physicsListener = null;
flax._physicsRunning = !1;
flax._physicsBodyToRemove = null;
flax._physicsFixtureToRemove = null;
flax.physicsTypeStatic = 0;
flax.physicsTypeKinematic = 1;
flax.physicsTypeDynamic = 2;
flax.physicsWorldPos = cc.p();
flax.createPhysicsWorld = function(a, b) {
    flax._physicsWorld && flax.destroyPhysicsWorld();
    var c = new Box2D.Dynamics.b2World(new Box2D.Common.Math.b2Vec2(a.x, a.y), !0 === b);
    c.SetContinuousPhysics(!0);
    flax.physicsWorldPos = cc.p();
    flax._physicsWorld = c;
    flax._physicsBodyToRemove = [];
    flax._physicsFixtureToRemove = [];
    return c
};
flax.getPhysicsWorld = function() {
    if (null == flax._physicsWorld) throw "Pleas use flax.createPhysicsWorld to create the world firstly!";
    return flax._physicsWorld
};
flax.startPhysicsWorld = function() {
    flax.getPhysicsWorld() && flax.currentScene && !flax._physicsRunning && (flax._createPhysicsListener(), flax.currentScene.schedule(flax._updatePhysicsWorld, 1 / cc.game.config.frameRate), flax._physicsRunning = !0)
};
flax.stopPhysicsWorld = function() {
    flax._physicsRunning && flax.currentScene && (flax.currentScene.unschedule(flax._updatePhysicsWorld), flax._physicsRunning = !1)
};
flax.destroyPhysicsWorld = function() {
    if (flax._physicsWorld) {
        flax.stopPhysicsWorld();
        for (var a = flax._physicsWorld.GetBodyList(); a; a = a.GetNext()) {
            var b = a.GetUserData();
            b && (b._physicsBody = null);
            flax._physicsWorld.DestroyBody(a)
        }
        flax.onCollideStart.removeAll();
        flax.onCollideEnd.removeAll();
        flax.onCollidePre.removeAll();
        flax.onCollidePost.removeAll();
        flax._physicsWorld = null;
        flax._physicsListener = null;
        flax._physicsBodyToRemove = null
    }
};
flax.removePhysicsBody = function(a) { - 1 == flax._physicsBodyToRemove.indexOf(a) && flax._physicsBodyToRemove.push(a)
};
flax.removePhysicsFixture = function(a) { - 1 == flax._physicsFixtureToRemove.indexOf(a) && flax._physicsFixtureToRemove.push(a)
};
flax.physicsRaycast = function(a, b, c, d) {
    flax.getPhysicsWorld().RayCast(function(e, f, g, k) {
        e = e.GetUserData();
        f = cc.pMult(f, PTM_RATIO);
        var m = cc.pSub(c, f);
        g = cc.pMult(g, cc.pDot(m, g));
        m = cc.pSub(c, cc.pMult(g, 2));
        g = flax.getAngle(f, m);
        d && 0 < d && (k = flax.getAngle(b, c), d /= Math.sin(Math.abs(g / 2 - k / 2) * Math.PI / 180), f = cc.pSub(f, flax.getPointOnCircle(cc.p(), d, k)), m = cc.pDistance(b, c), k = cc.pDistance(b, f) / m, m = flax.getPointOnCircle(f, m * (1 - k), g));
        a(e, f, m, k)
    },
    cc.pMult(b, 1 / PTM_RATIO), cc.pMult(c, 1 / PTM_RATIO))
};
flax.physicsSimulate = function(a, b, c) {
    c || (c = flax.frameInterval);
    b = Math.round(b / c);
    for (var d = a.GetPosition(), e = a.GetAngle(), f = {},
    g = 0, k = flax._physicsWorld.GetBodyList(); k; k = k.GetNext()) if (k != a) {
        var m = k.GetType();
        m != flax.physicsTypeStatic && (k.m_type = flax.physicsTypeStatic, k.__tempKey = ++g, f[k.__tempKey] = m)
    }
    m = [];
    for (g = 0; g < b; g++) flax._physicsWorld.Step(c, velocityIterations, positionIterations),
    k = a.GetPosition(),
    m.push(cc.p(k.x * PTM_RATIO, k.y * PTM_RATIO));
    for (k = flax._physicsWorld.GetBodyList(); k; k = k.GetNext()) k.__tempKey && (k.SetType(f[k.__tempKey]), delete k.__tempKey);
    a.SetPositionAndAngle(d, e);
    return m
};
flax._createPhysicsListener = function() {
    flax._physicsListener || (flax._physicsListener = new Box2D.Dynamics.b2ContactListener, flax._physicsListener.BeginContact = function(a) {
        var b = a.GetFixtureA(),
        c = a.GetFixtureB(),
        b = b.GetUserData() || b,
        c = c.GetUserData() || c;
        b.owner && null == b.owner.parent || c.owner && null == c.owner.parent || (b.physicsContact = c.physicsContact = a, flax.onCollideStart.dispatch(b, c), b.physicsContact = c.physicsContact = null)
    },
    flax._physicsListener.EndContact = function(a) {
        var b = a.GetFixtureA(),
        c = a.GetFixtureB(),
        b = b.GetUserData() || b,
        c = c.GetUserData() || c;
        b.owner && null == b.owner.parent || c.owner && null == c.owner.parent || (b.physicsContact = c.physicsContact = a, flax.onCollideEnd.dispatch(b, c), b.physicsContact = c.physicsContact = null)
    },
    flax._physicsListener.PreSolve = function(a, b) {
        var c = a.GetFixtureA(),
        d = a.GetFixtureB(),
        c = c.GetUserData() || c,
        d = d.GetUserData() || d;
        c.owner && null == c.owner.parent || d.owner && null == d.owner.parent || (c.physicsContact = d.physicsContact = a, flax.onCollidePre.dispatch(c, d), c.physicsContact = d.physicsContact = null)
    },
    flax._physicsListener.PostSolve = function(a, b) {
        var c = a.GetFixtureA(),
        d = a.GetFixtureB(),
        c = c.GetUserData() || c,
        d = d.GetUserData() || d;
        c.owner && null == c.owner.parent || d.owner && null == d.owner.parent || (c.physicsContact = d.physicsContact = a, flax.onCollidePost.dispatch(c, d), c.physicsContact = d.physicsContact = null)
    },
    flax._physicsWorld.SetContactListener(flax._physicsListener))
};
flax.createPhysicalWalls = function(a, b) {
    if (null == a || 0 == a.length) a = [1, 1, 1, 1];
    var c = flax.getPhysicsWorld(),
    d = new Box2D.Dynamics.b2FixtureDef;
    d.density = 1;
    null == b && (b = 3);
    d.friction = b;
    var e = new Box2D.Dynamics.b2BodyDef,
    f = cc.director.getWinSize();
    e.type = Box2D.Dynamics.b2Body.b2_staticBody;
    d.shape = new Box2D.Collision.Shapes.b2PolygonShape;
    d.shape.SetAsBox(0.5 * f.width / PTM_RATIO, 0.5);
    a[0] && (e.position.Set(0.5 * f.width / PTM_RATIO, f.height / PTM_RATIO), c.CreateBody(e).CreateFixture(d));
    a[1] && (e.position.Set(0.5 * f.width / PTM_RATIO, 0), c.CreateBody(e).CreateFixture(d));
    d.shape.SetAsBox(0.5, 0.5 * f.height / PTM_RATIO);
    a[2] && (e.position.Set(0, 0.5 * f.height / PTM_RATIO), c.CreateBody(e).CreateFixture(d));
    a[3] && (e.position.Set(f.width / PTM_RATIO, 0.5 * f.height / PTM_RATIO), c.CreateBody(e).CreateFixture(d))
};
var velocityIterations = 8,
positionIterations = 1;
flax._updatePhysicsWorld = function(a) {
    for (var b = flax._physicsFixtureToRemove.length; b--;) {
        var c = flax._physicsFixtureToRemove[b],
        d = c.GetBody();
        d && d.DestroyFixture(c);
        flax._physicsFixtureToRemove.splice(b, 1)
    }
    for (b = flax._physicsBodyToRemove.length; b--;) flax._physicsWorld.DestroyBody(flax._physicsBodyToRemove[b]),
    flax._physicsBodyToRemove.splice(b, 1);
    flax._physicsWorld.Step(a, velocityIterations, positionIterations);
    for (a = flax._physicsWorld.GetBodyList(); a; a = a.GetNext()) b = a.GetUserData(),
    null != b && null != b && b.parent && (c = cc.p(a.GetPosition()), c.x *= PTM_RATIO, c.y *= PTM_RATIO, c = cc.pAdd(c, flax.physicsWorldPos), c = b.parent.convertToNodeSpace(c), b.x = c.x, b.y = c.y, !0 !== b.ignoreBodyRotation && (b.rotation = -1 * RADIAN_TO_DEGREE * a.GetAngle(), b.rotation += a.__rotationOffset))
};
flax._debugBox2DNode = null;
flax.debugDrawPhysics = function() {
    null == flax._debugBox2DNode && (flax._debugBox2DNode = new flax.DebugBox2DNode(flax.getPhysicsWorld()), flax.currentScene.addChild(flax._debugBox2DNode, Number.MAX_VALUE))
};
flax.DebugBox2DNode = cc.Node.extend({
    _refWorld: null,
    ctor: function(a) {
        this._super();
        this._refWorld = a;
        a = Box2D.Dynamics.b2DebugDraw;
        var b = new a;
        b.SetSprite(document.getElementById("gameCanvas").getContext("2d"));
        var c = PTM_RATIO * cc.view.getViewPortRect().width / cc.view.getDesignResolutionSize().width;
        b.SetDrawScale(c);
        b.SetFillAlpha(0.5);
        b.SetLineThickness(1);
        b.SetFlags(a.e_shapeBit | a.e_jointBit | a.e_centerOfMassBit);
        this._refWorld.SetDebugDraw(b)
    },
    draw: function(a) {
        this._super();
        this._refWorld && (a.scale(1, -1), this._refWorld.DrawDebugData(), a.scale(1, 1), a.translate(0, 0))
    }
});
flax.TileMapModule = {
    tx: 0,
    ty: 0,
    autoUpdateTileWhenMove: !0,
    tileValue: TileValue.WALKABLE,
    _tileMap: null,
    _tileInited: !1,
    onEnter: function() {
        this._tileMap && !this._tileInited && this.updateTile(!0)
    },
    onExit: function() {
        this._tileMap && this._tileMap.removeObject(this);
        this._tileMap = null;
        this._tileInited = !1
    },
    onPosition: function() {
        this.autoUpdateTileWhenMove && this._tileMap && this.updateTile()
    },
    getTileMap: function() {
        return this._tileMap
    },
    setTileMap: function(a) { ! a || a instanceof flax.TileMap || (a = flax.getTileMap(a));
        this._tileMap != a && (this._tileMap && this._tileMap.removeObject(this), this._tileMap = a, null != this._tileMap && this.parent && this.updateTile(!0))
    },
    updateTile: function(a) {
        if (this._tileMap) {
            var b = this.getPosition();
            this.parent && (b = this.parent.convertToWorldSpace(b));
            b = this._tileMap.getTileIndex(b);
            this.setTile(b.x, b.y, a)
        }
    },
    setTile: function(a, b, c) {
        if (!0 === c || a != this.tx || b != this.ty) {
            c = this.tx;
            var d = this.ty;
            this.tx = a;
            this.ty = b;
            this._tileMap && this.parent && (this._tileMap.removeObject(this, c, d), this.parent && (this._tileMap.addObject(this), this._tileInited = !0))
        }
    },
    snapToTile: function(a, b, c) {
        this._tileMap.snapToTile(this, a, b, c)
    }
};
var HLayoutType = {
    LEFT: 0,
    CENTER: 1,
    RIGHT: 2
},
VLayoutType = {
    BOTTOM: 0,
    MIDDLE: 1,
    TOP: 2
};
flax.getLayoutPosition = function(a, b, c) {
    var d = flax.getRect(a, !0),
    e = cc.visibleRect.center,
    f = a.getAnchorPointInPoints(),
    g = 0,
    k = 0;
    switch (b) {
    case HLayoutType.LEFT:
        g = 0;
        break;
    case HLayoutType.CENTER:
        g = e.x - d.width / 2;
        break;
    case HLayoutType.RIGHT:
        g = cc.visibleRect.right.x - d.width
    }
    switch (c) {
    case VLayoutType.BOTTOM:
        k = 0;
        break;
    case VLayoutType.MIDDLE:
        k = e.y - d.height / 2;
        break;
    case VLayoutType.TOP:
        k = cc.visibleRect.top.y - d.height
    }
    d = flax.getScale(a, !0);
    b = cc.p(g + (b ? 0 : cc.visibleRect.bottomLeft.x) + f.x * d.x, k + (c ? 0 : cc.visibleRect.bottomLeft.y) + f.y * d.y);
    a.parent && (b = a.parent.convertToNodeSpace(b));
    return b
};
flax.ScreenLayoutModule = {
    _isAutoLayout: !1,
    _hlayout: null,
    _vlayout: null,
    _offsetX: 0,
    _offsetY: 0,
    onEnter: function() {
        flax.onDeviceRotate.add(this._updateLayout, this);
        flax.onScreenResize.add(this._updateLayout, this)
    },
    onExit: function() {
        flax.onDeviceRotate.remove(this._updateLayout, this);
        flax.onScreenResize.remove(this._updateLayout, this)
    },
    setLayoutOffset: function(a, b) {
        this._offsetX = a;
        this._offsetY = b;
        this._updateLayout()
    },
    setLayout: function(a, b) {
        this._isAutoLayout = !1;
        this._hlayout = a;
        this._vlayout = b;
        var c = flax.getLayoutPosition(this, a, b);
        c.x += this._offsetX;
        c.y += this._offsetY;
        this.setPosition(c)
    },
    autoLayout: function() {
        if (cc.view.getResolutionPolicy() == cc.ResolutionPolicy.NO_BORDER) {
            this._isAutoLayout = !0;
            var a = flax.getRect(this, this.parent),
            b = cc.visibleRect.center,
            c = this.getAnchorPointInPoints(),
            d = 0,
            e = cc.visibleRect.width / flax.designedStageSize.width;
            if (1 != e) {
                var f = this.x - b.x;
                0 < f && (d = a.width);
                f = a.x + d - b.x;
                this.x = b.x + f * e + c.x * this.scaleX - d + this._offsetX
            }
            e = cc.visibleRect.height / flax.designedStageSize.height;
            1 != e && (f = this.y - b.y, d = 0, 0 < f && (d = a.height), f = a.y + d - b.y, this.y = b.y + f * e + c.y * this.scaleY - d + this._offsetY)
        }
    },
    _updateLayout: function(a) {
        this._isAutoLayout ? this.autoLayout() : null != this._hlayout && null != this._vlayout && this.setLayout(this._hlayout, this._vlayout)
    }
};
flax.PhysicsModule = {
    _physicsBody: null,
    _physicsToBeSet: null,
    _physicsBodyParam: null,
    _physicsColliders: null,
    onEnter: function() {
        null == this._physicsColliders && (this._physicsColliders = []);
        this._physicsBodyParam && this.createPhysics(this._physicsBodyParam.type, this._physicsBodyParam.fixedRotation, this._physicsBodyParam.bullet);
        if (this._physicsToBeSet) for (var a in this._physicsToBeSet) {
            var b = this.getCollider(a),
            c = this._physicsToBeSet[a];
            b.createPhysics(c.density, c.friction, c.restitution, c.isSensor, c.catBits, c.maskBits);
            delete this._physicsToBeSet[a]; - 1 == this._physicsColliders.indexOf(b) && this._physicsColliders.push(b)
        }
    },
    onExit: function() {
        for (var a = 0; a < this._physicsColliders.length; a++) this._physicsColliders[a].destroyPhysics();
        this._physicsColliders = [];
        this._physicsBody && (flax.removePhysicsBody(this._physicsBody), this._physicsBody = null);
        this._physicsBodyParam = null
    },
    getPhysicsBody: function() {
        return this._physicsBody
    },
    createPhysics: function(a, b, c) {
        null == a && (a = Box2D.Dynamics.b2Body.b2_dynamicBody);
        this._physicsBodyParam = {
            type: a,
            fixedRotation: b,
            bullet: c
        };
        if (!this.parent) return null;
        if (null == this._physicsBody) {
            var d = new Box2D.Dynamics.b2BodyDef;
            d.type = a;
            d.fixedRotation = b;
            d.bullet = c;
            d.userData = this;
            a = flax.getPosition(this, !0);
            d.position.Set(a.x / PTM_RATIO, a.y / PTM_RATIO);
            this._physicsBody = flax.getPhysicsWorld().CreateBody(d);
            this._physicsBody.__rotationOffset = this.rotation
        }
        return this._physicsBody
    },
    destroyPhysics: function() {
        this.removePhysicsShape()
    },
    addPhysicsShape: function(a, b, c, d, e, f, g) {
        if (null == this._physicsBody) throw "Please createPhysics firstly!";
        var k = this.getCollider(a);
        if (null == k) return cc.log("There is no collider named: " + a),
        null;
        if (k.physicsFixture) return k.physicsFixture;
        var m = {
            density: b,
            friction: c,
            restitution: d,
            isSensor: e,
            catBits: f,
            maskBits: g
        };
        if (this.parent) return k.setOwner(this),
        a = k.createPhysics(b, c, d, e, f, g),
        -1 == this._physicsColliders.indexOf(k) && this._physicsColliders.push(k),
        a;
        null == this._physicsToBeSet && (this._physicsToBeSet = {});
        null == this._physicsToBeSet[a] && (this._physicsToBeSet[a] = m);
        return null
    },
    removePhysicsShape: function(a) {
        for (var b = this._physicsColliders.length; b--;) {
            var c = this._physicsColliders[b];
            if (null == a || c.name == a) c.destroyPhysics(),
            this._physicsColliders.splice(b, 1)
        }
        0 == this._physicsColliders.length && (flax.removePhysicsBody(this._physicsBody), this._physicsBody = null)
    }
};
flax.MoveModule = {
    gravityOnMove: null,
    destroyWhenReach: !1,
    destroyWhenOutofStage: !1,
    moveSpeed: null,
    moveAcc: null,
    restrainRect: null,
    inRandom: !1,
    _moveSpeedLen: 0,
    _targetPos: null,
    _inMoving: !1,
    _callBack: null,
    _callContext: null,
    onEnter: function() {},
    onExit: function() {
        this.destroyWhenOutofStage = this.destroyWhenReach = !1;
        this.restrainRect = this.gravityOnMove = null;
        this._inMoving = this.inRandom = !1
    },
    moveTo: function(a, b, c, d) {
        this.inRandom = !1;
        this._targetPos = a;
        this._callBack = c;
        this._callContext = d;
        a = cc.pSub(a, this.getPosition());
        1 > cc.pLength(a) || !b || 0 >= b ? this.scheduleOnce(this._moveOver, 0.01) : (this.moveSpeed = cc.pMult(a, 1 / b), this._moveSpeedLen = cc.pLength(this.moveSpeed), this.resumeMove())
    },
    moveToBySpeed: function(a, b, c, d) {
        this.inRandom = !1;
        this._targetPos = a;
        this._callBack = c;
        this._callContext = d;
        a = cc.pSub(a, this.getPosition());
        c = cc.pLength(a);
        1 > c ? this.scheduleOnce(this._moveOver, 0.01) : (this.moveSpeed = cc.pMult(a, b / c), this._moveSpeedLen = cc.pLength(this.moveSpeed), this.resumeMove())
    },
    moveBySpeed: function(a, b) {
        this._callBack = this._targetPos = null;
        this.inRandom = !1;
        this.moveSpeed = "object" === typeof a ? a: flax.getPointOnCircle(cc.p(), a, b);
        this.resumeMove()
    },
    moveRandomly: function(a, b, c) {
        this.restrainRect = c || flax.stageRect;
        this.moveBySpeed(a, b || 360 * Math.random());
        this.inRandom = null == b
    },
    pauseMove: function() {
        this._inMoving && (this.unschedule(this._doMove), this._inMoving = !1)
    },
    resumeMove: function() {
        this._inMoving || (this._inMoving = !0, this.schedule(this._doMove, flax.frameInterval, cc.REPEAT_FOREVER))
    },
    stopMove: function() {
        this._inMoving && (this._targetPos = this.moveSpeed = null, this._inMoving = !1, this.restrainRect = this._callBack = null, this.inRandom = !1, this.unschedule(this._doMove))
    },
    _doMove: function(a) {
        var b = this.getPosition();
        if ((this._targetPos ? cc.pDistance(b, this._targetPos) : Number.maxValue) < this._moveSpeedLen * a || this.destroyWhenOutofStage && !cc.rectContainsRect(flax.stageRect, flax.getRect(this, !0))) this._moveOver(),
        this.stopMove();
        else {
            var c = flax.getRect(this, this.parent);
            if (this.restrainRect) {
                var d = 0,
                e = 0;
                c.x < this.restrainRect.x ? d = 1 : c.x > this.restrainRect.x + this.restrainRect.width - c.width && (d = -1);
                c.y < this.restrainRect.y ? e = 1 : c.y > this.restrainRect.y + this.restrainRect.height - c.height && (e = -1);
                this.inRandom && (d && (this.moveSpeed.x = d * Math.abs(this.moveSpeed.x)), e && (this.moveSpeed.y = e * Math.abs(this.moveSpeed.y)))
            }
            c = this.moveAcc;
            this.gravityOnMove && (c = cc.pAdd(c || cc.p(), this.gravityOnMove));
            c && (this.moveSpeed = cc.pAdd(this.moveSpeed, cc.pMult(c, a)));
            this.setPosition(cc.pAdd(b, cc.pMult(this.moveSpeed, a)))
        }
    },
    _moveOver: function() {
        this._targetPos && this.setPosition(this._targetPos);
        this._callBack && (this._callBack.apply(this._callContext || this), this._callBack = null);
        this.destroyWhenReach && this.destroy()
    }
};
flax.Anchor = cc.Class.extend({
    x: 0,
    y: 0,
    zIndex: 0,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    ctor: function(a) {
        a = a.split(",");
        this.x = parseFloat(a[0]);
        this.y = parseFloat(a[1]);
        2 < a.length && (this.zIndex = parseInt(a[2]));
        3 < a.length && (this.rotation = parseFloat(a[3]));
        4 < a.length && (this.scaleX = parseFloat(a[4]));
        5 < a.length && (this.scaleY = parseFloat(a[5]));
        cc.log(this.scaleX + "," + a.length)
    }
});
flax._sprite = {
    __instanceId: null,
    onAnimationOver: null,
    onSequenceOver: null,
    onFrameChanged: null,
    onFrameLabel: null,
    autoDestroyWhenOver: !1,
    autoStopWhenOver: !1,
    autoHideWhenOver: !1,
    autoRecycle: !1,
    currentFrame: 0,
    currentAnim: null,
    totalFrames: 0,
    frameInterval: 0,
    ignoreBodyRotation: !1,
    define: null,
    name: null,
    assetsFile: null,
    assetID: null,
    clsName: "flax.FlaxSprite",
    playing: !1,
    _prevFrame: -1,
    _labelFrames: null,
    _labelSounds: null,
    _loopStart: 0,
    _loopEnd: 0,
    _isLanguageElement: !1,
    __isFlaxSprite: !0,
    __isInputMask: !1,
    _fps: 24,
    _colliders: null,
    _mainCollider: null,
    _definedMainCollider: !1,
    _anchorBindings: null,
    _inited: !1,
    _mouseEnabled: !0,
    _baseAssetID: null,
    _subAnims: null,
    _animSequence: null,
    _loopSequence: !1,
    _sequenceIndex: 0,
    _fpsForAnims: null,
    _isAnimationOverStop: !1,
    ctor: function(a, b) {
        if ("flax.FlaxSprite" == this.clsName) throw "flax.FlaxSprite is an abstract class, please use flax.Animator or flax.MovieClip!";
        this instanceof cc.SpriteBatchNode ? cc.SpriteBatchNode.prototype.ctor.call(this, cc.path.changeExtname(a, ".png")) : cc.Sprite.prototype.ctor.call(this);
        if (!a || !b) throw "Please set assetsFile and assetID to me!";
        this.__instanceId = ClassManager.getNewInstanceId();
        this._anchorBindings = [];
        this._animSequence = [];
        this._fpsForAnims = {};
        this.onAnimationOver = new signals.Signal;
        this.onSequenceOver = new signals.Signal;
        this.onFrameChanged = new signals.Signal;
        this.onFrameLabel = new signals.Signal;
        this.setSource(a, b)
    },
    setSource: function(a, b) {
        if (null == a || null == b) throw "assetsFile and assetID can not be null!";
        if (this.assetsFile != a || this.assetID != b && this._baseAssetID != b) {
            this.assetsFile = a;
            this.currentAnim = null;
            this.assetID = this._handleSumAnims(b);
            this.define = this.getDefine();
            var c = this.define.anchorX,
            d = this.define.anchorY;
            isNaN(c) || isNaN(d) || this.setAnchorPoint(c, d);
            0 == this.fps && (this.fps = this.define.fps);
            this.onNewSource();
            this.currentFrame = 0;
            this._initFrameLabels();
            this.renderFrame(this.currentFrame, !0);
            this._initColliders();
            this.parent && this._updateLaguage();
            null == this.__pool__id__ && (this.__pool__id__ = this.assetID);
            this.currentAnim && this.onFrameLabel.dispatch(this.currentAnim)
        }
    },
    _handleSumAnims: function(a) {
        a = a.split("$");
        this._baseAssetID = a[0];
        this._subAnims = flax.assetsManager.getSubAnims(this.assetsFile, this._baseAssetID);
        var b = a[1];
        null == b && this._subAnims && (b = this._subAnims[0]);
        a = this._baseAssetID;
        b && (a = this._baseAssetID + "$" + b, this.currentAnim = b);
        return a
    },
    _initFrameLabels: function() {
        this._labelFrames = [];
        this._frameSounds = {};
        var a = this.define.labels;
        if (a) {
            for (var b in a) {
                var c = a[b]; - 1 < b.indexOf("@") ? (null == this.define.sounds && (this.define.sounds = {}), this.define.sounds["" + c.start] = DEFAULT_SOUNDS_FOLDER + b.slice(0, b.indexOf("@")), delete a[b]) : this._labelFrames.push(c.start)
            }
            flax.copyProperties(this.define.sounds, this._frameSounds)
        }
    },
    setFpsForAnim: function(a, b) {
        this._fpsForAnims[a] = b
    },
    addFrameSound: function(a, b) {
        this._frameSounds["" + a] = b
    },
    removeFrameSound: function(a) {
        delete this._frameSounds["" + a]
    },
    getLabels: function(a) {
        return this.define.labels ? this.define.labels[a] : null
    },
    hasLabel: function(a) {
        return null != this.getLabels(a)
    },
    getMainCollider: function() {
        return this.getCollider("main") || this._mainCollider
    },
    getCollider: function(a) {
        var b = null;
        this._colliders && (a = this._colliders[a], null != a && (b = a[this.currentFrame]));
        return b
    },
    _initColliders: function() {
        this._mainCollider = null;
        this._colliders = {};
        var a = this.define.colliders;
        if (a) {
            var b = null,
            c;
            for (c in a) {
                this._colliders[c] = [];
                for (var d = a[c], e = -1; ++e < d.length;) if (null == d[e]) this._colliders[c][e] = null;
                else if (b = this._colliders[c][e] = new flax.Collider(d[e]), b.name = c, b.setOwner(this), "main" == c || "base" == c) this._mainCollider = b
            }
        }
        this._definedMainCollider = null != this._mainCollider;
        this._definedMainCollider || (this._mainCollider = new flax.Collider("Rect,0,0," + this.width + "," + this.height + ",0", !1), this._mainCollider.name = "main", this._mainCollider.setOwner(this))
    },
    getRect: function(a) {
        return this.getMainCollider().getRect(a)
    },
    debugDraw: function() {
        this.getMainCollider().debugDraw()
    },
    getCenter: function(a) {
        return this.getMainCollider().getCenter(a)
    },
    getAnchor: function(a) {
        if (this.define.anchors) {
            var b = this.define.anchors[a];
            if (null != b) return (b = b[this.currentFrame]) && "string" === typeof b && (b = new flax.Anchor(b), this.define.anchors[a][this.currentFrame] = b),
            b
        }
        return null
    },
    bindAnchor: function(a, b, c) {
        if (!this.define.anchors) return cc.log(this.assetID + ": there is no any anchor!"),
        !1;
        if (null == this.define.anchors[a]) return cc.log(this.assetID + ": there is no anchor named " + a),
        !1;
        if (null == b) throw "Node can't be null!";
        if ( - 1 < this._anchorBindings.indexOf(b)) return cc.log(this.assetID + ": anchor has been bound, " + a),
        !1; ! 1 !== c && this._anchorBindings.push(b);
        b.__anchor__ = a;
        this._updateAnchorNode(b, this.getAnchor(a));
        b.parent != this && (b.removeFromParent(!1), this.addChild(b));
        return ! 0
    },
    unbindAnchor: function(a, b) {
        for (var c = null,
        d = -1,
        e = this._anchorBindings.length; ++d < e;) if (c = this._anchorBindings[d], c === a || c.__anchor__ === a) {
            this._anchorBindings.splice(d, 1);
            delete c.__anchor__;
            b && (c.destroy ? c.destroy() : c.removeFromParent());
            break
        }
    },
    getCurrentLabel: function() {
        var a = this.define.labels;
        if (!a) return null;
        for (var b in a) {
            var c = a[b];
            if (this.currentFrame >= c.start && this.currentFrame <= c.end) return b
        }
        return null
    },
    nextFrame: function() {
        this.gotoAndStop(Math.min(++this.currentFrame, this.totalFrames - 1))
    },
    prevFrame: function() {
        this.gotoAndStop(Math.max(--this.currentFrame, 0))
    },
    gotoLoopNext: function(a, b) {
        var c = 0,
        d = this.totalFrames - 1;
        0 < arguments.length && (d = this._getStartAndEndFrame(a, b), c = d[0], d = d[1]);
        c = this.currentFrame >= d ? c: ++this.currentFrame;
        this.gotoAndStop(c)
    },
    gotoLoopPrev: function(a, b) {
        var c = 0,
        d = this.totalFrames - 1;
        0 < arguments.length && (d = this._getStartAndEndFrame(a, b), c = d[0], d = d[1]);
        c = this.currentFrame <= c ? d: --this.currentFrame;
        this.gotoAndStop(c)
    },
    _getStartAndEndFrame: function(a, b) {
        var c = 0,
        d = this.totalFrames - 1;
        if ("string" === typeof a) {
            var e = this.getLabels(a);
            e && (c = e.start);
            e && "string" != typeof b && isNaN(b) && (d = e.end)
        }
        "string" === typeof b && (e = this.getLabels(b)) && (d = e.start);
        isNaN(a) || (c = a);
        isNaN(b) || (d = b);
        return [c, d]
    },
    play: function(a) {
        this._isLanguageElement || this.__isButton || (!0 !== a ? (this._loopStart = 0, this._loopEnd = this.totalFrames - 1) : (this._animReversed = !0, this.currentFrame = this._loopStart = this.totalFrames - 1, this._loopEnd = 0), this.updatePlaying(!0), this.currentAnim = null)
    },
    playSequence: function(a) {
        if (null == a) return ! 1;
        a instanceof Array || (a = Array.prototype.slice.call(arguments));
        if (0 == a.length) return ! 1;
        this._loopSequence = !1;
        this._sequenceIndex = 0;
        var b = this.gotoAndPlay(a[0]);
        this._animSequence = a;
        return b
    },
    playSequenceLoop: function(a) {
        a instanceof Array || (a = Array.prototype.slice.call(arguments));
        this.playSequence(a);
        this._loopSequence = !0
    },
    stopSequence: function() {
        this._loopSequence = !1;
        this._animSequence.length = 0
    },
    _setSubAnim: function(a, b) {
        if (!a || 0 == a.length) return ! 1;
        if (null == this._subAnims || -1 == this._subAnims.indexOf(a)) return this.__isButton || cc.log(this.parent.name + "---\x3e" + this.name + ": There is no animation named: " + a),
        !1;
        this.setSource(this.assetsFile, this._baseAssetID + "$" + a); ! 1 === b ? this.gotoAndStop(0) : (this._fpsForAnims[a] && this.setFPS(this._fpsForAnims[a]), this.gotoAndPlay(0));
        this.currentAnim = a;
        this._animTime = 0;
        return ! 0
    },
    gotoAndPlay: function(a, b) {
        this._animReversed = !1;
        if (this._isLanguageElement || this.__isButton) return ! 1;
        if ("string" === typeof a) {
            if (this.playing && this.currentAnim == a && !0 !== b) return ! 0;
            var c = this.getLabels(a);
            if (null == c) return c = this._setSubAnim(a, !0),
            c || (cc.log(this.parent.name + "---\x3e" + this.name + ": There is no animation named: " + a), this.play()),
            c;
            this._loopStart = c.start;
            this._loopEnd = c.end;
            this.currentFrame = this._loopStart;
            this.currentAnim = a;
            this._fpsForAnims[a] && this.setFPS(this._fpsForAnims[a])
        } else {
            if (!this.isValideFrame(a)) return cc.log(this.parent.name + "---\x3e" + this.name + ": The frame: " + a + " is out of range!"),
            !1;
            this._loopStart = 0;
            this._loopEnd = this.totalFrames - 1;
            this.currentFrame = a;
            this.currentAnim = null
        }
        this.renderFrame(this.currentFrame);
        this.updatePlaying(!0);
        this._animTime = 0;
        return ! 0
    },
    stop: function() {
        this._animReversed = !1;
        this.updatePlaying(!1);
        this.currentAnim = null
    },
    gotoAndStop: function(a, b) {
        this._isAnimationOverStop = void 0 === b ? !1 : b;
        this._animReversed = !1;
        if (isNaN(a)) {
            var c = this.getLabels(a);
            if (null == c) return (c = this._setSubAnim(a, !1)) || this.__isButton || cc.log(this.parent.name + "---\x3e" + this.name + ": There is no animation named: " + a),
            c;
            a = c.start
        }
        this.currentAnim = null;
        if (!this.isValideFrame(a)) return cc.log(this.parent.name + "---\x3e" + this.name + ": The frame: " + a + " is out of range!"),
        !1;
        this.updatePlaying(!1);
        this.currentFrame = a;
        this.renderFrame(a);
        return ! 0
    },
    setFPS: function(a) {
        this._fps != a && (this._fps = a, this.updateSchedule())
    },
    getFPS: function() {
        return this._fps
    },
    updatePlaying: function(a) {
        this.playing != a && (this.playing = a, this.updateSchedule())
    },
    updateSchedule: function() {
        this.playing ? (this.unschedule(this.onFrame), 1 < this.totalFrames && this.schedule(this.onFrame, 1 / this._fps)) : this.unschedule(this.onFrame)
    },
    _animTime: 0,
    _animReversed: !1,
    onFrame: function(a) {
        if (this.visible) {
            var b = this._animReversed;
            this.currentFrame += b ? -1 : 1;
            this._animTime += a;
            a = b ? this.currentFrame < this._loopEnd: this.currentFrame > this._loopEnd;
            var c = !1;
            a && (this.currentFrame = this._loopEnd, (this.autoDestroyWhenOver || this.autoStopWhenOver || this.autoHideWhenOver) && this.updatePlaying(!1), this.onAnimationOver.getNumListeners() && (this.onAnimationOver.dispatch(this), c = !0), this.autoDestroyWhenOver ? this.destroy() : this.autoHideWhenOver ? this.visible = !1 : this._animSequence.length ? this._playNext() : this.autoStopWhenOver || (this.currentFrame = this._loopStart), this._animTime = 0); ! this._isAnimationOverStop && (a = b ? this.currentFrame < this._loopEnd: this.currentFrame > this._loopEnd, b = b ? 0 > this.currentFrame: this.currentFrame > this.totalFrames - 1, a || b) && (this.currentFrame = this._loopStart);
            c && (this._isAnimationOverStop = !1);
            this.renderFrame(this.currentFrame)
        }
    },
    _playNext: function() {
        this._sequenceIndex++;
        if (this._sequenceIndex >= this._animSequence.length && (this._loopSequence ? this._sequenceIndex = 0 : (this.autoStopWhenOver || this.gotoAndPlay(this._animSequence[this._sequenceIndex - 1], !0), this._animSequence = []), this.onSequenceOver.getNumListeners() && this.onSequenceOver.dispatch(this), 0 != this._sequenceIndex)) return;
        var a = this._animSequence,
        b = a[this._sequenceIndex];
        if ("number" === typeof b) if (this._loopSequence && this._sequenceIndex == a.length - 1 ? this._sequenceIndex = 0 : this._sequenceIndex++, a.length > this._sequenceIndex && "string" === typeof a[this._sequenceIndex]) {
            var c = b,
            b = a[this._sequenceIndex];
            this.scheduleOnce(function() {
                this.gotoAndPlay(b)
            },
            c - this._animTime);
            this.updatePlaying(!1)
        } else this._animSequence = [],
        this.currentFrame = this._loopStart;
        else this.gotoAndPlay(b)
    },
    isValideFrame: function(a) {
        return 0 <= a && a < this.totalFrames
    },
    renderFrame: function(a, b) {
        if (this._prevFrame != a || !0 == b) {
            this._prevFrame != a && (this._prevFrame = a);
            this._handleAnchorBindings();
            this._updateCollider();
            this.doRenderFrame(a);
            this.onFrameChanged.getNumListeners() && this.onFrameChanged.dispatch(this.currentFrame); - 1 < this._labelFrames.indexOf(a) && this.onFrameLabel.dispatch(this.getCurrentLabel(a));
            var c = this._frameSounds["" + a];
            c && flax.playSound(c)
        }
    },
    doRenderFrame: function(a) {},
    _handleAnchorBindings: function() {
        for (var a = null,
        b = null,
        c = -1,
        d = this._anchorBindings.length; ++c < d;) a = this._anchorBindings[c],
        a.visible && (b = this.getAnchor(a.__anchor__), null != b && this._updateAnchorNode(a, b))
    },
    _updateAnchorNode: function(a, b) {
        null != b && (a.x = b.x, a.y = b.y, a.zIndex = b.zIndex, a.rotation = b.rotation, a.setScaleX(b.scaleX), a.setScaleY(b.scaleY))
    },
    onEnter: function() {
        this._super();
        this._destroyed = !1;
        this._updateCollider();
        this._updateLaguage();
        flax.callModuleOnEnter(this);
        this.__fromPool && (this.__fromPool = !1, this.release())
    },
    onExit: function() {
        this._super();
        this._destroyed = !0;
        this.onAnimationOver.removeAll();
        this.onSequenceOver.removeAll();
        this.onFrameChanged.removeAll();
        this.onFrameLabel.removeAll();
        flax.inputManager && (flax.inputManager.removeListener(this), this.__isInputMask && flax.inputManager.removeMask(this));
        for (var a = null,
        b = -1,
        c = this._anchorBindings.length; ++b < c;) a = this._anchorBindings[b],
        a.destroy ? a.destroy() : a.removeFromParent(!0),
        delete a.__anchor__;
        this._anchorBindings.length = 0;
        flax.callModuleOnExit(this)
    },
    _updateLaguage: function() {
        flax.language && (this._isLanguageElement = -1 < flax.language.index && this.name && 0 == this.name.indexOf("label__")) && (this.gotoAndStop(flax.language.index) || this.gotoAndStop(0))
    },
    _updateCollider: function() {},
    setPosition: function(a, b) {
        var c = !1,
        c = this.getPositionX(),
        d = this.getPositionY();
        void 0 === b ? (c = a.x != c || a.y != d) && this._super(a) : (c = a != c || b != d) && this._super(a, b);
        c && this.parent && (flax.callModuleFunction(this, "onPosition"), this._updateCollider())
    },
    setPositionX: function(a) {
        this.setPosition(a, this.getPositionY())
    },
    setPositionY: function(a) {
        this.setPosition(this.getPositionX(), a)
    },
    setLocalZOrder: function(a) {
        this._localZOrder !== a && (this._parent && this._parent.reorderChild(this, a), cc.eventManager._setDirtyForNode(this), this._localZOrder = a)
    },
    _destroyed: !1,
    destroy: function() {
        this._destroyed || (this._destroyed = !0, this.parent && !0 === this.parent.__isMovieClip && this.parent.namedChildren[this.name] == this && (delete this.parent.namedChildren[this.name], delete this.parent[this.name]), this.autoRecycle && flax.ObjectPool.get(this.assetsFile, this.clsName, this.__pool__id__ || "").recycle(this), this.removeFromParent(), this.autoRecycle = !1)
    },
    onRecycle: function() {
        this.setScale(1);
        0 == this._realOpacity ? this.opacity = 0 : this.opacity = 255;
        this.rotation = 0;
        this.ignoreBodyRotation = this.autoHideWhenOver = this.autoStopWhenOver = this.autoDestroyWhenOver = !1;
        RESET_FRAME_ON_RECYCLE && this.gotoAndStop(0);
        this.setPosition(0, 0);
        this._animSequence.length = 0;
        this._loopSequence = !1;
        this._sequenceIndex = 0;
        this._animReversed = !1;
        this.currentAnim = null;
        this.__isInputMask = !1
    },
    isMouseEnabled: function() {
        return this._mouseEnabled
    },
    setMouseEnabled: function(a) {
        this._mouseEnabled = a
    },
    getDefine: function() {
        return null
    },
    onNewSource: function() {}
};
flax.FlaxSprite = cc.Sprite.extend(flax._sprite);
flax.FlaxSprite.create = function(a, b) {
    var c = new flax.FlaxSprite(a, b);
    c.clsName = "flax.FlaxSprite";
    return c
};
flax.addModule(flax.FlaxSprite, flax.TileMapModule);
flax.addModule(flax.FlaxSprite, flax.MoveModule);
flax.addModule(flax.FlaxSprite, flax.ScreenLayoutModule);
flax.addModule(flax.FlaxSprite, flax.PhysicsModule);
window.flax.FlaxSprite = flax.FlaxSprite;
flax.FlaxSpriteBatch = cc.SpriteBatchNode.extend(flax._sprite);
flax.FlaxSpriteBatch.create = function(a, b) {
    var c = new flax.FlaxSpriteBatch(a, b);
    c.clsName = "flax.FlaxSpriteBatch";
    return c
};
flax.addModule(flax.FlaxSpriteBatch, flax.TileMapModule);
flax.addModule(flax.FlaxSpriteBatch, flax.MoveModule);
flax.addModule(flax.FlaxSpriteBatch, flax.ScreenLayoutModule);
flax.addModule(flax.FlaxSpriteBatch, flax.PhysicsModule);
window.flax.FlaxSpriteBatch = flax.FlaxSpriteBatch;
_p = flax.FlaxSprite.prototype;
cc.defineGetterSetter(_p, "mainCollider", _p.getMainCollider);
_p.getPhysicsBody && cc.defineGetterSetter(_p, "physicsBody", _p.getPhysicsBody);
cc.defineGetterSetter(_p, "center", _p.getCenter);
cc.defineGetterSetter(_p, "fps", _p.getFPS, _p.setFPS);
cc.defineGetterSetter(_p, "tileMap", _p.getTileMap, _p.setTileMap);
cc.defineGetterSetter(_p, "currentLabel", _p.getCurrentLabel);
cc.defineGetterSetter(_p, "x", _p.getPositionX, _p.setPositionX);
cc.defineGetterSetter(_p, "y", _p.getPositionY, _p.setPositionY);
_p = flax.FlaxSpriteBatch.prototype;
cc.defineGetterSetter(_p, "mainCollider", _p.getMainCollider);
_p.getPhysicsBody && cc.defineGetterSetter(_p, "physicsBody", _p.getPhysicsBody);
cc.defineGetterSetter(_p, "center", _p.getCenter);
cc.defineGetterSetter(_p, "fps", _p.getFPS, _p.setFPS);
cc.defineGetterSetter(_p, "tileMap", _p.getTileMap, _p.setTileMap);
cc.defineGetterSetter(_p, "currentLabel", _p.getCurrentLabel);
cc.defineGetterSetter(_p, "x", _p.getPositionX, _p.setPositionX);
cc.defineGetterSetter(_p, "y", _p.getPositionY, _p.setPositionY);
flax.Animator = flax.FlaxSprite.extend({
    frameNames: null,
    clsName: "flax.Animator",
    onNewSource: function() {
        this.frameNames = flax.assetsManager.getFrameNames(this.assetsFile, this.define.start, this.define.end);
        this.totalFrames = this.frameNames.length;
        0 == this.totalFrames && cc.log("There is no frame for display: " + this.assetID)
    },
    doRenderFrame: function(a) {
        a = cc.spriteFrameCache.getSpriteFrame(this.frameNames[a]);
        this.setSpriteFrame(a)
    },
    getDefine: function() {
        var a = flax.assetsManager.getDisplayDefine(this.assetsFile, this.assetID);
        if (null == a) throw "There is no Animator named: " + this.assetID + " in assets: " + this.assetsFile + ", or make sure this class extends from the proper class!";
        return a
    }
});
flax.Animator.create = function(a, b) {
    var c = new flax.Animator(a, b);
    c.clsName = "flax.Animator";
    return c
};
window.flax.Animator = flax.Animator;
flax._image = {
    define: null,
    name: null,
    assetsFile: null,
    assetID: null,
    clsName: "flax.Image",
    autoRecycle: !1,
    _anchorBindings: null,
    __instanceId: null,
    _imgFile: null,
    _sx: 1,
    _sy: 1,
    _imgSize: null,
    _destroyed: !1,
    ctor: function(a, b) {
        if (this instanceof cc.Sprite) cc.Sprite.prototype.ctor.call(this);
        else {
            this.define = flax.assetsManager.getDisplayDefine(a, b);
            this._imgFile = this.define.url;
            this._super();
            var c = new cc.SpriteBatchNode(this._imgFile);
            this.updateWithBatchNode(c, cc.rect(), !1, this.define.scale9)
        }
        if (!a || !b) throw "Please set assetsFile and assetID to me!";
        this.__instanceId = ClassManager.getNewInstanceId();
        this._anchorBindings = [];
        this.setSource(a, b)
    },
    setSource: function(a, b) {
        if (null == a || null == b) throw "assetsFile and assetID can not be null!";
        if (this.assetsFile != a || this.assetID != b) {
            this.assetsFile = a;
            this.assetID = b;
            this.define = flax.assetsManager.getDisplayDefine(this.assetsFile, this.assetID);
            this._imgFile = this.assetsFile.slice(0, this.assetsFile.lastIndexOf("/")) + "/" + this.define.url;
            flax.Scale9Image && this instanceof flax.Scale9Image ? this.initWithFile(this._imgFile, cc.rect(), this.define.scale9) : this.initWithFile(this._imgFile);
            if (cc.sys.isNative) this.onImgLoaded();
            else this.addEventListener("load", this.onImgLoaded, this);
            var c = this.define.anchorX,
            d = this.define.anchorY;
            isNaN(c) || isNaN(d) || this.setAnchorPoint(c, d);
            this.onNewSource();
            null == this.__pool__id__ && (this.__pool__id__ = this.assetID)
        }
    },
    onImgLoaded: function() {
        this._imgSize = (new cc.Sprite(this._imgFile)).getContentSize();
        this.scheduleOnce(function() {
            this._updateSize(this._sx, this._sy)
        },
        0.01)
    },
    destroy: function() {
        this._destroyed || (this._destroyed = !0, this.autoRecycle && flax.ObjectPool.get(this.assetsFile, this.clsName, this.__pool__id__ || "").recycle(this), this.removeFromParent(), this.autoRecycle = !1)
    },
    onEnter: function() {
        this._super();
        this._destroyed = !1
    },
    onExit: function() {
        this._super();
        flax.inputManager.removeListener(this);
        for (var a = null,
        b = -1,
        c = this._anchorBindings.length; ++b < c;) a = this._anchorBindings[b],
        a.destroy ? a.destroy() : a.removeFromParent(!0),
        delete a.__anchor__;
        this._anchorBindings.length = 0
    },
    onRecycle: function() {
        this.setScale(1);
        this.opacity = 255;
        this.rotation = 0;
        this.setPosition(0, 0)
    },
    getAnchor: function(a) {
        return this.define.anchors && (a = this.define.anchors[a], null != a) ? new flax.Anchor(a[0]) : null
    },
    bindAnchor: function(a, b, c) {
        if (!this.define.anchors) return cc.log(this.assetID + ": there is no any anchor!"),
        !1;
        if (null == this.define.anchors[a]) return cc.log(this.assetID + ": there is no anchor named " + a),
        !1;
        if (null == b) throw "Node can't be null!";
        if ( - 1 < this._anchorBindings.indexOf(b)) return cc.log(this.assetID + ": anchor has been bound, " + a),
        !1; ! 1 !== c && this._anchorBindings.push(b);
        b.__anchor__ = a;
        this._updateAnchorNode(b, this.getAnchor(a));
        b.parent != this && (b.removeFromParent(!1), this.addChild(b));
        return ! 0
    },
    _updateAnchorNode: function(a, b) {
        null != b && (a.x = b.x, a.y = b.y, a.zIndex = b.zIndex, a.rotation = b.rotation)
    },
    setScaleX: function(a) {
        flax.Scale9Image && this instanceof flax.Scale9Image ? (this._sx = a, this._updateSize(a, this._sy)) : cc.Node.prototype.setScaleX.call(this, a)
    },
    setScaleY: function(a) {
        flax.Scale9Image && this instanceof flax.Scale9Image ? (this._sy = a, this._updateSize(this._sx, a)) : cc.Node.prototype.setScaleY.call(this, a)
    },
    _updateSize: function(a, b) {
        null != this._imgSize && (this.width = this._imgSize.width * a, this.height = this._imgSize.height * b)
    },
    onNewSource: function() {}
};
flax.Image = cc.Sprite.extend(flax._image);
window.flax.Image = flax.Image;
cc.Scale9Sprite && (flax.Scale9Image = cc.Scale9Sprite.extend(flax._image), _p = flax.Image.prototype, cc.defineGetterSetter(_p, "scaleX", _p.getScaleX, _p.setScaleX), cc.defineGetterSetter(_p, "scaleY", _p.getScaleY, _p.setScaleY), _p = flax.Scale9Image.prototype, cc.defineGetterSetter(_p, "scaleX", _p.getScaleX, _p.setScaleX), cc.defineGetterSetter(_p, "scaleY", _p.getScaleY, _p.setScaleY), window.flax.Scale9Image = flax.Scale9Image);
flax.Image.create = function(a, b) {
    if (flax.assetsManager.getDisplayDefine(a, b).scale9) {
        if (null == flax.Scale9Image) throw "Please add module of 'gui' into project.json if you want to use Scale9Image!";
        var c = new flax.Scale9Image(a, b)
    } else c = new flax.Image(a, b);
    return c
};
flax = flax || {};
flax.FrameData = cc.Class.extend({
    x: 0,
    y: 0,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    alpha: 1,
    opacity: 255,
    zIndex: -1,
    skewX: 0,
    skewY: 0,
    font: null,
    fontSize: 12,
    fontColor: "",
    textAlign: "",
    textWidth: 40,
    textHeight: 20,
    _isText: !1,
    _data: null,
    _hasSkew: !1,
    ctor: function(a) {
        this._data = a;
        this.x = parseFloat(a[0]);
        this.y = parseFloat(a[1]);
        this.rotation = parseFloat(a[2]);
        this.scaleX = parseFloat(a[3]);
        this.scaleY = parseFloat(a[4]);
        this.alpha = parseFloat(a[5]);
        this.opacity = Math.round(255 * this.alpha);
        6 < a.length && (this.zIndex = parseInt(a[6]));
        7 < a.length && (this.skewX = parseFloat(a[7]));
        8 < a.length && (this.skewY = parseFloat(a[8]));
        this._hasSkew = 7 < a.length && (0 != this.skewX || 0 != this.skewY);
        9 < a.length && (this._isText = !0, this.font = a[9], this.fontSize = parseInt(a[10]), this.fontColor = a[11], this.fontColor = cc.hexToColor(this.fontColor), this.textAlign = H_ALIGHS.indexOf(a[12]), this.textWidth = parseFloat(a[13]), this.textHeight = parseFloat(a[14]))
    },
    setForChild: function(a) {
        a.setScaleX(this.scaleX);
        a.setScaleY(this.scaleY);
        this._hasSkew ? (a.setRotationX(this.skewX), a.setRotationY(this.skewY)) : a.setRotation(this.rotation);
        void 0 != a.alpha ? a.alpha = this.alpha: a.setOpacity && a.setOpacity(this.opacity);
        var b = this.x,
        c = this.y;
        this.font && !0 === a.__isTTF && (a.setFontName(this.font), a.setFontFillColor(this.fontColor), a.setHorizontalAlignment(this.textAlign), a.setDimensions(this.textWidth, this.textHeight), a.setFontSize(this.fontSize - 1), a.setFontSize(this.fontSize));
        a.setPositionX(b);
        a.setPositionY(c)
    },
    clone: function() {
        return new flax.FrameData(this._data)
    },
    destroy: function() {
        this._data = null
    }
});
flax._movieClip = {
    clsName: "flax.MovieClip",
    sameFpsForChildren: !1,
    createChildFromPool: !1,
    _autoPlayChildren: !1,
    namedChildren: null,
    _childrenDefine: null,
    _gRect: null,
    _extraChildren: null,
    __isMovieClip: !0,
    replaceChild: function(a, b, c) {
        if (!this.running) return ! 1;
        var d = this._childrenDefine[a];
        if (null == d) return cc.log("There is no child with named: " + a + "  in MovieClip: " + this.assetID),
        !1;
        var e = this.namedChildren[a];
        if (e) {
            c || (c = this.assetsFile);
            d = b instanceof cc.Node;
            if (!d && !flax.assetsManager.getAssetType(c, b)) return ! 1;
            var f = e._autoPlayChildren;
            this.destroyChild(e);
            e = d ? b: flax.assetsManager.createDisplay(c, b, null, this.createChildFromPool);
            e.name = a;
            this.namedChildren[a] = e; ! 0 !== e.__isMovieClip || f || (e.autoPlayChildren = this._autoPlayChildren);
            this._autoPlayChildren && !0 === e.__isFlaxSprite && (this.playing ? e.gotoAndPlay(0) : e.gotoAndStop(0));
            this[a] = e;
            this.addChild(e);
            this.renderFrame(this.currentFrame, !0)
        } else d["class"] = b,
        d.assetsFile = c;
        return ! 0
    },
    getFrameData: function(a, b) {
        if (!this.define) return null;
        if (this.define && this.define.frames) {
            var c = this.define.frames[b];
            if (c) for (var d = 0; d < c.length; d++) {
                var e = c[d];
                if (e.name == a) return e.data
            }
        }
        cc.log("This MovieClip maybe is not initialized yet!");
        return null
    },
    setOpacity: function(a) {
        cc.Node.prototype.setOpacity.call(this, a);
        for (var b in this.namedChildren) {
            var c = this.namedChildren[b];
            c.setOpacity && c.setOpacity(a)
        }
    },
    setColor: function(a) {
        cc.Node.prototype.setColor.call(this, a);
        for (var b in this.namedChildren) {
            var c = this.namedChildren[b];
            c.setColor && c.setColor(a)
        }
    },
    onNewSource: function() {
        for (var a in this.namedChildren) this.destroyChild(this.namedChildren[a]);
        this.namedChildren = {};
        this._childrenDefine = this.define.children;
        this.totalFrames = this.define.totalFrames;
        this._gRect = flax._strToRect(this.define.rect);
        this.setContentSize(this._gRect.width, this._gRect.height);
        this._initFrameData()
    },
    _initFrameData: function() {
        if (!this.define.frames) {
            var a = {};
            this.define.frames = [];
            for (var b = 0; b < this.totalFrames; b++) {
                var c = [],
                d = [],
                e;
                for (e in this._childrenDefine) {
                    var f = a[e];
                    if (null == f) {
                        for (var f = [], g = this._childrenDefine[e].frames, k = -1; ++k < g.length;) {
                            var m = g[k];
                            m && (m = new flax.FrameData(m.split(",")), f[k] = m)
                        }
                        delete this._childrenDefine[e].frames;
                        a[e] = f
                    }
                    f = f[b];
                    null == f ? d.push({
                        name: e,
                        data: null
                    }) : c[f.zIndex] = {
                        name: e,
                        data: f
                    }
                }
                this.define.frames[b] = d.concat(c)
            }
        }
    },
    onEnter: function() {
        this._super();
        this._gRect || (this._gRect = flax._strToRect(this.define.rect));
        this.setContentSize(this._gRect.width, this._gRect.height)
    },
    addChildAt: function(a, b) {
        this._super(a, b);
        if (!a.name || this.namedChildren && !this.namedChildren[a.name]) this._extraChildren || (this._extraChildren = []),
        a.__eIndex = b,
        this._extraChildren.push(a)
    },
    doRenderFrame: function(a) {
        a = this.define.frames[a];
        for (var b = a.length,
        c = 0; c < b; c++) {
            var d = a[c];
            if (null != d) {
                var e = d.name,
                f = d.data,
                d = this.namedChildren[e];
                if (f) {
                    this._childrenDefine || (this._childrenDefine = this.define.children);
                    var g = this._childrenDefine[e];
                    null == d && (null != g.text ? (d = flax.createLabel(this.assetsFile, f, g), d.name = e) : d = flax.assetsManager.createDisplay(g.assetsFile || this.assetsFile, g["class"], {
                        name: e
                    },
                    this.createChildFromPool), this.namedChildren[e] = d, this[e] = d, this.onNewChild(d));
                    f.setForChild(d);
                    this.sameFpsForChildren && (d.fps = this.fps);
                    e = -1 == f.zIndex ? g.zIndex: f.zIndex;
                    d.mask ? d.mask.parent != this ? (d.mask.removeFromParent(!1), this.addChild(d.mask, e)) : d.mask.zIndex != e && (d.mask.zIndex = e) : d.parent != this ? (d.removeFromParent(!1), this.addChild(d, e)) : d.zIndex != e && (d.zIndex = e)
                } else d && this.destroyChild(d)
            }
        }
        if (this._extraChildren) for (c = 0; c < this._extraChildren.length; c++) d = this._extraChildren[c],
        d.zIndex = d.__eIndex
    },
    destroyChild: function(a) {
        var b = a.name;
        this.namedChildren && this.namedChildren[b] == a && (delete this.namedChildren[b], delete this[b]);
        a.destroy ? a.destroy() : a.removeFromParent(!0)
    },
    stop: function() {
        this._super();
        if (this._autoPlayChildren && this.namedChildren) for (var a in this.namedChildren) {
            var b = this.namedChildren[a]; ! 0 === b.__isFlaxSprite && b.stop()
        }
    },
    play: function() {
        this._super();
        if (this._autoPlayChildren && this.namedChildren) for (var a in this.namedChildren) {
            var b = this.namedChildren[a]; ! 0 === b.__isFlaxSprite && b.play()
        }
    },
    getAutoPlayChildren: function() {
        return this._autoPlayChildren
    },
    setAutoPlayChildren: function(a) {
        if (this._autoPlayChildren != a && (this._autoPlayChildren = a, this.namedChildren)) for (var b in this.namedChildren) {
            var c = this.namedChildren[b]; ! 0 === c.__isMovieClip && c.setAutoPlayChildren(a);
            c.__isFlaxSprite && (a ? c.play() : c.stop())
        }
    },
    onNewChild: function(a) { ! 0 === a.__isMovieClip && (a.autoPlayChildren = this._autoPlayChildren);
        this._autoPlayChildren && !0 === a.__isFlaxSprite && (this.playing ? a.gotoAndPlay(0) : a.gotoAndStop(0))
    },
    getDefine: function() {
        var a = flax.assetsManager.getMc(this.assetsFile, this.assetID);
        if (null == a) throw "There is no MovieClip named: " + this.assetID + " in assets: " + this.assetsFile + ", or make sure this class extends from the proper class!";
        return a
    },
    getChild: function(a, b) {
        if (!this.namedChildren) return null;
        void 0 === b && (b = !0);
        var c = this.namedChildren[a];
        if (c) return c;
        if (!b) return null;
        for (var d in this.namedChildren) if (c = this.namedChildren[d], c.getChild && (c = c.getChild(a, b))) return c;
        return null
    },
    getDisplayByName: function(a, b) {
        void 0 === b && (b = !0);
        if (!this.__isMovieClip) return b && cc.log(this.name + " is " + this.clsName + ",If the result is right, you can ignore !"),
        null;
        var c = this[a] ? this[a] : this.getChild(a, !1);
        if (!c) {
            for (var d = 0,
            e = this.children.length; d < e; d++) if (c = this.children[d], c.name == a) return c;
            if (this.maskClipNode && this.maskClipNode[a]) return this.maskClipNode[a];
            b && cc.log(this.name + " has no child named:" + a);
            b && cc.log("All named children:" + this.namedChildren);
            return null
        }
        return c
    },
    getChildByAssetID: function(a) {
        if (!this.namedChildren) return null;
        var b = null,
        c;
        for (c in this.namedChildren) if (b = this.namedChildren[c], b.assetID == a) return b;
        return null
    },
    getLabelText: function(a, b) {
        var c = this.getChild(a, void 0 === b ? !0 : b);
        return c && (c instanceof flax.BitmapLabel || !0 === c.__isTTF) ? c.getString() : null
    },
    setLabelText: function(a, b, c) {
        return (a = this.getChild(a, void 0 === c ? !0 : c)) && (a instanceof flax.BitmapLabel || !0 === a.__isTTF) ? (a.setString(b), a) : null
    },
    setFPS: function(a) {
        if (this._fps != a && (this._fps = a, this.updateSchedule(), this.sameFpsForChildren && this.namedChildren)) {
            a = null;
            for (var b in this.namedChildren) a = this.namedChildren[b],
            a.fps = this._fps
        }
    },
    onRecycle: function() {
        this._super();
        this._autoPlayChildren = this.createChildFromPool = this.sameFpsForChildren = !1;
        if (RESET_FRAME_ON_RECYCLE) for (var a in this.namedChildren) ! 0 === this.namedChildren[a].__isFlaxSprite && (this.currentFrame = 0)
    },
    onExit: function() {
        this._super();
        for (var a in this.namedChildren) delete this.namedChildren[a],
        delete this[a];
        this._extraChildren = this._gRect = this._childrenDefine = null;
        this.autoRecycle && this.removeAllChildren(!0)
    },
    addMaskLayer: function(a, b) {
        if (null == this.maskClipNode || void 0 === this.maskClipNode) {
            var c = new cc.ClippingNode;
            c.setAnchorPoint(cc.p(0.5, 0.5));
            c.setAlphaThreshold(0.1);
            this.maskClipNode = c
        }
        this.maskClipNode.stencil || (c = new cc.Sprite(a.getSpriteFrame()), c.setOpacity(254), this.maskClipNode.setStencil(c), c.getTexture().setAntiAliasTexParameters());
        var d = function(a, b) {
            a && (a.parent && !0 === a.parent.__isMovieClip && a.parent.namedChildren[a.name] == a && delete a.parent.namedChildren[a.name], a.removeFromParent(b))
        };
        d(a, !0); ! this.maskClipNode.parent && this.addChild(this.maskClipNode, a.zIndex);
        a && this.maskClipNode.setPosition(a.getPosition());
        c = function(a, b) {
            if (a) {
                var c = b.convertToWorldSpace(a.getPosition());
                a.parent && (c = a.parent.convertToWorldSpace(a.getPosition()));
                c = b.maskClipNode.convertToNodeSpace(c);
                d(a, !1);
                b.maskClipNode.addChild(a, a.zIndex);
                a.setPosition(c);
                b.maskClipNode[a.name] = a
            }
        };
        if (b instanceof Array) for (var e = 0; e < b.length; e++) c(b[e], this);
        else c(b, this);
        return this.maskClipNode
    },
    updateMaskLayer: function(a, b) {
        if (!this.maskClipNode) throw "maskWarning: there has no maskClipNode!!!";
        if (!a) throw "maskWarning: there has no maskLayer!!!";
        if (!b) throw "maskWarning: there has no obsLayer!!!";
        var c = (a.parent ? a.parent: this).convertToWorldSpace(a.getPosition()),
        c = this.maskClipNode.convertToNodeSpace(c),
        d = this.maskClipNode.stencil;
        a.scaleX == d.scaleX && a.scaleY == d.scaleY || d.setScale(a.getScaleX(), a.getScaleY());
        a.skewX != d.skewX && d.setSkewX(a.getSkewX());
        a.skewY != d.skewY && d.setSkewY(a.getSkewY());
        d.setPosition(c);
        a.removeFromParent();
        if (b instanceof Array) for (c = 0; c < b.length; c++) this._updateMaskClipNode(b[c]);
        else this._updateMaskClipNode(b)
    },
    _updateMaskClipNode: function(a) {
        var b = (a.parent ? a.parent: this).convertToWorldSpace(a.getPosition()),
        b = this.maskClipNode.convertToNodeSpace(b),
        c = this.maskClipNode[a.name];
        a.scaleX == c.scaleX && a.scaleY == c.scaleY || c.setScale(a.getScaleX(), a.getScaleY());
        a.skewX != c.skewX && c.setSkewX(a.getSkewX());
        a.skewY != c.skewY && c.setSkewY(a.getSkewY());
        a._realOpacity != c._realOpacity && c.setOpacity(a.getOpacity());
        c.setPosition(b);
        a.removeFromParent()
    }
};
flax.MovieClip = flax.FlaxSprite.extend(flax._movieClip);
flax.MovieClip.create = function(a, b) {
    var c = new flax.MovieClip(a, b);
    c.clsName = "flax.MovieClip";
    return c
};
_p = flax.MovieClip.prototype;
cc.defineGetterSetter(_p, "autoPlayChildren", _p.getAutoPlayChildren, _p.setAutoPlayChildren);
cc.defineGetterSetter(_p, "opacity", _p.getOpacity, _p.setOpacity);
window.flax.MovieClip = flax.MovieClip;
flax.MovieClipBatch = flax.FlaxSpriteBatch.extend(flax._movieClip);
flax.MovieClipBatch.create = function(a, b) {
    var c = new flax.MovieClipBatch(a, b);
    c.clsName = "flax.MovieClipBatch";
    return c
};
_p = flax.MovieClipBatch.prototype;
cc.defineGetterSetter(_p, "autoPlayChildren", _p.getAutoPlayChildren, _p.setAutoPlayChildren);
cc.defineGetterSetter(_p, "opacity", _p.getOpacity, _p.setOpacity);
window.flax.MovieClipBatch = flax.MovieClipBatch;
flax.ProgressBarType = {
    HORIZONTAL: "horizontal",
    VERTICAL: "vertical",
    RADIAL: "radial"
};
flax.ProgressBar = flax.Animator.extend({
    clsName: "flax.ProgressBar",
    pBar: null,
    _type: flax.ProgressBarType.HORIZONTAL,
    _reversed: !1,
    _tween: null,
    _tweenInOver: null,
    onTweenOver: null,
    onPercentageChanged: null,
    onEnter: function() {
        this._super(); ! this.onTweenOver && (this.onTweenOver = new signals.Signal); ! this.onPercentageChanged && (this.onPercentageChanged = new signals.Signal)
    },
    onExit: function() {
        this._super();
        this.pBar = null;
        this._type = flax.ProgressBarType.HORIZONTAL;
        this._reversed = !1;
        this._tweenInOver = this._tween = null;
        this.onTweenOver && this.onTweenOver.removeAll();
        this.onPercentageChanged && this.onPercentageChanged.removeAll();
        this.onPercentageChanged = this.onTweenOver = null
    },
    getPercentage: function() {
        return this.pBar ? this.pBar.percentage: 0
    },
    setPercentage: function(a) {
        this.pBar && (this.pBar.percentage = a)
    },
    getType: function() {
        return this._type
    },
    setType: function(a) {
        this._type != a && (this._type = a, this._updatePBar())
    },
    getReversed: function() {
        return this._reversed
    },
    setReversed: function(a) {
        this._reversed != a && (this._reversed = a, this._updatePBar(), this.percentage += 0.1, this.percentage -= 0.1)
    },
    tween: function(a, b, c) {
        null != this.pBar && (this._tweenInOver && (this._tweenInOver.isDone() || (this.pBar.stopAction(this._tweenInOver), this.unscheduleUpdate()), this._tweenInOver.release()), this._tween = cc.progressFromTo(c, a, b), this._tweenInOver = new cc.Sequence(this._tween, cc.callFunc(function() {
            this.onTweenOver && this.onTweenOver.getNumListeners() && this.onTweenOver.dispatch(this.pBar.percentage, this)
        },
        this)), this._tweenInOver.retain(), this.pBar.runAction(this._tweenInOver), this.scheduleUpdate())
    },
    update: function(a) {
        this.onPercentageChanged && this.onPercentageChanged.getNumListeners() ? (this.onPercentageChanged.dispatch(this.getPercentage(), a), 100 == this.pBar.percentage && this.unscheduleUpdate()) : this.unscheduleUpdate()
    },
    stopTween: function() {
        this._tweenInOver && this.pBar && (this.unscheduleUpdate(), this.pBar.stopAction(this._tweenInOver), this.onTweenOver && this.onTweenOver.removeAll(), this.onPercentageChanged && this.onPercentageChanged.removeAll(), this._tweenInOver.release(), this._tweenInOver = this._tween = null)
    },
    runBarAction: function(a) {
        null != this.pBar && (this._tweenInOver && (this._tweenInOver.isDone() || (this.pBar.stopAction(this._tweenInOver), this.unscheduleUpdate()), this._tweenInOver.release()), (this._tweenInOver = a) && this._tweenInOver.retain(), this.pBar.runAction(a), this.scheduleUpdate())
    },
    stopBarAction: function(a) {
        this.unscheduleUpdate();
        this.pBar && a ? this.pBar.stopAction(a) : this.pBar && this._tweenInOver && this.pBar.stopAction(this._tweenInOver);
        this._tweenInOver && this._tweenInOver.release();
        this.onTweenOver && this.onTweenOver.removeAll();
        this.onTweenOver && this.onPercentageChanged.removeAll()
    },
    stopAllActions: function() {
        this.stopBarAction();
        this.stopTween();
        this.unscheduleUpdate();
        this._super()
    },
    doRenderFrame: function(a) {
        if (a = cc.spriteFrameCache.getSpriteFrame(this.frameNames[a])) a = new cc.Sprite(a),
        null == this.pBar ? (this.width = a.width, this.height = a.height, this.pBar = cc.ProgressTimer.create(a), this._updatePBar(), this.pBar.setAnchorPoint(this.getAnchorPoint()), this.pBar.setPosition(this.getAnchorPointInPoints()), this.addChild(this.pBar)) : this.pBar.setSprite(a)
    },
    _updatePBar: function() {
        if (null != this.pBar) if (this._type == flax.ProgressBarType.RADIAL) this.pBar.type = 0,
        this.pBar.setReverseDirection(this._reversed),
        this.pBar.midPoint = cc.p(0.5, 0.5);
        else {
            this.pBar.type = 1;
            var a = this._type == flax.ProgressBarType.HORIZONTAL,
            b = cc.p(0, 0),
            c = cc.p(a ? 1 : 0, a ? 0 : 1);
            this._reversed && (a ? b.x = 1 : b.y = 1);
            this.pBar.midPoint = b;
            this.pBar.barChangeRate = c
        }
    }
});
flax.ProgressBar.create = function(a, b) {
    var c = new flax.ProgressBar(a, b);
    c.clsName = "flax.ProgressBar";
    return c
};
window.flax.ProgressBar = flax.ProgressBar;
_p = flax.ProgressBar.prototype;
cc.defineGetterSetter(_p, "percentage", _p.getPercentage, _p.setPercentage);
cc.defineGetterSetter(_p, "type", _p.getType, _p.setType);
cc.defineGetterSetter(_p, "reversed", _p.getReversed, _p.setReversed);
flax.BitmapLabel = cc.Sprite.extend({
    mlWidth: 0,
    mlHeight: 0,
    fontName: null,
    fontSize: 20,
    frames: [],
    chars: [],
    assetsFile: null,
    name: null,
    params: null,
    _str: null,
    _gap: 0,
    _spaceGap: 10,
    _charCanvas: null,
    _fontDefine: null,
    _isRealFont: !1,
    onRecycle: function() {
        this.frames = [];
        this.chars = []
    },
    onEnter: function() {
        this._super();
        this._updateStr()
    },
    onExit: function() {
        this._super();
        this._fontDefine = this._charCanvas = this.params = this.chars = this.frames = null
    },
    getString: function() {
        return this._str
    },
    setString: function(a) {
        null == a && (a = "");
        a = "" + a;
        a !== this._str && (this._str = a, this._updateStr())
    },
    getSpaceGap: function() {
        return this._spaceGap
    },
    setSpaceGap: function(a) {
        this._spaceGap != a && (this._spaceGap = a, this._str && -1 < this._str.indexOf(" ") && this._updateStr())
    },
    getGap: function() {
        return this._gap
    },
    setGap: function(a) {
        a != this._gap && (this._gap = a, this._str && this._updateStr())
    },
    setFontName: function(a) {
        if (null != a && (null == this.fontName || this.fontName != a)) {
            this.fontName = a;
            this._isRealFont = !0;
            this._fontDefine = flax.assetsManager.getFont(this.assetsFile, this.fontName);
            null == this._fontDefine && (this._isRealFont = !1, this._fontDefine = flax.assetsManager.getDisplayDefine(this.assetsFile, this.fontName));
            if (null == this._fontDefine) throw "Can't find the font named: " + this.fontName;
            this.frames = flax.assetsManager.getFrameNames(this.assetsFile, parseInt(this._fontDefine.start), parseInt(this._fontDefine.end));
            this.chars = this._fontDefine.chars;
            this._isRealFont && (this.fontSize = parseInt(this._fontDefine.size))
        }
    },
    tweenInt: function(a, b, c) {
        this.setString(a);
        var d = flax.numberSign(b - a);
        if (0 != d) {
            var e = Math.abs(b - a),
            f = Math.max(c / e, flax.frameInterval),
            e = Math.round(c / f),
            d = d * Math.round(Math.abs(b - a) / e);
            this.schedule(function(a) {
                a = parseInt(this._str);
                var c = a + d;
                0 < d && c > b ? c = b: 0 > d && c < b && (c = b);
                c != a && this.setString(c)
            },
            f, e + 10)
        }
    },
    _updateStr: function() {
        if (this.parent && this._str && this._str.length) {
            if (null == this._charCanvas) {
                var a = cc.path.changeBasename(this.assetsFile, ".png");
                this._charCanvas = new cc.SpriteBatchNode(a, this._str.length);
                this.addChild(this._charCanvas)
            }
            this._isRealFont || (this.params.textHeight = 0);
            this._charCanvas.removeAllChildren();
            for (a = this.mlHeight = this.mlWidth = 0; a < this._str.length; a++) {
                var b = this._str[a];
                if ("\n" != b) if (" " == b) this.mlWidth += this._spaceGap;
                else {
                    var c = this._findCharIndex(b); - 1 == c ? cc.log("Not found the char: " + b + " in the fonts: " + this.fontName) : (b = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(this.frames[c])), b.setAnchorPoint(this._fontDefine.anchorX, this._fontDefine.anchorY), b.x = this.mlWidth, b.y = 0, this._charCanvas.addChild(b), b = b.getContentSize(), this.mlWidth += b.width, a != this._str.length - 1 && (this.mlWidth += this._gap), this.mlHeight = b.height > this.mlHeight ? b.height: this.mlHeight, !this._isRealFont && this.params.textHeight < b.height && (this.params.textHeight = b.height))
                }
            }
            if (this.params && this.params.textWidth && this.params.textHeight) for (b = Math.max(this.mlWidth / this.params.textWidth, this.mlHeight / this.params.textHeight), a = 0, 1 < b && (c = 1 / b, this._charCanvas.setScale(c), a = this.mlHeight * (1 - 1 / b) * b, this.mlWidth *= c, this.mlHeight *= c), b = (this.params.textWidth - this.mlWidth) / 2, c = this._charCanvas.childrenCount; c--;) {
                var d = this._charCanvas.children[c];
                "center" == H_ALIGHS[this.params.textAlign] ? d.x += b: "right" == H_ALIGHS[this.params.textAlign] && (d.x += 2 * b);
                d.y -= a
            }
            this._charCanvas.setContentSize(this.mlWidth, this.mlHeight);
            this.setContentSize(this.mlWidth, this.mlHeight)
        }
    },
    _findCharIndex: function(a) {
        var b = -1;
        if (this._isRealFont) for (var c = 0; c < this.chars.length; c++) {
            if (this.chars[c] == a) {
                b = c;
                break
            }
        } else this._fontDefine.labels && (c = this._fontDefine.labels[a]) && (b = c.start),
        -1 != b || isNaN(parseInt(a)) || (b = parseInt(a));
        return b
    },
    getBounds: function(a) {
        null == a && (a = !0);
        var b = cc.rect(0.5 * this.width / this._str.length, -this.params.textHeight, this.width, this.height + 2);
        b.y += (this.params.textHeight - this.height) / 2 - 1;
        if (!a) return b;
        var c = b.width,
        d = b.height,
        b = cc.p(b.x, b.y),
        b = this.convertToWorldSpace(b);
        a.convertToNodeSpace && (b = a.convertToNodeSpace(b));
        return cc.rect(b.x, b.y, c, d)
    },
    destroy: function() {
        this.removeFromParent()
    }
});
flax.Label = flax.BitmapLabel;
flax.BitmapLabel.prototype.getRect = flax.BitmapLabel.prototype.getBounds;
_p = flax.BitmapLabel.prototype;
cc.defineGetterSetter(_p, "gap", _p.getGap, _p.setGap);
cc.defineGetterSetter(_p, "spaceGap", _p.getSpaceGap, _p.setSpaceGap);
cc.defineGetterSetter(_p, "text", _p.getString, _p.setString);
flax.BitmapLabel.createFromAnim = function(a, b, c) {
    var d = new flax.BitmapLabel;
    flax.assetsManager.addAssets(a);
    d.assetsFile = a;
    d.params = {
        textWidth: 0,
        textHeight: 0,
        textAlign: 0
    };
    d.setFontName(b);
    d.setAnchorPoint(0, 0);
    d.setString(c);
    return d
};
_p = cc.LabelTTF.prototype;
cc.defineGetterSetter(_p, "text", _p.getString, _p.setString);
flax.createLabel = function(a, b, c) {
    if (!1 === b._isText) throw "The assetsFile: " + a + " was exported with old version of Flax tool, re-export it to fix the Text issue!";
    cc.sys.isNative || (c.text = c.text.split("\\").join(""));
    var d = null,
    e = c["class"],
    d = flax.assetsManager.getFont(a, e);
    if (!0 == c.input) {
        if (null == cc.EditBox) throw "If you want to use input text, please add module of 'editbox' into project.json!";
        d = flax.assetsManager.getFrameNamesOfDisplay(a, e);
        if (null == flax.Scale9Image) throw "Please add module of 'gui' or 'ccui'(cocos 3.10 later) into project.json if you want to use EditBox!";
        d = new cc.EditBox(cc.size(b.textWidth, b.textHeight), new cc.Scale9Sprite(d[0]), d[1] ? new cc.Scale9Sprite(d[1]) : null, d[2] ? new cc.Scale9Sprite(d[2]) : null);
        d.setFontColor(b.fontColor);
        d.setFontName(b.font);
        d.setFontSize(b.fontSize);
        d.setPlaceHolder(c.text);
        d.setPlaceholderFontName(b.font);
        d.setPlaceholderFontSize(b.fontSize);
        a = flax.assetsManager.getDisplayDefine(a, e);
        d.setAnchorPoint(a.anchorX, a.anchorY)
    } else b.font && null == d ? (d = "null" != e && flax.language ? new cc.LabelTTF(flax.language.getStr(e) || c.text) : new cc.LabelTTF(c.text), d.setAnchorPoint(0, 1), d.setFontName(b.font), d.setFontSize(b.fontSize), d.setHorizontalAlignment(b.textAlign), d.setFontFillColor(b.fontColor), d.setDimensions(b.textWidth, b.textHeight), d.__isTTF = !0) : (d = new flax.BitmapLabel, flax.assetsManager.addAssets(a), d.assetsFile = a, d.params = b, d.setFontName(e), d.setAnchorPoint(0, 0), d.setString(c.text));
    return d
};
flax.Label.create = flax.createLabel;
flax._fontResources = null;
flax.registerFont = function(a, b) {
    a && b && ("string" == typeof b && (b = [b]), null == flax._fontResources && (flax._fontResources = {}), flax._fontResources[a] = b)
};
var ButtonState = {
    UP: "up",
    OVER: "over",
    DOWN: "down",
    SELECTED: "selected",
    SELECTED_OVER: "selected_over",
    SELECTED_DOWN: "selected_down",
    DISABLED: "disabled",
    LOCKED: "locked"
};
MOUSE_DOWN_SCALE = 0.95;
flax._buttonDefine = {
    clickSound: null,
    group: null,
    _playChildrenOnState: !1,
    _state: null,
    _initScaleX: 1,
    _initScaleY: 1,
    _inScaleDown: !1,
    _inDisabledGray: !0,
    __isButton: !0,
    onEnter: function() {
        this._super();
        this._initScaleX = this.scaleX;
        this._initScaleY = this.scaleY;
        flax.inputManager.addListener(this, this._onPress, InputType.press);
        flax.inputManager.addListener(this, this._onClick, InputType.click);
        flax.inputManager.addListener(this, this._onMove, InputType.move);
        if (!cc.sys.isMobile) {
            var a = this,
            b = cc.EventListener.create({
                event: cc.EventListener.MOUSE,
                onMouseMove: function(b) {
                    if (0 != b.getButton()) {
                        var d = {
                            target: a,
                            currentTarget: a
                        };
                        a.isMouseEnabled() && a._onMove(b, d)
                    }
                }
            });
            cc.eventManager.addListener(b, this)
        }
    },
    onExit: function() {
        this.group && (this.group.removeButton(this), this.group = null);
        cc.eventManager.removeListener(this);
        this._super()
    },
    onRecycle: function() {
        this._super();
        this._playChildrenOnState = !1;
        this._state = null;
        this._inScaleDown = !1;
        this.disabledCover && (this.disabledCover.visible = !0);
        this._inDisabledGray = !0
    },
    setState: function(a) {
        var b = this.isSelected();
        this._state = a;
        this.gotoAndStop(this._state) || (a = this.isSelected() ? ButtonState.SELECTED: ButtonState.UP, this.gotoAndStop(a) || (this.gotoAndStop(0), -1 < this._state.indexOf("down") && (this._inScaleDown = !0, this.setScale(this._initScaleX * MOUSE_DOWN_SCALE, this._initScaleY * MOUSE_DOWN_SCALE)), this._state == ButtonState.DISABLED && (this._inDisabledGray = !0, this.disabledCover && (this.disabledCover.visible = !0)))); - 1 == this._state.indexOf("down") && this._inScaleDown && this.setScale(this._initScaleX, this._initScaleY);
        this._state != ButtonState.DISABLED && this._inDisabledGray && (this._inDisabledGray = !1, this.disabledCover && (this.disabledCover.visible = !1));
        this._playOrPauseChildren();
        this.isSelected() && !b && this.group && this.group.updateButtons(this);
        this.handleStateChange()
    },
    handleStateChange: function() {},
    getState: function() {
        return this._state
    },
    isSelected: function() {
        return this._state && 0 == this._state.indexOf("selected")
    },
    setSelected: function(a) {
        this.isSelected() != a && this.isSelectable() && this.isMouseEnabled() && !this.isLocked() && this.setState(a ? ButtonState.SELECTED: ButtonState.UP)
    },
    isSelectable: function() {
        return this.hasLabel(ButtonState.SELECTED)
    },
    setMouseEnabled: function(a) {
        this.setState(a ? ButtonState.UP: ButtonState.DISABLED);
        return ! 0
    },
    isMouseEnabled: function() {
        return this._state != ButtonState.DISABLED
    },
    setLocked: function(a) {
        this.setState(a ? ButtonState.LOCKED: ButtonState.UP)
    },
    isLocked: function() {
        return this._state == ButtonState.LOCKED
    },
    setPlayChildrenOnState: function(a) {
        this._playChildrenOnState != a && (this._playChildrenOnState = a, this._playOrPauseChildren())
    },
    getPlayChildrenOnState: function() {
        return this._playChildrenOnState
    },
    _onPress: function(a, b) {
        if (this._state != ButtonState.LOCKED && this._state != ButtonState.DISABLED) {
            var c = this.clickSound || flax.buttonSound;
            c && flax.playSound(c);
            this._toSetState(ButtonState.DOWN)
        }
    },
    _onClick: function(a, b) {
        this._state != ButtonState.LOCKED && this._state != ButtonState.DISABLED && (this.isSelectable() ? !this.isSelected() || this.group ? this.setState(ButtonState.SELECTED) : this.setState(ButtonState.UP) : this.setState(ButtonState.UP))
    },
    _onMove: function(a, b) {
        this._state != ButtonState.DISABLED && this._state != ButtonState.LOCKED && (flax.ifTouched(this, a.getLocation()) ? this._toSetState(cc.sys.isMobile ? ButtonState.DOWN: ButtonState.OVER) : this._toSetState(ButtonState.UP))
    },
    _toSetState: function(a) {
        this.isSelectable() && this.isSelected() && (a = a == ButtonState.UP ? ButtonState.SELECTED: "selected_" + a);
        this.setState(a)
    },
    _playOrPauseChildren: function() {
        for (var a = this.childrenCount; a--;) {
            var b = this.children[a];
            flax.isFlaxSprite(b) && (this._playChildrenOnState ? (b.autoPlayChildren = !0, b.play()) : (b.autoPlayChildren = !1, b.stop()))
        }
    }
};
flax.SimpleButton = flax.Animator.extend(flax._buttonDefine);
flax.SimpleButton.create = function(a, b) {
    var c = new flax.SimpleButton(a, b);
    c.clsName = "flax.SimpleButton";
    c.setState(ButtonState.UP);
    return c
};
window.flax.SimpleButton = flax.SimpleButton;
_p = flax.SimpleButton.prototype;
cc.defineGetterSetter(_p, "state", _p.getState, _p.setState);
cc.defineGetterSetter(_p, "playChildrenOnState", _p.getPlayChildrenOnState, _p.setPlayChildrenOnState);
cc.defineGetterSetter(_p, "selected", _p.isSelected, _p.setSelected);
flax.Button = flax.MovieClip.extend(flax._buttonDefine);
flax.Button.create = function(a, b) {
    var c = new flax.Button(a, b);
    c.clsName = "flax.Button";
    c.setState(ButtonState.UP);
    return c
};
window.flax.Button = flax.Button;
_p = flax.Button.prototype;
cc.defineGetterSetter(_p, "state", _p.getState, _p.setState);
cc.defineGetterSetter(_p, "playChildrenOnState", _p.getPlayChildrenOnState, _p.setPlayChildrenOnState);
cc.defineGetterSetter(_p, "selected", _p.isSelected, _p.setSelected);
flax.ButtonGroup = cc.Class.extend({
    buttons: null,
    selectedButton: null,
    onSelected: null,
    ctor: function() {
        this.buttons = [];
        this.onSelected = new signals.Signal
    },
    addButton: function(a) {
        a instanceof Array || (a = Array.prototype.slice.call(arguments));
        for (var b = 0; b < a.length; b++) {
            var c = a[b],
            c = a[b]; ! flax.isButton(c) || -1 < this.buttons.indexOf(c) || (this.buttons.push(c), c.group = this)
        }
    },
    removeButton: function(a) {
        var b = this.buttons.indexOf(a); - 1 < b && (this.buttons.splice(b, 1), a.group = null);
        0 == this.buttons.length && (this.onSelected.removeAll(), this.onSelected = null)
    },
    updateButtons: function(a) {
        for (var b = 0; b < this.buttons.length; b++) {
            var c = this.buttons[b];
            c != a && c.isMouseEnabled() && !c.isLocked() && c.setState(ButtonState.UP)
        }
        this.selectedButton = a;
        b = flax.mousePos && flax.ifTouched(a, flax.mousePos);
        this.onSelected.dispatch(a, b)
    }
});
flax._preloader = {
    resources: null,
    _label: null,
    _logo: null,
    _inited: !1,
    initWithResources: function(a, b) {
        this.init();
        "string" == typeof a && (a = [a]);
        this.resources = a || [];
        this.cb = b
    },
    init: function() {
        if (!this._inited) {
            this._inited = !0;
            var a = this,
            b = cc.director.getWinSize();
            if (this instanceof cc.Layer) {
                var c = new cc.LayerColor(cc.color(0, 0, 0, 100));
                this.addChild(c, 0)
            }
            var d = cc.p(b.width / 2, b.height / 2),
            e = cc.game.config.loading;
            e && flax.isImageFile(e) ? cc.loader.load(e,
            function() {
                a._logo = new cc.Sprite(e);
                a._logo.setPosition(d);
                a.addChild(a._logo, 10);
                if (!cc.sys.isNative) {
                    var b = 16 * (1 + a._logo.width / 200);
                    a.createLabel(cc.pSub(d, cc.p(0, a._logo.height / 2 + 0.6 * b)), b);
                    a.logoClick()
                }
            }) : a.createLabel(d)
        }
    },
    createLabel: function(a, b) {
        var c = this._label = new cc.LabelTTF("Loading...", "Arial", b || 18);
        c.enableStroke(cc.color(51, 51, 51), 2);
        c.setColor(cc.color(255, 255, 255));
        c.setPosition(a);
        this.addChild(c, 10)
    },
    logoClick: function() {
        var a = this._logo,
        b = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: !1,
            onTouchBegan: function(b, d) {
                return cc.rectContainsPoint(flax.getRect(a, !0), b.getLocation()) ? (flax.goHomeUrl(), !0) : !1
            }
        });
        cc.eventManager.addListener(b, this._logo)
    },
    onEnter: function() {
        cc.Node.prototype.onEnter.call(this);
        this.resources && this.schedule(this._startLoading, 0.3)
    },
    _startLoading: function() {
        var a = this;
        a.unschedule(a._startLoading);
        cc.loader.load(a.resources,
        function(b, c, d) {
            null != a._label && a._showProgress("Loading: ", c, d)
        },
        function() {
            a.cb && a.cb()
        })
    },
    _showProgress: function(a, b, c) {
        this._label && (null != c ? this._label.setString(a + (c + 1) + "/" + b) : this._label.setString(a + b + "%"))
    }
};
flax.Preloader = cc.Scene.extend(flax._preloader);
flax.ResPreloader = cc.Layer.extend(flax._preloader);
window.flax.Preloader = flax.Preloader;
window.flax.ResPreloader = flax.ResPreloader;
ALL_DIRECTONS = "UP DOWN LEFT RIGHT LEFT_UP RIGHT_UP RIGHT_DOWN LEFT_DOWN".split(" ");
ALL_DIRECTONS0 = "UP DOWN LEFT RIGHT LEFT_UP LEFT_DOWN".split(" ");
ALL_DIRECTONS1 = "UP DOWN LEFT RIGHT RIGHT_UP RIGHT_DOWN".split(" ");
EIGHT_DIRECTIONS_VALUE = {
    UP: [0, 1],
    DOWN: [0, -1],
    LEFT: [ - 1, 0],
    RIGHT: [1, 0],
    LEFT_UP: [ - 1, 1],
    RIGHT_UP: [1, 1],
    RIGHT_DOWN: [1, -1],
    LEFT_DOWN: [ - 1, -1]
};
MAX_IN_TILE = 10;
flax.TileMap = cc.Node.extend({
    isHexagon: !1,
    autoLayout: !1,
    _allTilesIndex: null,
    _gridCanvas: null,
    _tileWidth: 0,
    _tileHeight: 0,
    _mapWidth: 0,
    _mapHeight: 0,
    _objectsMap: null,
    _objectsArr: null,
    _inUpdate: !1,
    _offset: null,
    ctor: function() {
        this._super();
        this.setAnchorPoint(0, 0);
        this._offset = cc.p()
    },
    init: function(a, b, c, d, e) {
        if (!a || !b) throw "Please set tileWdith and tileHeight!";
        this._tileWidth = a;
        this._tileHeight = b;
        c && d && this.setMapSize(c, d, e)
    },
    update: function(a) {
        for (a = this._objectsArr ? this._objectsArr.length: 0; a--;) {
            var b = this._objectsArr[a];
            b.autoUpdateTileWhenMove && b.updateTile()
        }
    },
    getTileSize: function() {
        return {
            width: this._tileWidth,
            height: this._tileHeight
        }
    },
    getMapSizePixel: function() {
        var a = cc.size(this._tileWidth * this._mapWidth, this._tileHeight * this._mapHeight);
        this.isHexagon && (a.width += 0.5 * this._tileWidth);
        return a
    },
    setMapSize: function(a, b, c) { ! 0 == c && (a = Math.ceil(a / this._tileWidth), b = Math.ceil(b / this._tileHeight));
        c = [[], []];
        if (this._mapWidth == a && this._mapHeight == b) return c;
        null == this._objectsArr && (this._objectsArr = []);
        null == this._objectsMap && (this._objectsMap = []);
        for (var d = this._mapWidth,
        e = this._mapHeight,
        f = -1,
        g = -1,
        k = Math.max(a, d), m = Math.max(b, e); ++f < k;) {
            null == this._objectsMap[f] && (this._objectsMap[f] = []);
            for (g = -1; ++g < m;) f >= a || g >= b ? (c[0] = c[0].concat(this._objectsMap[f][g]), this.removeObjects(f, g), delete this._objectsMap[f][g]) : f < d && g < e || (this._objectsMap[f][g] = [], c[1].push([f, g]));
            0 == this._objectsMap[f].length && delete this._objectsMap[f]
        }
        this._mapWidth = a;
        this._mapHeight = b;
        this.setContentSize(this.getMapSizePixel());
        return c
    },
    getMapSize: function() {
        return {
            width: this._mapWidth,
            height: this._mapHeight
        }
    },
    showDebugGrid: function() {
        this.showGrid()
    },
    showGrid: function(a, b) {
        this._gridCanvas ? this._gridCanvas.clear() : (this._gridCanvas = cc.DrawNode.create(), this.addChild(this._gridCanvas));
        a || (a = 1);
        b || (b = cc.color(255, 0, 0, 255));
        for (var c = 0; c <= this._mapWidth; c++) this._gridCanvas.drawSegment(cc.p(c * this._tileWidth, 0), cc.p(c * this._tileWidth, this._tileHeight * this._mapHeight), a, b);
        for (c = 0; c <= this._mapHeight; c++) this._gridCanvas.drawSegment(cc.p(0, c * this._tileHeight), cc.p(this._tileWidth * this._mapWidth, c * this._tileHeight), a, b)
    },
    hideGrid: function() {
        this._gridCanvas && this._gridCanvas.clear()
    },
    showDebugTile: function(a, b, c) {
        a = this.getTiledPosition(a, b);
        null == c && (c = cc.color(0, 255, 0, 128));
        b = flax.getScale(this, !0);
        flax.drawRect(cc.rect(a.x - this._tileWidth * b.x / 2, a.y - this._tileHeight * b.y / 2, this._tileWidth * b.x, this._tileHeight * b.y), 1, c, c)
    },
    clear: function(a) {
        if (0 != this._objectsArr.length) {
            void 0 === a && (a = !0);
            for (var b, c = 0; c < this._mapWidth; c++) for (var d = 0; d < this._mapHeight; d++) {
                if (a) {
                    b = this._objectsMap[c][d];
                    for (var e in b) {
                        var f = b[e];
                        f instanceof cc.Node && f.destroy()
                    }
                }
                this._objectsMap[c][d] = []
            }
            this._objectsArr.length = 0
        }
    },
    getTileIndex: function(a, b) {
        var c, d;
        null == b ? (c = a.x, d = a.y) : (c = a, d = b);
        var e = this._offset;
        e.x = this.getPositionX();
        e.y = this.getPositionY();
        this.parent && (e = this.parent.convertToWorldSpace(e));
        var f = flax.getScale(this, !0),
        g = Math.abs(f.x),
        k = Math.abs(f.y),
        f = Math.floor((c - e.x) / (this._tileWidth * g));
        d = Math.floor((d - e.y) / (this._tileHeight * k));
        this.isHexagon && 0 != d % 2 && (f = Math.floor((c - e.x - this._tileWidth * g * 0.5) / (this._tileWidth * g)));
        return {
            x: f,
            y: d
        }
    },
    getTiledPosition: function(a, b) {
        var c = this._offset;
        c.x = this.getPositionX();
        c.y = this.getPositionY();
        this.parent && (c = this.parent.convertToWorldSpace(c));
        var d = flax.getScale(this, !0),
        e = Math.abs(d.x),
        f = Math.abs(d.y),
        d = (a + 0.5) * this._tileWidth * e + c.x,
        c = (b + 0.5) * this._tileHeight * f + c.y;
        this.isHexagon && 0 != b % 2 && (d += 0.5 * this._tileWidth * e);
        return {
            x: d,
            y: c
        }
    },
    getCoveredTiles: function(a, b) {
        var c = flax.getRect(a, !0);
        return this.getCoveredTiles1(c, b)
    },
    getCoveredTiles1: function(a, b) {
        b = !0 === b;
        for (var c = this.getTileIndex(a.x, a.y), d = c.x, e = c.y, c = this.getTileIndex(a.x + a.width, a.y + a.height), f = c.x, c = c.y, g = [], d = d - 1, k = 0; ++d <= f;) for (k = e - 1; ++k <= c;) b ? g = g.concat(this.getObjects(d, k)) : g.push({
            x: d,
            y: k
        });
        return g
    },
    isValideTile: function(a, b) {
        return 0 <= a && a < this._mapWidth && 0 <= b && b < this._mapHeight
    },
    snapToTile: function(a, b, c, d) {
        if (a instanceof cc.Node) {
            var e = null;
            if (null == b || null == c) e = a.getPosition(),
            a.parent && (e = a.parent.convertToWorldSpace(e)),
            c = this.getTileIndex(e),
            b = c.x,
            c = c.y;
            e = this.getTiledPosition(b, c);
            a.parent && (e = a.parent.convertToNodeSpace(e));
            a.setPosition(e); ! 0 === d && a.setTileMap(this)
        }
    },
    snapAll: function() {
        for (var a = this._objectsArr.length,
        b = -1,
        c = null; ++b < a;) c = this._objectsArr[b],
        this.snapToTile(c)
    },
    addObject: function(a, b, c) {
        void 0 === b && (b = a.tx);
        void 0 === c && (c = a.ty);
        a.tx = b;
        a.ty = c;
        if (this.isValideTile(b, c) && !( - 1 < this._objectsArr.indexOf(a))) {
            this._objectsArr.push(a);
            var d = this._objectsMap[b][c]; ! this._inUpdate && cc.sys.isNative && (this._inUpdate = !0, cc.director.getScheduler().scheduleUpdateForTarget(this));
            if (a instanceof cc.Node && this.autoLayout) {
                b = (b + (this._mapHeight - 1 - c) * this._mapWidth) * MAX_IN_TILE;
                c = null;
                for (var e = 0,
                f = !1,
                g = 0; g < d.length; g++) c = d[g],
                c instanceof cc.Node && (!f && c.y <= a.y && (d.splice(g, 0, a), a.zIndex = Math.min(e, MAX_IN_TILE) + b, f = !0, e++, g++), c.zIndex = Math.min(e, MAX_IN_TILE) + b, e++);
                f || (d.push(a), a.zOrder = Math.min(e, MAX_IN_TILE) + b)
            } else d.push(a)
        }
    },
    updateLayout: function(a, b) {
        if (this.isValideTile(a, b)) {
            var c = this._objectsMap[a][b];
            if (0 != c.length) {
                c.sort(this._sortByY);
                for (var d = (a + (this._mapHeight - 1 - b) * this._mapWidth) * MAX_IN_TILE, e = null, f = 0, g = 0; g < c.length; g++) e = c[g],
                e instanceof cc.Node && (e.zIndex = Math.min(f, MAX_IN_TILE) + d, f++)
            }
        }
    },
    removeObject: function(a, b, c) {
        void 0 === b && (b = a.tx);
        void 0 === c && (c = a.ty);
        this.isValideTile(b, c) && (b = this._objectsMap[b][c], c = b.indexOf(a), -1 < c && b.splice(c, 1), c = this._objectsArr.indexOf(a), -1 < c && this._objectsArr.splice(c, 1));
        this._inUpdate && cc.sys.isNative && 0 == this._objectsArr.length && (this._inUpdate = !1, cc.director.getScheduler().unscheduleUpdateForTarget(this))
    },
    removeObjects: function(a, b) {
        if (this.isValideTile(a, b)) for (var c = this._objectsMap[a][b], d = null, d = -1; c.length;) d = c[0],
        d.tx = d.ty = -1,
        d = this._objectsArr.indexOf(d),
        -1 < d && this._objectsArr.splice(d, 1),
        c.splice(0, 1)
    },
    getObjects: function(a, b) {
        return this.isValideTile(a, b) ? this._objectsMap[a][b] : []
    },
    getObjects1: function(a, b) {
        var c = this.getTileIndex(a, b);
        return this.getObjects(c.x, c.y)
    },
    getAllObjects: function() {
        return this._objectsArr
    },
    getTiles: function(a) {
        for (var b = [], c = -1, d = -1; ++c < this._mapWidth;) for (d = -1; ++d < this._mapHeight;) null != a && !1 === a(this, c, d) || b.push({
            x: c,
            y: d
        });
        return b
    },
    getRow: function(a, b) {
        for (var c = -1,
        d = []; ++c < this._mapHeight;) d = !0 === b ? d.concat(this.getObjects(a, c)) : d.push({
            x: a,
            y: c
        });
        return d
    },
    getCol: function(a, b) {
        for (var c = -1,
        d = []; ++c < this._mapWidth;) d = !0 === b ? d.concat(this.getObjects(c, a)) : d.push({
            x: c,
            y: a
        });
        return d
    },
    __tilesSearched: null,
    __nonRecursive: !1,
    findConnectedObjects: function(a, b, c) {
        this.__tilesSearched = {};
        b = this.findNeighbors(a, b, c, null, !1);
        a = b.indexOf(a); - 1 < a && b.splice(a, 1);
        this.__tilesSearched = null;
        return b
    },
    findNeighbors: function(a, b, c, d, e) {
        for (var f = this._getAllDirections(a, c, d), g = !this.__nonRecursive && null != this.__tilesSearched, k = [], m = f.length; m--;) {
            var n = EIGHT_DIRECTIONS_VALUE[f[m]],
            p = a.tx + n[0],
            n = a.ty + n[1];
            if (this.__tilesSearched) {
                var r = p + "-" + n;
                if (!0 === this.__tilesSearched[r]) continue;
                this.__tilesSearched[r] = !0
            }
            if (e) k.push({
                x: p,
                y: n
            });
            else for (var p = this.getObjects(p, n), n = null, r = !1, u = 0; u < p.length; u++) if (n = p[u], null == b || 0 == b.length || n[b] === a[b]) k.push(n),
            !r && g && (k = k.concat(this.findNeighbors(n, b, c, d, e)), r = !0)
        }
        return k
    },
    findSeparatedGroups: function() {
        var a = [],
        b = null;
        this.__tilesSearched = {};
        var c = this.getAllObjects(),
        d = [],
        e = c.length;
        for (i = 0; i < e; i++) nb = c[i],
        -1 < d.indexOf(nb) || (b = this.findNeighbors(nb), b.length || !0 === this.__tilesSearched[nb.tx + "-" + nb.ty] || (b = [nb], this.__tilesSearched[nb.tx + "-" + nb.ty] = !0), a.push(b), d = d.concat(b));
        this.__tilesSearched = null;
        return a
    },
    findSurroundings: function(a, b, c, d) {
        if (null == b || 1 > b) b = 1;
        a = [a];
        var e = [];
        this.__tilesSearched = {};
        for (this.__nonRecursive = !0; b--;) {
            for (var f = [], g = 0; g < a.length; g++) {
                var k = a[g];
                void 0 === k.tx && (k = {
                    tx: k.x,
                    ty: k.y
                });
                f = f.concat(this.findNeighbors(k, null, !0, null, c && d ? !c: !0))
            }
            a = f;
            if (c && !d) {
                for (var m = [], g = 0; g < f.length; g++) k = f[g],
                m = m.concat(this.getObjects(k.x, k.y));
                e.push(m)
            } else e.push(f)
        }
        this.__tilesSearched = null;
        this.__nonRecursive = !1;
        return e
    },
    _getAllDirections: function(a, b, c) {
        var d = ALL_DIRECTONS;
        this.isHexagon ? d = 0 == a.ty % 2 ? ALL_DIRECTONS0: ALL_DIRECTONS1: b || (d = d.slice(0, 4));
        a = ALL_DIRECTONS.indexOf(c);
        if ( - 1 == a || 3 < a) return d;
        b = [];
        var e = null;
        for (a = 0; a < d.length; a++) e = d[a],
        -1 < e.indexOf(c) && b.push(e);
        this.isHexagon && 1 == b.length && b.push("UP", "DOWN");
        return b
    },
    isEmptyTile: function(a, b) {
        if (!this.isValideTile(a, b)) return ! 1;
        var c = this.getObjects(a, b);
        return c ? 0 == c.length: !1
    },
    tileToIndex: function(a, b) {
        return b * this._mapWidth + a
    },
    indexToTile: function(a) {
        var b = a % this._mapWidth;
        return {
            x: b,
            y: Math.floor((a - b) / this._mapWidth)
        }
    },
    getAllTilesIndex: function() {
        if (!this._allTilesIndex) {
            this._allTilesIndex = [];
            for (var a = 0; a < this._mapWidth * this._mapHeight; a++) this._allTilesIndex.push(a)
        }
        return this._allTilesIndex
    },
    findEmptyTilesIndex: function() {
        for (var a = this.getAllTilesIndex().concat(), b = this._objectsArr, c = b.length, d = 0; d < c && a.length; d++) for (var e = this.getCoveredTiles(b[d]), f = e.length, g = 0; g < f; g++) {
            var k = e[g],
            k = a.indexOf(this.tileToIndex(k.x, k.y)); - 1 < k && a.splice(k, 1)
        }
        return a
    },
    _sortByY: function(a, b) {
        if (a.y > b.y) return - 1;
        if (a.y < b.y) return 1
    }
});
flax.TileMap.create = function(a) {
    return new flax.TileMap(a)
};
_p = flax.TileMap.prototype;
cc.defineGetterSetter(_p, "tileSize", _p.getTileSize);
cc.defineGetterSetter(_p, "mapSize", _p.getMapSize);
flax._tileMaps = {};
flax.getTileMap = function(a) {
    if ("undefined" !== typeof flax._tileMaps[a]) return flax._tileMaps[a];
    cc.log("The tileMap: " + a + " hasn't been defined, pls use flax.registerTileMap to define it firstly!");
    return null
};
flax.registerTileMap = function(a) {
    flax._tileMaps[a.id] = a
};
flax.userData = {};
flax.fetchUserData = function(a) {
    a && (flax.userData = a);
    a = null;
    try { (a = cc.sys.localStorage.getItem(cc.game.config.gameId)) && (a = JSON.parse(a))
    } catch(b) {
        cc.log("Fetch UserData Error: " + b.name)
    }
    a && flax.copyProperties(a, flax.userData);
    flax.userData || (flax.userData = {})
};
flax.saveUserData = function() {
    flax.userData || (flax.userData = {});
    try {
        cc.sys.localStorage.setItem(cc.game.config.gameId, JSON.stringify(flax.userData))
    } catch(a) {
        cc.log("Save UserData Error: " + a.name)
    }
};
flax.ObjectPool = cc.Class.extend({
    maxCount: 100,
    _clsName: null,
    _cls: null,
    _assetsFile: null,
    _pool: null,
    _extraID: "",
    init: function(a, b, c) {
        if (this._assetsFile && this._cls) return cc.log("The pool has been inited with cls: " + this._cls),
        !1;
        this._clsName = b;
        this._cls = flax.nameToObject(b);
        if (null == this._cls) return cc.log("There is no class named: " + b),
        !1;
        this._assetsFile = a;
        this._pool = [];
        void 0 !== c && (this.maxCount = c);
        return ! 0
    },
    fetch: function(a, b, c) {
        if (null == a) return cc.log("Please give me a assetID to fetch a object!"),
        null;
        var d = null;
        0 < this._pool.length ? (d = this._pool.shift(), d.__fromPool = !0, d.onRecycle && d.onRecycle(), d.setSource(this._assetsFile, a)) : d = this._cls.create ? this._cls.create(this._assetsFile, a) : new this._cls(this._assetsFile, a);
        d.__pool__id__ = this._extraID;
        d.clsName = this._clsName;
        d._destroyed = !1;
        d.autoRecycle = !0;
        d.visible = !0;
        c ? "undefined" === typeof c.zIndex && (c.zIndex = 0) : c = {
            zIndex: 0
        };
        d.attr(c);
        b && b.addChild(d);
        return d
    },
    recycle: function(a) {
        a instanceof this._cls ? this._pool.length < this.maxCount && (a.retain && a.retain(), this._pool.push(a)) : cc.log("The object to recycle is not the same type with this pool: " + this._clsName)
    },
    release: function() {
        for (var a = this._pool.length; a--;) this._pool[a].release && this._pool[a].release();
        this._pool.length = 0
    }
});
flax.ObjectPool.all = {};
flax.ObjectPool.create = function(a, b, c) {
    var d = new flax.ObjectPool;
    return d.init(a, b, c) ? d: null
};
flax.ObjectPool.get = function(a, b, c) {
    null == b && (b = "flax.Animator");
    null == c && (c = "");
    var d = a + b + c,
    e = flax.ObjectPool.all[d];
    null == e && (e = flax.ObjectPool.create(a, b), e._extraID = c, flax.ObjectPool.all[d] = e);
    return e
};
flax.ObjectPool.release = function() {
    for (var a in flax.ObjectPool.all) flax.ObjectPool.all[a].release(),
    delete flax.ObjectPool.all[a]
};
flax.HealthModule = {
    maxHealth: 100,
    health: 100,
    hurtable: !0,
    dead: !1,
    ownerBody: null,
    onEnter: function() {
        this.health = this.maxHealth;
        this.dead = !1
    },
    onExit: function() {},
    onHit: function(a) {
        if (!this.hurtable) return ! 1;
        if (this.dead) return ! 0;
        this.health -= a.damage;
        return 0 >= this.health ? (this.dead = !0, this.health = 0, this.onDie(), !0) : !1
    },
    onDie: function() {
        this.ownerBody ? this.ownerBody.destroy() : this.destroy()
    }
};
flax.EnemyWaveModule = {
    waveAssetJson: null,
    waves: null,
    onWaveBegin: null,
    onEnemyIn: null,
    onWaveOver: null,
    batchCanvas: null,
    currentWave: -1,
    totalWaves: 0,
    wavePaused: !0,
    waveOver: !1,
    _waveDefine: null,
    _enemyCount: 0,
    _firstRun: !0,
    onEnter: function() {
        this.totalWaves = this.waves.length;
        this.onWaveBegin = new signals.Signal;
        this.onEnemyIn = new signals.Signal;
        this.onWaveOver = new signals.Signal;
        this.wavePaused || this.nextWave()
    },
    onExit: function() {
        this.onWaveBegin.removeAll();
        this.onEnemyIn.removeAll();
        this.onWaveOver.removeAll()
    },
    startWave: function() {
        this.wavePaused && (this.wavePaused = !1, this._firstRun ? this.nextWave() : this._createWaveEnemy(), this._firstRun = !1)
    },
    stopWave: function() {
        this.wavePaused || (this.wavePaused = !0)
    },
    nextWave: function() {
        this.waveOver || this.wavePaused || (this._enemyCount = 0, this.currentWave++, this._waveDefine = this.waves[this.currentWave], this._createWaveEnemy(), this.onWaveBegin.dispatch())
    },
    _createWaveEnemy: function() {
        if (!this.waveOver && !this.wavePaused) {
            var a = flax.getRandomInArray(this._waveDefine.types),
            a = this._doCreateEnemy(a);
            this.onEnemyIn.dispatch(a); ++this._enemyCount < this._waveDefine.count ? (a = flax.randInt(parseInt(this._waveDefine.interval[0]), parseInt(this._waveDefine.interval[1])), this.scheduleOnce(function() {
                this._createWaveEnemy()
            },
            a)) : this.currentWave == this.totalWaves - 1 ? (this.waveOver = !0, this.onWaveOver.dispatch()) : this.nextWave()
        }
    },
    _doCreateEnemy: function(a) {
        this.waveAssetJson && flax.assetsManager.createDisplay(this.waveAssetJson, a, {
            parent: this.batchCanvas,
            x: this.x,
            y: this.y
        },
        !0)
    }
};
flax._soundButton = {
    onEnter: function() {
        this._super();
        this.setState(flax.getSoundEnabled() ? ButtonState.UP: ButtonState.SELECTED)
    },
    _onClick: function(a, b) {
        this._super(a, b);
        flax.setSoundEnabled(!this.isSelected())
    }
};
flax.SimpleSoundButton = flax.SimpleButton.extend(flax._soundButton);
flax.SoundButton = flax.Button.extend(flax._soundButton);
flax.GunParam = cc.Class.extend({
    bulletAssets: null,
    bulletID: null,
    targetMap: null,
    selfMap: null,
    damage: 1,
    damageRadius: 0,
    speed: 600,
    interval: 0.15,
    count: 1,
    angleGap: 5,
    angleOffset: 0,
    waveInterval: 0,
    countInWave: 6,
    gravityX: 0,
    gravityY: 0,
    fireSound: null,
    fireEffectID: null,
    hitEffectID: null,
    alwaysLive: !1,
    bulletPlayOnce: !1,
    fps: 0,
    isMissle: !1
});
flax.GunParam.create = function(a) {
    var b = new flax.GunParam;
    0 == a.speed && (a.speed = 0.001);
    flax.copyProperties(a, b);
    return b
};
flax.Gun = cc.Node.extend({
    owner: null,
    param: null,
    aimTarget: null,
    _firing: !1,
    _targetMap: null,
    _canvas: null,
    start: function() {
        this._firing || (this._firing = !0, this._canvas = flax.BulletCanvas.fetch(this.param.bulletAssets), 0 >= this.param.waveInterval || 1 > this.param.countInWave ? (this.schedule(this.shootOnce, this.param.interval), this.shootOnce()) : this._waveFire())
    },
    end: function() {
        this._firing && (this._firing = !1, this.unschedule(this.shootOnce), this.unschedule(this._createWave))
    },
    updateParam: function(a) {
        null != a && (flax.copyProperties(a, this.param), this.end(), this.start())
    },
    isFiring: function() {
        return this._firing
    },
    _waveFire: function() {
        this._firing && (this._createWave(), this.schedule(this._createWave, this.param.interval * this.param.countInWave + this.param.waveInterval, cc.REPEAT_FOREVER))
    },
    shootOnce: function() {
        if (null != this.parent) {
            var a = this.parent.convertToWorldSpace(this.getPosition());
            if (this.aimTarget && this.aimTarget.parent && this.aimTarget.visible) {
                var b = flax.getAngle(flax.getPosition(this, !0), this.aimTarget.center);
                this.owner.onAimingTarget(b);
                this.rotation = b - this.param.angleOffset - this.parent.rotation
            }
            for (var a = this._canvas.convertToNodeSpace(a), b = flax.getRotation(this, !0), c = -1, d = 0, e = 0, f = flax.createDInts(this.param.count); ++c < this.param.count;) e = f[c],
            d = b + e * this.param.angleGap,
            this._canvas.addBullet(d, a, this.param, this.owner);
            this._showFireEffect(a, d);
            this.param.fireSound && flax.playSound(this.param.fireSound)
        }
    },
    _createWave: function() {
        1 < this.param.countInWave ? this.schedule(this.shootOnce, this.param.interval, this.param.countInWave - 1) : this.shootOnce()
    },
    _showFireEffect: function(a, b) {
        if (null != this.param.fireEffectID && "" != this.param.fireEffectID) {
            var c = flax.assetsManager.createDisplay(this.param.bulletAssets, this.param.fireEffectID, {
                parent: this._canvas
            },
            !0);
            c.zIndex = 999;
            c.autoDestroyWhenOver = !0;
            c.setPosition(a);
            c.setRotation(b);
            c.gotoAndPlay(0)
        }
    }
});
flax.BulletCanvas = cc.SpriteBatchNode.extend({
    assetsFile: null,
    onBulletHit: null,
    onBulletOut: null,
    _bullets: null,
    onEnter: function() {
        this._super();
        this._bullets = [];
        this.onBulletHit = new signals.Signal;
        this.onBulletOut = new signals.Signal;
        this.scheduleUpdate()
    },
    onExit: function() {
        this._super();
        this.onBulletHit.removeAll();
        this.onBulletOut.removeAll()
    },
    addBullet: function(a, b, c, d) {
        if (null == this.parent) cc.log("Please create a bullet canvas: flax.BulletCanvas.create('" + this.assetsFile + "', container, zIndex);");
        else {
            c instanceof flax.GunParam || (c = flax.GunParam.create(c));
            var e = flax.assetsManager.createDisplay(c.bulletAssets, c.bulletID, {
                parent: this
            },
            !0);
            e.owner = d;
            e.param = c;
            d && d.targets && (e.targets = d.targets);
            c.targetMap && (e.targetMap = flax.getTileMap(c.targetMap));
            c.fps && (e.fps = c.fps);
            e.__physicalShooted = !1;
            if (e instanceof flax.MovieClip) {
                e.__isMovieClip = !0;
                e.autoPlayChildren = !0;
                e.autoDestroyWhenOver = !0;
                d = e.children.length;
                for (var f; d--;) f = e.children[d],
                c.selfMap && f.setTileMap(c.selfMap),
                f.__isBullet = !0,
                f.__canvas = this,
                f.__body = e
            } else c.selfMap && (e.setTileMap(c.selfMap), e.__isBullet = !0, e.__canvas = this, e.__body = e);
            e.play();
            e.autoStopWhenOver = c.bulletPlayOnce;
            e.setPosition(b);
            e.setRotation(a);
            b = c.damage;
            b instanceof Array && (1 == b.length ? b = b[0] : 2 <= b.length && (b = flax.randInt(b[0], b[1])));
            e.damage = b;
            a = DEGREE_TO_RADIAN * (90 - (a + c.angleOffset));
            e.__vx = c.speed * Math.cos(a);
            e.__vy = c.speed * Math.sin(a);
            this._bullets.push(e);
            return e
        }
    },
    destroyBullet: function(a, b, c) {
        void 0 === b && (b = this._bullets.indexOf(a));
        0 > b || (!1 !== c && a.destroy(), this._bullets.splice(b, 1))
    },
    update: function(a) {
        var b = this._bullets.length;
        if (0 != b) for (var c = null,
        d = null,
        d = null,
        e = !1,
        e = null; b--;) {
            c = this._bullets[b];
            c.physicsBody ? c.__physicalShooted || (c.physicsBody.SetLinearVelocity({
                x: c.__vx / PTM_RATIO,
                y: c.__vy / PTM_RATIO
            }), c.__physicalShooted = !0) : (c.__vx += c.param.gravityX * a, c.__vy += c.param.gravityY * a, c.x += c.__vx * a, c.y += c.__vy * a, c.rotation = flax.getAngle1(c.__vx, c.__vy, !0) - c.param.angleOffset);
            var d = flax.getRect(c, !0),
            e = !1,
            f = !cc.rectIntersectsRect(flax.stageRect, d);
            f || (d = this._checkHittedTarget(c, d, !1)) && d.length && (e = flax.getPosition(c, !0), d = c.param.damageRadius, 0 < d && (d = cc.rect(e.x - d / 2, e.y - d / 2, d, d), this._checkHittedTarget(c, d, !0)), e = !0);
            f ? (this.onBulletOut.dispatch(c), this.destroyBullet(c, b)) : e && (this.onBulletHit.dispatch(c), c.param.alwaysLive || this.destroyBullet(c, b))
        }
    },
    _checkHittedTarget: function(a, b, c) {
        var d = [],
        e = null;
        a.targets ? e = a.targets: a.targetMap && (e = a.targetMap.getCoveredTiles1(b, !0));
        if (!e || !e.length) return d;
        b = flax.getRotation(a, !0);
        for (var f = -1; ++f < e.length;) if ((target = e[f]) && target.parent && target.visible && (!a.owner || !(target == a.owner || flax.isChildOf(a.owner, target) || !0 === target.dead || null != a.owner.camp && target.camp == a.owner.camp))) if (a.__isMovieClip) for (var g = a.children,
        k = g.length; k--;) {
            var m = g[k];
            b = flax.getRotation(m, !0);
            if (m.mainCollider.checkCollision(target.mainCollider)) {
                flax.callModuleFunction(target, "onHit", a); ! 1 !== target.hurtable && this._showHitEffect(a, b, a.convertToWorldSpace(m.getPosition()));
                target.__isBullet && (m = target.__canvas._bullets.indexOf(target), -1 < m && target.__canvas._bullets.splice(m, 1), target.__body.destroy());
                if (!c) return [target];
                d.push(target)
            }
        } else if (a.mainCollider.checkCollision(target.mainCollider)) {
            flax.callModuleFunction(target, "onHit", a); ! 1 !== target.hurtable && this._showHitEffect(a, b, a.getPosition());
            target.__isBullet && (m = target.__canvas._bullets.indexOf(target), -1 < m && target.__canvas._bullets.splice(m, 1), target.__body.destroy());
            if (!c) return [target];
            d.push(target)
        }
        return d
    },
    _showHitEffect: function(a, b, c) {
        if (null != a.param.hitEffectID && "" != a.param.hitEffectID) {
            var d = flax.assetsManager.createDisplay(a.param.bulletAssets, a.param.hitEffectID, {
                parent: this
            },
            !0);
            d.zIndex = 999;
            d.autoDestroyWhenOver = !0;
            d.setPosition(c || a.getPosition());
            d.setRotation(b);
            d.gotoAndPlay(0)
        }
    }
});
flax.BulletCanvas.create = function(a, b, c) {
    a = flax.BulletCanvas.fetch(a);
    a.parent != b && (a.removeFromParent(), b.addChild(a, c || 999))
};
flax.BulletCanvas.fetch = function(a) {
    if (flax._bulletCanvases[a]) return flax._bulletCanvases[a];
    var b = cc.path.changeBasename(a, ".png"),
    b = new flax.BulletCanvas(b, 100);
    b.assetsFile = a;
    return flax._bulletCanvases[a] = b
};
flax._bulletCanvases = {};
flax.BulletCanvas.release = function() {
    flax._bulletCanvases = {}
};
flax.Gun.create = function(a) {
    if (null == a) return cc.log("Please give me a param defiled like: flax.GunParam!"),
    null;
    a = flax.GunParam.create(a);
    var b = new flax.Gun;
    b.param = a;
    b.init();
    return b
};
flax._gunnerDefine = {
    camp: null,
    _gunParam: null,
    targets: null,
    alwaysBind: !0,
    _guns: null,
    _autoShooting: !1,
    _waitingShoot: !1,
    _auto: !1,
    onEnter: function() {
        this._super();
        this._guns = [];
        this._gunParam && this.setGunParam(this._gunParam)
    },
    onRecycle: function() {
        this._super();
        this._guns = this.targets = this._gunParam = this.camp = null;
        this._autoShooting = this._waitingShoot = this._auto = !1;
        this.stopShoot()
    },
    getGunParam: function() {
        return this._gunParam
    },
    setGunParam: function(a, b) {
        this._gunParam = a;
        if (null != this.parent) if (b || (b = a.gunAnchors), null == b) cc.log("Please set the gunAnchors param!");
        else {
            for (var c = -1,
            d = b.length,
            e = null,
            f = null; ++c < d;) e = b[c],
            f = flax.Gun.create(this._gunParam),
            this.bindAnchor(e, f, this.alwaysBind) && (f.owner = this, f.name = e, this[e] = f, this._guns.push(f));
            this._waitingShoot && this.scheduleOnce(this.autoShoot, 0.1)
        }
    },
    shoot: function() {
        this._auto = !1;
        this._doBeginShoot()
    },
    autoShoot: function(a) {
        this._auto = !0;
        null == this.parent || null == this._guns || 0 == this._guns.length ? this._waitingShoot = !0 : (0 < a ? this.scheduleOnce(this._doBeginShoot, a) : this._doBeginShoot(), this._autoShooting = !0, this._waitingShoot = !1)
    },
    aimToTarget: function(a) {
        if (a && a.parent && a.visible) {
            null == this.targets ? this.targets = [a] : -1 == this.targets.indexOf(a) && this.targets.push(a);
            for (var b = -1,
            c = this._guns.length,
            d = null; ++b < c;) d = this._guns[b],
            d.aimTarget = a
        }
    },
    onAimingTarget: function(a) {},
    _doBeginShoot: function() {
        for (var a = -1,
        b = this._guns.length; ++a < b;) this._auto ? this._guns[a].start() : this._guns[a].shootOnce()
    },
    stopShoot: function() {
        this._autoShooting = !1;
        if (null != this._guns && 0 != this._guns.length) for (var a = -1,
        b = this._guns.length; ++a < b;) this._guns[a].end()
    },
    upgradeGun: function(a, b) {
        var c = this._deltaGunParam(a); ! isNaN(b) && 0 < b ? this.scheduleOnce(function() {
            this._deltaGunParam(c)
        },
        b) : this._deltaGunParam(c)
    },
    _deltaGunParam: function(a) {
        if (0 != this._guns.length) {
            var b = {},
            c = 0,
            d;
            for (d in a) c = this._guns[0].param[d] + a[d],
            0 >= c ? delete a[d] : (b[d] = -a[d], a[d] = c);
            c = this._guns.length;
            for (d = null; c--;) d = this._guns[c],
            d.updateParam(a);
            return b
        }
    },
    onDie: function() {
        this.stopShoot();
        flax.callModuleFunction(this, "onDie");
        this.ownerBody ? this.ownerBody.destroy() : this.destroy()
    }
};
flax.Gunner = flax.Animator.extend(flax._gunnerDefine);
window.flax.Gunner = flax.Gunner;
flax.MCGunner = flax.MovieClip.extend(flax._gunnerDefine);
window.flax.MCGunner = flax.MCGunner;
flax.addModule(flax.Gunner, flax.HealthModule, !1);
flax.addModule(flax.MCGunner, flax.HealthModule, !1);
_p = flax.Gunner.prototype;
cc.defineGetterSetter(_p, "gunParam", _p.getGunParam, _p.setGunParam);
_p = flax.MCGunner.prototype;
cc.defineGetterSetter(_p, "gunParam", _p.getGunParam, _p.setGunParam);
flax.Gunner.create = function(a, b) {
    var c = new flax.Gunner(a, b);
    c.clsName = "flax.Gunner";
    return c
};
flax.MCGunner.create = function(a, b) {
    var c = new flax.MCGunner(a, b);
    c.clsName = "flax.MCGunner";
    return c
};
flax.ScrollingBG = cc.Node.extend({
    name: null,
    onScrolledOver: null,
    _loop: !0,
    _bg0: null,
    _bg1: null,
    _sources: null,
    _scrollingIndex: 0,
    _scrolling: !1,
    _paused: !1,
    _speedX: 0,
    _speedY: 0,
    _d: 1,
    _size: null,
    _x0: 0,
    _y0: 0,
    ctor: function(a, b, c) {
        this._super();
        this._sources = [];
        this.onScrolledOver = new signals.Signal;
        a && this.addSource(a, b, c)
    },
    onExit: function() {
        this._super();
        this.onScrolledOver.removeAll()
    },
    addSource: function(a, b, c) {
        this._sources.push({
            source: a,
            assetID: b,
            isTile: c
        });
        null == this._bg0 && (this._bg0 = this._createNextBG())
    },
    _createNextBG: function() {
        this._scrollingIndex > this._sources.length - 1 && (this._scrollingIndex = 0);
        var a = this._sources[this._scrollingIndex];
        this._scrollingIndex++;
        var b = null;
        if (null != a.assetID) b = !0 !== a.isTile ? flax.assetsManager.createDisplay(a.source, a.assetID, null, !0) : new flax.TiledImage(a.source, a.assetID);
        else if (a.source) if (flax.isFlaxDisplay(a.source)) a.source.parent && a.source.parent.addChild(this, a.source.zIndex),
        this.name = a.source.name,
        this.parent && (this.parent[this.name] = this),
        this.setPosition(a.source.getPosition()),
        b = flax.assetsManager.cloneDisplay(a.source),
        a.source.removeFromParent();
        else if (flax.isImageFile(a.source)) b = new cc.Sprite(a.source);
        else throw "Not supported source type!";
        else throw "Arguments is not valid!";
        b.setAnchorPoint(0, 0);
        this.addChild(b);
        null == this._size && (this._size = b.getContentSize(), this.setContentSize(this._size));
        return b
    },
    reset: function() {
        this._paused = !1;
        this._scrolling && (this._scrolling = !1, this._speedX = this._speedY = 0, this._bg0.destroy ? this._bg0.destroy() : this._bg0.removeFromParent(), this._bg0 = null, this._bg1.destroy ? this._bg1.destroy() : this._bg1.removeFromParent(), this._bg1 = null, this._scrollingIndex = 0, null == this._bg0 && (this._bg0 = this._createNextBG()), this._bg0.setPosition(this._x0, this._y0), this.unscheduleUpdate())
    },
    startXScroll: function(a, b) {
        0 == a || null == this._bg0 || this._scrolling || (this._scrolling = !0, this._loop = !1 !== b, this._speedX = a, this._speedY = 0, this._d = 0 < this._speedX ? 1 : -1, this._resetScroll(), this.scheduleUpdate())
    },
    startYScroll: function(a, b) {
        0 == a || null == this._bg0 || this._scrolling || (this._scrolling = !0, this._loop = !1 !== b, this._speedY = a, this._speedX = 0, this._d = 0 < this._speedY ? 1 : -1, this._resetScroll(), this.scheduleUpdate())
    },
    pauseScroll: function() {
        this._scrolling && !this._paused && (this._paused = !0, this.unscheduleUpdate())
    },
    resumeScroll: function() {
        this._scrolling && this._paused && (this._paused = !1, this.scheduleUpdate())
    },
    _resetScroll: function() {
        this._bg0.setPosition(this._x0, this._y0);
        null == this._bg1 && (this._bg1 = this._createNextBG());
        0 != this._speedX ? this._bg1.x = -this._d * (this._size.width - 1) : this._bg1.y = -this._d * (this._size.height - 1)
    },
    update: function(a) {
        if (0 == this._size.width * this._size.height) this._size = this._bg0.getContentSize(),
        0 != this._size.width * this._size.height && (this.setContentSize(this._size), this._resetScroll());
        else {
            var b = !1;
            0 != this._speedX ? (a *= this._speedX, this._bg0.x += a, this._bg1.x += a, a = this._size.width - this._bg0.x * this._d, 0 >= a && (this._bg0.x += this._d * a, this._bg1.x += this._d * a, b = !0)) : 0 != this._speedY && (a *= this._speedY, this._bg0.y += a, this._bg1.y += a, a = this._size.height - this._bg0.y * this._d, 0 >= a && (this._bg0.y += this._d * a, this._bg1.y += this._d * a, b = !0));
            b && (!this._loop && this._scrollingIndex > this._sources.length - 1 ? (this.onScrolledOver.dispatch(), this.pauseScroll()) : (this._bg0.destroy ? this._bg0.destroy() : this._bg0.removeFromParent(), this._bg0 = this._bg1, this._bg1 = this._createNextBG(), this._resetScroll()))
        }
    },
    getRect: function() {
        0 == this._size.width * this._size.height && (this._size = this._bg0.getContentSize(), 0 != this._size.width * this._size.height && this.setContentSize(this._size));
        return cc.rect(0, 0, this._size.width, this._size.height)
    }
});
flax.ScrollingBG.create = function(a, b, c) {
    return new flax.ScrollingBG(a, b, c)
};
flax._scrollPaneDefine = {
    _viewRect: null,
    onEnter: function() {
        this._super(); (this._viewRect = this.getCollider("view").getRect(!0)) ? flax.inputManager.addListener(null, this._startDrag, InputType.press, this) : cc.log("If you want me scrollable, please set collider__view for me!")
    },
    scrollToCenter: function(a, b) {
        var c = cc.visibleRect.center,
        c = this.parent.convertToNodeSpace(c),
        d = this.convertToWorldSpace(a.getPosition ? a.getPosition() : a),
        d = this.parent.convertToNodeSpace(d),
        c = cc.pSub(c, d),
        c = this._validatePos(this.x + c.x, this.y + c.y);
        0 < b ? this.runAction(cc.MoveTo.create(b, c)) : this.setPosition(c)
    },
    _startDrag: function(a, b) {
        this.scheduleOnce(function() {
            flax.inputManager.addListener(null, this._drag, InputType.move, this);
            flax.inputManager.addListener(null, this._stopDrag, InputType.up, this)
        },
        0.01)
    },
    _drag: function(a, b) {
        var c = a.getDelta();
        this._viewRect.width >= this.width && (c.x = 0);
        this._viewRect.height >= this.height && (c.y = 0);
        c = this._validatePos(this.x + c.x, this.y + c.y);
        this.x = c.x;
        this.y = c.y
    },
    _stopDrag: function(a, b) {
        flax.inputManager.removeListener(null, this._drag, InputType.move);
        flax.inputManager.removeListener(null, this._stopDrag, InputType.up)
    },
    _validatePos: function(a, b) {
        a = Math.max(this._viewRect.x + this._viewRect.width - this.width, a);
        a = Math.min(this._viewRect.x, a);
        b = Math.max(this._viewRect.y + this._viewRect.height - this.height, b);
        b = Math.min(this._viewRect.y, b);
        return cc.p(a, b)
    }
};
flax.ScrollPane = flax.Animator.extend(flax._scrollPaneDefine);
flax.ScrollPane.create = function(a, b) {
    return new flax.ScrollPane(a, b)
};
window.flax.ScrollPane = flax.ScrollPane;
flax.MCScrollPane = flax.MovieClip.extend(flax._scrollPaneDefine);
flax.MCScrollPane.create = function(a, b) {
    return new flax.MCScrollPane(a, b)
};
window.flax.MCScrollPane = flax.MCScrollPane;
flax.TiledImage = cc.SpriteBatchNode.extend({
    tileMap: null,
    tileWidthOffset: 0,
    tileHeightOffset: 0,
    assetsFile: null,
    assetID: null,
    _mapWidth: 0,
    _mapHeight: 0,
    ctor: function(a, b, c, d) {
        var e = cc.path.changeBasename(a, ".png");
        cc.SpriteBatchNode.prototype.ctor.call(this, e);
        this.tileMap = new flax.TileMap;
        this.setTileSource(a, b);
        c || (c = cc.visibleRect.width);
        d || (d = cc.visibleRect.height);
        this.setSize(c, d)
    },
    setTileSource: function(a, b) {
        if (this.assetsFile != a || this.assetID != b) {
            this.assetsFile = a;
            this.assetID = b;
            var c = flax.assetsManager.createDisplay(this.assetsFile, this.assetID).getContentSize();
            this.tileMap.init(c.width + this.tileWidthOffset, c.height + this.tileHeightOffset);
            0 < this._mapWidth * this._mapHeight && (0 < this.getChildrenCount() && this._updateTileImg(), this._updateSize())
        }
    },
    setSize: function(a, b) {
        if (a != this._mapWidth || b != this._mapHeight) this._mapWidth = a,
        this._mapHeight = b,
        this.assetsFile && this._updateSize()
    },
    _updateTileImg: function() {
        for (var a = null,
        b = this.getChildrenCount(), c = -1; ++c < b;) a = this.children[c],
        a.setSource(this.assetsFile, this.assetID),
        this.tileMap.snapToTile(a, a.tx, a.ty)
    },
    _updateSize: function() {
        var a = this.tileMap.setMapSize(this._mapWidth, this._mapHeight, !0),
        b,
        c = a[0].length;
        if (0 < c) {
            var d;
            for (b = -1; ++b < c;) d = a[0][b],
            d.destroy ? d.destroy() : d.removeFromParent()
        }
        c = a[1].length;
        if (0 < c) for (b = -1; ++b < c;) this._createTile(a[1][b][0], a[1][b][1]);
        this.setContentSize(this.tileMap.getMapSizePixel())
    },
    _createTile: function(a, b) {
        var c = flax.assetsManager.createDisplay(this.assetsFile, this.assetID, {
            parent: this
        },
        !0);
        c.setAnchorPoint(0.5, 0.5);
        this.tileMap.snapToTile(c, a, b, !0);
        return c
    }
});
EIGHT_DIRECT_VALUE = [[0, 1], [0, -1], [ - 1, 0], [1, 0], [ - 1, 1], [1, 1], [1, -1], [ - 1, -1]];
var LinkFinder = {};
window.LinkFinder = LinkFinder;
LinkFinder.map = null;
LinkFinder.blocks = null;
LinkFinder.findLink = function(a, b, c, d) {
    var e = null,
    e = a == c || b == d ? LinkFinder._checkDirectLink(a, b, c, d) : LinkFinder._checkOneLink(a, b, c, d);
    null == e && (e = LinkFinder._checkTwoLink(a, b, c, d));
    return e
};
LinkFinder.shuffle = function(a) {
    var b = this.map.getAllObjects(),
    c = b.concat(),
    d = -1;
    if (this.blocks && this.blocks.length) for (c = []; ++d < b.length;) {
        var e = b[d]; - 1 == this.blocks.indexOf(e) && c.push(e)
    }
    flax.shuffleArray(c);
    d = -1;
    for (b = c.length / 2; ++d < b;) {
        var e = c[d],
        f = c[d + b],
        g = e.getPosition(); ! 1 !== a ? (e.runAction(cc.MoveTo.create(0.2, f.getPosition())), f.runAction(cc.MoveTo.create(0.2, g))) : (e.setPosition(f.getPosition()), f.setPosition(g))
    }
};
LinkFinder.findAvailableLink = function(a) {
    var b = this.map.getAllObjects(),
    c = b.length;
    if (0 == c) return null;
    for (var d, e, f = null,
    g = [], k = null, m = 0; m < c - 1; m++) if (d = b[m], !(this.blocks && -1 < this.blocks.indexOf(d))) {
        var n = 0 == g.length;
        null == k && (k = d);
        for (var p = m + 1; p < c; p++) if (e = b[p], !(this.blocks && -1 < this.blocks.indexOf(e))) if (e.assetID == d.assetID) {
            if (LinkFinder.findLink(d.tx, d.ty, e.tx, e.ty)) return [d, e];
            n && g.push(e)
        } else n && null == f && LinkFinder.findLink(d.tx, d.ty, e.tx, e.ty) && (f = e)
    }
    if (0 == g.length) return null;
    b = g[Math.floor(g.length * Math.random())];
    c = cc.p(b.getPosition());
    if (null == f) {
        f = this._findEmptyNeighbor(k.tx, k.ty);
        if (null == f) throw "Dead map!!!!";
        c = this.map.getTiledPosition(f.x, f.y);
        b.parent && (c = b.parent.convertToNodeSpace(c)); ! 0 === a ? b.runAction(cc.MoveTo.create(0.2, c)) : b.setPosition(c)
    } else ! 0 === a ? (b.runAction(cc.MoveTo.create(0.2, f.getPosition())), f.runAction(cc.MoveTo.create(0.2, c))) : (b.setPosition(f.getPosition()), f.setPosition(c));
    return [k, b]
};
LinkFinder._findEmptyNeighbor = function(a, b) {
    for (var c = null,
    d = 0; 4 > d && (c = EIGHT_DIRECT_VALUE[d], c = cc.p(a + c[0], b + c[1]), !this.map.isEmptyTile(c.x, c.y)); d++);
    return c
};
LinkFinder._checkDirectLink = function(a, b, c, d) {
    if (a == c && b == d) return null;
    if (a == c) {
        for (var e = !0,
        f = 0 < d - b ? 1 : -1, g = b + f; g != d;) {
            if (!this.map.isEmptyTile(a, g)) {
                e = !1;
                break
            }
            g += f
        }
        if (e) return [new cc.p(a, b), new cc.p(c, d)]
    }
    if (b == d) {
        e = !0;
        f = 0 < c - a ? 1 : -1;
        for (g = a + f; g != c;) {
            if (!this.map.isEmptyTile(g, b)) {
                e = !1;
                break
            }
            g += f
        }
        if (e) return [new cc.p(a, b), new cc.p(c, d)]
    }
    return null
};
LinkFinder._checkOneLink = function(a, b, c, d) {
    if (a == c || b == d) return null;
    if (this.map.isEmptyTile(a, d)) {
        var e = LinkFinder._checkDirectLink(a, b, a, d);
        if (e && (e = LinkFinder._checkDirectLink(a, d, c, d))) return [new cc.p(a, b), new cc.p(a, d), new cc.p(c, d)]
    }
    return this.map.isEmptyTile(c, b) && (e = LinkFinder._checkDirectLink(a, b, c, b)) && (e = LinkFinder._checkDirectLink(c, b, c, d)) ? [new cc.p(a, b), new cc.p(c, b), new cc.p(c, d)] : null
};
LinkFinder._checkTwoLink = function(a, b, c, d) {
    if (a == c && b == d) return null;
    var e = 0 <= c - a ? 1 : -1,
    f = 0 <= d - b ? 1 : -1,
    g = LinkFinder._twoLinkSearch(a, b, c, d, e, f);
    null == g && (g = LinkFinder._twoLinkSearch(a, b, c, d, -e, -f));
    null != g && g.unshift(new cc.p(a, b));
    return g
};
LinkFinder._twoLinkSearch = function(a, b, c, d, e, f) {
    for (var g = null,
    k = a + e,
    m = b + f,
    n = !1,
    p = !1; ! n || !p;) {
        if (!n && (n = !this.map.isEmptyTile(k, b), !n)) {
            g = LinkFinder._checkOneLink(k, b, c, d);
            if (null != g) break;
            k += e
        }
        if (!p && (p = !this.map.isEmptyTile(a, m), !p)) {
            g = LinkFinder._checkOneLink(a, m, c, d);
            if (null != g) break;
            m += f
        }
    }
    return g
};
var HEX_NUM = "0123456789ABCDEF",
COLOR_WHITE = cc.color(255, 255, 255),
COLOR_BLACK = cc.color(0, 0, 0),
COLOR_RED = cc.color(255, 0, 0),
COLOR_GREEN = cc.color(0, 255, 0),
COLOR_BLUE = cc.color(0, 0, 255),
COLOR_GRAY = cc.color(128, 128, 128);
function hexToRgb(a) {
    var b = "#" == a.charAt(0) ? a.substring(1, 7) : a;
    a = parseInt(b.substring(0, 2), 16);
    var c = parseInt(b.substring(2, 4), 16),
    b = parseInt(b.substring(4, 6), 16);
    return [a, c, b]
}
function randomColor() {
    var a = hsvToRgb(Math.random(), 0.9725, 1);
    return rgbToHex(a[0], a[1], a[2]).toUpperCase()
}
function rgbToHex(a, b, c) {
    return _toHex(a) + _toHex(b) + _toHex(c)
}
function rgbToHsl(a, b, c) {
    a /= 255;
    b /= 255;
    c /= 255;
    var d = Math.max(a, b, c),
    e = Math.min(a, b, c),
    f,
    g = (d + e) / 2;
    if (d == e) f = e = 0;
    else {
        var k = d - e,
        e = 0.5 < g ? k / (2 - d - e) : k / (d + e);
        switch (d) {
        case a:
            f = (b - c) / k + (b < c ? 6 : 0);
            break;
        case b:
            f = (c - a) / k + 2;
            break;
        case c:
            f = (a - b) / k + 4
        }
        f /= 6
    }
    return [f, e, g]
}
function hslToRgb(a, b, c) {
    if (0 == b) c = b = a = c;
    else {
        var d = function(a, b, c) {
            0 > c && (c += 1);
            1 < c && (c -= 1);
            return c < 1 / 6 ? a + 6 * (b - a) * c: 0.5 > c ? b: c < 2 / 3 ? a + (b - a) * (2 / 3 - c) * 6 : a
        },
        e = 0.5 > c ? c * (1 + b) : c + b - c * b,
        f = 2 * c - e;
        c = d(f, e, a + 1 / 3);
        b = d(f, e, a);
        a = d(f, e, a - 1 / 3)
    }
    return [255 * c, 255 * b, 255 * a]
}
function rgbToHsv(a, b, c) {
    a /= 255;
    b /= 255;
    c /= 255;
    var d = Math.max(a, b, c),
    e = Math.min(a, b, c),
    f,
    g = d - e;
    if (d == e) f = 0;
    else {
        switch (d) {
        case a:
            f = (b - c) / g + (b < c ? 6 : 0);
            break;
        case b:
            f = (c - a) / g + 2;
            break;
        case c:
            f = (a - b) / g + 4
        }
        f /= 6
    }
    return [f, 0 == d ? 0 : g / d, d]
}
function hsvToRgb(a, b, c) {
    var d, e, f, g = Math.floor(6 * a),
    k = 6 * a - g;
    a = c * (1 - b);
    var m = c * (1 - k * b);
    b = c * (1 - (1 - k) * b);
    switch (g % 6) {
    case 0:
        d = c;
        e = b;
        f = a;
        break;
    case 1:
        d = m;
        e = c;
        f = a;
        break;
    case 2:
        d = a;
        e = c;
        f = b;
        break;
    case 3:
        d = a;
        e = m;
        f = c;
        break;
    case 4:
        d = b;
        e = a;
        f = c;
        break;
    case 5:
        d = c,
        e = a,
        f = m
    }
    return [255 * d, 255 * e, 255 * f]
}
function darkenHexColor(a, b) {
    var c = hexToRgb(a),
    c = rgbToHsl(c[0], c[1], c[2]);
    c[2] -= b;
    c = hslToRgb(c[0], c[1], c[2]);
    return rgbToHex(c[0], c[1], c[2])
}
function _toHex(a) {
    a = parseInt(a, 10);
    if (isNaN(a)) return "00";
    a = Math.max(0, Math.min(a, 255));
    return HEX_NUM.charAt((a - a % 16) / 16) + HEX_NUM.charAt(a % 16)
};
var GameConfig = {
    log: function(a) {
        "localhost" == window.location.hostname && console.log.apply(console, arguments)
    },
    info: function(a) {
        "localhost" == window.location.hostname && console.info.apply(console, arguments)
    },
    shuffle: function(a) {
        for (var b = null,
        c = null,
        d = a.length - 1; 0 <= d; d--) b = Math.floor(Math.random() * (d + 1)),
        c = a[b],
        a[b] = a[d],
        a[d] = c
    },
    getRandomNum: function(a, b) {
        for (var c = [], d = null, d = 0; d < a; ++d) c.push(d);
        for (var e = null,
        e = null,
        d = 0; d < a - b; ++d) e = c.length,
        e = Math.floor(Math.random() * e),
        c.splice(e, 1);
        return c
    },
    getTimeString: function(a) {
        var b = parseInt(a);
        a = Math.floor(b / 6E4);
        var b = b - 6E4 * a,
        c = Math.floor(b / 1E3),
        b = Math.floor((b - 1E3 * c) / 10);
        return (10 <= a ? a: "0" + a) + ":" + (10 <= c ? c: "0" + c) + ":" + (10 <= b ? b: "0" + b)
    },
    getAngle1: function(a, b, c) {
        void 0 === c && (c = !1);
        a = Math.atan2(b, a);
        0 > a && (a += 2 * Math.PI);
        c && (a *= 180 / Math.PI);
        return a
    }
};
var Preloader = cc.Scene.extend({
    onEnter: function() {
        cc.Node.prototype.onEnter.call(this);
        this.schedule(this._startLoading, 0.3)
    },
    onExit: function() {
        cc.Node.prototype.onExit.call(this);
        this._label && this._label.setString("Loaded")
    },
    initWithResources: function(a, b) {
        cc.isString(a) && (a = [a]);
        this.resources = a || [];
        this.cb = b
    },
    init: function() {
        if (!this._inited && (this._inited = !0, cc.sys.isNative)) {
            var a = cc.director.getWinSize(),
            b = cc.p(a.width / 2, a.height / 2),
            c = new cc.Sprite(MGF.instance.bgUrl),
            d = c.getContentSize().width,
            e = c.getContentSize().height;
            c.setScaleX(a.width / d);
            c.setScaleY(a.height / e);
            c.setPosition(b);
            this.addChild(c, 0);
            var f = new cc.Sprite(MGF.instance.logoUrl);
            f.setScale(cc.contentScaleFactor());
            f.setPosition(b);
            f.y = 0.75 * a.height;
            this.addChild(f);
            var g = new cc.Sprite(MGF.instance.playUrl);
            g.setScale(cc.contentScaleFactor());
            g.setPosition(b);
            g.y = 0.5 * a.height;
            this.addChild(g);
            var k = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: !0,
                onTouchBegan: function(a, b) {
                    var c = b.getCurrentTarget(),
                    d = c.convertToNodeSpace(a.getLocation()),
                    e = c.getContentSize(),
                    e = cc.rect(0, 0, e.width, e.height);
                    return cc.rectContainsPoint(e, d) ? c == g ? (cc.eventManager.removeListener(k), c = new cc.FadeTo(1, 0), d = new cc.MoveBy(1, cc.p(0, 50)), g.runAction(new cc.Sequence(new cc.Spawn(c, d), new cc.CallFunc(function() {
                        MGDelegate.dispatcherEvent(new MGEvent(MGEvent.ENTER_GAME))
                    }))), !1) : !0 : !1
                }
            }),
            a = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: !0,
                onTouchBegan: function(a, b) {
                    var c = b.getCurrentTarget(),
                    d = c.convertToNodeSpace(a.getLocation()),
                    e = c.getContentSize(),
                    e = cc.rect(0, 0, e.width, e.height);
                    return cc.rectContainsPoint(e, d) ? (c == f && App.ClickMore(), !0) : !1
                }
            });
            cc.eventManager.addListener(a, f);
            cc.eventManager.addListener(k, g)
        }
    },
    _initStage: function(a, b) {
        var c = this._texture2d = new cc.Texture2D;
        c.initWithElement(a);
        c.handleLoadedTexture();
        c = this._logo = new cc.Sprite(c);
        c.setScale(cc.contentScaleFactor());
        c.x = b.x;
        c.y = b.y;
        this._bgLayer.addChild(c, 10)
    },
    _startLoading: function() {
        var a = this;
        a.unschedule(a._startLoading);
        cc.loader.load(a.resources,
        function(a, c, d) {
            a = Math.min(d / c * 100 | 0, 100);
            var e = new MGEvent(MGEvent.LOAD_PROGRESS);
            e.data = {
                itemsLoaded: d,
                itemsTotal: c,
                percent: a
            };
            MGDelegate.dispatcherEvent(e)
        },
        function() {
            MGDelegate.dispatcherEvent(new MGEvent(MGEvent.LOAD_COMPLETE));
            a.cb && a.cb()
        })
    }
});
Preloader.preload = function(a, b) {
    this._miaPreloader || (this._miaPreloader = new Preloader, this._miaPreloader.init());
    this._miaPreloader.initWithResources(a, b);
    cc.director.runScene(this._miaPreloader);
    return this._miaPreloader
};
var SharePlatform = cc.Node.extend({
    score: 0,
    lv: 0,
    beatPer: 0,
    shareBtns: [],
    appBtns: [],
    share_gap: 8,
    app_gap: 8,
    alignType: "H",
    btn_app: null,
    btn_google: null,
    shareContainer: null,
    appContainer: null,
    appWidth: 0,
    shareWidth: 0,
    onEnter: function() {
        this._super();
        this.init()
    },
    onExit: function() {
        this._super();
        this.shareBtns = [];
        this.appBtns = []
    },
    init: function() {
        var a = "",
        b = "",
        c = 0;
        this.shareBtns = [];
        this.appBtns = [];
        this.shareContainer = new cc.Node;
        this.addChild(this.shareContainer);
        for (var d = 0; d < App.platforms.length; d++) a = App.platforms[d],
        0 > a.indexOf("weixin") && (b = "$platform_" + a, res[b] ? (c++, b = new cc.Sprite(res[b]), b.anchorX = 0, b.anchorY = 0.5, b.name = a, flax.inputManager.addListener(b, this.onClick, InputType.click, this), this.shareContainer.addChild(b), this.shareBtns.push(b)) : console.warn("Can not found platform [" + b + "] image!!"));
        this.appContainer = new cc.Node;
        this.appContainer.y = 69;
        this.addChild(this.appContainer);
        for (d = c = 0; d < App.apps.length; d++) a = App.apps[d],
        b = "$" + a,
        console.log("Download platform name:"),
        res[b] ? (c++, b = new cc.Sprite(res[b]), b.anchorX = 0, b.anchorY = 0.5, b.name = a, flax.inputManager.addListener(b, this.onClick, InputType.click, this), this.appContainer.addChild(b), this.appBtns.push(b)) : console.warn("Can not found platform [" + b + "] image!!");
        this.resetAppBtnsUI("H");
        this.resetShareBtnsUI("H")
    },
    onClick: function(a, b) {
        console.log("onClick:" + b.target.name);
        var c = b.target.name;
        "app_" == c.substr(0, 4) ? App.DownloadApp(c) : App.Share(c, this.score, this.lv, this.beatPer)
    },
    setData: function(a, b, c, d) {
        this.score = a;
        this.lv = b;
        this.beatPer = c;
        d && (this.share_gap = d);
        this.resetShareBtnsUI()
    },
    resetShareBtnsUI: function(a) {
        this.alignType = a;
        for (a = 0; a < this.shareBtns.length; a++) {
            var b = this.shareBtns[a];
            this.alignType = "H";
            b.x = (b.getContentSize().width + this.share_gap) * a;
            b.y = 0
        }
        this.shareWidth = b ? b.x + b.getContentSize().width: 0;
        this.shareContainer.x = (cc.winSize.width - this.shareWidth) / 2
    },
    resetAppBtnsUI: function(a) {
        this.alignType = a;
        for (a = this.appWidth = 0; a < this.appBtns.length; a++) {
            var b = this.appBtns[a];
            this.alignType = "H";
            b.x = (b.getContentSize().width + this.app_gap) * a;
            b.y = 0
        }
        this.appWidth = b ? b.x + b.getContentSize().width: 0;
        this.appContainer.x = (cc.winSize.width - this.appWidth) / 2
    }
});
var App = function() {
    function a() {
        a.instance && console.log("can not new App again");
        this.onAddToStageHandler()
    }
    a.VERSION = "2.2.1.6";
    a.debug = !0;
    a.frameworkInfo = null;
    a.engine = null;
    a.Doc = null;
    a.miniLogoUrl = "";
    a.instance = null;
    a.PLATFORM_FACEBOOK = "facebook";
    a.PLATFORM_TWITTER = "twitter";
    a.PLATFORM_WEIXIN = "weixin";
    a.PLATFORM_QQ = "qq";
    a.PLATFORM_WEIBO = "weibo";
    a.PLATFORM_GOOGLE_PLUS = "google_plus";
    a.gamename = "-1";
    a.nameid = "-1";
    a.sharemsgs = {};
    a.showmsgs = {};
    a.platforms = [];
    a.textures = {};
    a.FullscreenEnabled = !0;
    a.apps = [];
    a.language = "";
    a.PREGAME = "pregame";
    a.INGAME = "ingame";
    a.state = a.PREGAME;
    a.LogoAlign = "NONE";
    a.ScreenshotEnabled = !0;
    a.CreditsEnabled = !0;
    a.MoreGamesButtonEnabled = !0;
    var b = function(b) {
        a.debug && console.log("%c%s", "background:yellow;color:green;", b.type);
        MGDelegate.dispatcherEvent(b)
    };
    a.prototype.onAddToStageHandler = function() {
        MGDelegate.isApp = !1;
        MGDelegate.addEventListener(MGEvent.FRAMEWORK_INFO_RESPONSE || "FRAMEWORK_INFO_RESPONSE", this.onFrameworkInfoHandler, this);
        MGDelegate.addEventListener(MGEvent.ENTER_GAME || "ENTER_GAME", this.enterGame, this);
        var c = new MGEvent(MGEvent.FRAMEWORK_INFO_REQUEST || "FRAMEWORK_INFO_REQUEST");
        c.data = {
            AppVersion: a.VERSION
        };
        b(c);
        b(new MGEvent(MGEvent.ADDED_TO_STAGE || "ADDED_TO_STAGE"))
    };
    a.prototype.onFrameworkInfoHandler = function(b) {
        MGDelegate.removeEventListener(MGEvent.FRAMEWORK_INFO_RESPONSE || "FRAMEWORK_INFO_RESPONSE", this.onFrameworkInfoHandler, this);
        a.frameworkInfo = b.data;
        a.frameworkInfo && console.log("AppVersion: " + a.VERSION);
        a.debug = a.frameworkInfo.debug;
        if ("localhost" == window.location.hostname || "127.0.0.1" == window.location.hostname) a.debug = !0;
        a.gamename = a.frameworkInfo.gamename;
        a.nameid = a.frameworkInfo.nameid;
        a.language = a.frameworkInfo.language || "en";
        a.sharemsgs = a.frameworkInfo.sharemsgs || [];
        a.showmsgs = a.frameworkInfo.showmsgs || [];
        a.ScreenshotEnabled = a.frameworkInfo.HasScreenshot;
        a.CreditsEnabled = a.frameworkInfo.hasOwnProperty("showCredits") ? a.frameworkInfo.showCredits: !0;
        a.MoreGamesButtonEnabled = a.frameworkInfo.hasOwnProperty("showMoreGamesButton") ? a.frameworkInfo.showMoreGamesButton: !0;
        a.FullscreenEnabled = a.frameworkInfo.hasOwnProperty("fullscreenEnabled") ? a.frameworkInfo.fullscreenEnabled: !0;
        for (var d in a.sharemsgs)"app_" == d.substr(0, 4) ? a.apps.push(d) : a.platforms.push(d);
        a.platforms.sort();
        a.apps.sort();
        try {
            eval("cc"),
            a.engine = "cocos"
        } catch(e) {}
        try {
            eval("egret"),
            a.engine = "egret"
        } catch(f) {}
        if (!a.engine) throw "no such a engine exsit!";
        switch (a.engine) {
        case "cocos":
            this.CocosFrameworkInfoHandler();
            break;
        case "egret":
            this.EgretFrameworkInfoHandler()
        }
    };
    a.prototype.CocosFrameworkInfoHandler = function() {
        a.frameworkInfo.miniLogoUrl && (a.miniLogoUrl = a.frameworkInfo.miniLogoUrl, res.miniLogoUrl = a.miniLogoUrl, res_resource.push(a.miniLogoUrl));
        var b = a.platforms.length,
        d = a.apps.length,
        e = "",
        e = "";
        if (0 != b) for (var f = 0; f < b; f++) if (e = a.platforms[f], 0 > e.indexOf("weixin")) {
            var g = "res/platform/" + e + ".png",
            e = "$platform_" + e;
            res[e] = g;
            res_resource.push(g)
        }
        if (0 != d) for (f = 0; f < d; f++) e = a.apps[f],
        g = "res/app/" + e + ".png",
        e = "$" + e,
        res[e] = g,
        res_resource.push(g);
        b = ["c_button"];
        d = b.length;
        for (f = 0; f < d; f++) e = b[f],
        g = "res/credits/" + e + ".png",
        e = "$" + e,
        res[e] = g,
        res_resource.push(g)
    };
    a.prototype.PreLoadEgretTexture = function(b, d) {
        RES.getResByUrl(d,
        function(d) {
            a.textures[b] = d
        },
        a, RES.ResourceItem.TYPE_IMAGE)
    };
    a.prototype.EgretFrameworkInfoHandler = function() {
        a.frameworkInfo.miniLogoUrl && (a.miniLogoUrl = a.frameworkInfo.miniLogoUrl, -1 < a.miniLogoUrl.indexOf("office") || this.PreLoadEgretTexture("miniLogoUrl", a.miniLogoUrl))
    };
    a.prototype.enterGame = function(b) {
        a.state = a.INGAME
    };
    a.Share = function(c, d, e, f) {
        void 0 === d && (d = 0);
        void 0 === e && (e = 0);
        void 0 === f && (f = 0);
        if (a.sharemsgs[c]) {
            var g = a.sharemsgs[c],
            g = g.replace(/\{nameid\}/g, a.nameid),
            g = g.replace(/\{gamename\}/g, a.gamename),
            g = g.replace(/\{score\}/g, d + ""),
            g = g.replace(/\{level\}/g, e + ""),
            g = g.replace(/\{percent\}/g, f + "");
            d = new MGEvent(MGEvent.SHARE || "SHARE");
            d.data = {
                platform: c,
                gamename: a.gamename,
                nameid: a.nameid,
                msg: g
            };
            b(d)
        }
    };
    a.GetShowMsg = function(b, d, e, f) {
        void 0 === b && (b = a.language);
        void 0 === d && (d = 0);
        void 0 === e && (e = 0);
        void 0 === f && (f = 0);
        if (a.showmsgs[b]) return a.Share("weixin", d, e, f),
        b = a.showmsgs[b],
        b = b.replace(/\{nameid\}/g, a.nameid),
        b = b.replace(/\{gamename\}/g, a.gamename),
        b = b.replace(/\{score\}/g, d + ""),
        b = b.replace(/\{percent\}/g, f + "");
        console.warn("can not found show msg: ")
    };
    a.DownloadApp = function(a) {
        var d = new MGEvent(MGEvent.DOWNLOAD_APP || "DOWNLOAD_APP");
        d.data = {
            platform: a
        };
        b(d)
    };
    a.Start = function() {
        b(new MGEvent(MGEvent.START_GAME || "START_GAME"))
    };
    a.Pause = function() {
        b(new MGEvent(MGEvent.PAUSE_GAME || "PAUSE_GAME"))
    };
    a.ClickMore = function() {
        b(new MGEvent(MGEvent.CLICK_MORE || "CLICK_MORE"))
    };
    a.ClickLogo = function() {
        b(new MGEvent(MGEvent.CLICK_MINILOGO || "CLICK_MINILOGO"))
    };
    a.ClickCredits = function() {
        b(new MGEvent(MGEvent.CLICK_CREDITS || "CLICK_CREDITS"))
    };
    a.ShowWin = function() {
        a.Pause();
        b(new MGEvent(MGEvent.SHOW_WIN || "SHOW_WIN"))
    };
    a.ShowLose = function() {
        a.Pause();
        b(new MGEvent(MGEvent.SHOW_LOSE || "SHOW_LOSE"))
    };
    a.Screenshot = function(c, d, e, f) {
        c || (c = cc.winSize);
        d || (d = "");
        e || (e = function() {
            console.log("screenshot success.")
        });
        f || (f = function() {
            console.log("screenshot faild.")
        });
        if (MGDelegate.isApp) {
            var g = new MGEvent(MGEvent.SCREENSHOT || "SCREENSHOT");
            g.data = {
                rect: c,
                msg: d,
                success: e,
                faild: f
            };
            b(g)
        }
        var k = a.Doc.getElementById("screenshootCanvas");
        k ? (k.getContext("2d").clearRect(0, 0, k.width, k.height), k.width = c.width, k.height = c.height) : (g = a.Doc.getElementById("gameCanvas"), k = a.Doc.createElement("canvas"), k.id = "screenshootCanvas", k.style.display = "none", k.width = c.width, k.height = c.height, g.appendChild(k));
        setTimeout(function() {
            try {
                var g = a.Doc.getElementById("gameCanvas").getContext("2d").getImageData(c.x, c.y, c.width, c.height);
                k.getContext("2d").putImageData(g, 0, 0, 0, 0, c.width, c.height);
                var n = new MGEvent(MGEvent.SCREENSHOT || "SCREENSHOT");
                n.data = {
                    rect: c,
                    msg: d,
                    success: e,
                    faild: f
                };
                b(n)
            } catch(p) {
                console.error("Security Error", p.message)
            }
        },
        60)
    };
    a.ContinueGame = function() {
        BaseScene.creditNone = !1;
        b(new MGEvent(MGEvent.CONTINUE_GAME || "CONTINUE_GAME"))
    };
    a.LevelFail = function(a) {
        var d = new MGEvent(MGEvent.LEVEL_FAIL || "LEVEL_FAIL");
        d.data = {
            level: a
        };
        b(d)
    };
    a.LevelWin = function(a) {
        var d = new MGEvent(MGEvent.LEVEL_WIN || "LEVEL_WIN");
        d.data = {
            level: a
        };
        b(d)
    };
    a.ChangeScene = function(a, d) {
        var e = null;
        3 <= arguments.length && (e = arguments.slice(2));
        var f = MGEvent.CHANGE_SCENE || "CHANGE_SCENE";
      a.apply(d, e)
    };
    a.ShowAD = function() {
        var a = null;
        3 <= arguments.length && (a = arguments.slice(2));
        var d = MGEvent.REWARD_AD || "REWARD_AD";
        MGDelegate._eventMap[d] && 0 != MGDelegate._eventMap[d].length ? (d = new MGEvent(d), d.data = {
            callback: callback,
            thisObj: thisObj,
            args: a
        },
        b(d)) : callback.apply(thisObj, a)
    };
    a.ClickFullscreen = function() {
        a.FullscreenEnabled && b(new MGEvent(MGEvent.FULLSCREEN || "FULLSCREEN"))
    };
    return a
} ();
App.init = function() {
    App.instance || (App.instance = new App)
};
App.prototype.__class__ = "App";
var BaseScene = cc.Scene.extend({
    _miniLogoBmp: null,
    onEnter: function() {
        this._super()
    },
    _createMiniLogo: function() {
        this._miniLogoBmp || (this._miniLogoBmp = new cc.Sprite(res.miniLogoUrl), this._miniLogoBmp.x = this._miniLogoBmp.width / 2, this._miniLogoBmp.y = this._miniLogoBmp.height / 2, this._miniLogoBmp.zIndex = 999, this.addChild(this._miniLogoBmp), flax.inputManager.addListener(this._miniLogoBmp, this.onMiniLogo, InputType.click, this))
    },
    registerSoundEffect: function(a) {
        BaseScene.SoundEffect = a
    },
    playEffect: function(a) {
        a ? flax.playEffect(a) : BaseScene.SoundEffect && flax.playEffect(BaseScene.SoundEffect)
    },
    bindFullScreenButton: function(a) {
        console.assert(a, "can not found fullScreenButton");
        flax.addListener(a,
        function() {
            App.ClickFullscreen();
            this.playEffect()
        },
        null, this);
        a.visible = App.FullscreenEnabled
    },
    bindCreditsButton: function(a) {
        console.assert(a, "can not found creditsButton");
        flax.addListener(a,
        function() {
            App.ClickCredits();
            this.playEffect()
        },
        null, this);
        a.visible = App.CreditsEnabled
    },
    bindMoreButton: function(a) {
        console.assert(a, "can not found moreButton");
        flax.addListener(a,
        function() {
            App.ClickMore();
            this.playEffect()
        },
        null, this);
        a.visible = App.MoreGamesButtonEnabled
    },
    bindSoundButton: function(a) {
        console.assert(a, "can not found soundButton");
        this._soundButton = a;
        flax.getSoundEnabled() && a.gotoAndStop(0);
        flax.getSoundEnabled() || a.gotoAndStop(1);
        flax.addListener(a,
        function() {
            var b = flax.getSoundEnabled();
            a.gotoAndStop(b ? 1 : 0);
            flax.setSoundEnabled(!b);
            this.playEffect()
        },
        null, this)
    },
    onMiniLogo: function(a, b) {
        App.ClickLogo()
    },
    setMiniLogo: function(a) {
        a = a.toLocaleUpperCase();
        this._createMiniLogo();
        if ("NONE" == a) this._miniLogoBmp.visible = !1,
        BaseScene.miniLogoNone = !0;
        else {
            BaseScene.miniLogoAlign = a;
            BaseScene.miniLogoNone = !1;
            this._miniLogoBmp.visible = !0;
            var b = 0,
            c = 0;
            switch (a) {
            case "BL":
                b = this._miniLogoBmp.width / 2;
                c = this._miniLogoBmp.height / 2;
                break;
            case "BM":
                b = cc.winSize.width / 2;
                c = this._miniLogoBmp.height / 2;
                break;
            case "BR":
                b = cc.winSize.width - this._miniLogoBmp.width / 2;
                c = this._miniLogoBmp.height / 2;
                break;
            case "TL":
                b = this._miniLogoBmp.width / 2;
                c = cc.winSize.height - this._miniLogoBmp.height / 2;
                break;
            case "TM":
                b = cc.winSize.width / 2;
                c = cc.winSize.height - this._miniLogoBmp.height / 2;
                break;
            case "TR":
                b = cc.winSize.width - this._miniLogoBmp.width / 2;
                c = cc.winSize.height - this._miniLogoBmp.height / 2;
                break;
            case "MM":
                b = cc.winSize.width / 2;
                c = cc.winSize.height / 2;
                break;
            default:
                a = a.split(","),
                b = parseFloat(a[0]),
                c = parseFloat(a[1])
            }
            this._miniLogoBmp.x = b;
            this._miniLogoBmp.y = c
        }
    },
    getDisplayByName: function(a, b) {
        b || (b = this);
        if (b[a]) return b[a];
        for (var c = b.children,
        d = 0,
        e = c.length; d < e; d++) {
            var f = c[d];
            if (f.name == a) return f
        }
        return null
    }
});
BaseScene.miniLogoNone = !1;
BaseScene.miniLogoAlign = "NONE";
BaseScene.SoundEffect = "";
BaseScene.VERSION = "2.2.3";
var res = {
    game_plist: "res/game.plist",
    game_topObstacle_png: "res/game/topObstacle.png",
    img_mlplay_png: "res/img/mlplay.png",
    img_minilogo_png: "res/img/minilogo.png",
    game_rectObstacle_png: "res/game/rectObstacle.png",
    img_mlbg_png: "res/img/mlbg.png",
    game_png: "res/game.png",
    img_mllogo_png: "res/img/mllogo.png",
    game_Shape1_png: "res/game/Shape1.png",
    sound_bg_mp3: "res/sound/bg.mp3",
    game_bg2_png: "res/game/bg2.png",
    sound_click_mp3: "res/sound/click.mp3",
    game_middleObstacle_png: "res/game/middleObstacle.png",
    game_ShopBg_png: "res/game/ShopBg.png"
},
res_resource = [];
for (i in res) res_resource.push(res[i]);
var DataManager = cc.Class.extend({
    ctor: function() {
        this.loadData()
    },
    loadData: function() {
        var a = cc.sys.localStorage.getItem(cc.game.config.gameId + "_" + cc.game.config.version);
        a && (GameConfig.playerData = JSON.parse(a));
        this.saveData()
    },
    saveData: function() {
        var a = cc.game.config.gameId + "_" + cc.game.config.version,
        b = JSON.stringify(GameConfig.playerData);
        cc.sys.localStorage.setItem(a, b)
    },
    saveCoin: function(a) {
        GameConfig.playerData.coinNum = a;
        this.saveData()
    },
    saveDistance: function(a) {
        GameConfig.mode === GameConfig.MODE_TIME ? a > GameConfig.playerData.time_BestDistance && (GameConfig.playerData.time_BestDistance = a) : a > GameConfig.playerData.endless_BestDistance && (GameConfig.playerData.endless_BestDistance = a);
        this.saveData()
    },
    saveUnlock: function(a) {
        GameConfig.playerData.unlockNum = a;
        this.saveData()
    }
});
var Coin = flax.MovieClip.extend({
    type: null,
    onEnter: function() {
        this._super();
        this._initCoin()
    },
    _initCoin: function() {
        GameConfig.mode === GameConfig.MODE_ENDLESS && this.gotoAndStop(1)
    }
});
var Obstacle = cc.Class.extend({
    container: null,
    world: null,
    bodyArr: null,
    height: null,
    y: null,
    ctor: function(a, b) {
        this.world = a;
        this.container = b;
        this.bodyArr = [];
        this._createObstacle()
    },
    setHeight: function(a, b) {
        var c = Box2D.Common.Math.b2Vec2;
        this.y = a;
        for (var d = null,
        d = null,
        e = b ? 117.5 : 362.5, f = 0, g = this.bodyArr.length; f < g; ++f) d = this.bodyArr[f],
        d.SetPosition(new c(e / GameMain.PTM_RATIO, d.GetPosition().y + a / GameMain.PTM_RATIO)),
        d = d.GetUserData(),
        d.setScaleX(b ? -1 : 1)
    },
    moveDown: function(a) {
        var b = Box2D.Common.Math.b2Vec2;
        this.y -= a;
        for (var c = null,
        d = 0,
        e = this.bodyArr.length; d < e; ++d) c = this.bodyArr[d],
        c.SetPosition(new b(c.GetPosition().x, c.GetPosition().y - a / GameMain.PTM_RATIO))
    },
    destroy: function() {
        for (var a = null,
        b = 0,
        c = this.bodyArr.length; b < c; ++b) a = this.bodyArr[b],
        a.GetUserData().removeFromParent(),
        this.world.DestroyBody(a)
    },
    _createObstacle: function() {
        var a = Box2D.Dynamics.b2BodyDef,
        b = Box2D.Dynamics.b2Body,
        c = Box2D.Dynamics.b2FixtureDef,
        d = Box2D.Collision.Shapes.b2PolygonShape,
        e = cc.p(0, 0);
        this.height = 0;
        var f = new cc.Sprite(res.game_topObstacle_png);
        this.height += f.height;
        var g = (f.height - 50) / 2;
        f.offset_h = g;
        e.y -= f.height;
        f.setPosition(e);
        this.container.addChild(f);
        var k = new a;
        k.type = b.b2_staticBody;
        k.position.Set(f.x / GameMain.PTM_RATIO, (f.y - g) / GameMain.PTM_RATIO);
        k = this.world.CreateBody(k);
        this.bodyArr.push(k);
        k.SetUserData(f);
        var m = new d;
        m.SetAsBox(117.5 / GameMain.PTM_RATIO, 25 / GameMain.PTM_RATIO);
        var n = new c;
        n.shape = m;
        n.density = 100;
        n.friction = 0.3;
        n.filter.categoryBits = GameMain.MASK_OBSTACLE_1;
        n.filter.maskBits = GameMain.MASK_BALL;
        n.filter.groupIndex = 0;
        k.CreateFixture(n);
        e.y -= f.height / 2;
        for (var f = Math.floor(3 * Math.random()), p = null, r = 0; r < f; ++r) p = new cc.Sprite(res.game_middleObstacle_png),
        this.height += p.height,
        e.y -= p.height / 2,
        p.setPosition(e),
        this.container.addChild(p),
        k = new a,
        k.type = b.b2_staticBody,
        k.position.Set(p.x / GameMain.PTM_RATIO, p.y / GameMain.PTM_RATIO),
        k = this.world.CreateBody(k),
        this.bodyArr.push(k),
        k.SetUserData(p),
        m = new d,
        m.SetAsBox(p.width / 2 / GameMain.PTM_RATIO, p.height / 2 / GameMain.PTM_RATIO),
        n = new c,
        n.shape = m,
        n.density = 100,
        n.friction = 0.3,
        n.filter.categoryBits = GameMain.MASK_OBSTACLE_1,
        n.filter.maskBits = GameMain.MASK_BALL,
        n.filter.groupIndex = 0,
        k.CreateFixture(n),
        e.y -= p.height / 2;
        m = new cc.Sprite(res.game_topObstacle_png);
        this.height += m.height;
        m.setScaleY( - 1);
        m.offset_h = -1 * g;
        e.y -= m.height / 2;
        m.setPosition(e);
        this.container.addChild(m);
        k = new a;
        k.type = b.b2_staticBody;
        k.position.Set(m.x / GameMain.PTM_RATIO, (m.y + g) / GameMain.PTM_RATIO);
        k = this.world.CreateBody(k);
        this.bodyArr.push(k);
        k.SetUserData(m);
        m = new d;
        m.SetAsBox(117.5 / GameMain.PTM_RATIO, 25 / GameMain.PTM_RATIO);
        n = new c;
        n.shape = m;
        n.density = 100;
        n.friction = 0.3;
        n.filter.categoryBits = GameMain.MASK_OBSTACLE_1;
        n.filter.maskBits = GameMain.MASK_BALL;
        n.filter.groupIndex = 0;
        k.CreateFixture(n)
    }
});
var Gear = cc.Class.extend({
    container: null,
    world: null,
    bodyArr: null,
    height: null,
    y: null,
    ctor: function(a, b) {
        this.world = a;
        this.container = b;
        this.bodyArr = [];
        this._createGear()
    },
    setHeight: function(a) {
        var b = Box2D.Common.Math.b2Vec2;
        this.y = a;
        for (var c = null,
        d = null,
        e = 0,
        f = this.bodyArr.length; e < f; ++e) c = this.bodyArr[e],
        d = new b(cc.winSize.width / 2 / GameMain.PTM_RATIO, c.GetPosition().y + a / GameMain.PTM_RATIO),
        c.SetPosition(d),
        c.GetUserData()
    },
    moveDown: function(a) {
        var b = Box2D.Common.Math.b2Vec2;
        this.y -= a;
        for (var c = null,
        d = null,
        e = 0,
        f = this.bodyArr.length; e < f; ++e) c = this.bodyArr[e],
        d = new b(c.GetPosition().x, c.GetPosition().y - a / GameMain.PTM_RATIO),
        c.SetPosition(d)
    },
    destroy: function() {
        for (var a = null,
        b = 0,
        c = this.bodyArr.length; b < c; ++b) a = this.bodyArr[b],
        a.GetUserData().removeFromParent(),
        this.world.DestroyBody(a)
    },
    _createGear: function() {
        for (var a = Box2D.Dynamics.b2BodyDef,
        b = Box2D.Dynamics.b2Body,
        c = Box2D.Dynamics.b2FixtureDef,
        d = Box2D.Collision.Shapes.b2PolygonShape,
        e = cc.p(0, 0), f = null, g = f = null, k = null, m = Math.floor(2 * Math.random()) + 2, n = null, p = 0; p < m; ++p) n = new cc.Sprite(res.game_rectObstacle_png),
        e.y -= n.height / 2 + 50,
        n.setPosition(e),
        this.container.addChild(n),
        f = new a,
        f.type = b.b2_dynamicBody,
        f.position.Set(n.x / GameMain.PTM_RATIO, n.y / GameMain.PTM_RATIO),
        f = this.world.CreateBody(f),
        this.bodyArr.push(f),
        f.SetUserData(n),
        g = new d,
        g.SetAsBox(n.width / 2 / GameMain.PTM_RATIO, n.height / 2 / GameMain.PTM_RATIO),
        k = new c,
        k.shape = g,
        k.density = 1E4,
        k.friction = 0.2,
        k.filter.categoryBits = GameMain.MASK_OBSTACLE_2,
        k.filter.maskBits = GameMain.MASK_BALL,
        k.filter.groupIndex = 0,
        f.CreateFixture(k),
        f.SetAngularVelocity(0.5 * Math.random() + 0.3),
        e.y -= n.height / 2;
        this.height -= e.y
    }
});
var Scroll = cc.Class.extend({
    container: null,
    world: null,
    ball: null,
    coinArr: null,
    obstacleArr: null,
    obstacleCount: null,
    isFlip: null,
    topObstacle: null,
    distance: null,
    distanceMark: null,
    ctor: function(a, b) {
        this.world = a;
        this.container = b;
        Scroll.MAX_Y = b.height / 5 * 3;
        this.ball = this.container.getChildByName("ball");
        this.coinArr = [];
        this.obstacleArr = [];
        this.obstacleCount = 0;
        this.distanceMark = this.container.parent.distanceMark;
        this.distance = 0;
        this.distanceMark.y = cc.winSize.height + Scroll.MAX_Y;
        this._initObstacle()
    },
    _initObstacle: function() {
        var a = 200,
        b = null;
        this.isFlip = 0.5 < Math.random();
        for (var c = 0; 2 > c; ++c) b = new Obstacle(this.world, this.container),
        this.obstacleCount++,
        a += b.height + 50 * Math.random(),
        b.setHeight(a, this.isFlip),
        this.isFlip = !this.isFlip,
        this.obstacleArr.push(b);
        this.topObstacle = b
    },
    _createObstacle: function() {
        var a = null,
        b = null;
        0 === this.obstacleCount % Scroll.GEAR_RATIO ? (a = this.topObstacle = new Gear(this.world, this.container), b = cc.winSize.height + a.height + 50 * Math.random(), a.setHeight(b)) : (a = this.topObstacle = new Obstacle(this.world, this.container), b = cc.winSize.height + a.height + 50 * Math.random(), a.setHeight(b, this.isFlip), this.isFlip = !this.isFlip, 1 > Math.random() * (GameConfig.mode === GameConfig.MODE_TIME ? 5 : 3) && (b = flax.createDisplay(res.game_plist, "Coin", {
            parent: this.container
        }), b.setPosition(this.isFlip ? 165 : 315, a.y - a.height / 2), this.coinArr.push(b)));
        this.obstacleArr.push(a);
        this.obstacleCount++
    },
    _moveObstacle: function() {
        var a = Box2D.Common.Math.b2Vec2,
        b = this.ball.y,
        c = this.ball.body;
        if (b > Scroll.MAX_Y) {
            b = b - Scroll.MAX_Y + 2;
            c.SetPosition(new a(c.GetPosition().x, c.GetPosition().y - b / GameMain.PTM_RATIO));
            this._scrollBG(b);
            c = null;
            for (a = this.obstacleArr.length - 1; 0 <= a; a--) c = this.obstacleArr[a],
            c.moveDown(b),
            0 > c.y && (c.destroy(), this.obstacleArr.splice(a, 1));
            c = null;
            for (a = this.coinArr.length - 1; 0 <= a; a--) c = this.coinArr[a],
            c.y -= b,
            0 > c.y && (this.coinArr.splice(a, 1), c.destroy())
        }
    },
    update: function(a) {
        this._moveObstacle();
        this.topObstacle.y < cc.winSize.height && this._createObstacle();
        this._checkCollisionWithCoin()
    },
    _checkCollisionWithCoin: function() {
        for (var a = null,
        b = !1,
        c = this.coinArr.length - 1; 0 <= c; c--) if (a = this.coinArr[c], b = flax.ifCollide(a, this.ball)) GameConfig.mode === GameConfig.MODE_ENDLESS ? GameMain.instance.addTime() : GameConfig.mode === GameConfig.MODE_TIME && GameMain.instance.addCoin(),
        this.coinArr.splice(c, 1),
        a.destroy()
    },
    _scrollBG: function(a) {
        this.distance += a / 800 * 50;
        GameMain.instance.refreshDistance(this.distance);
        this.distanceMark.y < this.ball.y && this.distanceMark.setColor(cc.color("#12C417"));
        this.distanceMark.y -= a;
        this.distanceMark.y < this.distanceMark.height / 2 * -1 && (this.distanceMark.y += cc.winSize.height, this.distanceMark.distance.text = 50 * Math.ceil(this.distance / 50) + " m", this.distanceMark.setColor(cc.color("#ffffff")))
    }
});
var GameIndex = BaseScene.extend({
    gameMain: null,
    onEnter: function() {
        this._super();
        this.gameMain = flax.createDisplay(res.game_plist, "gameIndex", {
            parent: this,
            y: cc.winSize.height
        });
        this.setMiniLogo("TL")
    },
    onEnterTransitionDidFinish: function() {
        this.bindSoundButton(this.gameMain.btn_music);
        this.bindFullScreenButton(this.gameMain.btn_fs);
        this.bindMoreButton(this.gameMain.btn_more);
        this.bindCreditsButton(this.gameMain.btn_credits);
        flax.addListener(this.gameMain.btn_play, this._onClickStart, null, this);
        flax.addListener(this.gameMain.btn_store, this._onClickStore, null, this);
        flax.addListener(this.gameMain.btn_endless, this._onClickModeButton, null, this);
        flax.addListener(this.gameMain.btn_time, this._onClickModeButton, null, this);
        this._onChooseMode(GameConfig.mode)
    },
    _onClickModeButton: function(a, b) {
        this.playEffect();
        this._onChooseMode(b.currentTarget.name.substring(4))
    },
    _onChooseMode: function(a) {
        a === GameConfig.MODE_TIME ? (GameConfig.mode = GameConfig.MODE_TIME, this.gameMain.btn_endless.gotoAndStop(0), this.gameMain.btn_time.gotoAndStop(1)) : a === GameConfig.MODE_ENDLESS && (GameConfig.mode = GameConfig.MODE_ENDLESS, this.gameMain.btn_time.gotoAndStop(0), this.gameMain.btn_endless.gotoAndStop(1))
    },
    _onClickStore: function(a, b) {
        this.playEffect();
        flax.removeListener(b.currentTarget);
        App.ChangeScene(function() {
            flax.replaceScene("GameStore")
        },
        this)
    },
    _onClickStart: function(a, b) {
        this.playEffect();
        flax.removeListener(b.currentTarget);
        App.Start();
        App.ChangeScene(function() {
            flax.replaceScene("GameMain")
        },
        this)
    }
});
var GameMain = BaseScene.extend({
    gameMain: null,
    space: null,
    ball: null,
    _startPosition: null,
    _startTime: null,
    _pointCount: null,
    restTime: null,
    timeCount: null,
    scroller: null,
    start: null,
    coinNum: null,
    onEnter: function() {
        this._super();
        GameMain.instance = this;
        this.gameMain = flax.createDisplay(res.game_plist, "gameMain", {
            parent: this,
            y: cc.winSize.height
        });
        this.setMiniLogo("TM");
        this.registerSoundEffect(res.sound_click_mp3);
        this._initPhysics()
    },
    onEnterTransitionDidFinish: function() {
        this.bindFullScreenButton(this.gameMain.btn_fs);
        this.bindMoreButton(this.gameMain.btn_more);
        this.gameMain.btn_home.visible = !1;
        this.gameMain.btn_replay.visible = !1;
        this.gameMain.btnRefresh.visible = !1;
        flax.inputManager.addListener(this.gameMain.btnRefresh, this._onClickRefresh, InputType.click, this);
        this._initGame()
    },
    _initGame: function() {
        this.restTime = GameMain.TOTAL_TIME;
        this.timeCount = 0;
        this._refreshTime();
        this.refreshDistance(0);
        this.gameMain.best.setColor(cc.color("#12C417"));
        this.gameMain.best.text = (GameConfig.mode === GameConfig.MODE_TIME ? GameConfig.playerData.time_BestDistance: GameConfig.playerData.endless_BestDistance) + " m";
        this._initTouchListener();
        this.scroller = new Scroll(this.world, this.gameMain.container);
        this._showGuide();
        GameConfig.mode === GameConfig.MODE_ENDLESS ? (this.gameMain.coinTxt.visible = !1, this.gameMain.coinPanel.visible = !1) : (this.coinNum = GameConfig.playerData.coinNum, this.gameMain.coinTxt.text = this.coinNum)
    },
    _initTouchListener: function() {
        var a = this,
        b = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: !0,
            onTouchBegan: function(b, d) {
                a._handleTouchBegan(b.getLocation());
                return ! 0
            },
            onTouchMoved: function(b, d) {
                a._handleTouchMoved(b.getLocation())
            },
            onTouchEnded: function(b, d) {
                a._handleTouchEnded()
            }
        });
        cc.eventManager.addListener(b, this.gameMain.bg)
    },
    _handleTouchBegan: function(a) {
        this._pointCount = GameMain.POINT_NUM;
        this._startPosition = a;
        this._startTime = (new Date).getTime(); ! 1 === this.start && (this.start = !0, this.gameMain.hand.stopAllActions(), this.gameMain.hand.runAction(cc.fadeOut(0.5)), this.scheduleUpdate(), this.gameMain.btnRefresh.visible = !0)
    },
    _isMoving: !1,
    _handleTouchMoved: function(a) {
        var b = cc.pDistance(this._startPosition, a);
        if (b > 1.5 * this.ball.width && !this._isMoving) {
            this._isMoving = !0;
            var c = Box2D.Common.Math.b2Vec2,
            d = this.ball.body,
            e = cc.pSub(a, this._startPosition);
            a = GameMain.IMPULSE_MAX;
            b = b / this.ball.width / 0.9;
            e = Math.atan2(e.y, e.x);
            b = new c(a * b * Math.cos(e), a * b * Math.sin(e));
            e = Math.sqrt(Math.pow(b.x, 2) + Math.pow(b.y, 2));
            e > a && (b = new c(b.x * a / e, b.y * a / e));
            d.ApplyImpulse(b, new c(0, 0))
        }
    },
    _handleTouchEnded: function() {
        this._isMoving = !1
    },
    _showGuide: function() {
        this.update(1 / 60);
        this.start = !1;
        var a = this.gameMain.hand,
        b = this.scroller.isFlip ? -50 : 50;
        a.runAction(cc.repeatForever(cc.sequence(cc.moveBy(0.5, b, 150), cc.delayTime(0.2), cc.callFunc(function() {
            a.x -= b;
            a.y -= 150
        }), cc.delayTime(0.1))))
    },
    _reduceTime: function(a) {
        this.timeCount++;
        60 === this.timeCount && (this.timeCount = 0, this.restTime--, 0 >= this.restTime && (this.restTime = 0, this._gameOver(), this.unscheduleUpdate()), this._refreshTime())
    },
    _gameOver: function() {
        this.ball.runAction(cc.fadeOut(0.5));
        var a = this.gameMain.btn_home,
        b = this.gameMain.btn_replay;
        a.visible = !0;
        b.visible = !0;
        var c = this;
        flax.addListener(a,
        function() {
            c.playEffect(res.sound_click_mp3);
            App.ChangeScene(function() {
                flax.replaceScene("GameIndex")
            })
        });
        flax.addListener(b,
        function() {
            c.playEffect(res.sound_click_mp3);
            App.ChangeScene(function() {
                flax.refreshScene()
            })
        })
    },
    addCoin: function() {
        this.coinNum++;
        9999 <= this.coinNum && (this.coinNum = 9999);
        this.gameMain.coinTxt.text = this.coinNum;
        GameConfig.dataManager.saveCoin(this.coinNum)
    },
    addTime: function() {
        this.restTime += 2;
        this.restTime > GameMain.TOTAL_TIME && (this.restTime = GameMain.TOTAL_TIME);
        this._refreshTime()
    },
    _refreshTime: function() {
        var a = this.gameMain.timeMc;
        a.time1.gotoAndStop(Math.floor(this.restTime / 10));
        a.time2.gotoAndStop(this.restTime % 10);
        var b = a.time1.children[0],
        c = a.time2.children[0],
        d = 5 < this.restTime ? 1 : 2;
        b.gotoAndStop(d);
        c.gotoAndStop(d);
        a.timeOutID && clearTimeout(a.timeOutID);
        a.timeOutID = setTimeout(function() {
            d = 0;
            b.gotoAndStop(d);
            c.gotoAndStop(d)
        },
        100)
    },
    refreshDistance: function(a) {
        a = Math.floor(a);
        this.gameMain.distance.text = a + " m";
        GameConfig.mode === GameConfig.MODE_TIME ? a > GameConfig.playerData.time_BestDistance && (GameConfig.dataManager.saveDistance(a), this.gameMain.best.text = GameConfig.playerData.time_BestDistance + " m") : a > GameConfig.playerData.endless_BestDistance && (GameConfig.dataManager.saveDistance(a), this.gameMain.best.text = GameConfig.playerData.endless_BestDistance + " m")
    },
    _refreshPhysics: function() {
        this.world.Step(1 / 60, 8, 1);
        for (var a = this.world.GetBodyList(); a; a = a.GetNext()) if (null !== a.GetUserData()) {
            var b = a.GetUserData();
            b.x = a.GetPosition().x * GameMain.PTM_RATIO;
            b.y = "number" === typeof b.offset_h ? a.GetPosition().y * GameMain.PTM_RATIO + b.offset_h: a.GetPosition().y * GameMain.PTM_RATIO;
            b.rotation = -1 * cc.radiansToDegrees(a.GetAngle())
        }
    },
    _onClickRefresh: function() {
        this.playEffect(res.sound_click_mp3);
        App.ChangeScene(function() {
            flax.refreshScene()
        })
    },
    update: function(a) {
        this._reduceTime();
        this._refreshPhysics();
        this.scroller.update(a)
    },
    _initPhysics: function() {
        var a = Box2D.Common.Math.b2Vec2,
        b = Box2D.Dynamics.b2BodyDef,
        c = Box2D.Dynamics.b2Body,
        d = Box2D.Dynamics.b2FixtureDef,
        e = Box2D.Dynamics.b2World,
        f = Box2D.Collision.Shapes.b2PolygonShape,
        g = Box2D.Collision.Shapes.b2CircleShape,
        k = cc.director.getWinSize(),
        a = new a(0, 0);
        this.world = new e(a, !0);
        this.world.SetContinuousPhysics();
        var a = this.gameMain.container.border1,
        m = this.gameMain.container.border2,
        e = new b;
        e.type = c.b2_staticBody;
        var n = new d;
        n.density = 1;
        n.friction = 0.5;
        n.restitution = 0.1;
        n.filter.categoryBits = GameMain.MASK_BORDER;
        n.filter.maskBits = GameMain.MASK_BALL;
        n.filter.groupIndex = 0;
        n.shape = new f;
        n.shape.SetAsBox(a.width / GameMain.PTM_RATIO / 2, a.height / GameMain.PTM_RATIO / 2);
        e.position.Set(a.width / GameMain.PTM_RATIO / 2, a.height / GameMain.PTM_RATIO / 2);
        this.world.CreateBody(e).CreateFixture(n);
        e = new b;
        e.type = c.b2_staticBody;
        n = new d;
        n.density = 1;
        n.friction = 0.5;
        n.restitution = 0.1;
        n.filter.categoryBits = GameMain.MASK_BORDER;
        n.filter.maskBits = GameMain.MASK_BALL;
        n.filter.groupIndex = 0;
        n.shape = new f;
        n.shape.SetAsBox(k.width / 2 / GameMain.PTM_RATIO, 15 / GameMain.PTM_RATIO);
        e.position.Set(k.width / 2 / GameMain.PTM_RATIO, -15 / GameMain.PTM_RATIO);
        this.world.CreateBody(e).CreateFixture(n);
        e = new b;
        e.type = c.b2_staticBody;
        n = new d;
        n.density = 1;
        n.friction = 0.5;
        n.restitution = 0.1;
        n.filter.categoryBits = GameMain.MASK_BORDER;
        n.filter.maskBits = GameMain.MASK_BALL;
        n.filter.groupIndex = 0;
        n.shape = new f;
        n.shape.SetAsBox(m.width / 2 / GameMain.PTM_RATIO, m.height / 2 / GameMain.PTM_RATIO);
        e.position.Set((m.x - m.width / 2) / GameMain.PTM_RATIO, m.height / 2 / GameMain.PTM_RATIO);
        this.world.CreateBody(e).CreateFixture(n);
        f = this.ball = this.gameMain.container.ball;
        f.gotoAndStop(GameConfig.ballIndex);
        f.setName("ball");
        e = new b;
        e.type = c.b2_dynamicBody;
        e.position.Set(f.x / GameMain.PTM_RATIO, f.y / GameMain.PTM_RATIO);
        b = f.body = this.world.CreateBody(e);
        b.SetUserData(f);
        g = new g;
        g.SetRadius(f.width / 2 / GameMain.PTM_RATIO);
        d = new d;
        d.shape = g;
        d.density = 2;
        d.friction = 0.35;
        d.restitution = 0.2;
        b.CreateFixture(d)
    }
});
GameMain.instance = null;
var GameStore = BaseScene.extend({
    gameMain: null,
    coinNum: null,
    distance: null,
    onEnter: function() {
        this._super();
        this.gameMain = flax.createDisplay(res.game_plist, "gameStore", {
            parent: this,
            y: cc.winSize.height
        });
        this.setMiniLogo("TL");
        this.registerSoundEffect(res.sound_click_mp3)
    },
    onEnterTransitionDidFinish: function() {
        this.bindFullScreenButton(this.gameMain.btn_fs);
        this.bindMoreButton(this.gameMain.btn_more);
        flax.addListener(this.gameMain.btn_back, this._onClickBack, null, this);
        this._initGame();
        this._chooseBall(GameConfig.ballIndex)
    },
    _initGame: function() {
        this.coinNum = GameConfig.playerData.coinNum;
        this.distance = Math.max(GameConfig.playerData.time_BestDistance, GameConfig.playerData.endless_BestDistance);
        this.gameMain.coinTxt.text = this.coinNum;
        var a = 0,
        b = !1,
        c = this.gameMain.ball0;
        c.gotoAndStop(GameStore.state.UNCHOOSE);
        0 !== GameConfig.ballIndex && flax.addListener(c.btn_play, this._onClickChooseBtn, null, this);
        for (a = 1; 6 > a; ++a) c = this.gameMain["ball" + a],
        (b = this._checkUnlock(a)) ? (c.gotoAndStop(GameStore.state.UNCHOOSE), flax.addListener(c.btn_play, this._onClickChooseBtn, null, this)) : (b = this._checkCanUnlock(a)) ? (c.gotoAndStop(GameStore.state.UNLOCK), flax.addListener(c.unlock, this._onClickUnlock, null, this)) : c.gotoAndStop(GameStore.state.LOCK)
    },
    _checkUnlock: function(a) {
        return 0 !== (GameConfig.playerData.unlockNum & 1 << a)
    },
    _checkCanUnlock: function(a) {
        var b = !1;
        return b = 3 > a ? this.distance >= GameStore.distance["BALL" + a] : this.coinNum >= GameStore.price["BALL" + a]
    },
    _onClickUnlock: function(a, b) {
        this.playEffect();
        var c = b.currentTarget;
        flax.removeListener(c);
        c = parseInt(c.parent.name.match(/\d/)[0]);
        this._unLockBall(c)
    },
    _unLockBall: function(a) {
        var b = this.gameMain["ball" + a];
        b.gotoAndStop(GameStore.state.UNCHOOSE);
        GameConfig.dataManager.saveUnlock(GameConfig.playerData.unlockNum | 1 << a);
        flax.addListener(b.btn_play || b.getChildByName("btn_play"), this._onClickChooseBtn, null, this);
        3 <= a && this._buyBall(a)
    },
    _buyBall: function(a) {
        this.coinNum -= GameStore.price["BALL" + a];
        this.gameMain.coinTxt.text = this.coinNum;
        GameConfig.dataManager.saveCoin(this.coinNum)
    },
    _onClickChooseBtn: function(a, b) {
        this.playEffect();
        var c = b.currentTarget;
        flax.removeListener(c);
        c = parseInt(c.parent.name.match(/\d/)[0]);
        this._chooseBall(c)
    },
    _chooseBall: function(a) {
        var b = this.gameMain["ball" + GameConfig.ballIndex];
        b.gotoAndStop(GameStore.state.UNCHOOSE);
        flax.addListener(b.btn_play, this._onClickChooseBtn, null, this);
        b = this.gameMain["ball" + a];
        flax.removeListener(b.btn_play, this._onClickChooseBtn, InputType.click);
        b.gotoAndStop(GameStore.state.CHOOSE);
        GameConfig.ballIndex = a
    },
    _onClickBack: function(a, b) {
        this.playEffect();
        flax.removeListener(b.currentTarget);
        App.ChangeScene(function() {
            flax.replaceScene("GameIndex")
        },
        this)
    }
});
GameConfig.MODE_TIME = "time";
GameConfig.MODE_ENDLESS = "endless";
GameConfig.ballIndex = 0;
GameConfig.mode = GameConfig.MODE_TIME;
GameConfig.playerData = {
    time_BestDistance: 0,
    endless_BestDistance: 0,
    coinNum: 0,
    unlockNum: 0
};
GameMain.POINT_NUM = 3;
GameMain.TOTAL_TIME = 22;
GameMain.RATIO = 30;
GameMain.IMPULSE_MAX = 60;
GameMain.DEBUG_NODE_SHOW = !0;
GameMain.MASK_BALL = 1;
GameMain.MASK_BORDER = 2;
GameMain.MASK_OBSTACLE_1 = 4;
GameMain.MASK_OBSTACLE_2 = 8;
GameMain.PTM_RATIO = 32;
Gear.TYPE_ROTATE = 1;
Gear.TYPE_MOVE = 2;
GameStore.state = {
    LOCK: 0,
    UNLOCK: 1,
    UNCHOOSE: 2,
    CHOOSE: 3
};
GameStore.distance = {
    BALL1: 600,
    BALL2: 1E3
};
GameStore.price = {
    BALL3: 100,
    BALL4: 150,
    BALL5: 300
};
Scroll.MAX_Y = null;
Scroll.GEAR_RATIO = 6;
cc.game.onStart = function() {
    cc.view.enableAutoFullScreen(!1);
    App.init();
    cc.view.enableRetina(!0);
    flax.init(cc.ResolutionPolicy.SHOW_ALL);
    flax.registerScene("GameIndex", GameIndex);
    flax.registerScene("GameMain", GameMain);
    flax.registerScene("GameStore", GameStore);
    MGDelegate.addEventListener(MGEvent.ENTER_GAME || "ENTER_GAME",
    function() {
        MGDelegate.removeEventListener(MGEvent.ENTER_GAME || "ENTER_GAME", arguments.callee, this);
        window.location.hostname.match(/localhost/) || flax.playMusic(res.sound_bg_mp3, !0);
        GameConfig.dataManager = new DataManager;
        flax.replaceScene("GameIndex")
    },
    this);
    Preloader.preload(res_resource,
    function() {},
    this)
};
MGDelegate.addEventListener(MGEvent.GAME_STARTUP || "GAME_STARTUP",
function() {
    MGDelegate.removeEventListener(MGEvent.STARTUP || "GAME_STARTUP", arguments.callee, this);
    cc.game.run()
},
this);