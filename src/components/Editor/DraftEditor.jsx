import { useState } from 'react'
import {
    Editor,
    EditorState,
    convertFromRaw,
    Modifier,
    convertToRaw,
    getDefaultKeyBinding,
    DefaultDraftBlockRenderMap
} from "draft-js";
import 'draft-js/dist/Draft.css';
import './DraftEditor.css'
import { Map as IMap } from 'immutable'
import HighlightText from '../styles/HighlightText';
import RedText from '../styles/RedText';
import Bold from '../styles/Bold'
import Underline from '../styles/Underline'

const blockRenderMap = IMap({
    'HightlightBlock': {
        element: 'mark',
        wrapper: <HighlightText />
    },
    "RedTextColor": {
        element: "span",
        wrapper: <RedText />
    },
    "customBold": {
        element: "span",
        wrapper: <Bold />
    },
    "customUnderline": {
        element: "span",
        wrapper: <Underline />
    }
});

const extendedBlockRenderMap = DefaultDraftBlockRenderMap.merge(blockRenderMap);

const DraftEditor = () => {
    const [saving, setSaving] = useState(false);

    const [editorState, setEditorState] = useState(() => {
        const savedContent = localStorage.getItem("savedDraft");
        return savedContent ? EditorState.createWithContent(
            convertFromRaw(JSON.parse(savedContent))
        ) : EditorState.createEmpty();
    });

    const handleSave = () => {
        setSaving(true)
        //mock disable button
        setTimeout(() => {
            setSaving(false)
        }, 1500);
    }

    const handleTextChange = (newEditorState) => {
        const selectedState = newEditorState.getSelection();
        let contentState = newEditorState.getCurrentContent();
        const anchorKey = selectedState.getAnchorKey();
        const currentTextBlock = contentState.getBlockForKey(anchorKey);
        const startPosition = selectedState.getStartOffset();
        const currText = currentTextBlock.getText();

        const handleBlockTypeChange = (blockType, pos) => {
            const newSelection = selectedState.merge({
                anchorOffset: 0,
                focusOffset: pos.length,
            });

            contentState = Modifier.removeRange(
                contentState,
                newSelection,
                "backward"
            );

            const newContentState = Modifier.setBlockType(
                contentState,
                newSelection,
                blockType
            );

            return EditorState.push(
                newEditorState,
                newContentState,
                "change-inline-style"
            );
        };

        switch (true) {
            case currText.startsWith("# ") && startPosition === 2:
                setEditorState(handleBlockTypeChange("header-one", "#"));
                break
            case currText.startsWith("* ") && startPosition === 2:
                setEditorState(handleBlockTypeChange("customBold", "*"));
                break
            case currText.startsWith("** ") && startPosition === 3:
                setEditorState(handleBlockTypeChange("RedTextColor", "**"));
                break
            case currText.startsWith("``` ") && startPosition === 4:
                setEditorState(handleBlockTypeChange("HightlightBlock", "```"));
                break
            case currText.startsWith("*** ") && startPosition === 4:
                setEditorState(handleBlockTypeChange("customUnderline", "***"));
                break
            default: setEditorState(newEditorState)
        }

        localStorage.setItem("savedDraft",
            JSON.stringify(convertToRaw(newEditorState.getCurrentContent()))
        );
    };

    return (
        <div className="container">
            <div className="header">
                <div className="title">
                    <h2>Demo editor by Sarthak Acharya</h2>
                </div>
                <button
                    onClick={handleSave}
                    className="save-btn"
                    disabled={saving}>
                    {saving ? "SAVING" : "SAVE"}
                </button>
            </div>
            <div className="editor-wrapper">
                <Editor
                    placeholder='Type your text...'
                    editorState={editorState}
                    keyBindingFn={getDefaultKeyBinding}
                    blockRenderMap={extendedBlockRenderMap}
                    onChange={handleTextChange} />
            </div>
        </div>

    )
}

export default DraftEditor