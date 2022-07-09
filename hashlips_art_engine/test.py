import json

with open('build/json/_metadata.json') as f:
    data = json.load(f)

with open('_metadata_4200.json', 'w') as of:
    json.dump(data[:4200], of)
