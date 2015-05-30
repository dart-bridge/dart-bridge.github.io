# Middleware
<p class='lead'>
The Bridge server is a wrapper around the [Shelf](//pub.dartlang.org/packages/shelf)
server. Middleware can be attached with a service provider. 
</p>

```dart
import 'package:bridge/core.dart';
import 'package:bridge/http.dart' as http;
import 'package:shelf/shelf.dart' as shelf;

class MyMiddlewareServiceProvider implements ServiceProvider {
  load(http.Server server) {
    server.addMiddleware(
      shelf.createMiddleware(requestHandler: handler)
    );
  }
  
  shelf.Response handler(shelf.Request request) {
    // ...
  }
}
```

> Read more about `shelf.Middleware` [here](//pub.dartlang.org/packages/shelf).
