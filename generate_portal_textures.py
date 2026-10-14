import math
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance

# Dimensões de alta fidelidade
W, H = 2048, 512

# 1. TEXTURA DIFUSA (Albedo / Cor)
diffuse = Image.new("RGB", (W, H), (22, 28, 38))
draw = ImageDraw.Draw(diffuse)

# Base metálica escura com variação de painéis
panel_width = W // 16
for i in range(16):
    x0 = i * panel_width
    x1 = (i + 1) * panel_width - 4
    # Variação sutil de tom de liga metálica
    shade = 28 + (i % 3) * 6
    draw.rectangle([x0, 0, x1, H], fill=(shade, shade + 5, shade + 14))
    
    # Linha divisória de painel (sulco mecânico)
    draw.line([x1 + 1, 0, x1 + 1, H], fill=(8, 10, 16), width=3)

# Ranhuras horizontais e canais de ventilação
for y in [60, 120, 200, 312, 392, 452]:
    draw.line([0, y, W, y], fill=(12, 16, 24), width=4)
    # Rebites / parafusos industriais ao longo das ranhuras
    for x in range(20, W, 32):
        draw.ellipse([x - 2, y - 2, x + 2, y + 2], fill=(120, 140, 165), outline=(10, 15, 20))

# Grades de ventilação mecânicas (Grilles)
for i in range(16):
    gx = i * panel_width + 24
    gy = 140
    gw = panel_width - 48
    gh = 130
    draw.rectangle([gx, gy, gx + gw, gy + gh], fill=(14, 18, 26), outline=(40, 50, 68), width=2)
    # Lâminas da grade
    for vy in range(gy + 6, gy + gh - 4, 10):
        draw.line([gx + 4, vy, gx + gw - 4, vy], fill=(6, 8, 12), width=3)
        draw.line([gx + 4, vy + 3, gx + gw - 4, vy + 3], fill=(70, 85, 110), width=1)

# Listras de perigo (Hazard stripes) em placas seletivas
for i in [2, 6, 10, 14]:
    hx = i * panel_width + 16
    hy = 20
    for s in range(0, 80, 14):
        draw.polygon([(hx + s, hy), (hx + s + 8, hy), (hx + s - 6, hy + 28), (hx + s - 14, hy + 28)], fill=(210, 160, 20))

# Trilhos de energia de plasma ciano
draw.rectangle([0, 240, W, 272], fill=(10, 30, 48))
for x in range(0, W, 64):
    draw.rectangle([x + 10, 246, x + 54, 266], fill=(0, 220, 255))

# 2. MAPA DE RELEVO E NORMAL MAP (Height -> Normal)
height = Image.new("L", (W, H), 128)
hdraw = ImageDraw.Draw(height)

# Painéis em relevo
for i in range(16):
    x0 = i * panel_width
    x1 = (i + 1) * panel_width - 4
    hdraw.rectangle([x0, 0, x1, H], fill=145)
    hdraw.line([x1 + 1, 0, x1 + 3, H], fill=40, width=3)

# Ranhuras fundas
for y in [60, 120, 200, 312, 392, 452]:
    hdraw.line([0, y, W, y], fill=30, width=4)
    for x in range(20, W, 32):
        hdraw.ellipse([x - 2, y - 2, x + 2, y + 2], fill=220)

for i in range(16):
    gx = i * panel_width + 24
    gy = 140
    gw = panel_width - 48
    gh = 130
    hdraw.rectangle([gx, gy, gx + gw, gy + gh], fill=60)
    for vy in range(gy + 6, gy + gh - 4, 10):
        hdraw.line([gx + 4, vy, gx + gw - 4, vy], fill=15, width=3)

hdraw.rectangle([0, 240, W, 272], fill=50)

# Gerar Normal Map a partir do Height Map (Sobel filter aproximado)
h_pixels = height.load()
normal = Image.new("RGB", (W, H))
n_pixels = normal.load()

for y in range(H):
    y_prev = (y - 1) % H
    y_next = (y + 1) % H
    for x in range(W):
        x_prev = (x - 1) % W
        x_next = (x + 1) % W
        
        # Gradientes Sobel
        dx = (h_pixels[x_next, y] - h_pixels[x_prev, y]) / 255.0 * 2.5
        dy = (h_pixels[x, y_next] - h_pixels[x, y_prev]) / 255.0 * 2.5
        
        # Vetor normal normalizado
        nz = 1.0
        length = math.sqrt(dx * dx + dy * dy + nz * nz)
        nx = (-dx / length) * 0.5 + 0.5
        ny = (-dy / length) * 0.5 + 0.5
        norm_z = (nz / length) * 0.5 + 0.5
        
        n_pixels[x, y] = (int(nx * 255), int(ny * 255), int(norm_z * 255))

# 3. MAPA DE EMISSÃO (Luzes neon do anel mecânico)
emissive = Image.new("RGB", (W, H), (0, 0, 0))
edraw = ImageDraw.Draw(emissive)
# Trilho de plasma ciano brilhante
for x in range(0, W, 64):
    edraw.rectangle([x + 10, 246, x + 54, 266], fill=(0, 240, 255))
    # Marcadores de chevron
    edraw.polygon([(x + 20, 18), (x + 32, 28), (x + 44, 18), (x + 32, 38)], fill=(0, 200, 255))
    edraw.polygon([(x + 20, 470), (x + 32, 480), (x + 44, 470), (x + 32, 490)], fill=(0, 200, 255))

# 4. MAPA DE RUGOSIDADE (Roughness)
roughness = Image.new("L", (W, H), 120)
rdraw = ImageDraw.Draw(roughness)
# Rebites e metal polido com baixa rugosidade (alto brilho)
for y in [60, 120, 200, 312, 392, 452]:
    for x in range(20, W, 32):
        rdraw.ellipse([x - 2, y - 2, x + 2, y + 2], fill=30)
# Trilho neon é super liso (refletivo)
rdraw.rectangle([0, 240, W, 272], fill=40)

# Salvar texturas em public/textures/
import os
dest_dir = r"d:\API-GERAL\yvion-dashboard\public\textures"
os.makedirs(dest_dir, exist_ok=True)

diffuse.save(os.path.join(dest_dir, "portal_mech_diffuse.jpg"), "JPEG", quality=95)
normal.save(os.path.join(dest_dir, "portal_mech_normal.jpg"), "JPEG", quality=95)
emissive.save(os.path.join(dest_dir, "portal_mech_emissive.jpg"), "JPEG", quality=95)
roughness.save(os.path.join(dest_dir, "portal_mech_roughness.jpg"), "JPEG", quality=95)

print("Texturas mecânicas PBR AAA do portal geradas com sucesso!")
