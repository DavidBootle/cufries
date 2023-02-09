# David Bootle 2023
# Resizes all images in the ./public/images folder (except those starting with _) to be 400x400 cropped images

from pathlib import Path
from PIL import Image

images_folder = Path.cwd() / 'public' / 'images'
images = images_folder.glob('*.jpg')

CROP_SIZE = 600

# iterate through each image in the folder
for image_path in images:
    print(f'Resizing {image_path.name}')

    # skip images starting with _
    if image_path.name[0] == '_':
        continue

    # calculate new size for resizing
    image = Image.open(image_path)  # open image
    aspect_ratio = image.size[0] / image.size[1] # calculate aspect ratio

    if image.width > image.height: # if width is greater than height
        new_height = CROP_SIZE
        new_width = new_height * aspect_ratio
    elif image.width < image.height: # if height is greater than width
        new_width = CROP_SIZE
        new_height = new_width / aspect_ratio
    else: # the image is already a square
        new_width = CROP_SIZE
        new_height = CROP_SIZE

    new_width = round(new_width)
    new_height = round(new_height)

    image = image.resize((new_width, new_height)) # resize image so that smallest edge is 400px

    # calculate crop
    if image.width > image.height: # landscape
        margin = (image.width - CROP_SIZE) / 2
        box = (0, 0, CROP_SIZE, CROP_SIZE)
        image = image.crop(box) # crop to box
    elif image.width < image.height: # portrait
        margin = (image.height - CROP_SIZE) / 2
        box = (0, 0, CROP_SIZE, CROP_SIZE)
        image = image.crop(box) # crop to box
    else: # already square don't bother
        pass

    image.save(image_path)
    image.close()
