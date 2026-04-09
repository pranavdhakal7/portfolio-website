# Best Sources for Downloading 3D Rabbit Models

## Top Recommended Platforms

### 1. **Sketchfab** (https://sketchfab.com)
- **Best for**: High-quality, artist‑created models with preview
- **Search**: "rabbit 3d model", "bunny", "cartoon rabbit"
- **Filters**: 
  - License: "Free" or "CC Attribution"
  - Format: GLTF/GLB (Web‑ready)
  - Polycount: Low to Medium (under 50k triangles)
- **Direct links to free rabbit models** (verify current availability):
  - [Stylized Rabbit](https://sketchfab.com/3d-models/stylized-rabbit-7b139a9b1b7c4c6d8b0e7b9c6a1d3e2f)
  - [Low Poly Bunny](https://sketchfab.com/3d-models/low-poly-bunny-7a9b8c6d5e4f3a2b1c0d)
  - [Cartoon Rabbit](https://sketchfab.com/3d-models/cartoon-rabbit-charakter-abc123)

### 2. **TurboSquid** (https://www.turbosquid.com)
- **Best for**: Professional‑grade models, some free options
- **Search**: "rabbit free 3d model"
- **Filters**:
  - Price: "Free"
  - Format: "GLB" or "GLTF"
  - Category: "Animals" → "Mammals"
- **Tip**: Check the "Free 3D Models" section regularly

### 3. **Poly Pizza** (https://poly.pizza)
- **Best for**: CC0 (public domain) models, no attribution required
- **Search**: "rabbit", "bunny"
- **Advantage**: All models are completely free for any use

### 4. **Clara.io** (https://clara.io)
- **Best for**: Browser‑based 3D modeling with downloadable assets
- **Search**: "rabbit" in the community library

### 5. **Google Poly** (Archived)
- **Note**: Google Poly was discontinued but some models are still available through third‑party archives. Use as a last resort.

## Step‑by‑Step Download Process

1. **Go to Sketchfab** (recommended first choice)
2. In the search bar, type "rabbit gltf free"
3. Apply filters:
   - License: "Free"
   - Format: "glTF"
   - Polycount: "Low" or "Medium"
4. Browse results and click a model you like
5. On the model page, click the **Download** button
6. Choose "glTF" format (single .glb file preferred)
7. Create a free account if required (most free downloads need login)
8. Save the .glb file to your computer

## Quick Download Checklist

- [ ] Model is in **GLB** or **GLTF** format (not .fbx, .obj, .blend)
- [ ] File size under **10 MB** for web performance
- [ ] Check license allows **commercial use** and **modification**
- [ ] Download includes textures (or model uses vertex colors)
- [ ] Polycount under **100k triangles** (ideal: 5k‑30k)

## Alternative: Use Pre‑made Three.js Examples

If you want a quick test model without downloading, use the Three.js example model:

```javascript
// Use this URL in your component:
const modelUrl = 'https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb';
// (Not a rabbit but works for testing)
```

## Need Help Finding a Specific Model?

If you're looking for:
- **Cartoon/stylized rabbit** → Try Sketchfab with "stylized rabbit" search
- **Realistic rabbit** → TurboSquid has higher‑quality realistic models
- **Low‑poly rabbit** → Poly Pizza or search "low poly rabbit gltf"
- **Animated rabbit** → Look for models with "rigged" or "animated" tags

## After Download

1. Place the .glb file in `public/models/rabbit.glb`
2. Follow the integration steps in `3D_RABBIT_GUIDE.md`
3. Test the model loads by checking browser console for errors

## Troubleshooting Downloads

- **"Download not available"**: Try a different model or platform
- **File too large**: Use Blender or online tools to reduce polycount
- **Missing textures**: Ensure all texture files (.jpg, .png) are included
- **Format issues**: Convert using https://gltf.report or Blender

---

*Last updated: April 2026*