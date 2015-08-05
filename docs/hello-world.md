# Hello World
<p class='lead'>
Let's open up the app in our favourite editor, and navigate the directory structure. We're going to change what we're
seeing in the browser window.
</p>

## API
Check out the file <mark>lib/api/api.dart</mark>. The file will look something like this:

```dart
import 'package:bridge/http.dart';
import 'package:bridge/tether.dart';

import 'pages_controller.dart';

class Api {
  PagesController controller;

  Api(PagesController this.controller);

  routes(Router router) {
    router.get('/', controller.index, name: 'index');
  }

  tether(Tether tether) {
  }
}
```

The `routes` method on the `Api` class is where we register HTTP routes. Right now, only `/` is registered. Let's modify
it.

First, we can remove the `name` parameter, it's not important right now. Next, replace `controller.index` with a simple
closure, that returns the string `"Hello, world"`.

```dart
routes(Router router) {
  router.get('/', () {
    return 'Hello, world!';
  });
}
```
```
Hello, world!
```

That's all we need to do. Go back to the command line, *reload and restart the server*, and then check out your work in
the browser.

## Casting
The router will cast the returned value to a format that can be sent as a text document. In our case, it's already a
string, so we're all right. However, more complicated structures will be cast to JSON:

```dart
routes(Router router) {
  router.get('/', () {
    return {'response': 'Hello, world!'};
  });
}
```
```json
{"response":"Hello, world!"}
```

## Returning a template
Enough of this. Let's return som HTML, shall we?

Modify <mark>lib/templates/index.html</mark> to your hearts content, then change the route response to the following:

```dart
routes(Router router) {
  router.get('/', () {
    return template('index');
  });
}
```
```html
<!-- lib/templates/index.html -->
<h1>Hello, world!</h1>
```

> **Note:** Remember to `reload` and `start` the server back up between edits.