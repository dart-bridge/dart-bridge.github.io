# Middleware <small>bridge.http</small>
<p class='lead'>
Bridge supports Shelf Middleware directly. Just use the `addMiddleware` method on the `Server` class.
</p>

```dart
server.addMiddleware(shelf.createMiddleware(...));
```

Since the order of the middleware can not be relied upon, hijacking request-middleware must be explicitly prepended
to the beginning of the middleware list. Use the `highPriority` named flag.

```dart
server.addMiddleware(shelf.createMiddleware(...), highPriority: true);
```
