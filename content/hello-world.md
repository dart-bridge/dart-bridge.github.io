# Hello world
<p class='lead'>
To learn how the HTTP requests go through the app, let's see
a simple "Hello, world" message.
</p>

The most simple response can be created directly in `lib/http/routes.dart`.

```dart
part of framework;

class Routes {
  register(Router router) {
    router.get('/', () => 'Hello, world');
  }
}
```

Start up the application by running this command in the terminal:

```bash
dart bridge start
```

Now go to http://localhost:1337 to see your message.

## Controller
In your `lib/http/controllers.dart` library, add a `part` import to a new controller,
let's call it `hello_world_controller.dart`.

```dart
part of controllers;

class HelloWorldController {
  index() {
    return 'Hello, world';
  }
}
```

Now modify `routes.dart` to [inject](#/core/dependency-injection) the 
controller.

```dart
part of framework;

class Routes {
  register(Router router, HelloWorldController controller) {
    router.get('/', () => controller.index);
  }
}
```

Run `reload` in the command line, and you should see the exact same result in your
browser.

## Template
Next, let's create (or edit) `lib/templates/index.hbs`.

```html
<body>
  <h1>Hello world</h1>
</body>
```

Then, let's modify the `index` method in `lib/http/controllers/hello_world_controller.dart`.

```dart
part of controllers;

class HelloWorldController {
  index() {
    return template('index');
  }
}
```

Hit `reload`, and you should see the heading in the browser.