# Media Assets Guide

This document explains where to place your photos and book covers for the gallery and library pages.

## 📁 Folder Structure

```
public/
├── photos/          # Gallery photos
│   ├── travel/      # Travel photoset
│   ├── work/        # Work & Projects photoset
│   ├── urban/       # Urban Exploration photoset
│   ├── nature/      # Nature & Landscapes photoset
│   └── misc/        # Miscellaneous photoset
└── books/           # Book covers for library
```

---

## 📸 Gallery Photos

### Location
Place your photos in the corresponding photoset folders:

- **Travel photos**: `public/photos/travel/`
- **Work photos**: `public/photos/work/`
- **Urban photos**: `public/photos/urban/`
- **Nature photos**: `public/photos/nature/`
- **Misc photos**: `public/photos/misc/`

### File Naming
Use descriptive names:
- `beach-sunset.jpg`
- `mountain-view.jpg`
- `city-street.jpg`

### Supported Formats
- `.jpg` / `.jpeg`
- `.png`
- `.webp`

### After Adding Photos
Update the photoset data in:
- `src/pages/gallery/[slug].astro` (lines 10-40)

Example:
```typescript
travel: {
  title: "Travel",
  description: "Photos from various trips...",
  photos: [
    { src: "/photos/travel/beach-sunset.jpg", alt: "Beach sunset" },
    { src: "/photos/travel/mountain-view.jpg", alt: "Mountain view" },
  ]
}
```

---

## 📚 Book Covers

### Location
Place book cover images in: `public/books/`

### File Naming
Use lowercase with hyphens:
- `be-seen.jpg`
- `supercommunicators.jpg`
- `spinning-magnet.jpg`

### Recommended Size
- Width: 400-600px
- Aspect ratio: 2:3 (book cover proportions)

### After Adding Covers
Update the books array in:
- `src/pages/library.astro` (lines 8-95)

Example:
```typescript
{
  title: "BE SEEN",
  author: "Jen Gottlieb",
  status: "reading",
  progress: 40,
  cover: "/books/be-seen.jpg"  // Add this line
}
```

---

## 🔄 Quick Reference

| Content Type | Location | Update File |
|--------------|----------|-------------|
| Gallery Photos | `public/photos/{photoset}/` | `src/pages/gallery/[slug].astro` |
| Book Covers | `public/books/` | `src/pages/library.astro` |

---

## ✅ Next Steps

1. **Add your photos** to the appropriate folders
2. **Update the data files** with the correct paths
3. **Test the pages** to ensure images display correctly
4. **Optimize images** for web (compress if needed)

All folders are ready for your content!
