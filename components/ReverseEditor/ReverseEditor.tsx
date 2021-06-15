import { FC, useState } from 'react'
import { EditorState } from 'draft-js'
import Editor from '@draft-js-plugins/editor'
import createSideToolbarPlugin from '@draft-js-plugins/side-toolbar'

import {
  BoldButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  ItalicButton,
  OrderedListButton,
  UnorderedListButton,
} from '@draft-js-plugins/buttons'

import 'draft-js/dist/Draft.css'
import '@draft-js-plugins/side-toolbar/lib/plugin.css'

const sideToolbarPlugin = createSideToolbarPlugin()
const { SideToolbar } = sideToolbarPlugin

const ReverseEditor: FC = () => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  )

  return (
    <>
      <Editor
        editorState={editorState}
        editorKey="reverse"
        onChange={setEditorState}
        plugins={[sideToolbarPlugin]}
        placeholder={'Personalize your card...'}
      />
      <SideToolbar>
        {(externalProps) => (
          <>
            <HeadlineOneButton {...externalProps} />
            <HeadlineTwoButton {...externalProps} />
            <BoldButton {...externalProps} />
            <ItalicButton {...externalProps} />
            <OrderedListButton {...externalProps} />
            <UnorderedListButton {...externalProps} />
          </>
        )}
      </SideToolbar>
    </>
  )
}

export default ReverseEditor
