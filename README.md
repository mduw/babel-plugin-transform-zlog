## Babel-plugin-transform-zlog

### Transform log syntax, extract templates from source code matching patterns

- Source map: mapping source path(posix) to its id

  ```
      {
          <source_map_ID>: <file_path>
      }
  ```

- Symbol map: mapping source map info to its symbol id

  ```
      {
          <symbol_map_ID>: <source_map_id>:<row>:<column>
      }
  ```

- Template map: mapping an actual raw template string to its template id

  ```
      {
          <template_ID>: <string>
      }
  ```

\*\*\* NOTE: All IDs are auto indexing

### Usage

```
    plugins: [
        "babel-plugin-transform-zlog",
        {
            "replaceSymbFunc":{
                "info":[
                    "logSymbol",
                    {
                        "variants":["self", "R", "F"]
                    }
                ],
                "debug":[
                    "logSymbol",
                    {
                        "variants":["self", "R", "F"]
                    }
                ],
                "warn":[
                    "logSymbol",
                    {
                        "variants":["self", "R", "F"]
                    }
                ],
                "error":[
                    "logSymbol",
                    {
                        "variants":["self", "R", "F"]
                    }
                ]
            },
            "replaceCreateFeatFunc":["createFeatLogs","createOneFeatLog"],
            "replaceCreateTemplFunc":["l"],
            "loggerPathRegex":"(\\w+\\/)*some\\/path\\/(\\w+\\/)*(logger)$",
            "logDataPathRegex":"(\\w+\\/)*more\\/path\\/(\\w+\\/)*(templates(-\\w+)+|templates)$",
            "excludePathRegex":"",
            "outDir":"out/path",
        }
    ]
```
