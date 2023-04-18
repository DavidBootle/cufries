from pathlib import Path
import json

# create a path object for the all_food.json file
all_food_path = Path.cwd() / 'json' / 'all_food.json'

# parse as json
with open(all_food_path, 'r', -1, 'utf-8') as file:
    all_food = json.load(file)

items = all_food['items']
items = map(lambda item: item['name'], items)

new_items = {
    'items': list(items),
    'date': all_food['date']
}

# create a path object for the all_food_migration.json file
all_food_migration_path = Path.cwd() / 'json' / 'all_food_migration.json'

with open(all_food_migration_path, 'w', -1, 'utf-8') as file:
    json.dump(new_items, file, ensure_ascii=False, separators=(',',':'))