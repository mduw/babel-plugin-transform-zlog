## Babel-plugin-transform-zlog

### Transform log syntax, extract templates from source code matching patterns

- Source map: mapping source path(posix) to its id

  ```json
      {
          <source_map_ID>: <file_path>
      }
  ```

- Symbol map: mapping source map info to its symbol id

  ```json
      {
          <symbol_map_ID>: <source_map_id>:<row>:<column>
      }
  ```

- Template map: mapping an actual raw template string to its template id

  ```json
      {
          <template_ID>: <string>
      }
  ```

\*\*\* NOTE: All IDs are auto indexing

### Usage

```json
    plugins: [
        "babel-plugin-transform-zlog",
        {
            replaceSymbFunc: {
            info: [
              'logSymbol',
              {
                variants: ['self', 'R', 'C', 'F', 'RC', 'RF'],
              },
            ],
            debug: [
              'logSymbol',
              {
                variants: ['self', 'R', 'C', 'F', 'RC', 'RF'],
              },
            ],
            warn: [
              'logSymbol',
              {
                variants: ['self', 'R', 'C', 'F', 'RC', 'RF'],
              },
            ],
            error: [
              'logSymbol',
              {
                variants: ['self', 'R', 'C', 'F', 'RC', 'RF'],
              },
            ],

          replaceCreateFeatFunc: ['createFeatLogs', 'createOneFeatLog'],
          replaceCreateTemplFunc: ['l'],
          loggerPathRegex: "(\\w+\\/)*utils\\/logger\\/(\\w+\\/)*(logger)$",
          logDataPathRegex: "(\\w+\\/)*utils\\/logger\\/(\\w+\\/)*(templates(-\\w+)+|templates)$",
          excludePathRegex: "(zlogger|src\\/static)",
          outDir: "outpath/4/extracted/data",
        }
    ]
```
