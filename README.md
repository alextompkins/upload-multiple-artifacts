# upload-multiple-artifacts

## Why is this needed?

Because [actions/upload-artifact](https://github.com/actions/upload-artifact) only allows you to upload a single file/archive.
If you have a dynamic number of files you want uploaded (separately), you're SoL. 
This solves that problem.

## Usage

### Inputs
```yaml
files-to-upload:
  description: A JSON-serialized array of filenames to upload
  required: true
```

E.g. 
```json
[
  "./file1.png",
  "./nested/file2.txt",
  "./file3.zip"
]
```

### Outputs
```yaml
artifact-ids:
  description: A JSON mapping of the input filenames to uploaded artifact IDs
```

E.g. 
```json
{
  "./file1.png": 5750917148,
  "./nested/file2.txt": 5750917190,
  "./file3.zip": 5750917225
}
```

See [action.yml](./action.yml) for further details.

## Acknowledgements
Inspired mainly by https://gist.github.com/LJBNZ/35a59ea05d8d3854b8c31f0495727aed
