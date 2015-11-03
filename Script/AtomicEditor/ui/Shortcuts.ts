//
// Copyright (c) 2014-2015, THUNDERBEAST GAMES LLC All rights reserved
// LICENSE: Atomic Game Engine Editor and Tools EULA
// Please see LICENSE_ATOMIC_EDITOR_AND_TOOLS.md in repository root for
// license information: https://github.com/AtomicGameEngine/AtomicGameEngine
//

import EditorEvents = require("../editor/EditorEvents");
import EditorUI = require("./EditorUI");

class Shortcuts extends Atomic.ScriptObject {

    constructor() {

        super();

        this.subscribeToEvent("UIShortcut", (ev: Atomic.UIShortcutEvent) => this.handleUIShortcut(ev));

        this.subscribeToEvent("KeyDown", (ev: Atomic.KeyDownEvent) => this.handleKeyDown(ev));


    }

    invokePlay() {

        this.sendEvent(EditorEvents.SaveAllResources);
        Atomic.editorMode.playProject();

    }

    invokePlayDebug() {

        this.sendEvent(EditorEvents.SaveAllResources);
        Atomic.editorMode.playProjectDebug();

    }


    invokeFormatCode() {

        var editor = EditorUI.getMainFrame().resourceframe.currentResourceEditor;

        if (editor && editor.typeName == "JSResourceEditor") {

            (<Editor.JSResourceEditor>editor).formatCode();

        }

    }

    invokeFileClose() {

        // pretty gross
        var editor = EditorUI.getMainFrame().resourceframe.currentResourceEditor;
        if (!editor) return;
        editor.close(true);

    }

    invokeFileSave() {
        this.sendEvent(EditorEvents.SaveResource);
    }

    invokeUndo() {
        this.invokeResourceFrameShortcut("undo");
    }

    invokeRedo() {
        this.invokeResourceFrameShortcut("redo");
    }

    invokeCut() {
        this.invokeResourceFrameShortcut("cut");
    }

    invokeCopy() {
        this.invokeResourceFrameShortcut("copy");
    }

    invokePaste() {
        this.invokeResourceFrameShortcut("paste");
    }

    invokeSelectAll() {
        this.invokeResourceFrameShortcut("selectall");
    }

    invokeGizmoMode3DTranslate() {

        this.sendEvent("GizmoEditModeChanged", { mode: 1 });

    }

    invokeGizmoMode3DRotate() {

        this.sendEvent("GizmoEditModeChanged", { mode: 2 });

    }

    invokeGizmoMode3DScale() {

        this.sendEvent("GizmoEditModeChanged", { mode: 3 });

    }

    invokeResourceFrameShortcut(shortcut: string) {
        if (!ToolCore.toolSystem.project) return;
        var resourceFrame = EditorUI.getMainFrame().resourceframe.currentResourceEditor;
        if (resourceFrame) {
            resourceFrame.invokeShortcut(shortcut);
        }
    }

    handleKeyDown(ev: Atomic.KeyDownEvent) {

        // if the right mouse buttons isn't down
        if (!(ev.buttons & Atomic.MOUSEB_RIGHT)) {

            // TODO: Make these customizable

            if (ev.key == Atomic.KEY_W) {
                this.invokeGizmoMode3DTranslate();
            } else if (ev.key == Atomic.KEY_E) {
                this.invokeGizmoMode3DRotate();
            } else if (ev.key == Atomic.KEY_R) {
                this.invokeGizmoMode3DScale();
            }

        }

    }

    // global shortcut handler
    handleUIShortcut(ev: Atomic.UIShortcutEvent) {

        var cmdKey;
        if (Atomic.platform == "MacOSX") {
            cmdKey = (Atomic.input.getKeyDown(Atomic.KEY_LGUI) || Atomic.input.getKeyDown(Atomic.KEY_RGUI));
        } else {
            cmdKey = (Atomic.input.getKeyDown(Atomic.KEY_LCTRL) || Atomic.input.getKeyDown(Atomic.KEY_RCTRL));
        }

        if (cmdKey) {

            if (ev.key == Atomic.KEY_S) {
                this.invokeFileSave();
            }
            else if (ev.key == Atomic.KEY_W) {
                this.invokeFileClose();
            }
            else if (ev.key == Atomic.KEY_I) {
                this.invokeFormatCode();
            }
            else if (ev.key == Atomic.KEY_P) {
                this.invokePlay();
                //if shift is pressed
            } else if (ev.qualifiers & Atomic.QUAL_SHIFT) {
                if (ev.key == Atomic.KEY_B) {
                    EditorUI.getModelOps().showBuildSettings();
                }
            } else if (ev.key == Atomic.KEY_B) {
                EditorUI.getModelOps().showBuild();
            }

        }

    }

}

export = Shortcuts;
