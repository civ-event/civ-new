#!/usr/bin/env python3
"""生成转盘资产：完整奖品盘面一体旋转，仅 GO/指针/底座固定。"""

from __future__ import annotations

import math
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'src/assets/images/zhuanpanhuo-c6f5b3.png')
OUT = os.path.join(ROOT, 'src/assets/images')

PIVOT_X = 1092
PIVOT_Y = 470
HUB_R = 98
CLIP_R = 418
CHAR_SHIFT_X = 20
CHAR_MAX_X = 710
CHAR_RING_MAX_X = 676


def is_prize_segment(px: tuple[int, int, int, int]) -> bool:
    r, g, b, a = px
    if a < 80:
        return False
    if r > 200 and g > 140 and b < 130:
        return True
    if r > 240 and g > 175 and b < 220:
        return True
    return False


def is_fixed_pointer(x: int, y: int) -> bool:
    radius = math.hypot(x - PIVOT_X, y - PIVOT_Y)
    if radius <= HUB_R or radius >= CLIP_R:
        return False
    angle = (math.degrees(math.atan2(y - PIVOT_Y, x - PIVOT_X)) + 360) % 360
    return 235 < angle < 305 and radius > 320


def is_fixed_hub(radius: float, px: tuple[int, int, int, int]) -> bool:
    if radius > 132 or px[3] < 40 or is_prize_segment(px):
        return False
    return True


def is_fixed_base(x: int, y: int, radius: float, px: tuple[int, int, int, int]) -> bool:
    if y < 820 or radius < 360:
        return False
    angle = (math.degrees(math.atan2(y - PIVOT_Y, x - PIVOT_X)) + 360) % 360
    pr, pg, pb, pa = px
    if pa < 80:
        return False
    return 55 < angle < 125 and pr < 200 and pg < 150


def stays_on_static(x: int, y: int, radius: float, px: tuple[int, int, int, int]) -> bool:
    """仅 GO 中心、顶部指针、底部托架固定，奖品盘面（含内圈木环）整体旋转。"""
    return (
        is_fixed_pointer(x, y)
        or is_fixed_hub(radius, px)
        or is_fixed_base(x, y, radius, px)
    )


def is_character_pixel(x: int, y: int, px: tuple[int, int, int, int]) -> bool:
    if px[3] == 0 or x >= CHAR_MAX_X:
        return False
    radius = math.hypot(x - PIVOT_X, y - PIVOT_Y)
    if HUB_R < radius < CLIP_R:
        if is_prize_segment(px) or is_fixed_hub(radius, px):
            return False
        return x < CHAR_RING_MAX_X
    return True


def main() -> None:
    src = Image.open(SRC).convert('RGBA')
    width, height = src.size
    src_px = src.load()
    disc_size = CLIP_R * 2

    disc = Image.new('RGBA', (disc_size, disc_size), (0, 0, 0, 0))
    disc_px = disc.load()
    static_bg = src.copy()
    bg_px = static_bg.load()
    character = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    char_px = character.load()

    for y in range(height):
        for x in range(width):
            px = src_px[x, y]
            radius = math.hypot(x - PIVOT_X, y - PIVOT_Y)

            if is_character_pixel(x, y, px):
                target_x = x - CHAR_SHIFT_X
                if target_x >= 0:
                    char_px[target_x, y] = px
                bg_px[x, y] = (0, 0, 0, 0)
                continue

            if HUB_R < radius < CLIP_R:
                if stays_on_static(x, y, radius, px):
                    continue
                bg_px[x, y] = (0, 0, 0, 0)
                dx = x - (PIVOT_X - CLIP_R)
                dy = y - (PIVOT_Y - CLIP_R)
                if 0 <= dx < disc_size and 0 <= dy < disc_size:
                    disc_px[dx, dy] = px

    disc.save(os.path.join(OUT, 'wheel-disc.png'))
    static_bg.save(os.path.join(OUT, 'wheel-bg-static.png'))
    character.save(os.path.join(OUT, 'wheel-character.png'))
    print(f'pivot=({PIVOT_X},{PIVOT_Y}) clip={CLIP_R}')


if __name__ == '__main__':
    main()
