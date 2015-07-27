# Middleware <small>bridge.http</small>
<p class='lead'>
Bridge both provide a `Middleware` class that can be extended, and supports Shelf Middleware directly. Just use 
the `addMiddleware` method on the `Server` class.
</p>

```dart
server.addMiddleware(middleware);
```

Since the order of the middleware can not be relied upon, hijacking request-middleware must be explicitly prepended
to the beginning of the middleware list. Use the `highPriority` named flag.

```dart
server.addMiddleware(middleware, highPriority: true);
```

## Bridge Middleware
The `Middleware` abstract class can optionally implement one or both of the methods `request` and `response`.
Both is backed by the [Service Container](#/core/service-container), and can return anything, like the
[route handlers](#/http/router). The corresponding `shelf.Request` or `shelf.Response` can be injected.

### `request`
```dart
class MyRequestMiddleware {
  request() {
    return 'Hello, world!';
  }
}
```
```dart
server.addMiddleware(new MyRequestMiddleware());
```

Every request going into server will now return a response with the body `"Hello, world!"`. The middleware queue
will be continued depending on the return value of the return value of `request`:

* `null` or `Future<null>` – The request will be passed on to the next middleware in the queue.
* `shelf.Request` or `Future<shelf.Request>` – The new (or modified) request will be passed to the next middleware
in the queue.
* `shelf.Response` or `Future<shelf.Response>` – The response will be returned, and the middleware queue is canceled.
* Any other value will be cast to a `String` or JSON encodable format and returned as a `shelf.Response`, and the
middleware queue is canceled.

### `response`

```dart
class MyResponseMiddleware {
  response() {
    return '<h1>Overriding response</h1>';
  }
}
```
```dart
server.addMiddleware(new MyResponseMiddleware());
```

Every request will now go through the router and the application, but be replaced by the _Overriding response_
heading. The `shelf.Response` passed into the next middleware in the queue, depends on the return value of the
`response` method:

* `null` or `Future<null>` – The original response will be passed on to the next middleware in the queue.
* `shelf.Response` or `Future<shelf.Response>` – The new (or modified) response will be passed to the next middleware
in the queue.
* Any other value will be cast to a `String` or JSON encodable format and returned as a `shelf.Response`, and passed
to the next middleware in the queue.

> **Note:** the same `Middleware` can implement both methods, and the same instance will be shared for all
requests/responses.