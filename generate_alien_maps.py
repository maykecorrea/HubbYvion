from PIL import Image, ImageEnhance, ImageFilter

# Carregar a textura colorida do planeta alienígena
src_path = r"d:\API-GERAL\yvion-dashboard\public\textures\alien_sister_planet.jpg"
im = Image.open(src_path)
w, h = im.size

# Criar mapa de emissão (Bioluminescência noturna das espinhas do dino, raízes e cidades)
# Extraímos regiões com alto brilho em ciano e verde e eliminamos o mar roxo escuro
emissive = Image.new("L", (w, h))
src_pixels = im.load()
em_pixels = emissive.load()

for y in range(h):
    for x in range(w):
        r, g, b = src_pixels[x, y]
        # Cyber-dino spine (cyan/blue: b high, g medium-high, r low)
        # Neon city lines & trees (g high, b high)
        # Ouro/fogo (r high, g high, b low)
        brightness = (r * 0.2 + g * 0.5 + b * 0.3)
        # Se for brilhante (linhas neon ou espinha fóssil)
        if brightness > 140:
            val = int(min(255, (brightness - 140) * 2.2))
        else:
            val = 0
        em_pixels[x, y] = val

# Suavizar levemente o mapa de emissão para criar um glow natural
emissive = emissive.filter(ImageFilter.GaussianBlur(1.2))
emissive_path = r"d:\API-GERAL\yvion-dashboard\public\textures\alien_sister_planet_emissive.jpg"
emissive.save(emissive_path, "JPEG", quality=90)
print(f"Emissive map salvo: {emissive_path}")

# Criar mapa de relevo / bump (montanhas, ossadas e arranha-céus em alto relevo)
bump = im.convert("L")
enhancer = ImageEnhance.Contrast(bump)
bump = enhancer.enhance(1.6)
bump = bump.filter(ImageFilter.EDGE_ENHANCE)
bump_path = r"d:\API-GERAL\yvion-dashboard\public\textures\alien_sister_planet_bump.jpg"
bump.save(bump_path, "JPEG", quality=90)
print(f"Bump map salvo: {bump_path}")
