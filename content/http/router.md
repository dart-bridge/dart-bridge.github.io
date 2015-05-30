# Router
<p class='lead'>
The router provides easy ways to listen for, and respond to, requests to specific
endpoints.
</p>

```dart
router.get('/path/:wildcard', ({String wildcard}) {
  return "You're looking for $wildcard";
});
```

The [IoC Container](#/core/container) resolves the callback, so we can inject dependencies
to be used in the response.

The `Input` class can be used to get access to data sent with the request, and the 
[Shelf](//pub.dartlang.org/packages/shelf) `Request` class can be injected to provide
information about the actual HTTP request.

```dart
router.post('/store', (Input input, shelf.Request request) {
  return 'This is ${request.url.path}, and you posted ${input}';
});
```

## Controllers
Using controllers instead of closures directly in the router method is of course
a good pattern. Just replace the closure with a method reference, and you're good to go.

```dart
var controller = new PagesController();

router.get('/pages', controller.index);
router.post('/pages', controller.store);
router.get('/pages/:id', controller.show);
router.get('/pages/:id/edit', controller.edit);
router.update('/pages/:id', controller.update);
router.delete('/pages/:id', controller.destroy);
```