'''
David Bootle 2023

Fetches images from Google Images if they do not have an image already.

Local server is run by nicegui and is used to control the program.
'''

import base64
from pathlib import Path
import json
from nicegui import ui
from PIL import Image, UnidentifiedImageError
from google_images_search import GoogleImagesSearch, GoogleBackendException
from io import BytesIO

# Define paths
images_folder = Path.cwd() / 'public' / 'images'
all_food_path = Path.cwd() / 'json' / 'all_food.json'
api_key_path = Path.cwd() / 'googleimageapikey.txt'
placeholder_image_path = Path.cwd() / 'public' / 'images' / '_Placeholder.jpg'

placeholder_image = base64.b64encode(placeholder_image_path.read_bytes()).decode('utf-8')
placeholder_image = f'data:image/jpeg;base64,{placeholder_image}'

# Define class to keep track of application state
class State:
    '''Keeps track of app state.'''
    def __init__(self):
        # Define variables
        self.item_names = []
        self.api_key = None
        self.image_elements = [None] * 10
        self.image_content = [None] * 10
        self.image_content_pillow = [None] * 10
        self.custom_uploaded_image = None

        # Load item names
        self.load_starting_item_names()

        # Load google images
        self.load_google_images()

        self.set_placeholder_images()

    def load_starting_item_names(self):
        '''Loads the starting item names from all_food.json and filters out items that already have names.'''
        # open the all_food.json file
        with open(all_food_path, 'r', encoding='utf-8') as file:
            all_food = json.loads(file.read()) # load the json
        self.item_names = list(map(lambda i: i['name'], all_food['items'])) # get list of food names
        self.item_names = list(filter(lambda i: not (images_folder / f'{i}.jpg').exists(), self.item_names)) # filter out items that already have images
        # sort list of item names alphabetically
        self.item_names.sort()
        self.item_names = {i: self.item_names[i] for i in range(0, len(self.item_names))} # convert to dict with index as key

    def load_button(self):
        '''Loads image elements with content and updates them.'''
        self.load_images()
        self.update_images()

    def skip_button(self):
        '''Called when the skip item button is pressed.'''
        self.update_current_item(itemSelector.value + 1)
        self.set_placeholder_images()
        self.update_images()

    def load_images(self):
        '''
        Uses the Google Images API to load images for the current item.
        '''
        item_name = self.item_names[itemSelector.value] # get name of current item

        # notify user
        ui.notify(f'Loading images for {item_name}...')

        # if override search term is not empty, set item_name to the override search term
        if customSearchInput.value != '':
            item_name = customSearchInput.value

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
        except GoogleBackendException as e:
            ui.notify('Failed to get new images.')
            print(e)
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

        # save images to self.image_content_pillow
        self.image_content_pillow = images

        # convert images to base64 and save to self.image_content
        for i in range(0, len(images)):
            with BytesIO() as buffer:
                images[i].save(buffer, format='JPEG')
                image = base64.b64encode(buffer.getvalue()).decode('utf-8')
                image = f'data:image/jpeg;base64,{image}'
                self.image_content[i] = image
        
        self.update_images()

    def set_placeholder_images(self):
        '''Sets the image content to the placeholder image.'''
        for k in range(0, 10):
            self.image_content[k] = placeholder_image
        self.image_content_pillow = [None] * 10

    def update_images(self):
        '''Updates the image sources for the ui images.'''
        for k in range(0, 10):
            self.image_elements[k].source = self.image_content[k]

    def update_current_item(self, value):
        '''Updates the current item.'''
        if value + 1 > len(self.item_names):
            ui.notify('No more items to load.')
            return
        itemSelector.value = value

    def load_google_images(self):
        '''Loads the api key from the api_key_path file and sets up self.gis'''
        # verify that the api key exists
        if not api_key_path.exists():
            ui.notify('API Key not found.')
            return
        
        # open the api key file
        with open(api_key_path, 'r', encoding='utf-8') as file:
            self.api_key = file.read()

        self.gis = GoogleImagesSearch(self.api_key, 'c5e103f8aecd6443a')

    def image_selected(self, index):
        '''Called when an image is selected.'''
        # verify that image_content_pillow exists for the given index. If it does not, then the image is a placeholder.
        if self.image_content_pillow[index] is None:
            ui.notify('No image loaded in that slot.')
            return

        item_name = self.item_names[itemSelector.value] # get the name of the current item
        image = self.image_content_pillow[index] # get pillow object for the selected image
        image.save(images_folder / f'{item_name}.jpg') # save the image to the images folder
        ui.notify(f'Saved image for {item_name}.') # notify user

    def image_uploaded(self, event):
        # event.content is a tempfile.SpooledTemporaryFile. We need to open it in pillow.
        try:
            image = Image.open(event.content)
        except UnidentifiedImageError:
            ui.notify('Invalid image type.')

        # convert image to JPEG
        image = image.convert('RGB')

        # crop out square in the center of image (use full width for portrait images and full height for landscape images)
        if image.width > image.height:
            # landscape image
            left = (image.width - image.height) / 2
            top = 0
            right = (image.width + image.height) / 2
            bottom = image.height
        else:
            # portrait image
            left = 0
            top = (image.height - image.width) / 2
            right = image.width
            bottom = (image.height + image.width) / 2
        image = image.crop((left, top, right, bottom))

        # resize image to 256x256
        image = image.resize((256, 256))

        self.custom_uploaded_image = image # save the image to the state

        # convert image to base64
        with BytesIO() as buffer:
            image.save(buffer, format='JPEG')
            image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
            image_base64 = f'data:image/jpeg;base64,{image_base64}'
            customImageUploadPreview.source = image_base64 # set the image source to the base64 image
        
        # make the image preview visible
        previewColumn.visible = True
    
    def save_custom_image(self):
        '''Saves the custom uploaded image to the images folder.'''
        if self.custom_uploaded_image is None:
            ui.notify('No image uploaded.')
            return

        item_name = self.item_names[itemSelector.value]

        # save the image to the images folder
        self.custom_uploaded_image.save(images_folder / f'{item_name}.jpg')

state = State()

## UI
with ui.row():
    # item selection card
    with ui.card():
        ui.label('Current Item: ').classes('text-lg')
        itemSelector = ui.select(state.item_names, value=0)

    # override search term card
    with ui.card():
        ui.label('Override Search Term (Optional)').classes('text-lg')
        customSearchInput = ui.input(label="Override Search Term")

# file upload
with ui.row():
    with ui.card():
        # two rows of 5 images each
        ui.label("Click an image to save it").classes('text-lg')
        with ui.row():
            for i in range(0, 5):
                state.image_elements[i] = ui.image(state.image_content[i]).classes('w-64 h-64').on('click', lambda x, index=i: state.image_selected(index))
        with ui.row():
            for i in range(5, 10):
                state.image_elements[i] = ui.image(state.image_content[i]).classes('w-64 h-64').on('click', lambda x, index=i: state.image_selected(index))

        with ui.row():
            # Row with a load button and skip button
            loadButton = ui.button('Load Images From Google', on_click=state.load_button) # Load Button
            skipButton = ui.button('Next Item', on_click=state.skip_button) # Skip Button
    
    with ui.card():
        with ui.row():
            # file upload with border class applied through tailwind classes
            fileUpload = ui.upload(label="Upload Custom Image", on_upload=state.image_uploaded).props('accept="image/*"')
            with ui.column() as previewColumn:
                customImageUploadPreview = ui.image(placeholder_image).classes('w-64 h-64')
                saveCustomImageButton = ui.button('Save Custom Image', on_click=state.save_custom_image).classes('w-32')
            previewColumn.visible = False

ui.run(title="CU Fries Image Selector", favicon="https://cufries.com/favicon.ico")
