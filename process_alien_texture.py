import math
from PIL import Image, ImageFilter, ImageEnhance

# Caminho da imagem fonte de alta fidelidade
src_path = r"C:\Users\caabelo\.gemini\antigravity\brain\2585f631-d043-4943-9de3-9541bcec7d6f\alien_world_dino_cyber_abstract_1791585128088.jpg"
im = Image.open(src_path)
w, h = im.size

# Recortar a parte da superfície (evitar o vácuo preto no topo)
# O terreno com os dinossauros titânicos, cidades cyber e florestas espirais está entre y=50 e y=h
crop_box = (0, 40, w, h)
terrain = im.crop(crop_box)
tw, th = terrain.size

# Queremos um mapa equirretangular de proporção 2:1 (ex: 2048 x 1024)
TARGET_W = 2048
TARGET_H = 1024

# Redimensionar para cobrir uma boa parte
terrain_resized = terrain.resize((TARGET_W, TARGET_H), Image.Resampling.LANCZOS)

# Criar versão espelhada horizontal para blend perfeito e continuidade global
terrain_flipped = terrain_resized.transpose(Image.FLIP_LEFT_RIGHT)

# Fazer blend suave entre as metades esquerda e direita para eliminar costuras (seamless 360)
out = Image.new("RGB", (TARGET_W, TARGET_H))
pixels_a = terrain_resized.load()
pixels_b = terrain_flipped.load()
pixels_out = out.load()

blend_width = int(TARGET_W * 0.15) # 15% de transição suave nas bordas

for y in range(TARGET_H):
    for x in range(TARGET_W):
        # Peso da costura nas bordas esquerda/direita
        if x < blend_width:
            alpha = 0.5 * (1.0 - math.cos(math.pi * x / blend_width))
            # interpolação entre a borda direita e esquerda
            r = int(pixels_a[x, y][0] * alpha + pixels_a[TARGET_W - 1 - (blend_width - x), y][0] * (1 - alpha))
            g = int(pixels_a[x, y][1] * alpha + pixels_a[TARGET_W - 1 - (blend_width - x), y][1] * (1 - alpha))
            b = int(pixels_a[x, y][2] * alpha + pixels_a[TARGET_W - 1 - (blend_width - x), y][2] * (1 - alpha))
            pixels_out[x, y] = (r, g, b)
        else:
            pixels_out[x, y] = pixels_a[x, y]

# Realçar saturação e contraste para padrão cinema / Unreal Engine
enhancer_color = ImageEnhance.Color(out)
out = enhancer_color.enhance(1.25)

enhancer_contrast = ImageEnhance.Contrast(out)
out = enhancer_contrast.enhance(1.15)

enhancer_sharp = ImageEnhance.Sharpness(out)
out = enhancer_sharp.enhance(1.3)

dest_path = r"d:\API-GERAL\yvion-dashboard\public\textures\alien_sister_planet.jpg"
out.save(dest_path, "JPEG", quality=95)
print(f"Salvo com sucesso em {dest_path} ({TARGET_W}x{TARGET_H})")
