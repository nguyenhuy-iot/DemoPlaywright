import ctypes
import time
import shutil
import sys
from pathlib import Path
from typing import Optional

# Constants
VK_F8 = 0x77
VK_F9 = 0x78
VK_ESC = 0x1B

PREFIX_INPUT = "input"
PREFIX_OUTPUT = "output"

BASE_DIR = Path(__file__).resolve().parent
# Make source dir configurable
SOURCE_DIR = Path(r"C:\Users\NguyenHuy\Pictures\Saved Pictures")
TARGET_DIR = BASE_DIR / "EVD"

# Ensure directories exist
try:
    TARGET_DIR.mkdir(exist_ok=True)
    if not SOURCE_DIR.exists():
        print(f"Error: Source directory {SOURCE_DIR} does not exist.")
        sys.exit(1)
except Exception as e:
    print(f"Error creating/accessing directories: {e}")
    sys.exit(1)

user32 = ctypes.windll.user32


def is_pressed(key: int) -> bool:
    """Checks if a virtual key is currently pressed."""
    return bool(user32.GetAsyncKeyState(key) & 0x8000)


def get_next_number(prefix: str) -> int:
    """Calculates the next available number for a given prefix."""
    max_number = 0

    for file in TARGET_DIR.glob(f"{prefix}_*.png"):
        try:
            # Extract number from filename
            number = int(file.stem.split("_")[-1])
            max_number = max(max_number, number)
        except (ValueError, IndexError):
            continue

    return max_number + 1


def get_latest_image() -> Optional[Path]:
    """Returns the most recently modified image file in SOURCE_DIR."""
    files = list(SOURCE_DIR.glob("*.png"))

    if not files:
        return None

    return max(files, key=lambda file: file.stat().st_mtime)


def move_image(prefix: str) -> None:
    """Moves the latest image from SOURCE_DIR to TARGET_DIR with the correct naming."""
    try:
        source = get_latest_image()

        if source is None:
            print("Không tìm thấy ảnh.")
            return

        number = get_next_number(prefix)
        # Thay đổi số trong :02d để chỉnh số lượng chữ số (vd: :03d cho 001)
        target = TARGET_DIR / f"{prefix}_{number:02d}.png"

        shutil.move(str(source), str(target))
        print(f"Saved: {target.name}")
    except Exception as e:
        print(f"Error moving image: {e}")


def main():
    """Main application loop."""
    print("================================")
    print("          EVD CAPTURE")
    print("================================")
    print(f"F8  -> {PREFIX_INPUT.upper()}")
    print(f"F9  -> {PREFIX_OUTPUT.upper()}")
    print("ESC -> EXIT")
    print()

    f8_previous = False
    f9_previous = False

    while True:
        try:
            f8_current = is_pressed(VK_F8)
            f9_current = is_pressed(VK_F9)

            if f8_current and not f8_previous:
                move_image(PREFIX_INPUT)

            if f9_current and not f9_previous:
                move_image(PREFIX_OUTPUT)

            if is_pressed(VK_ESC):
                print("Exit")
                break

            f8_previous = f8_current
            f9_previous = f9_current

            time.sleep(0.03)
        except KeyboardInterrupt:
            print("\nExit")
            break
        except Exception as e:
            print(f"An unexpected error occurred: {e}")
            time.sleep(1)


if __name__ == "__main__":
    main()
