/*
    MIT License

    Copyright (c) 2018 MuddyTummy Software LLC
*/

/// <reference path="../shared/ammo.d.ts"/>

namespace pxsim {
    export class Helper {
        public static btVector3FromThree(vec: THREE.Vector3): Ammo.btVector3 {
            return new Ammo.btVector3(vec.x, vec.y, vec.z);
        }

        public static btQuaternionFromThree(qtr: THREE.Quaternion): Ammo.btQuaternion {
            return new Ammo.btQuaternion(qtr.x, qtr.y, qtr.z, qtr.w);
        }

        public static applyFn<T, R>(input: T | T[], fn: (t: T) => R): R | R[] {
            return Array.isArray(input) ? input.map(fn) : fn(input);
        }

        public static safeObjectDispose(object: rt.IDisposableObject | null) {
            if (object) {
                object.dispose();
            }
        }

        public static safeAmmoObjectDestroy(object: any | null) {
            if (object) {
                Ammo.destroy(object);
            }
        }
    }

    export class SimpleEventListenerHelper {
        private _listeners = new Map<string, (this: HTMLElement, ev: Event) => any>();

        constructor(public readonly target: EventTarget) {
        }

        public addEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any): void {
            this.target.addEventListener(type, listener);
            this._listeners.set(type, listener);
        }

        public removeEventListener<K extends keyof HTMLElementEventMap>(type: K): void {
            const listener = this._listeners.get(type);
            if (listener) {
                this.target.removeEventListener(type, listener);
                this._listeners.delete(type);
            }
        }

        public removeAllEventListeners() {
            this._listeners.forEach((listener, type) => {
                this.target.removeEventListener(type, listener);
            });
            this._listeners.clear();
        }
    }
}
