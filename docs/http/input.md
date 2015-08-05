# Input <small>bridge.http</small>
<p class='lead'>
The HTTP protocol specifies different ways of sending data to a server. The `Input` class' job is to unify them all
into a simple `Map`.
</p>

Consider this route handler:

```dart
router.get('/', (Input input) {
  return input;
});
```

It will take whatever is in the input and return it. And since the input class can be cast to JSON, we can examine
what we get from different HTTP data packet formats:

```http
GET http://localhost:1337/?key=value
```
```json
{
  "key": "value"
}
```

Easy enough. The query string of a GET request is included in the `Input` map.

The same goes for other methods with `application/x-www-form-urlencoded` encoding type:

```dart
router.post('/', (Input input) => input);
```
```http
POST http://localhost:1337/
key=value&some-integer=42
```
```json
{
  "key": "value",
  "some-integer": 42
}
```

Just as easily, Bridge handles `multipart/form-data` packets, with both primitives, and even files.

## `UploadedFile`
When a file is uploaded using HTTP, it's represented by an `UploadedFile` object. The class itself is very simple,
and only contains basic information about the uploaded file, as well as a `saveTo` method, which takes a
`dart:io.File` and asynchronously saves the uploaded file to that location.

```dart
router.post('upload', (Input input) async {
  UploadedFile uploadedFile = input['file']; // This is the name of the form input field
  
  await uploadedFile.saveTo(new File('storage/${uploadedFile.name}'));
  
  return 'Upload successful!';
});
```