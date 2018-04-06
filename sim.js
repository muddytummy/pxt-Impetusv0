"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var rt;
(function (rt) {
    var ObjectDisposable = (function () {
        function ObjectDisposable() {
            this._isDisposed = false;
        }
        ObjectDisposable.prototype.dispose = function () {
            if (!this._isDisposed) {
                this._onDispose();
                this._isDisposed = true;
            }
        };
        return ObjectDisposable;
    }());
    rt.ObjectDisposable = ObjectDisposable;
    var ObjectWithId = (function (_super) {
        __extends(ObjectWithId, _super);
        function ObjectWithId(id) {
            var _this = _super.call(this) || this;
            _this._id = id || '';
            return _this;
        }
        Object.defineProperty(ObjectWithId.prototype, "id", {
            get: function () { return this._id; },
            enumerable: true,
            configurable: true
        });
        return ObjectWithId;
    }(ObjectDisposable));
    rt.ObjectWithId = ObjectWithId;
    var ObjectWithIdDictionary = (function () {
        function ObjectWithIdDictionary() {
            this._objs = new Map();
        }
        ObjectWithIdDictionary.prototype.set = function (obj) {
            return this._objs.set(obj.id, obj);
        };
        ObjectWithIdDictionary.prototype.retrieve = function (id) {
            return this._objs.get(id) || null;
        };
        ObjectWithIdDictionary.prototype.delete = function (obj) {
            return this._objs.delete(obj.id);
        };
        return ObjectWithIdDictionary;
    }());
    rt.ObjectWithIdDictionary = ObjectWithIdDictionary;
    var WrappedObjectWithId = (function (_super) {
        __extends(WrappedObjectWithId, _super);
        function WrappedObjectWithId(reference, id) {
            var _this = _super.call(this, id) || this;
            _this._reference = reference;
            return _this;
        }
        Object.defineProperty(WrappedObjectWithId.prototype, "reference", {
            get: function () { return this._reference; },
            enumerable: true,
            configurable: true
        });
        return WrappedObjectWithId;
    }(ObjectWithId));
    rt.WrappedObjectWithId = WrappedObjectWithId;
    var ObjectWithIdFactory = (function () {
        function ObjectWithIdFactory(ctor) {
            this._objectcache = new Map();
            this._ctor = ctor;
            ObjectWithIdFactory._factories.push(this);
        }
        ObjectWithIdFactory.forgetAllInstances = function () {
            ObjectWithIdFactory._factories.forEach(function (factory) { return factory.forgetAllInstances(); });
        };
        ObjectWithIdFactory.prototype.getInstance = function (parameters, id) {
            var hash = objectHash([parameters, id], { algorithm: 'md5', encoding: 'hex', respectType: false });
            var instance = this._objectcache.get(hash);
            if (!instance) {
                this._objectcache.set(hash, instance = new (this._ctor)(parameters, id));
            }
            return instance;
        };
        ObjectWithIdFactory.prototype.forgetAllInstances = function () {
            this._objectcache.clear();
        };
        ObjectWithIdFactory._factories = new Array();
        return ObjectWithIdFactory;
    }());
    rt.ObjectWithIdFactory = ObjectWithIdFactory;
})(rt || (rt = {}));
var pxsim;
(function (pxsim) {
    var Object3d = (function (_super) {
        __extends(Object3d, _super);
        function Object3d(reference, id) {
            var _this = _super.call(this, reference, id) || this;
            _this._rigidbody = null;
            _this.reference.name = _this.id;
            _this.reference.userData = __assign({}, _this.reference.userData, { outer: _this });
            if (undefined !== _this.reference.castShadow) {
                _this.reference.castShadow = true;
            }
            if (undefined !== _this.reference.receiveShadow) {
                _this.reference.receiveShadow = true;
            }
            return _this;
        }
        Object3d.prototype.lookAt = function (position) {
            if (!position) {
                return;
            }
            this.reference.lookAt(position);
        };
        Object3d.prototype.setPosition = function (position) {
            if (!position) {
                return;
            }
            this.reference.position.set(position.x, position.y, position.z);
        };
        Object3d.prototype.setRotation = function (rotation) {
            if (!rotation) {
                return;
            }
            this.reference.rotation.set(THREE.Math.degToRad(rotation.x), THREE.Math.degToRad(rotation.y), THREE.Math.degToRad(rotation.z));
        };
        Object3d.prototype.setScale = function (scale) {
            this.reference.scale.set(scale.x, scale.y, scale.z);
        };
        Object3d.prototype.setRotationFromAxisAngle = function (axis, angle) {
            if (!axis) {
                return;
            }
            this.reference.setRotationFromAxisAngle(axis, THREE.Math.degToRad(angle));
        };
        Object3d.prototype.setPhysicsEnabled = function (enable) {
            if (this._rigidbody) {
                this._rigidbody.isKinematic = !enable;
            }
        };
        Object3d.prototype.animate = function (timeStep) {
            this.reference.children.forEach(function (reference) {
                var outer = outerObject(reference);
                if (outer) {
                    outer.animate(timeStep);
                }
            });
            if (this._rigidbody) {
                this._rigidbody.syncMotionStateToObject3d();
            }
        };
        Object3d.prototype.onAdded = function (scene3d) {
            if (this._rigidbody) {
                this._rigidbody.addRigidBody(scene3d.physicsWorld);
            }
        };
        Object3d.prototype.onRemoved = function (scene3d) {
            if (this._rigidbody) {
                this._rigidbody.removeRigidBody(scene3d.physicsWorld);
            }
        };
        Object3d.prototype._constructRigidBody = function () {
            return null;
        };
        Object3d.prototype._onDispose = function () {
            this.reference.children.forEach(function (reference) {
                var outer = outerObject(reference);
                if (outer) {
                    outer.dispose();
                }
            });
            if (this._rigidbody) {
                this._rigidbody.dispose();
            }
            this.reference.userData = __assign({}, this.reference.userData, { outer: null });
        };
        return Object3d;
    }(rt.WrappedObjectWithId));
    pxsim.Object3d = Object3d;
    var GenericObject3d = (function (_super) {
        __extends(GenericObject3d, _super);
        function GenericObject3d() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return GenericObject3d;
    }(Object3d));
    pxsim.GenericObject3d = GenericObject3d;
    function outerObject(reference) {
        return reference.userData.outer || null;
    }
    pxsim.outerObject = outerObject;
})(pxsim || (pxsim = {}));
var pxsim;
(function (pxsim) {
    var Camera = (function (_super) {
        __extends(Camera, _super);
        function Camera() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Camera.prototype.setSize = function (width, height) {
        };
        return Camera;
    }(pxsim.Object3d));
    pxsim.Camera = Camera;
    var PerspectiveCamera = (function (_super) {
        __extends(PerspectiveCamera, _super);
        function PerspectiveCamera(fov, near, far, id) {
            var _this = this;
            fov = fov || 60;
            near = near || .2;
            far = far || 2000;
            _this = _super.call(this, new THREE.PerspectiveCamera(fov, 1, near, far), id) || this;
            return _this;
        }
        PerspectiveCamera.prototype.setSize = function (width, height) {
            _super.prototype.setSize.call(this, width, height);
            this.reference.aspect = width / height;
            this.reference.updateProjectionMatrix();
        };
        return PerspectiveCamera;
    }(Camera));
    pxsim.PerspectiveCamera = PerspectiveCamera;
})(pxsim || (pxsim = {}));
(function (pxsim) {
    var camera;
    (function (camera) {
        function perspective() {
            return new pxsim.PerspectiveCamera();
        }
        camera.perspective = perspective;
    })(camera = pxsim.camera || (pxsim.camera = {}));
})(pxsim || (pxsim = {}));
var pxsim;
(function (pxsim) {
    var Color = (function (_super) {
        __extends(Color, _super);
        function Color() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Color;
    }(THREE.Color));
    pxsim.Color = Color;
})(pxsim || (pxsim = {}));
(function (pxsim) {
    var color;
    (function (color_1) {
        function standardColor(rgb) {
            return new pxsim.Color(rgb);
        }
        color_1.standardColor = standardColor;
        function randomColor() {
            return new pxsim.Color(Math.random() * (1 << 24));
        }
        color_1.randomColor = randomColor;
        function colorFromRgb(red, green, blue) {
            return new pxsim.Color(red / 255, green / 255, blue / 255);
        }
        color_1.colorFromRgb = colorFromRgb;
        function colorFromHsv(hue, sat, val) {
            return new pxsim.Color().setHSL(hue / 255, sat / 255, val / 255);
        }
        color_1.colorFromHsv = colorFromHsv;
        function colorWheel(color) {
            return new pxsim.Color(color);
        }
        color_1.colorWheel = colorWheel;
        function colorPicker(color) {
            return new pxsim.Color(color);
        }
        color_1.colorPicker = colorPicker;
    })(color = pxsim.color || (pxsim.color = {}));
})(pxsim || (pxsim = {}));
var serial;
(function (serial) {
    function writeString(text) {
        console.log(text);
        pxsim.runtime.board.writeSerial(text);
    }
    function writeLine(text) {
        writeString(text + "\r\n");
    }
    serial.writeLine = writeLine;
    function writeValue(name, value) {
        writeLine("" + (name ? name + ':' : '') + value);
    }
    serial.writeValue = writeValue;
})(serial || (serial = {}));
var pxsim;
(function (pxsim) {
    var console;
    (function (console) {
        function log(text) {
            serial.writeLine(text);
        }
        console.log = log;
        function logValue(name, value) {
            serial.writeValue(name, value);
        }
        console.logValue = logValue;
    })(console = pxsim.console || (pxsim.console = {}));
})(pxsim || (pxsim = {}));
var pxsim;
(function (pxsim) {
    var input;
    (function (input) {
        function onMouseMove(handler) {
            pxsim.singletonWorldBoard().events.listen(2, 1, handler);
        }
        input.onMouseMove = onMouseMove;
        function onMouseClick(button, handler) {
            var sid;
            switch (button) {
                case 1:
                    sid = 3;
                    break;
                case 2:
                    sid = 4;
                    break;
                case 3:
                    sid = 5;
                    break;
                default:
                    return;
            }
            pxsim.singletonWorldBoard().events.listen(sid, 2, handler);
        }
        input.onMouseClick = onMouseClick;
    })(input = pxsim.input || (pxsim.input = {}));
})(pxsim || (pxsim = {}));
var pxsim;
(function (pxsim) {
    var Light = (function (_super) {
        __extends(Light, _super);
        function Light() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Light.prototype._configureShadow = function () {
            this.reference.shadow.camera.left = -Light.distFrustum;
            this.reference.shadow.camera.right = Light.distFrustum;
            this.reference.shadow.camera.top = Light.distFrustum;
            this.reference.shadow.camera.bottom = -Light.distFrustum;
            this.reference.shadow.bias = 0.0001;
            this.reference.shadow.mapSize.width = 2048;
            this.reference.shadow.mapSize.height = 2048;
        };
        Light.distFrustum = 100;
        return Light;
    }(pxsim.Object3d));
    pxsim.Light = Light;
    var AmbientLight = (function (_super) {
        __extends(AmbientLight, _super);
        function AmbientLight(color, intensity, id) {
            return _super.call(this, new THREE.AmbientLight(color || 4210752, intensity || 1), id) || this;
        }
        return AmbientLight;
    }(Light));
    pxsim.AmbientLight = AmbientLight;
    var DirectionalLight = (function (_super) {
        __extends(DirectionalLight, _super);
        function DirectionalLight(color, intensity, id) {
            var _this = _super.call(this, new THREE.DirectionalLight(color || 16777215, intensity || 1), id) || this;
            _this._configureShadow();
            return _this;
        }
        return DirectionalLight;
    }(Light));
    pxsim.DirectionalLight = DirectionalLight;
    var HemisphereLight = (function (_super) {
        __extends(HemisphereLight, _super);
        function HemisphereLight(colorSky, colorGround, intensity, id) {
            return _super.call(this, new THREE.HemisphereLight(colorSky || 3310847, 16763007, intensity || 0.6), id) || this;
        }
        return HemisphereLight;
    }(Light));
    pxsim.HemisphereLight = HemisphereLight;
    var PointLight = (function (_super) {
        __extends(PointLight, _super);
        function PointLight(color, intensity, distance, decay, id) {
            var _this = _super.call(this, new THREE.PointLight(color || 16777215, intensity || 1, distance || 0, decay || 2), id) || this;
            _this._configureShadow();
            return _this;
        }
        return PointLight;
    }(Light));
    pxsim.PointLight = PointLight;
    var SpotLight = (function (_super) {
        __extends(SpotLight, _super);
        function SpotLight(color, intensity, distance, angle, penumbra, decay, id) {
            var _this = _super.call(this, new THREE.SpotLight(color || 16777215, intensity || 1, distance || 0, angle || Math.PI / 3, penumbra || 0, decay || 2), id) || this;
            _this._configureShadow();
            return _this;
        }
        return SpotLight;
    }(Light));
    pxsim.SpotLight = SpotLight;
})(pxsim || (pxsim = {}));
(function (pxsim) {
    var light;
    (function (light) {
        function ambientLight(color, intensity) {
            return new pxsim.DirectionalLight(color, intensity);
        }
        light.ambientLight = ambientLight;
        function directionalLight(color, intensity) {
            return new pxsim.DirectionalLight(color, intensity);
        }
        light.directionalLight = directionalLight;
        function hemisphereLight(colorSky, colorGround, intensity) {
            return new pxsim.HemisphereLight(colorSky, colorGround, intensity);
        }
        light.hemisphereLight = hemisphereLight;
    })(light = pxsim.light || (pxsim.light = {}));
})(pxsim || (pxsim = {}));
var pxsim;
(function (pxsim) {
    var loops;
    (function (loops) {
        function forever(body) {
            pxsim.thread.forever(body);
        }
        loops.forever = forever;
        function pauseAsync(ms) {
            return Promise.delay(ms);
        }
        loops.pauseAsync = pauseAsync;
    })(loops = pxsim.loops || (pxsim.loops = {}));
})(pxsim || (pxsim = {}));
var pxsim;
(function (pxsim) {
    var Material = (function (_super) {
        __extends(Material, _super);
        function Material() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._density = 1;
            return _this;
        }
        Object.defineProperty(Material.prototype, "density", {
            get: function () {
                return this._density;
            },
            enumerable: true,
            configurable: true
        });
        Material.prototype._onDispose = function () {
        };
        return Material;
    }(rt.WrappedObjectWithId));
    pxsim.Material = Material;
    var GenericMaterial = (function (_super) {
        __extends(GenericMaterial, _super);
        function GenericMaterial() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return GenericMaterial;
    }(Material));
    pxsim.GenericMaterial = GenericMaterial;
    var SolidMaterial = (function (_super) {
        __extends(SolidMaterial, _super);
        function SolidMaterial(params, id) {
            return _super.call(this, new THREE.MeshPhongMaterial(params), id) || this;
        }
        SolidMaterial.getInstance = function (solidColor, id) {
            return this._factory.getInstance({ color: (solidColor ? solidColor.getHex() : undefined) || 16777215 }, id);
        };
        SolidMaterial._factory = new rt.ObjectWithIdFactory(SolidMaterial);
        return SolidMaterial;
    }(Material));
    pxsim.SolidMaterial = SolidMaterial;
})(pxsim || (pxsim = {}));
(function (pxsim) {
    var material;
    (function (material) {
        function materialOfColor(color) {
            return pxsim.SolidMaterial.getInstance(color);
        }
        material.materialOfColor = materialOfColor;
    })(material = pxsim.material || (pxsim.material = {}));
})(pxsim || (pxsim = {}));
var pxsim;
(function (pxsim) {
    var Vector = (function (_super) {
        __extends(Vector, _super);
        function Vector() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Vector.prototype.toString = function () {
            return "(" + this.x + ", " + this.y + ", " + this.z + ")";
        };
        return Vector;
    }(THREE.Vector3));
    pxsim.Vector = Vector;
})(pxsim || (pxsim = {}));
(function (pxsim) {
    var math;
    (function (math) {
        function degreesInRadians(degrees) {
            return THREE.Math.degToRad(degrees);
        }
        math.degreesInRadians = degreesInRadians;
        function radiansInDegrees(radians) {
            return THREE.Math.radToDeg(radians);
        }
        math.radiansInDegrees = radiansInDegrees;
    })(math = pxsim.math || (pxsim.math = {}));
})(pxsim || (pxsim = {}));
(function (pxsim) {
    var math3d;
    (function (math3d) {
        function vector(x, y, z) {
            return new pxsim.Vector(x || 0, y || 0, z || 0);
        }
        math3d.vector = vector;
        function zeroVector() {
            return vector();
        }
        math3d.zeroVector = zeroVector;
        function unitVector() {
            return vector(1, 1, 1);
        }
        math3d.unitVector = unitVector;
        function vectorOp(a, op, b) {
            var result = vector();
            switch (op) {
                case 1:
                    return result.addVectors(a, b);
                case 2:
                    return result.subVectors(a, b);
                case 3:
                    return result.multiplyVectors(a, b);
            }
            throw new Error();
        }
        math3d.vectorOp = vectorOp;
        function vectorScalarOp(a, op, s) {
            var result = a;
            switch (op) {
                case 1:
                    return result.addScalar(s);
                case 2:
                    return result.subScalar(s);
                case 3:
                    return result.multiplyScalar(s);
                case 4:
                    return result.divideScalar(s);
            }
        }
        math3d.vectorScalarOp = vectorScalarOp;
    })(math3d = pxsim.math3d || (pxsim.math3d = {}));
})(pxsim || (pxsim = {}));
var pxsim;
(function (pxsim) {
    var Mesh3d = (function (_super) {
        __extends(Mesh3d, _super);
        function Mesh3d(shape3d, material, id) {
            var _this = _super.call(this, new THREE.Mesh(shape3d.reference, material.reference), id) || this;
            _this._rigidbody = new pxsim.RigidBody(_this, shape3d, shape3d.volume * material.density);
            return _this;
        }
        Object.defineProperty(Mesh3d.prototype, "shape3d", {
            get: function () {
                return new pxsim.GenericShape3d(this.reference.geometry);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Mesh3d.prototype, "material", {
            get: function () {
                return pxsim.Helper.applyFn(this.reference.material, function (ref) { return new pxsim.GenericMaterial(ref); });
            },
            enumerable: true,
            configurable: true
        });
        return Mesh3d;
    }(pxsim.Object3d));
    pxsim.Mesh3d = Mesh3d;
})(pxsim || (pxsim = {}));
(function (pxsim) {
    var mesh;
    (function (mesh) {
        function fromShapeAndMaterial(shape3d, material) {
            if (!shape3d || !material) {
                return null;
            }
            return new pxsim.Mesh3d(shape3d, material);
        }
        mesh.fromShapeAndMaterial = fromShapeAndMaterial;
    })(mesh = pxsim.mesh || (pxsim.mesh = {}));
})(pxsim || (pxsim = {}));
var pxsim;
(function (pxsim) {
    var Scene3d = (function (_super) {
        __extends(Scene3d, _super);
        function Scene3d(id) {
            var _this = _super.call(this, new THREE.Scene(), id) || this;
            _this._physicsworld = new pxsim.PhysicsWorld();
            _this._controls = null;
            _this.reference.background = new THREE.Color(13882323);
            _this._ambientlight = new pxsim.AmbientLight();
            _this.add(_this._ambientlight);
            _this._camera = new pxsim.PerspectiveCamera();
            _this.add(_this._camera, new pxsim.Vector(-40, 20, 15));
            _this._raycaster = new THREE.Raycaster();
            _this._controls = new THREE.OrbitControls(_this._camera.reference);
            _this._controls.target.set(0, 2, 0);
            _this._controls.update();
            return _this;
        }
        Object.defineProperty(Scene3d.prototype, "ambientLight", {
            get: function () {
                return this._ambientlight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scene3d.prototype, "x", {
            get: function () {
                return 1969;
            },
            set: function (x) {
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scene3d.prototype, "physicsWorld", {
            get: function () {
                return this._physicsworld;
            },
            enumerable: true,
            configurable: true
        });
        Scene3d.prototype.camera = function () {
            return this._camera;
        };
        Scene3d.prototype.setBackgroundColor = function (color) {
            if (!color) {
                return;
            }
            this.reference.background = color;
        };
        Scene3d.prototype.setAmbientLight = function (color) {
            if (!color) {
                return;
            }
            this.ambientLight.reference.color = color;
        };
        Scene3d.prototype.add = function (object3d, position) {
            if (!object3d) {
                return;
            }
            if (position) {
                object3d.setPosition(position);
            }
            this.reference.add(object3d.reference);
            object3d.onAdded(this);
        };
        Scene3d.prototype.remove = function (object3d) {
            if (!object3d) {
                return;
            }
            object3d.onRemoved(this);
            this.reference.remove(object3d.reference);
        };
        Scene3d.prototype.animate = function (timeStep) {
            _super.prototype.animate.call(this, timeStep);
            this._physicsworld.animate(timeStep);
            pxsim.singletonWorldBoard().events.queue(1, 0, timeStep);
        };
        Scene3d.prototype.intersectedObjects = function (x, y) {
            if (!this._camera) {
                return null;
            }
            this._raycaster.setFromCamera(new THREE.Vector2(x, y), this._camera.reference);
            var intersections = this._raycaster.intersectObjects(this.reference.children);
            return intersections.length > 0 ? intersections.map(function (intersection) { return new pxsim.GenericObject3d(intersection.object); }) : null;
        };
        Scene3d.prototype.setPhysicsEnabled = function (enable) {
        };
        Scene3d.prototype._onDispose = function () {
            this._physicsworld.dispose();
            _super.prototype._onDispose.call(this);
        };
        return Scene3d;
    }(pxsim.Object3d));
    pxsim.Scene3d = Scene3d;
    var GenericScene3d = (function (_super) {
        __extends(GenericScene3d, _super);
        function GenericScene3d() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return GenericScene3d;
    }(Scene3d));
    pxsim.GenericScene3d = GenericScene3d;
})(pxsim || (pxsim = {}));
(function (pxsim) {
    var scene;
    (function (scene) {
        function origin() {
            return pxsim.math3d.zeroVector();
        }
        scene.origin = origin;
        function onAnimate(handler) {
            pxsim.singletonWorldBoard().events.listen(1, 0, handler);
        }
        scene.onAnimate = onAnimate;
    })(scene = pxsim.scene || (pxsim.scene = {}));
})(pxsim || (pxsim = {}));
var pxsim;
(function (pxsim) {
    var Shape3d = (function (_super) {
        __extends(Shape3d, _super);
        function Shape3d() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._volume = 0;
            _this._ctorCollisionShape = null;
            return _this;
        }
        Object.defineProperty(Shape3d.prototype, "volume", {
            get: function () {
                return this._volume;
            },
            enumerable: true,
            configurable: true
        });
        Shape3d.prototype.createCollisionShape = function () {
            return this._ctorCollisionShape ? this._ctorCollisionShape() : null;
        };
        Shape3d.prototype._onDispose = function () {
        };
        Shape3d.prototype._setShapeVolume = function (volume) {
            this._volume = volume;
        };
        Shape3d.prototype._setCtorCollisionShape = function (ctor) {
            this._ctorCollisionShape = ctor;
        };
        Shape3d.prototype._getBounds = function (target) {
            this.reference.computeBoundingBox();
            return this.reference.boundingBox.getSize(target);
        };
        Shape3d.prototype._createCollisionShapeFromHalfExtents = function (ctor) {
            var bthalfextents = pxsim.Helper.btVector3FromThree(this._getBounds(new THREE.Vector3()).divideScalar(2));
            var btshape = ctor(bthalfextents);
            btshape.setMargin(Shape3d.collisionMargin);
            pxsim.Helper.safeAmmoObjectDestroy(bthalfextents);
            return btshape;
        };
        Shape3d.radialSegments = 32;
        Shape3d.collisionMargin = 0.05;
        return Shape3d;
    }(rt.WrappedObjectWithId));
    pxsim.Shape3d = Shape3d;
    var GenericShape3d = (function (_super) {
        __extends(GenericShape3d, _super);
        function GenericShape3d() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return GenericShape3d;
    }(Shape3d));
    pxsim.GenericShape3d = GenericShape3d;
    var PlaneShape3d = (function (_super) {
        __extends(PlaneShape3d, _super);
        function PlaneShape3d(width, height, id) {
            var _this = this;
            width = width || 100;
            height = height || 100;
            _this = _super.call(this, new THREE.PlaneBufferGeometry(width, height).rotateX(-Math.PI / 2), id) || this;
            _this._setCtorCollisionShape(function () { return _this._createCollisionShapeFromHalfExtents(function (bthalfextents) { return new Ammo.btBoxShape(bthalfextents); }); });
            return _this;
        }
        return PlaneShape3d;
    }(Shape3d));
    pxsim.PlaneShape3d = PlaneShape3d;
    var BoxShape3d = (function (_super) {
        __extends(BoxShape3d, _super);
        function BoxShape3d(width, height, depth, openEnded, id) {
            var _this = this;
            width = width || 1;
            height = height || 1;
            depth = depth || 1;
            _this = _super.call(this, new THREE.BoxBufferGeometry(width, height, depth), id) || this;
            _this._setShapeVolume(width * height * depth);
            _this._setCtorCollisionShape(function () { return _this._createCollisionShapeFromHalfExtents(function (bthalfextents) { return new Ammo.btBoxShape(bthalfextents); }); });
            return _this;
        }
        return BoxShape3d;
    }(Shape3d));
    pxsim.BoxShape3d = BoxShape3d;
    var CylinderShape3d = (function (_super) {
        __extends(CylinderShape3d, _super);
        function CylinderShape3d(radius, height, openEnded, id) {
            var _this = this;
            radius = radius || .5;
            height = height || 1;
            _this = _super.call(this, new THREE.CylinderBufferGeometry(radius, radius, height, Shape3d.radialSegments, 1, openEnded || false), id) || this;
            _this._setShapeVolume(Math.PI * Math.pow(radius, 2) * height);
            _this._setCtorCollisionShape(function () { return _this._createCollisionShapeFromHalfExtents(function (bthalfextents) { return new Ammo.btCylinderShape(bthalfextents); }); });
            return _this;
        }
        return CylinderShape3d;
    }(Shape3d));
    pxsim.CylinderShape3d = CylinderShape3d;
    var SphereShape3d = (function (_super) {
        __extends(SphereShape3d, _super);
        function SphereShape3d(radius, id) {
            var _this = this;
            radius = radius || .5;
            _this = _super.call(this, new THREE.SphereBufferGeometry(radius, Shape3d.radialSegments, Shape3d.radialSegments), id) || this;
            _this._setShapeVolume(4 / 3 * Math.PI * Math.pow(radius, 3));
            _this._setCtorCollisionShape(function () { return new Ammo.btSphereShape(radius); });
            return _this;
        }
        return SphereShape3d;
    }(Shape3d));
    pxsim.SphereShape3d = SphereShape3d;
    var ConeShape3d = (function (_super) {
        __extends(ConeShape3d, _super);
        function ConeShape3d(radius, height, id) {
            var _this = this;
            radius = radius || .5;
            height = height || 1;
            _this = _super.call(this, new THREE.ConeBufferGeometry(radius, height, Shape3d.radialSegments), id) || this;
            _this._setShapeVolume(Math.PI * Math.pow(radius, 2) * height / 3);
            _this._setCtorCollisionShape(function () { return new Ammo.btConeShape(radius, height); });
            return _this;
        }
        return ConeShape3d;
    }(Shape3d));
    pxsim.ConeShape3d = ConeShape3d;
})(pxsim || (pxsim = {}));
(function (pxsim) {
    var shape3d;
    (function (shape3d) {
        function planeShape(width, height) {
            return new pxsim.PlaneShape3d(width, height);
        }
        shape3d.planeShape = planeShape;
        function boxShape(width, height, depth) {
            return new pxsim.BoxShape3d(width, height, depth);
        }
        shape3d.boxShape = boxShape;
        function cylinderShape(radius, height) {
            return new pxsim.CylinderShape3d(radius, height);
        }
        shape3d.cylinderShape = cylinderShape;
        function sphereShape(radius) {
            return new pxsim.SphereShape3d(radius);
        }
        shape3d.sphereShape = sphereShape;
        function coneShape(radius, height) {
            return new pxsim.ConeShape3d(radius, height);
        }
        shape3d.coneShape = coneShape;
    })(shape3d = pxsim.shape3d || (pxsim.shape3d = {}));
})(pxsim || (pxsim = {}));
var pxsim;
(function (pxsim) {
    var World3d = (function (_super) {
        __extends(World3d, _super);
        function World3d(id) {
            if (id === void 0) { id = 'container'; }
            var _this = _super.call(this) || this;
            _this._scene = null;
            _this._onWindowResize = function () {
                _this._renderer.resize(window.innerWidth, window.innerHeight, window.devicePixelRatio);
            };
            _this._onDocumentMouseMove = function (event) { return _this._onDocumentMouseEvent(2, 1, event); };
            _this._onDocumentMouseClick = function (event) { return _this._onDocumentMouseEvent(World3d._sidFromMouseButtonEvent(event), 2, event); };
            _this._onDocumentMouseEvent = function (sid, evid, event) {
                event.preventDefault();
                if (!sid) {
                    return;
                }
                var x = (event.clientX / window.innerWidth) * 2 - 1;
                var y = -(event.clientY / window.innerHeight) * 2 + 1;
                pxsim.singletonWorldBoard().events.queue(sid, evid, new pxsim.EventCoordValue(x, y));
            };
            _this._renderer = new pxsim.Renderer(id);
            _this._scene = new pxsim.GenericScene3d();
            _this._updateRendererScene();
            var container = document.getElementById(_this._renderer.id);
            if (container) {
                container.innerHTML = '';
                if (Detector.webgl) {
                    container.appendChild(_this._renderer.domElement);
                }
                else {
                    Detector.addGetWebGLMessage({ parent: container });
                }
            }
            _this._onWindowResize();
            window.addEventListener('resize', _this._onWindowResize, false);
            document.addEventListener('mousemove', _this._onDocumentMouseMove, false);
            document.addEventListener('click', _this._onDocumentMouseClick, false);
            return _this;
        }
        World3d._sidFromMouseButtonEvent = function (event) {
            var sid;
            if (0 === event.button) {
                sid = 3;
            }
            else if (1 === event.button) {
                sid = 4;
            }
            else if (2 === event.button) {
                sid = 5;
            }
            return sid;
        };
        Object.defineProperty(World3d.prototype, "renderer", {
            get: function () {
                return this._renderer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(World3d.prototype, "scene", {
            get: function () {
                return this._scene;
            },
            enumerable: true,
            configurable: true
        });
        World3d.prototype._onDispose = function () {
            document.removeEventListener('click', this._onDocumentMouseClick, false);
            document.removeEventListener('mousemove', this._onDocumentMouseMove, false);
            window.removeEventListener('resize', this._onWindowResize, false);
            var container = document.getElementById(this._renderer.id);
            if (container) {
                container.innerHTML = '';
            }
            pxsim.Helper.safeObjectDispose(this._renderer.scene);
            this._renderer.dispose();
        };
        World3d.prototype._updateRendererScene = function () {
            this._renderer.scene = this._scene;
        };
        return World3d;
    }(rt.ObjectDisposable));
    pxsim.World3d = World3d;
})(pxsim || (pxsim = {}));
(function (pxsim) {
    var world;
    (function (world_1) {
        function world() {
            return pxsim.singletonWorldBoard().world;
        }
        world_1.world = world;
        function scene() {
            var world3d = pxsim.world.world();
            return world3d ? world3d.scene : null;
        }
        world_1.scene = scene;
        function intersectedObjectAt(x, y) {
            var scene3d = pxsim.world.scene();
            var objects = scene3d ? scene3d.intersectedObjects(x, y) : null;
            return objects && objects.length > 0 ? objects[0] : null;
        }
        world_1.intersectedObjectAt = intersectedObjectAt;
    })(world = pxsim.world || (pxsim.world = {}));
})(pxsim || (pxsim = {}));
var pxsim;
(function (pxsim) {
    var WorldBoard = (function (_super) {
        __extends(WorldBoard, _super);
        function WorldBoard() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._world3d = null;
            _this._events = null;
            return _this;
        }
        Object.defineProperty(WorldBoard, "singleton", {
            get: function () {
                return this._board;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WorldBoard.prototype, "world", {
            get: function () {
                return this._world3d;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WorldBoard.prototype, "events", {
            get: function () {
                return this._events;
            },
            enumerable: true,
            configurable: true
        });
        WorldBoard.prototype.initAsync = function (msg) {
            this.init();
            return Promise.resolve();
        };
        WorldBoard.prototype.init = function () {
            this.postkill();
            this._world3d = new pxsim.World3d();
            this._events = new pxsim.WorldEventBus(pxsim.runtime);
        };
        WorldBoard.prototype.kill = function () {
            if (this._world3d) {
                this._world3d.renderer.pause = true;
            }
        };
        WorldBoard.prototype.postkill = function () {
            rt.ObjectWithIdFactory.forgetAllInstances();
            pxsim.Helper.safeObjectDispose(this._world3d);
            this._world3d = null;
        };
        WorldBoard.prototype.receiveMessage = function (msg) {
        };
        WorldBoard.prototype.updateView = function () {
        };
        WorldBoard._board = new WorldBoard();
        return WorldBoard;
    }(pxsim.BaseBoard));
    pxsim.WorldBoard = WorldBoard;
    pxsim.initCurrentRuntime = function (msg) {
        singletonWorldBoard().postkill();
        return pxsim.runtime.board = singletonWorldBoard();
    };
    function singletonWorldBoard() { return WorldBoard.singleton; }
    pxsim.singletonWorldBoard = singletonWorldBoard;
})(pxsim || (pxsim = {}));
var pxsim;
(function (pxsim) {
    var EventValue = (function () {
        function EventValue() {
        }
        return EventValue;
    }());
    pxsim.EventValue = EventValue;
    var EventCoordValue = (function (_super) {
        __extends(EventCoordValue, _super);
        function EventCoordValue(x, y) {
            var _this = _super.call(this) || this;
            _this.x = x;
            _this.y = y;
            return _this;
        }
        EventCoordValue.prototype.toActionArgs = function () {
            return [this.x, this.y];
        };
        return EventCoordValue;
    }(EventValue));
    pxsim.EventCoordValue = EventCoordValue;
    var WorldEventBus = (function (_super) {
        __extends(WorldEventBus, _super);
        function WorldEventBus(runtime) {
            return _super.call(this, runtime, function (value) { return typeof value === 'object' ? value.toActionArgs() : [value]; }) || this;
        }
        return WorldEventBus;
    }(pxsim.EventBusGeneric));
    pxsim.WorldEventBus = WorldEventBus;
})(pxsim || (pxsim = {}));
var pxsim;
(function (pxsim) {
    var Helper = (function () {
        function Helper() {
        }
        Helper.btVector3FromThree = function (vec) {
            return new Ammo.btVector3(vec.x, vec.y, vec.z);
        };
        Helper.btQuaternionFromThree = function (qtr) {
            return new Ammo.btQuaternion(qtr.x, qtr.y, qtr.z, qtr.w);
        };
        Helper.applyFn = function (input, fn) {
            return Array.isArray(input) ? input.map(fn) : fn(input);
        };
        Helper.safeObjectDispose = function (dispoableobject) {
            if (dispoableobject) {
                dispoableobject.dispose();
            }
        };
        Helper.safeAmmoObjectDestroy = function (ammoobject) {
            if (ammoobject) {
                Ammo.destroy(ammoobject);
            }
        };
        return Helper;
    }());
    pxsim.Helper = Helper;
})(pxsim || (pxsim = {}));
var pxsim;
(function (pxsim) {
    var PhysicsWorld = (function (_super) {
        __extends(PhysicsWorld, _super);
        function PhysicsWorld() {
            var _this = _super.call(this) || this;
            _this._btconfig = new Ammo.btDefaultCollisionConfiguration();
            _this._btdispatcher = new Ammo.btCollisionDispatcher(_this._btconfig);
            _this._btbroadphase = new Ammo.btDbvtBroadphase();
            _this._btconstraintsolver = new Ammo.btSequentialImpulseConstraintSolver();
            _this._btworld = new Ammo.btDiscreteDynamicsWorld(_this._btdispatcher, _this._btbroadphase, _this._btconstraintsolver, _this._btconfig);
            _this._btworld.getSolverInfo().m_numIterations = PhysicsWorld._numIterationsSolver;
            return _this;
        }
        Object.defineProperty(PhysicsWorld.prototype, "btWorld", {
            get: function () {
                return this._btworld;
            },
            enumerable: true,
            configurable: true
        });
        PhysicsWorld.prototype.getGravity = function () {
            return this._btworld.getGravity().y();
        };
        PhysicsWorld.prototype.setGravity = function (gravity) {
            var btvecGravity = new Ammo.btVector3(0, gravity, 0);
            this._btworld.setGravity(btvecGravity);
            pxsim.Helper.safeAmmoObjectDestroy(btvecGravity);
        };
        PhysicsWorld.prototype.animate = function (timeStep) {
            this._btworld.stepSimulation(timeStep, PhysicsWorld._maxStepSimulation, PhysicsWorld._fixedTimeStep);
        };
        PhysicsWorld.prototype._onDispose = function () {
            pxsim.Helper.safeAmmoObjectDestroy(this._btworld);
            pxsim.Helper.safeAmmoObjectDestroy(this._btconstraintsolver);
            pxsim.Helper.safeAmmoObjectDestroy(this._btbroadphase);
            pxsim.Helper.safeAmmoObjectDestroy(this._btdispatcher);
            pxsim.Helper.safeAmmoObjectDestroy(this._btconfig);
        };
        PhysicsWorld._numIterationsSolver = 4;
        PhysicsWorld._maxStepSimulation = 3;
        PhysicsWorld._fixedTimeStep = 1 / 60;
        return PhysicsWorld;
    }(rt.ObjectDisposable));
    pxsim.PhysicsWorld = PhysicsWorld;
})(pxsim || (pxsim = {}));
var pxsim;
(function (pxsim) {
    var Renderer = (function (_super) {
        __extends(Renderer, _super);
        function Renderer(id) {
            if (id === void 0) { id = 'container'; }
            var _this = _super.call(this, Renderer._instantiateReference(id), id) || this;
            _this._domElement = document.createElement('div');
            _this._scene3d = null;
            _this._camera = null;
            _this._stats = new Stats();
            _this._clock = new THREE.Clock();
            _this._paused = false;
            _this._callbackRequestId = 0;
            _this._domElement.appendChild(_this.reference.domElement);
            _this._domElement.appendChild(_this._stats.dom);
            _this.reference.shadowMap.enabled = true;
            _this.reference.shadowMap.type = THREE.PCFSoftShadowMap;
            _this.reference.setClearColor(14745599);
            _this._runRenderLoop();
            return _this;
        }
        Renderer._instantiateReference = function (id) {
            var webglrenderer = Renderer._renderers.get(id);
            if (!webglrenderer) {
                Renderer._renderers.set(id, webglrenderer = new THREE.WebGLRenderer({ antialias: true }));
                webglrenderer.shadowMap.enabled = true;
                webglrenderer.shadowMap.type = THREE.PCFSoftShadowMap;
            }
            return webglrenderer;
        };
        Object.defineProperty(Renderer.prototype, "domElement", {
            get: function () {
                return this._domElement;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Renderer.prototype, "scene", {
            get: function () {
                return this._scene3d;
            },
            set: function (scene3d) {
                this._scene3d = scene3d;
                this._updateSceneCameraSize();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Renderer.prototype, "isPaused", {
            get: function () {
                return this._paused;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Renderer.prototype, "pause", {
            set: function (pause) {
                this._paused = pause;
            },
            enumerable: true,
            configurable: true
        });
        Renderer.prototype.animate = function () {
            if (!this._scene3d) {
                return;
            }
            this._scene3d.animate(this._clock.getDelta());
        };
        Renderer.prototype.render = function () {
            if (!this._scene3d) {
                return;
            }
            var camera = this._scene3d.camera();
            if (camera) {
                this.reference.render(this._scene3d.reference, camera.reference);
            }
        };
        Renderer.prototype.resize = function (width, height, devicePixelRatio) {
            this.reference.setPixelRatio(devicePixelRatio);
            this.reference.setSize(width, height);
            this._updateSceneCameraSize();
        };
        Renderer.prototype._onDispose = function () {
            this._stopRenderLoop();
        };
        Renderer.prototype._updateSceneCameraSize = function () {
            if (!this._scene3d) {
                return;
            }
            var camera = this._scene3d.camera();
            if (camera) {
                var size = this.reference.getSize();
                camera.setSize(size.width, size.height);
            }
        };
        Renderer.prototype._runRenderLoop = function () {
            var _this = this;
            this._callbackRequestId = requestAnimationFrame(function (time) {
                if (!_this._paused) {
                    if (_this._stats) {
                        _this._stats.begin();
                    }
                    _this.animate();
                    _this.render();
                    if (_this._stats) {
                        _this._stats.end();
                    }
                }
                _this._runRenderLoop();
            });
        };
        Renderer.prototype._stopRenderLoop = function () {
            if (0 !== this._callbackRequestId) {
                cancelAnimationFrame(this._callbackRequestId);
                this._callbackRequestId = 0;
            }
        };
        Renderer._renderers = new Map();
        return Renderer;
    }(rt.WrappedObjectWithId));
    pxsim.Renderer = Renderer;
})(pxsim || (pxsim = {}));
var pxsim;
(function (pxsim) {
    function btMotionStateFromObject3d(btmotionstate, object3d) {
        var bttransform = new Ammo.btTransform();
        var btorigin, btquarternion;
        bttransform.setOrigin(btorigin = pxsim.Helper.btVector3FromThree(object3d.reference.position));
        bttransform.setRotation(btquarternion = pxsim.Helper.btQuaternionFromThree(object3d.reference.quaternion));
        btmotionstate.setWorldTransform(bttransform);
        pxsim.Helper.safeAmmoObjectDestroy(btquarternion);
        pxsim.Helper.safeAmmoObjectDestroy(btorigin);
        pxsim.Helper.safeAmmoObjectDestroy(bttransform);
        return btmotionstate;
    }
    pxsim.btMotionStateFromObject3d = btMotionStateFromObject3d;
    function btMotionStateToObject3d(btmotionstate, object3d) {
        var bttransform = new Ammo.btTransform();
        btmotionstate.getWorldTransform(bttransform);
        var btorigin = bttransform.getOrigin();
        var btrotation = bttransform.getRotation();
        object3d.reference.position.set(btorigin.x(), btorigin.y(), btorigin.z());
        object3d.reference.quaternion.set(btrotation.x(), btrotation.y(), btrotation.z(), btrotation.w());
        pxsim.Helper.safeAmmoObjectDestroy(bttransform);
    }
    pxsim.btMotionStateToObject3d = btMotionStateToObject3d;
    var RigidBody = (function (_super) {
        __extends(RigidBody, _super);
        function RigidBody(object3d, shape3d, mass) {
            var _this = _super.call(this) || this;
            _this._world = null;
            mass = Math.max(RigidBody._minMass, Math.min(RigidBody._maxMass, mass));
            var isDynamic = mass !== 0;
            var btmotionstate = new Ammo.btDefaultMotionState();
            var btshape = shape3d.createCollisionShape();
            var btvecLocalInertia = new Ammo.btVector3(0, 0, 0);
            if (isDynamic) {
                btshape.calculateLocalInertia(mass, btvecLocalInertia);
            }
            var btinfo = new Ammo.btRigidBodyConstructionInfo(mass, btmotionstate, btshape, btvecLocalInertia);
            pxsim.Helper.safeAmmoObjectDestroy(btvecLocalInertia);
            _this._btbody = new Ammo.btRigidBody(btinfo);
            _this._btshape = btshape;
            _this._btmotionstate = btmotionstate;
            _this._btinfo = btinfo;
            _this._btbody.setFriction(RigidBody._defaultFriction);
            _this.isStatic = !isDynamic;
            _this.isKinematic = isDynamic;
            _this._object3d = object3d;
            return _this;
        }
        Object.defineProperty(RigidBody.prototype, "isStatic", {
            get: function () {
                return this._btbody.isStaticObject();
            },
            set: function (isStatic) {
                this._toggleCollisionFlag(1, isStatic);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RigidBody.prototype, "isKinematic", {
            get: function () {
                return this._btbody.isKinematicObject();
            },
            set: function (isKinematic) {
                this._toggleCollisionFlag(2, isKinematic);
                this._btbody.setActivationState(isKinematic ? 4 : 1);
                if (!isKinematic) {
                    this._btbody.activate();
                }
                if (this._world) {
                    this.addRigidBody(this._world);
                }
            },
            enumerable: true,
            configurable: true
        });
        RigidBody.prototype.addRigidBody = function (world) {
            this.removeRigidBody(world);
            btMotionStateFromObject3d(this._btmotionstate, this._object3d);
            this._btbody.setMotionState(this._btmotionstate);
            this._world = world;
            this._world.btWorld.addRigidBody(this._btbody);
        };
        RigidBody.prototype.removeRigidBody = function (world) {
            if (this._world !== world) {
                return;
            }
            this._world.btWorld.removeRigidBody(this._btbody);
            this._world = null;
        };
        RigidBody.prototype.syncMotionStateToObject3d = function () {
            if (!this._btbody.isStaticOrKinematicObject()) {
                btMotionStateToObject3d(this._btbody.getMotionState(), this._object3d);
            }
        };
        RigidBody.prototype._toggleCollisionFlag = function (flag, on) {
            var flags = this._btbody.getCollisionFlags();
            if (on) {
                flags |= flag;
            }
            else {
                flags &= ~flag;
            }
            this._btbody.setCollisionFlags(flags);
        };
        RigidBody.prototype._onDispose = function () {
            pxsim.Helper.safeAmmoObjectDestroy(this._btbody);
            pxsim.Helper.safeAmmoObjectDestroy(this._btinfo);
            pxsim.Helper.safeAmmoObjectDestroy(this._btmotionstate);
            pxsim.Helper.safeAmmoObjectDestroy(this._btshape);
        };
        RigidBody._minMass = 0;
        RigidBody._maxMass = 100;
        RigidBody._defaultFriction = .75;
        return RigidBody;
    }(rt.ObjectDisposable));
    pxsim.RigidBody = RigidBody;
})(pxsim || (pxsim = {}));