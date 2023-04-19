# URL-Checker

to add the mock database, add a `db.json` file and with the following structure

```
{
    "urls": [
      { "id": 1, "url": "https://example.com/file", "type": "file" },
      { "id": 2, "url": "https://example.com/folder", "type": "folder" }
    ]
}
```

make sure to have `json-server` installed and start the mock database with `json-server --watch db.json`
