import { useRef } from 'react'
import { Editor } from '@tinymce/tinymce-react'

interface RichTextEditorProps {
  value: string
  onChange: (content: string) => void
  height?: number
}

export function RichTextEditor({ value, onChange, height = 300 }: RichTextEditorProps) {
  const editorRef = useRef<unknown>(null)

  return (
    <Editor
      onInit={(_evt, editor) => {
        editorRef.current = editor
      }}
      value={value}
      onEditorChange={(content) => onChange(content)}
      init={{
        height,
        menubar: false,
        branding: false,
        promotion: false,
        plugins: [
          'lists',
          'link',
          'image',
          'code',
          'autolink',
          'autoresize',
        ],
        toolbar:
          'bold italic underline | bullist numlist | link image | code',
        content_style: `
          body {
            font-family: 'Inter', 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            color: #163B32;
            line-height: 1.6;
            padding: 8px 12px;
          }
        `,
        skin: 'oxide',
        content_css: 'default',
        statusbar: false,
      }}
    />
  )
}
