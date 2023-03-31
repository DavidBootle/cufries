# Preload images from the google images api into a folder for easy sorting.

from pathlib import Path
import json
from google_images_search import GoogleImagesSearch, GoogleBackendException
from PIL import Image, UnidentifiedImageError
from io import BytesIO

preloaded_images_folder = Path.home() / 'Downloads' / 'CU Fries Image Preload'
api_key_path = Path.cwd() / 'googleimageapikey.txt'
all_food_path = Path.cwd() / 'json' / 'all_food.json'
images_folder = Path.cwd() / 'public' / 'images'

class Loader:

    def __init__(self):
        self.item_names = []
        self.api_key = ''
        self.gis = None

        self.load_starting_item_names()
        self.load_google_images()

    def load_starting_item_names(self):
        '''Loads the starting item names from all_food.json and filters out items that already have names.'''
        # open the all_food.json file
        with open(all_food_path, 'r', encoding='utf-8') as file:
            all_food = json.loads(file.read()) # load the json
        self.item_names = list(map(lambda i: i['name'], all_food['items'])) # get list of food names
        self.item_names = list(filter(lambda i: not (images_folder / f'{i}.jpg').exists(), self.item_names)) # filter out items that already have images

        # get list of folder names in the preloaded images folder
        preloaded_images_folder_names = list(map(lambda i: i.name, preloaded_images_folder.iterdir()))
        # filter out items that already have images
        self.item_names = list(filter(lambda i: not (i in preloaded_images_folder_names), self.item_names))

        # sort list of item names alphabetically
        self.item_names.sort()
        self.item_names = {i: self.item_names[i] for i in range(0, len(self.item_names))} # convert to dict with index as key
    
    def load_images(self, item_name):
        '''
        Uses the Google Images API to load images for the current item.
        '''

        # notify user (print)
        print(f'Loading images for {item_name}...')

        # get search parameters for google images api
        search_params = {
            'q': f'{item_name}',
            'num': 10,
            'fileType': 'jpg',
            'safe': 'active',
            'imgColorType': 'color'
        }

        try:
            self.gis.search(search_params=search_params) # execute search
        except GoogleBackendException:
            # print Failed to load [image name]
            print('Failed to load image ', item_name)
            return
        
        images = self.gis.results() # get list of search results

        # get list of BytesIO objects from the search results
        images = list(map(lambda k: BytesIO(k.get_raw_data()), images))

        # get list of PIL images from the BytesIO objects
        images = list(map(lambda k: Image.open(k), images))

        # crop out square in the center of image (use full width for portrait images and full height for landscape images)
        for i in range(0, len(images)):
            if images[i].width > images[i].height:
                # landscape image
                left = (images[i].width - images[i].height) / 2
                top = 0
                right = (images[i].width + images[i].height) / 2
                bottom = images[i].height
            else:
                # portrait image
                left = 0
                top = (images[i].height - images[i].width) / 2
                right = images[i].width
                bottom = (images[i].height + images[i].width) / 2
            images[i] = images[i].crop((left, top, right, bottom))

        # resize images to 256x256
        images = list(map(lambda i: i.resize((256, 256)), images))

        # create new folder for the current item
        item_folder = preloaded_images_folder / item_name
        item_folder.mkdir(parents=True, exist_ok=True)

        # save images to the new folder
        for i in range(0, len(images)):
            try:
                images[i].save(item_folder / f'{i}.jpg', 'JPEG')
            except UnidentifiedImageError:
                # print Failed to load [image name]
                print('Failed to load image ', item_name)
                return
    
    def load_google_images(self):
        '''Loads the api key from the api_key_path file and sets up self.gis'''
        # verify that the api key exists
        if not api_key_path.exists():
            print('API key file does not exist.')
            return
        
        # open the api key file
        with open(api_key_path, 'r', encoding='utf-8') as file:
            self.api_key = file.read()

        self.gis = GoogleImagesSearch(self.api_key, 'c5e103f8aecd6443a')

# create a new loader
loader = Loader()

# load images for each item
for i in loader.item_names:
    loader.load_images(loader.item_names[i])