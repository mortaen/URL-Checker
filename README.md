# URL-Checker

after cloning the repo,  
run `npm i`

to add the mock database, add a `db.json` file and with the following structure

```
{
    "urls": [
      { "id": 1, "url": "https://example.com/file", "type": "file" },
      { "id": 2, "url": "https://example.com/folder", "type": "folder" }
    ]
}
```

start the mock database with `json-server --watch db.json`
