document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Initialize the Canvas (1000x1000 for high-res Twitter/X PFPs)
    const canvas = new fabric.Canvas('meme-canvas', {
        width: 1000,
        height: 1000,
        backgroundColor: '#1a2e23', // Default Ghibli moss color
        preserveObjectStacking: true // Prevents selected items from jumping to the absolute front automatically
    });

    // Make the canvas fit responsive screens visually, while keeping export at 1000x1000
    function resizeCanvas() {
        const outerEl = document.querySelector('.canvas-container-glass');
        if (!outerEl) return;
        
        const newWidth = outerEl.clientWidth; // clientWidth ignores borders and focuses on pure width
        const scale = newWidth / 1000;
        
        canvas.setDimensions({ width: newWidth, height: newWidth });
        canvas.setViewportTransform([scale, 0, 0, scale, 0, 0]);
        canvas.renderAll();
    }
    
    window.addEventListener('resize', resizeCanvas);
    
    // Slight delay on init guarantees the CSS grid is fully rendered before math happens
    setTimeout(resizeCanvas, 100);

    // 2. Background Color Controls
    window.setBackgroundColor = function(color) {
        canvas.setBackgroundImage(null, canvas.renderAll.bind(canvas)); // Clear image bg
        canvas.backgroundColor = color;
        canvas.renderAll();
    }

    // 3. Add Preset Assets (Cat, Halo, etc)
    window.addAsset = function(url) {
        fabric.Image.fromURL(url, function(img) {
            // Scale down huge images a bit so they fit on screen nicely
            if (img.width > 800) img.scaleToWidth(800);
            
            img.set({
                left: 500, // Center X
                top: 500,  // Center Y
                originX: 'center',
                originY: 'center',
                transparentCorners: false,
                cornerColor: '#8be9fd',
                borderColor: '#8be9fd',
                cornerSize: 12,
                padding: 10
            });
            canvas.add(img);
            canvas.setActiveObject(img);
        });
    }

    // 4. Universal Image Uploader Logic
    function handleImageUpload(e, isBackground = false) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(f) {
            const data = f.target.result;
            fabric.Image.fromURL(data, function(img) {
                if (isBackground) {
                    // Make image cover the background perfectly
                    const scale = Math.max(1000 / img.width, 1000 / img.height);
                    img.set({ originX: 'center', originY: 'center', left: 500, top: 500, scaleX: scale, scaleY: scale });
                    canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
                } else {
                    // Add as a drag-and-drop prop
                    if (img.width > 800) img.scaleToWidth(800);
                    img.set({ left: 500, top: 500, originX: 'center', originY: 'center', cornerColor: '#8be9fd', borderColor: '#8be9fd', transparentCorners: false });
                    canvas.add(img);
                    canvas.setActiveObject(img);
                }
            });
        };
        reader.readAsDataURL(file);
        e.target.value = ''; // Reset input so you can upload the same image again if needed
    }

    // Attach listeners to the hidden file inputs
    document.getElementById('upload-bg').addEventListener('change', (e) => handleImageUpload(e, true));
    document.getElementById('upload-base').addEventListener('change', (e) => handleImageUpload(e, false));
    document.getElementById('upload-prop').addEventListener('change', (e) => handleImageUpload(e, false));

    // 5. Layer Controls (Delete & Bring Forward)
    document.getElementById('delete-btn').addEventListener('click', () => {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            canvas.remove(activeObject);
            canvas.discardActiveObject();
        }
    });

    // Also allow the "Delete" or "Backspace" key on the keyboard to work
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Delete' || e.key === 'Backspace') {
            const activeObject = canvas.getActiveObject();
            if (activeObject) {
                canvas.remove(activeObject);
                canvas.discardActiveObject();
            }
        }
    });

    document.getElementById('bring-front-btn').addEventListener('click', () => {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            canvas.bringToFront(activeObject);
            canvas.discardActiveObject(); // deselects to force visual update
            canvas.setActiveObject(activeObject); // reselects
        }
    });

    // 6. Download the Masterpiece
    document.getElementById('download-btn').addEventListener('click', () => {
        canvas.discardActiveObject(); // Deselect everything so bounding boxes don't show in the download
        canvas.renderAll();
        
        // Export at exactly 1000x1000 regardless of screen size
        const dataURL = canvas.toDataURL({
            format: 'png',
            quality: 1,
            multiplier: 1000 / canvas.width // Forces high-res output
        });
        
        const link = document.createElement('a');
        link.download = 'CWAT-Anomaly.png';
        link.href = dataURL;
        link.click();
    });
});