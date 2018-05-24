/*
    MIT License

    Copyright (c) 2018 MuddyTummy Software LLC
*/

/// <reference path='../shared/enums.ts'/>

namespace pxsim.input {
    export function onKeyEvent(key: KeyboardKey | string, event: KeyEvent, handler: RefAction) {
        singletonWorldBoard().events!.listen(keyboardScopeIdFromKey(key), event, handler);
    }

    export function onMouseEnter(handler: RefAction) {
        singletonWorldBoard().events!.listen(ScopeId.MouseDevice, MouseEvent_Internal.Enter, handler);
    }

    export function onMouseMove(handler: RefAction) {
        singletonWorldBoard().events!.listen(ScopeId.MouseDevice, MouseEvent_Internal.Move, handler);
    }

    export function onMouseLeave(handler: RefAction) {
        singletonWorldBoard().events!.listen(ScopeId.MouseDevice, MouseEvent_Internal.Leave, handler);
    }

    export function onMouseButtonEvent(button: MouseButton, event: MouseButtonEvent, handler: RefAction) {
        singletonWorldBoard().events!.listen(mouseScopeIdFromButton(button), event, handler);
    }
}
