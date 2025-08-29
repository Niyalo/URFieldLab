import time
import numpy as np
from PIL import Image
import moderngl

# --- Part 1: The Slow CPU (NumPy) Implementation ---
# This demonstrates the math and is useful for understanding the process.
# It iterates through every pixel of the output, finds its corresponding
# point on the input image, and copies the color.

def equirectangular_to_cubemap_cpu(equi_img, face_size):
    """
    Converts an equirectangular image to 6 cubemap faces using NumPy.
    Handles both RGB and RGBA images. Painfully slow.
    """
    in_width, in_height = equi_img.size
    equi_pixels = np.array(equi_img)
    
    # --- FIX: Detect number of channels ---
    if len(equi_pixels.shape) < 3 or equi_pixels.shape[2] not in [3, 4]:
        raise ValueError("Input image must be RGB or RGBA.")
    in_channels = equi_pixels.shape[2]
    out_mode = 'RGBA' if in_channels == 4 else 'RGB'
    
    pi = np.pi
    pi2 = np.pi * 2

    face_names = ["px", "nx", "py", "ny", "pz", "nz"]
    face_images = []

    print(f"Starting SLOW CPU conversion for 6 faces (Mode: {out_mode})...")
    
    for face_idx, face_name in enumerate(face_names):
        print(f"  - Processing face: {face_name} ({face_idx+1}/{len(face_names)})")
        
        # --- FIX: Create output array with correct number of channels ---
        face_pixels = np.zeros((face_size, face_size, in_channels), dtype=np.uint8)

        for i in range(face_size):
            for j in range(face_size):
                u = (2.0 * (i + 0.5) / face_size) - 1.0
                v = (2.0 * (j + 0.5) / face_size) - 1.0
                
                if face_idx == 0:   # +X
                    d = (1.0, -v, -u)
                elif face_idx == 1: # -X
                    d = (-1.0, -v, u)
                elif face_idx == 2: # +Y
                    d = (u, 1.0, v)
                elif face_idx == 3: # -Y
                    d = (u, -1.0, -v)
                elif face_idx == 4: # +Z
                    d = (u, -v, 1.0)
                elif face_idx == 5: # -Z
                    d = (-u, -v, -1.0)

                x, y, z = d
                norm = np.sqrt(x*x + y*y + z*z)
                x /= norm
                y /= norm
                z /= norm

                lon = np.arctan2(x, z)
                lat = np.arcsin(y)

                src_x = int(((lon + pi) / pi2) * (in_width - 1))
                src_y = int(((pi/2 - lat) / pi) * (in_height - 1))
                
                src_x = min(max(src_x, 0), in_width - 1)
                src_y = min(max(src_y, 0), in_height - 1)

                face_pixels[j, i] = equi_pixels[src_y, src_x]
        
        # --- FIX: Use correct mode when creating Pillow image ---
        face_images.append(Image.fromarray(face_pixels, out_mode))

    return face_images


# --- Part 2: The Fast GPU (ModernGL) Implementation ---
# This offloads the entire conversion process to the GPU using a compute shader.
# The shader code does the exact same math as the CPU version, but in massive parallel.

def equirectangular_to_cubemap_gpu(equi_img, face_size):
    """
    Converts an equirectangular image to 6 cubemap faces using a compute shader.
    Extremely fast.

    :param equi_img: Input equirectangular image (Pillow Image).
    :param face_size: The width and height of each square cubemap face.
    :return: A list of 6 Pillow Images for each face (+X, -X, +Y, -Y, +Z, -Z).
    """
    print(f"\nStarting FAST GPU conversion...")

    # Create a headless ModernGL context
    ctx = moderngl.create_standalone_context()

    # GLSL code for the compute shader
    # This code will be executed for every pixel on the output texture
    compute_shader_glsl = """
    #version 430

    // Define the size of the workgroup. 16x16 is a good default.
    layout (local_size_x = 16, local_size_y = 16, local_size_z = 1) in;

    // Input equirectangular texture (read-only)
    layout (binding = 0, rgba8) uniform readonly image2D source_texture;
    
    // Output cubemap face texture (write-only)
    layout (binding = 1, rgba8) uniform writeonly image2D dest_texture;

    // Uniforms passed from Python
    uniform int face_id; // 0:+X, 1:-X, 2:+Y, 3:-Y, 4:+Z, 5:-Z
    uniform int face_size;

    const float PI = 3.14159265359;

    void main() {
        // Get the pixel coordinates for this shader invocation
        ivec2 pixel_coords = ivec2(gl_GlobalInvocationID.xy);
        
        // Ensure we don't write outside the image boundaries
        if (pixel_coords.x >= face_size || pixel_coords.y >= face_size) {
            return;
        }

        // 1. Convert pixel coordinates to normalized [-1, 1]
        vec2 uv = (vec2(pixel_coords) + 0.5) / float(face_size);
        vec2 st = uv * 2.0 - 1.0;

        // 2. Determine 3D direction vector based on face
        vec3 dir;
        if (face_id == 0) {         // +X
            dir = normalize(vec3(1.0, -st.y, -st.x));
        } else if (face_id == 1) {  // -X
            dir = normalize(vec3(-1.0, -st.y, st.x));
        } else if (face_id == 2) {  // +Y
            dir = normalize(vec3(st.x, 1.0, st.y));
        } else if (face_id == 3) {  // -Y
            dir = normalize(vec3(st.x, -1.0, -st.y));
        } else if (face_id == 4) {  // +Z
            dir = normalize(vec3(st.x, -st.y, 1.0));
        } else {                    // -Z
            dir = normalize(vec3(-st.x, -st.y, -1.0));
        }

        // 3. Convert 3D vector to spherical coordinates
        float lon = atan(dir.x, dir.z);
        float lat = asin(dir.y);

        // 4. Map spherical coordinates to equirectangular texture coordinates
        ivec2 source_dims = imageSize(source_texture);
        float src_x = (lon + PI) / (2.0 * PI) * float(source_dims.x);
        float src_y = (PI / 2.0 - lat) / PI * float(source_dims.y);
        
        ivec2 src_coords = ivec2(int(src_x), int(src_y));
        
        // 5. Sample the color and write to the output texture
        vec4 color = imageLoad(source_texture, src_coords);
        imageStore(dest_texture, pixel_coords, color);
    }
    """

    # Compile the compute shader
    compute_shader = ctx.compute_shader(compute_shader_glsl)

    # Create the source texture from the Pillow image
    source_texture = ctx.texture(equi_img.size, 3, equi_img.convert("RGB").tobytes())
    source_texture.bind_to_image(0, read=True, write=False)

    face_names = ["px", "nx", "py", "ny", "pz", "nz"]
    face_images = []

    for i, name in enumerate(face_names):
        print(f"  - Processing face: {name} ({i+1}/{len(face_names)})")
        
        # Create a destination texture for the cubemap face
        dest_texture = ctx.texture((face_size, face_size), 4, dtype='f1') # RGBA
        dest_texture.bind_to_image(1, read=False, write=True)

        # Set the uniforms
        compute_shader['face_id'] = i
        compute_shader['face_size'] = face_size

        # Calculate the number of workgroups to dispatch
        group_size = 16
        work_groups_x = (face_size + group_size - 1) // group_size
        work_groups_y = (face_size + group_size - 1) // group_size

        # Run the shader
        compute_shader.run(group_x=work_groups_x, group_y=work_groups_y)

        # Read the result back from the GPU to a Pillow image
        #face_img = Image.frombytes('RGB', dest_texture.size, dest_texture.read(components=3))
                # 1. Read the full RGBA data from the 4-component texture
        raw_data = dest_texture.read()
        # 2. Create an RGBA Pillow image from the raw data
        face_img_rgba = Image.frombytes('RGBA', dest_texture.size, raw_data)
        # 3. Convert it to RGB for saving (removes the alpha channel)
        face_img = face_img_rgba.convert('RGB')

        face_images.append(face_img)
    
    return face_images


# --- Part 3: Helper function to generate a test image ---
def create_test_equirectangular(width, height):
    """Creates a test image with gradients and text to verify orientation."""
    print(f"Generating a test equirectangular image ({width}x{height})...")
    
    # Use floating point array for smooth gradients
    arr = np.zeros((height, width, 3), dtype=np.float32)
    
    # Longitude gradient (Red)
    x_grad = np.linspace(0, 255, width, dtype=np.float32)
    arr[:, :, 0] = x_grad[np.newaxis, :]
    
    # Latitude gradient (Green)
    y_grad = np.linspace(0, 255, height, dtype=np.float32)
    arr[:, :, 1] = y_grad[:, np.newaxis]
    
    # Convert to uint8 for Pillow
    arr = arr.astype(np.uint8)
    img = Image.fromarray(arr, 'RGB')
    
    # Add text to make orientation obvious (requires Pillow with freetype support)
    try:
        from PIL import ImageDraw, ImageFont
        draw = ImageDraw.Draw(img)
        font_size = width // 30
        try:
            font = ImageFont.truetype("arial.ttf", font_size)
        except IOError:
            font = ImageFont.load_default()

        labels = {
            "FRONT (+Z)": (0.5, 0.5),
            "BACK (-Z)": (0.0, 0.5), # Back wraps around
            "LEFT (-X)": (0.25, 0.5),
            "RIGHT (+X)": (0.75, 0.5),
            "TOP (+Y)": (0.5, 0.05),
            "BOTTOM (-Y)": (0.5, 0.9),
        }
        for text, (lon_frac, lat_frac) in labels.items():
            pos_x = int(width * lon_frac)
            pos_y = int(height * lat_frac)
            draw.text((pos_x, pos_y), text, font=font, fill=(255, 255, 255), anchor="mm")

    except ImportError:
        print("Pillow's drawing capabilities not fully available. Skipping text labels.")

    return img


# --- Main execution block ---
if __name__ == '__main__':
    # Configuration
    EQUI_WIDTH = 1536
    EQUI_HEIGHT = 1024
    FACE_SIZE = 512 # Standard resolution for a cubemap face
    
    # Generate or load your equirectangular image
    input_filename = "albedo transparent.png"
    try:
        equi_img = Image.open(input_filename)
        print(f"Loaded existing test image: {input_filename}")
    except FileNotFoundError:
        equi_img = create_test_equirectangular(EQUI_WIDTH, EQUI_HEIGHT)
        equi_img.save(input_filename)
        print(f"Saved new test image to: {input_filename}")

     # --- Run and time the GPU version ---
    start_time_gpu = time.time()
    gpu_faces = equirectangular_to_cubemap_gpu(equi_img, FACE_SIZE)
    end_time_gpu = time.time()
    
    print(f"GPU conversion finished in: {end_time_gpu - start_time_gpu:.4f} seconds")
    
    face_names = ["px", "nx", "py", "ny", "pz", "nz"]
    for name, img in zip(face_names, gpu_faces):
        filename = f"cubemap_face_{name}_gpu.png"
        img.save(filename)
        print(f"  - Saved {filename}")

    print("\n" + "="*50 + "\n")

    # --- Run and time the CPU version (optional, can be slow) ---
    run_cpu_version = True # Set to False to skip the slow version
    if run_cpu_version:
        start_time_cpu = time.time()
        cpu_faces = equirectangular_to_cubemap_cpu(equi_img, FACE_SIZE)
        end_time_cpu = time.time()

        print(f"\nCPU conversion finished in: {end_time_cpu - start_time_cpu:.4f} seconds")

        for name, img in zip(face_names, cpu_faces):
            filename = f"cubemap_face_{name}_cpu.png"
            img.save(filename)
            print(f"  - Saved {filename}")
        
        # Final comparison
        print("\n--- Performance Comparison ---")
        print(f"CPU Time: {end_time_cpu - start_time_cpu:.4f} seconds")
        print(f"GPU Time: {end_time_gpu - start_time_gpu:.4f} seconds")
        print(f"GPU was approximately { (end_time_cpu - start_time_cpu) / (end_time_gpu - start_time_gpu) :.1f}x faster.")
    else:
        print("Skipped slow CPU version.")