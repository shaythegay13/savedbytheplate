from typing import Optional, Dict, Any
from PIL import Image
import numpy as np


def analyze_garden_image(image_path: str) -> Dict[str, Any]:
    """
    Lightweight analysis of a garden space image using Pillow + NumPy.
    Heuristics:
    - Shade index: based on average brightness (0=dark, 1=bright)
    - Green index: proportion of pixels with G channel dominant -> vegetation proxy
    - Clutter/obstacles index: edge density from simple Sobel-like filter
    Returns a dict of metrics and human-readable notes.
    """
    try:
        img = Image.open(image_path).convert("RGB")
    except Exception as e:
        return {"error": f"Unable to open image: {e}"}

    # Resize to manageable size for speed
    img_small = img.resize((512, max(1, int(512 * img.height / img.width))))
    arr = np.asarray(img_small).astype(np.float32) / 255.0

    # Brightness (simple average of channels)
    brightness = arr.mean()

    # Green dominance
    r, g, b = arr[..., 0], arr[..., 1], arr[..., 2]
    green_mask = (g > r + 0.05) & (g > b + 0.05)
    green_index = float(green_mask.mean())

    # Edge density (simple gradient magnitude on grayscale)
    gray = (0.299 * r + 0.587 * g + 0.114 * b)
    # Simple kernels
    gx = np.zeros_like(gray)
    gy = np.zeros_like(gray)
    gx[:, 1:-1] = gray[:, 2:] - gray[:, :-2]
    gy[1:-1, :] = gray[2:, :] - gray[:-2, :]
    grad = np.sqrt(gx * gx + gy * gy)
    edge_density = float((grad > 0.15).mean())

    # Heuristic notes
    notes = []
    if brightness < 0.35:
        notes.append("Low brightness suggests significant shade; prioritize shade-tolerant crops.")
    elif brightness < 0.55:
        notes.append("Moderate brightness; partial sun likely in parts of the space.")
    else:
        notes.append("High brightness; likely good sun exposure in open areas.")

    if green_index > 0.20:
        notes.append("Noticeable vegetation present; consider existing plants and potential competition.")
    elif green_index < 0.05:
        notes.append("Little vegetation detected; expect to import soil/containers or prepare beds.")

    if edge_density > 0.10:
        notes.append("High visual complexity suggests obstacles/clutter; plan layout for clear access and airflow.")

    return {
        "brightness": round(brightness, 3),
        "green_index": round(green_index, 3),
        "edge_density": round(edge_density, 3),
        "notes": notes,
    }
