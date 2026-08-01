<script>
import { h } from 'vue'

const renderChildren = (node) => (node?.content || []).map(renderNode).filter(Boolean)

const renderMarks = (text, marks) => {
  if (!marks || !marks.length) return text
  return marks.reduce((acc, mark) => {
    switch (mark.type) {
      case 'bold':
        return h('strong', { class: 'font-bold' }, acc)
      case 'italic':
        return h('em', acc)
      case 'strike':
        return h('s', acc)
      case 'underline':
        return h('u', acc)
      case 'code':
        return h('code', { class: 'bg-gray-100 px-1.5 py-0.5 rounded text-sm' }, acc)
      case 'link':
        return h(
          'a',
          {
            href: mark.attrs?.href,
            target: '_blank',
            rel: 'noopener noreferrer',
            class: 'text-indigo-600 hover:text-indigo-500 underline',
          },
          acc
        )
      case 'textStyle':
        return mark.attrs?.color
          ? h('span', { style: { color: mark.attrs.color } }, acc)
          : acc
      case 'highlight':
        return mark.attrs?.color
          ? h('mark', { style: { backgroundColor: mark.attrs.color } }, acc)
          : h('mark', { class: 'bg-yellow-200' }, acc)
      default:
        return acc
    }
  }, text)
}

const renderNode = (node) => {
  if (!node) return null

  switch (node.type) {
    case 'text':
      return renderMarks(node.text || '', node.marks)

    case 'paragraph':
      return h('p', { class: 'mb-4 leading-relaxed' }, renderChildren(node))

    case 'heading': {
      const level = Math.min(Math.max(node.attrs?.level || 2, 1), 6)
      const classes = {
        1: 'text-3xl font-bold mb-4 mt-8',
        2: 'text-2xl font-bold mb-3 mt-6',
        3: 'text-xl font-semibold mb-2 mt-5',
        4: 'text-lg font-semibold mb-2 mt-4',
      }
      return h(`h${level}`, { class: classes[level] || 'font-semibold mb-2 mt-4' }, renderChildren(node))
    }

    case 'blockquote':
      return h(
        'blockquote',
        { class: 'border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-4' },
        renderChildren(node)
      )

    case 'bulletList':
      return h('ul', { class: 'list-disc pl-6 mb-4 space-y-1' }, renderChildren(node))

    case 'orderedList':
      return h('ol', { class: 'list-decimal pl-6 mb-4 space-y-1' }, renderChildren(node))

    case 'listItem':
      return h('li', { class: 'leading-relaxed' }, renderChildren(node))

    case 'codeBlock':
      return h(
        'pre',
        { class: 'bg-gray-100 p-4 rounded-md overflow-x-auto mb-4 text-sm' },
        renderChildren(node)
      )

    case 'hardBreak':
      return h('br')

    case 'horizontalRule':
      return h('hr', { class: 'my-6 border-gray-200' })

    case 'image':
      return h('img', {
        src: node.attrs?.src,
        alt: node.attrs?.alt || '',
        class: 'rounded-lg my-4 max-w-full h-auto',
      })

    default:
      return renderChildren(node)
  }
}

export default {
  name: 'BlogContent',
  props: {
    content: {
      type: [Object, String, Array],
      default: null,
    },
  },
  render() {
    const content = this.content
    if (!content) return null

    // Plain string content -> split into paragraphs
    if (typeof content === 'string') {
      return h(
        'div',
        { class: 'blog-content' },
        content
          .split('\n')
          .filter((line) => line.trim())
          .map((line) => h('p', { class: 'mb-4 leading-relaxed' }, line))
      )
    }

    // Tiptap doc node
    if (content.type === 'doc' && content.content) {
      return h('div', { class: 'blog-content' }, renderChildren(content))
    }

    // Array of nodes
    if (Array.isArray(content)) {
      return h('div', { class: 'blog-content' }, content.map(renderNode).filter(Boolean))
    }

    // Single node
    return h('div', { class: 'blog-content' }, renderNode(content))
  },
}
</script>
