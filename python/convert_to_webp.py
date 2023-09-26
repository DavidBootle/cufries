# This file should read all images in the images folder and convert them from jpeg to webp. If they are already in webp format, they should be ignored.
from pathlib import Path
from PIL import Image

images_folder = Path('public') / 'images'

image_filenames = list(images_folder.glob('*.jpg'))
num_of_images = len(image_filenames)

for index, filename in enumerate(image_filenames):
    # convert image to webp format
    destination = filename.with_suffix('.webp')

    image = Image.open(filename)
    image.save(destination, format='webp')

    # print file size savings
    original_size = filename.stat().st_size
    new_size = destination.stat().st_size
    size_difference = original_size - new_size
    size_difference_percentage = round((size_difference / original_size) * 100, 2)

    # remove original image
    filename.unlink()

    print(f"Converted {filename} to webp ({index + 1}/{num_of_images}) - Saved {size_difference_percentage}% ({size_difference} bytes)")