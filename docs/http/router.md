# Router <small>bridge.http</small>
<p class='lead'>
The router manages all the entry points to your app through HTTP. The entries are backed up with full dependency
injection, so that you have the power of your entire application available to you instantly.
</p>

The route handler function's return value is cast to a format that can be sent back through HTTP. Let's look at the most
basic example:

```dart
router.get('/', () {
  return 'Hello, world!';
});
```
```html
Hello, world!
```

The method name specifies the HTTP method to listen to. The available ones are:

* GET/HED – `get`
* POST – `post`
* PUT – `put`
* PATCH – `patch`
* UPDATE – `update`
* DELETE – `delete`

Returned strings will be sent as HTML. More complex structures will be attempted to be cast to JSON:

```dart
router.get('/', () {
  return {'key': 'value'};
});
```
```json
{"key":"value"}
```

Returning a `shelf.Response` directly is also valid. This is good if you – for instance – want to return a special
HTTP status code:

```dart
router.get('/', () => new shelf.Response(400, body: 'No, sir!'));
```

## Named routes
A good practice is not to rely on the specific URI of a route for internal references. Instead, you can name the route:
```dart
router.get('/', controller.home, name: 'home');
```

## Dependency Injection
The [Service Container](#/docs/core/service-container) resolves the callback, giving you the ability to inject whatever
dependencies you like:
```dart
class Greeter {
  String greet(String name) {
    return 'Hello, $name!';
  }
}
```
```dart
router.get('/', (Greeter greeter) {
  return greeter.greet('friend');
});
```
```html
Hello, friend!
```

A few special objects are available for injection:

* The `shelf.Request`
* The data sent with the request, parsed into an `Input` object
* The current session, available as a `Session` object

```dart
router.get('path', (shelf.Request request,
                    Input input,
                    Session session) {
  session['counter'] = session.containsKey('key') ? session['counter']++ : 1;
  return {
    'request.url': request.url,
    'input': input,
    'session': session,
  };
});
```
```http
GET http://localhost:1337/path
```
```json
{
  "request.url":"path",
  "input":{},
  "session":{
    "counter":1
  }
}
```
```http
GET http://localhost:1337/path?key=value
```
```json
{
  "request.url":"path?key=value",
  "input":{
    "key": "value"
  },
  "session":{
    "counter":2
  }
}
```

## Wildcards
To receive a wildcard segment in the route, prepend the segment with a colon, and receive the wildcard as a named
argument in the handler. The order doesn't matter, but the named argument must match the name of the wildcard:

```dart
router.get(
    'greet/:lastName/:firstName',
      (Greeter greeter, {String firstName, String lastName}) {
    var name = '$firstName $lastName';
    return greeter.greet(name);
  });
```
```http
GET http://localhost:1337/greet/Draper/Don
```
```html
Hello, Don Draper!
```

## Modulating the return value
Let's say you have an implementation of an interface that is considered an error, but doesn't throw an exception. We
can specify how that interface is parsed as a route return value, by registering a return value modulator on the
`Server` singleton in a [Service Provider](#/docs/core/service-providers):

```dart
class MyHttpServiceProvider implements ServiceProvider {
  load(Server server) {
    server.modulateRouteReturnValue((value) {
      if (value is! MyInterface) return value; // Send to next modulator without changing anything
      
      if (value is InvalidMyInterface)
        return new shelf.Response.notFound('That resource was not found!');
      
      return 'Everything went ok!';
    });
  }
}
```

> **Note:** The modulation will pass its value along to the next modulator, however the order of these modulators
> can not be relied upon, and a modulation should only return a primitive value or  `shelf.Response`.

## Catching Exceptions
To abort a request, the easiest and most native approach is to throw an exception. As a default, this will simply return
a 500 error, with a simple text. However, you can globally catch these exceptions and specify the return value.
The handler is resolved through the [Container](#/docs/core/service-container), injecting the exception in question as
its specified type:

```dart
class MyHttpServiceProvider implements ServiceProvider {
  load(Server server) {
    server.handleException(HttpNotFoundException, (Greeter greeter, HttpNotFoundException exception) {
      var greeting = greeter.greet('Guest');
      return shelf.Response.notFound('''
        <h1>$greeting</h1>
        Oops! This page wasn't found!
      ''');
    });
  }
}
```