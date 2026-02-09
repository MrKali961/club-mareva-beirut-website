# Component Usage Guide

## Story Section

Full-width section with parallax background, animated text reveal, and decorative gold lines.

### Import
```tsx
import Story from '@/components/sections/Story';
```

### Usage
```tsx
<Story />
```

### Features
- Parallax scrolling background effect
- Staggered word-by-word text animation on scroll
- Animated gold decorative lines
- Dark overlay with gradient for readability
- Noise texture overlay for depth
- Responsive typography (4xl -> 6xl)

### Placeholder Image
The component expects a background image at:
`/public/images/cigar-closeup.jpg`

Replace this with an actual cigar close-up photograph for production.

---

## Amenities Grid

Responsive grid showcasing six amenities with icons, hover effects, and staggered animations.

### Import
```tsx
import Amenities from '@/components/sections/Amenities';
```

### Usage
```tsx
<Amenities />
```

### Features
- Responsive grid: 3 columns (desktop) -> 2 columns (tablet) -> 1 column (mobile)
- Staggered fade-in animations (100ms delay between cards)
- Hover effects: lift, gold border, icon scale/rotate, glow
- Lucide React icons
- Subtle noise texture on cards
- Corner accent animation on hover

### Amenities Included
1. Premium Humidor - Spanish cedar storage
2. Open Lounge - Social atmosphere
3. Private Lounge - Exclusive experiences
4. Specialty Bar - Rare spirits
5. Accessories - Premium cigar accessories
6. Pipes Collection - Curated selection

---

## Example Page Implementation

```tsx
import Story from '@/components/sections/Story';
import Amenities from '@/components/sections/Amenities';

export default function HomePage() {
  return (
    <main>
      {/* Other sections */}
      <Story />
      <Amenities />
      {/* Other sections */}
    </main>
  );
}
```

---

## Color Palette Used

- Black: `#0A0A0A` (bg-black)
- Dark Black: `#1A1A1A` (bg-black-800)
- Gold: `#C9A227` (text-gold, border-gold)
- Cream: `#F5F5F0` (text-cream)
- Green Dark: `#003018` (bg-green-dark)

## Typography

- Display Font: Playfair Display (font-playfair)
- Body Font: Inter (font-playfair)

## Animations

Both components use Framer Motion for smooth, professional animations:
- Scroll-triggered reveals
- Staggered element animations
- Hover micro-interactions
- Parallax effects
