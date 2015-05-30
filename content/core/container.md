# IoC Container
<p class='lead'>
The IoC Container is the backbone of the system. It's used to inject our dependencies
into the classes, resulting in testable and clean code, and a solid application
architecture.
</p>

The methods in [Service Providers](#/core/service-provider), and the HTTP layer is
resolved through the Container. That means that we can simply *ask for* what
we need, and get an instance of that class.

As long as the *constructor* of that class *only contains other resolvable classes*, 
they too will be created.

```dart
class MyClass {
}

class MyOtherClass {
  MyClass dependency;

  MyOtherClass(MyClass this.dependency);
}

class MyServiceProvider implements ServiceProvider {
  load(MyOtherClass dependency) {
    print(dependency.dependency is MyClass); // true
  }
}
```

## Interacting with the Container
<p class='lead'>
If we inject the container itself, we can interact with it. This is the whole
purpose of the Service Providers, as you can learn about 
[here](#/core/service-provider).
</p>

Create an instance of a class, and resolve all its dependencies with the `make` method.
```dart
MyClass instance = container.make(MyClass);
```

If you have an interface in your app, you'll want the classes depending on that module
to inject the interface, not an implementation. You can tell the container to
resolve the interface to an implementation, so that you have the choice of what
implementation to use located in a single place. Use the `bind` method.
```dart
container.bind(MyAbstractClass, MyImplementation);

print(container.make(MyAbstractClass) is MyImplementation); // true
```

If you need one instance of a class to be used throughout your app, you can use the
`singleton` method.
```dart
MyClass instance = container.make(MyClass);

container.singleton(instance);

// When your instance is an implementation of an interface
container.singleton(instance, as: MyInterface);
```

To resolve a method and resolve its arguments, use the `resolve` method.
```dart
container.resolve(instance.method);
```