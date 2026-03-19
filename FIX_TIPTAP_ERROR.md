# Fix TipTap Error - RichTextEditor Update

## Vấn đề
```
Failed to resolve entry for package "@tiptap/react". 
The package may have incorrect main/module/exports specified in its package.json.
```

TipTap packages không tương thích với Vite trong môi trường Figma Make.

## Giải pháp

### 1. Thay thế RichTextEditor
Đã thay thế TipTap-based editor bằng custom editor sử dụng `contentEditable` API.

**File cập nhật**: `/src/app/components/crm/RichTextEditor.tsx`

### 2. Xóa TipTap packages
Đã xóa các packages sau khỏi `package.json`:
- `@tiptap/react`
- `@tiptap/starter-kit`
- `@tiptap/extension-link`
- `@tiptap/extension-image`
- `@tiptap/extension-placeholder`

### 3. Features mới của RichTextEditor

#### Toolbar Buttons
- **Text Formatting**: Bold, Italic, Underline
- **Headings**: H1, H2
- **Lists**: Bullet list, Numbered list
- **Links**: Insert hyperlinks với popover
- **History**: Undo, Redo

#### Props (giữ nguyên API)
```typescript
interface RichTextEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  minHeight?: number;
  maxHeight?: number;
  showToolbar?: boolean;
  className?: string;
  editorClassName?: string;
}
```

#### Technical Implementation
- **contentEditable**: Native browser API
- **document.execCommand**: Formatting commands
- **Paste handling**: Plain text only
- **Link insertion**: Popover với input
- **Styling**: Tailwind + shadcn/ui components

### 4. Benefits

✅ **No external dependencies**: Sử dụng native browser APIs
✅ **Lighter bundle**: Không cần TipTap (~ 200KB saved)
✅ **Compatible**: Hoạt động tốt với Vite
✅ **Same API**: Không cần thay đổi usage code
✅ **Features**: Đủ cho CRM use cases

### 5. Limitations

So với TipTap:
- ❌ Không có advanced features (tables, mentions, etc.)
- ❌ Không có collaborative editing
- ❌ Không có markdown shortcuts
- ❌ Styling đơn giản hơn

Nhưng đủ cho:
- ✅ Email templates
- ✅ Notes và comments
- ✅ Rich descriptions
- ✅ Basic formatting needs

### 6. Usage Example

```typescript
// Unchanged - same as before
<RichTextEditor
  value={content}
  onChange={setContent}
  placeholder="Write something amazing..."
  minHeight={300}
  showToolbar={true}
/>
```

### 7. Browser Support

Sử dụng các APIs được support rộng rãi:
- contentEditable: All modern browsers
- document.execCommand: All browsers (deprecated nhưng vẫn hoạt động)
- Alternative: Có thể upgrade lên [Lexical](https://lexical.dev/) nếu cần

### 8. Testing

Để test RichTextEditor:
1. Navigate to `/showcase/forms`
2. Click vào "RichText" tab
3. Test các formatting buttons
4. Test insert link
5. Test paste content

## Kết luận

Lỗi đã được fix bằng cách thay thế TipTap với custom implementation. RichTextEditor mới:
- Nhẹ hơn và tương thích hơn
- Giữ nguyên API interface
- Đủ features cho CRM use cases
- Hoạt động tốt trong môi trường Figma Make

## Next Steps (Optional)

Nếu cần advanced features sau này:
1. **Lexical by Meta**: Modern, extensible editor
2. **Slate**: Customizable framework
3. **Quill**: Battle-tested editor
4. **ProseMirror**: Low-level toolkit

Nhưng hiện tại custom editor đủ cho requirements.
