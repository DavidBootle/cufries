'''
David Bootle 2023
Reads the all-food.json file and fetches any images that do not yet exist from google images.
'''

from pathlib import Path
import json
from PIL import Image
from google_images_search import GoogleImagesSearch
from io import BytesIO

images_folder = Path.cwd() / 'public' / 'images'
all_food_path = Path.cwd() / 'json' / 'all_food.json'
api_key_path = Path.cwd() / 'googleimageapikey.txt'

# verify that all_food.json exists
if not all_food_path.exists():
    print("WARNING: all_food.json does not exist. Please run the server to generate this file before running this script.")
    exit()

# verify that the api key exists
if not api_key_path.exists():
    print("WARNING: No google images api key found. Paste the API key in the file 'googleimageapikey.txt' in the project directory.")
    exit()

# read api key
with open(api_key_path, 'r') as file:
    API_KEY = file.read()
    gis = GoogleImagesSearch(API_KEY, 'c5e103f8aecd6443a')
    file.close()

# read all_food.json
with open(all_food_path, 'r') as file:
    all_food: list = json.loads(file.read())
    file.close()
food_names = map(lambda i: i['name'], all_food['items']) # get list of food names

# for each food name
for food in food_names:
    image_path = images_folder / f'{food}.jpg'
    if image_path.exists():
        continue
    
    print(f"Grabbing image for item '{food}'")
    
    search_params = {
        'q': f'{food}',
        'num': 10,
        'fileType': 'jpg',
        'safe': 'active',
        'imgColorType': 'color'
    }

    gis.search(search_params=search_params)
    images = gis.results() # grab the first image
    for image_result in images:
        image_io = BytesIO(image_result.get_raw_data())
        image = Image.open(image_io)
        image.show()
        ok = input('Image ok? (y/N): ')
        if ok.lower() == 'y': # if image is acceptable, it is added, otherwise go to next image
            with open(image_path, 'wb') as file:
                file.write(image_result.get_raw_data())
                file.close()
            break
        elif ok.lower() == 'skip':
            image.close()
            break
        elif ok.lower() == 'exit' or ok.lower() == 'stop':
            image.close()
            exit()
        else:
            image.close()

    print(f'No more images for {food}')
