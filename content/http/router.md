# Router <small>bridge.http</small>
<p class='lead'>
It's easy – register a route, return what you want.
</p>

```dart
router.get('greet/:name', ({String name}) async {
  return 'Hello, $name';
});
```

Easily get the input from the request body (maybe from an HTML form) by simply injecting the `Input` class. The
underlying `shelf.Request` can be accessed the same way.

```dart
var controller = new MyController();
router.get('home/:wildcard', controller.homePage);
```
```dart
import 'package:shelf/shelf.dart';
import 'package:bridge/http.dart';

class MyController {
  homePage(Input input, Request request, {String wildcard}) {
    return 'You queried $input with "${request.url}". The route: home/$wildcard';
  }
}
```
```bash
$ curl http://localhost:1337/home/something?key=value
You queried Input({key: value}) with "home/something?key=value". The route: home/something
```