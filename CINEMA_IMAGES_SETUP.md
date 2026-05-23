# Cinema Images Setup Guide

## Current Status
✅ Cinema management in admin panel is complete
✅ 6 cinemas are seeded in database with placeholder images
⏳ Need to add actual cinema images

## Cinemas That Need Images

1. **QFX Labim Mall** - Labim Mall, Pulchowk
2. **QFX Civil Mall** - Civil Mall, Sundhara
3. **QFX Jai Nepal** - Jai Nepal Hall, Jamal
4. **Fcube Cinemas** - Bhaktapur
5. **Big Movies** - Bhaktapur
6. **Gopi Krishna Movies** - Jamal, Kathmandu

## Steps to Add Cinema Images

### Option 1: Upload Images and Use Script (Recommended)

1. **Collect cinema images** (exterior photos, logos, or promotional images)
   - Save them with these names:
     - `qfx-labim.jpg`
     - `qfx-civil.jpg`
     - `qfx-jainepal.jpg`
     - `fcube.jpg`
     - `bigmovies.jpg`
     - `gopikrishna.jpg`

2. **Upload to assets folder**
   ```
   frontend/src/assets/
   ```

3. **Run the update script**
   ```bash
   cd backend
   node updateCinemaImages.js
   ```

4. **Verify in admin panel**
   - Go to Admin Dashboard → Cinemas
   - Check that all cinema images are displaying correctly

### Option 2: Manual Update via Admin Panel

1. Go to Admin Dashboard → Cinemas
2. Click "Edit" on each cinema
3. Update the "Image URL" field with the local path:
   - Format: `/src/assets/cinema-name.jpg`
4. Click "Update Cinema"

### Option 3: Use External URLs

If you prefer to use external image URLs (like from cinema websites):
1. Find high-quality images online
2. Use the admin panel to edit each cinema
3. Update the "Image URL" field with the external URL
4. Click "Update Cinema"

## Image Requirements

- **Format**: JPG, PNG, or WebP
- **Size**: Recommended 800x600px or similar aspect ratio
- **Quality**: High resolution for professional appearance
- **Content**: Cinema exterior, lobby, or official branding

## Current Image Paths in Database

All cinemas currently use placeholder images from Unsplash:
```
https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800
```

## After Adding Images

The cinema cards will display:
- Cinema image (160px height)
- Cinema name and location
- Rating with stars
- Distance from center
- Amenities badges
- Contact information
- "View Details" button

## Notes

- Images are displayed in both:
  - User-facing Cinemas page (`/cinemas`)
  - Admin Dashboard cinema management
- Make sure image paths are correct and accessible
- Test on both pages after updating
