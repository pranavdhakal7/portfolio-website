# Guide: Integrating the Tripo3D Rabbit Model

## Overview
A new Rabbit3D component has been created that attempts to load a rabbit model from the Tripo3D URL you provided. However, the URL is a viewer page, not a direct download link. This guide provides specific steps to download the model and integrate it properly.

## Current Status
- ✅ Rabbit3D component created (`src/components/Rabbit3D.js`)
- ✅ Home.js updated to use the new component
- ⚠️ Model not yet loaded (needs actual GLB/GLTF file)

## Step 1: Download the Rabbit Model from Tripo3D

1. **Visit the Tripo3D URL:**
   - Go to: `https://studio.tripo3d.ai/3d-model/593cd2cb-9620-4324-86e8-5728d04d2846?invite_code=P43E6K`

2. **Export the model:**
   - Look for a "Download" or "Export" button on the page
   - If available, choose GLB or GLTF format (GLB is preferred)
   - Save the file as `rabbit.glb`

3. **If download is not available:**
   - Try these alternative sources:
     - **Sketchfab**: Search for "rabbit" (free, downloadable)
     - **TurboSquid**: Filter by "Free" and "GLB" format
     - **PolyPizza**: Free CC0 rabbit models

## Step 2: Place the Model in the Project

1. **Create the directory structure:**
   ```bash
   mkdir -p public/assets/3d
   ```

2. **Copy the downloaded model:**
   - Place `rabbit.glb` in `public/assets/3d/rabbit.glb`
   - The component will look for it at `/assets/3d/rabbit.glb`

## Step 3: Verify the Component Works

The Rabbit3D component (`src/components/Rabbit3D.js`) is already configured to:
- Try loading from the Tripo3D URL first
- Fall back to the local file (`/assets/3d/rabbit.glb`)
- Show interactive 3D viewer with orbit controls
- Include subtle animations and hover effects

## Step 4: Test the Integration

1. **Start the development server** (if not already running):
   ```bash
   npm start
   ```

2. **Check the browser:**
   - The 3D rabbit should appear in the hero section
   - You should be able to:
     - Drag to rotate
     - Scroll to zoom
     - Hover for bounce animation

## Step 5: Customize the Model (Optional)

If the model needs adjustments:

1. **Change scale or position:**
   - Edit `Rabbit3D.js`, line ~30: `scale={[0.8, 0.8, 0.8]}`
   - Edit `Rabbit3D.js`, line ~31: `position={[0, -0.5, 0]}`

2. **Adjust lighting:**
   - Modify ambient/point/spot light intensities in the component

3. **Change background:**
   - Edit the gradient in the container style (line ~70)

## Troubleshooting

### Model Not Loading
- **Check console for errors**: Look for 404 or CORS errors
- **Verify file path**: Ensure `rabbit.glb` is in `public/assets/3d/`
- **File format**: Ensure it's a valid GLB/GLTF file

### Performance Issues
- **Reduce polygon count**: Use a lower-poly model
- **Enable compression**: Consider Draco compression for GLB files
- **Reduce texture size**: Use smaller textures

### Component Not Displaying
- **Check dependencies**: Ensure packages are installed:
  ```bash
  npm install three @react-three/fiber @react-three/drei
  ```
- **Verify imports**: Check for any import errors in the console

## Alternative: Use a Different Model

If the Tripo3D model is not suitable, you can:

1. **Download from other sources** (see `3D_MODEL_SOURCES.md`)
2. **Update the component** to point to the new file:
   ```javascript
   const LOCAL_MODEL_PATH = '/assets/3d/your-new-model.glb';
   ```

## Component Features

The Rabbit3D component includes:
- ✅ Interactive orbit controls (rotate, zoom, pan)
- ✅ Hover animations
- ✅ Gentle floating/rotation
- ✅ Responsive design
- ✅ Error handling
- ✅ Loading fallback
- ✅ Attractive gradient background

## Notes

- The component will show a wireframe cube while loading
- If no model is found, it will show the loading fallback indefinitely
- All Three.js dependencies are already installed in the project
- The component is styled to fit within the existing hero circle design

## Need Help?

If you encounter issues:
1. Check the browser console for specific error messages
2. Verify the model file is accessible at `/assets/3d/rabbit.glb`
3. Try a different 3D model format (GLTF instead of GLB)
4. Reduce the model complexity if performance is poor

---

*Last updated: April 2026*