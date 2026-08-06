<template>
  <div
    class="border border-gray-300 rounded-md overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500"
  >
    <!-- Toolbar -->
    <div
      v-if="editor"
      class="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 px-2 py-1.5"
    >
      <!-- Headings -->
      <button
        type="button"
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        :class="editor.isActive('heading', { level: 1 }) ? activeBtnClass : btnClass"
        class="px-2 py-1 rounded text-sm font-bold"
        title="Heading 1"
      >
        H1
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        :class="editor.isActive('heading', { level: 2 }) ? activeBtnClass : btnClass"
        class="px-2 py-1 rounded text-sm font-bold"
        title="Heading 2"
      >
        H2
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        :class="editor.isActive('heading', { level: 3 }) ? activeBtnClass : btnClass"
        class="px-2 py-1 rounded text-sm font-bold"
        title="Heading 3"
      >
        H3
      </button>

      <span class="w-px h-5 bg-gray-300 mx-1"></span>

      <!-- Inline styles -->
      <button
        type="button"
        @click="editor.chain().focus().toggleBold().run()"
        :class="editor.isActive('bold') ? activeBtnClass : btnClass"
        class="px-2 py-1 rounded text-sm font-bold"
        title="Bold"
      >
        B
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleItalic().run()"
        :class="editor.isActive('italic') ? activeBtnClass : btnClass"
        class="px-2 py-1 rounded text-sm italic"
        title="Italic"
      >
        I
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleUnderline().run()"
        :class="editor.isActive('underline') ? activeBtnClass : btnClass"
        class="px-2 py-1 rounded text-sm underline"
        title="Underline"
      >
        U
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleStrike().run()"
        :class="editor.isActive('strike') ? activeBtnClass : btnClass"
        class="px-2 py-1 rounded text-sm line-through"
        title="Strikethrough"
      >
        S
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleCode().run()"
        :class="editor.isActive('code') ? activeBtnClass : btnClass"
        class="px-2 py-1 rounded text-sm font-mono"
        title="Inline code"
      >
        &lt;/&gt;
      </button>

      <span class="w-px h-5 bg-gray-300 mx-1"></span>

      <!-- Blocks -->
      <button
        type="button"
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="editor.isActive('bulletList') ? activeBtnClass : btnClass"
        class="px-2 py-1 rounded text-sm"
        title="Bullet list"
      >
        &bull; List
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleOrderedList().run()"
        :class="editor.isActive('orderedList') ? activeBtnClass : btnClass"
        class="px-2 py-1 rounded text-sm"
        title="Numbered list"
      >
        1. List
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleBlockquote().run()"
        :class="editor.isActive('blockquote') ? activeBtnClass : btnClass"
        class="px-2 py-1 rounded text-sm"
        title="Quote"
      >
        &ldquo; Quote
      </button>

      <span class="w-px h-5 bg-gray-300 mx-1"></span>

      <!-- Text color -->
      <div class="relative">
        <button
          type="button"
          @click="showTextPalette = !showTextPalette"
          :class="editor.getAttributes('textStyle').color ? activeBtnClass : btnClass"
          class="px-2 py-1 rounded text-sm"
          title="Text color"
        >
          <span
            class="inline-block w-3.5 h-3.5 rounded-full border border-gray-400"
            :style="{ backgroundColor: editor.getAttributes('textStyle').color || '#111827' }"
          ></span>
        </button>
        <div
          v-if="showTextPalette"
          class="absolute left-0 top-full mt-1 z-20 flex flex-wrap gap-1 bg-white border border-gray-200 rounded-md shadow-lg p-2 w-44"
        >
          <button
            v-for="color in textColors"
            :key="color"
            type="button"
            @click="applyTextColor(color)"
            class="w-6 h-6 rounded-full border border-gray-300 hover:scale-110 transition-transform"
            :style="{ backgroundColor: color }"
          ></button>
          <button
            type="button"
            @click="applyTextColor(null)"
            class="w-6 h-6 rounded-full border border-gray-300 text-[10px] text-gray-500 hover:bg-gray-100"
            title="Reset color"
          >
            A
          </button>
        </div>
      </div>

      <!-- Highlight -->
      <div class="relative">
        <button
          type="button"
          @click="showHighlightPalette = !showHighlightPalette"
          :class="editor.isActive('highlight') ? activeBtnClass : btnClass"
          class="px-2 py-1 rounded text-sm"
          title="Highlight"
        >
          <span
            class="inline-block px-1 rounded-sm text-xs font-bold"
            :style="{ backgroundColor: currentHighlightColor() || '#fef08a' }"
            >HL</span
          >
        </button>
        <div
          v-if="showHighlightPalette"
          class="absolute left-0 top-full mt-1 z-20 flex flex-wrap gap-1 bg-white border border-gray-200 rounded-md shadow-lg p-2 w-44"
        >
          <button
            v-for="color in highlightColors"
            :key="color"
            type="button"
            @click="applyHighlight(color)"
            class="w-6 h-6 rounded-full border border-gray-300 hover:scale-110 transition-transform"
            :style="{ backgroundColor: color }"
          ></button>
          <button
            type="button"
            @click="applyHighlight(null)"
            class="w-6 h-6 rounded-full border border-gray-300 text-[10px] text-gray-500 hover:bg-gray-100"
            title="Remove highlight"
          >
            A
          </button>
        </div>
      </div>

      <span class="w-px h-5 bg-gray-300 mx-1"></span>

      <!-- History -->
      <button
        type="button"
        @click="editor.chain().focus().undo().run()"
        :disabled="!editor.can().undo()"
        class="px-2 py-1 rounded text-sm text-gray-600 hover:bg-gray-200 disabled:opacity-40"
        title="Undo"
      >
        &#8630;
      </button>
      <button
        type="button"
        @click="editor.chain().focus().redo().run()"
        :disabled="!editor.can().redo()"
        class="px-2 py-1 rounded text-sm text-gray-600 hover:bg-gray-200 disabled:opacity-40"
        title="Redo"
      >
        &#8631;
      </button>
    </div>

    <!-- Editor -->
    <EditorContent :editor="editor" class="bg-white" />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'

const props = defineProps({
  modelValue: {
    type: [Object, String, Array],
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

const btnClass = 'px-2 py-1 rounded text-sm text-gray-600 hover:bg-gray-200'
const activeBtnClass = 'px-2 py-1 rounded text-sm bg-indigo-600 text-white'

const textColors = [
  '#111827',
  '#ef4444',
  '#f97316',
  '#f59e0b',
  '#22c55e',
  '#10b981',
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#ec4899',
]

const highlightColors = [
  '#fef08a',
  '#fde68a',
  '#fed7aa',
  '#fecaca',
  '#bbf7d0',
  '#bfdbfe',
  '#ddd6fe',
  '#fbcfe8',
]

const showTextPalette = ref(false)
const showHighlightPalette = ref(false)

const editor = useEditor({
  content: props.modelValue || '',
  extensions: [StarterKit, TextStyle, Color, Highlight.configure({ multicolor: true })],
  editorProps: {
    attributes: {
      class: 'prose-editor focus:outline-none',
    },
  },
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getJSON())
  },
})

const currentHighlightColor = () => editor.value?.getAttributes('highlight').color || '#fef08a'

const applyTextColor = (color) => {
  showTextPalette.value = false
  if (!editor.value) return
  if (color) {
    editor.value.chain().focus().setColor(color).run()
  } else {
    editor.value.chain().focus().unsetColor().run()
  }
}

const applyHighlight = (color) => {
  showHighlightPalette.value = false
  if (!editor.value) return
  if (color) {
    editor.value.chain().focus().toggleHighlight({ color }).run()
  } else {
    editor.value.chain().focus().toggleHighlight().run()
  }
}

watch(
  () => props.modelValue,
  (value) => {
    if (!editor.value) return
    const next = value || ''
    if (JSON.stringify(editor.value.getJSON()) !== JSON.stringify(next)) {
      editor.value.commands.setContent(next)
    }
  },
)
</script>

<style>
.prose-editor {
  min-height: 240px;
  padding: 0.75rem 1rem;
  outline: none;
  color: #1f2937;
}
.prose-editor h1 {
  font-size: 1.875rem;
  font-weight: 700;
  margin: 1rem 0 0.5rem;
}
.prose-editor h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 1rem 0 0.5rem;
}
.prose-editor h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0.75rem 0 0.5rem;
}
.prose-editor p {
  margin: 0.5rem 0;
}
.prose-editor ul {
  list-style: disc;
  padding-left: 1.5rem;
  margin: 0.5rem 0;
}
.prose-editor ol {
  list-style: decimal;
  padding-left: 1.5rem;
  margin: 0.5rem 0;
}
.prose-editor blockquote {
  border-left: 4px solid #d1d5db;
  padding-left: 1rem;
  font-style: italic;
  color: #4b5563;
  margin: 0.5rem 0;
}
.prose-editor pre {
  background: #f3f4f6;
  padding: 0.75rem;
  border-radius: 0.375rem;
  margin: 0.5rem 0;
  overflow-x: auto;
}
.prose-editor code {
  background: #f3f4f6;
  padding: 0.1rem 0.25rem;
  border-radius: 0.25rem;
  font-family: ui-monospace, monospace;
}
.prose-editor a {
  color: #4f46e5;
  text-decoration: underline;
}
</style>
