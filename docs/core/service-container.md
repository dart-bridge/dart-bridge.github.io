# Service Container <small>bridge.core</small>
<p class='lead'>
Bridge depends heavily on *Dependency Injection*. The Service Container will automatically resolve the dependencies of
classes, to avoid long instantiation chains and help you to write testable code.
</p>

## Using the `Container` class directly
By injecting the container itself, we can use tap into the power of Bridge.

### Instantiation
Creating a class with the Service Container looks like this:

```dart
class MyClass {}
```
```dart
MyClass instance = container.make(MyClass);
```

Simple, right? So, how is this different from just typing out `new MyClass()`. Well, there are a few differences.

```dart
class MyClass {
  Dependency dependency;
  MyClass(Dependency this.dependency);
}

class Dependency {}
```
```dart
MyClass instance = container.make(MyClass);
print(instance.dependency); // Instance of 'Dependency'
```

The `make` method recursively instantiates the constructor arguments.

## Resolving a closure
Sometimes we might want to inject the dependencies of a single function, method or closure. We can use the `resolve`
method:

```dart
MyClass instance = container.resolve((MyClass myClass) {
  // ...
  return myClass;
});
```

Of course this can be remote functions as well. Simply put a reference as the argument:

```dart
container.resolve(controller.method);
```

## Pre-resolving
If we don't want to *run* the function we can resolve it in advance instead, using the `presolve` method.

```dart
myFunction(Dependency dependency, MyClass myClass) {
  // ...
}

var myResolvedFunction = container.presolve(myFunction);

myResolvedFunction();
```

A cool thing about this is that any argument passed into the "presolved" function will be passed into the original
function, injected by its type:
```dart
var presolved = container.presolve((MyClass myClass, String input) {
  print(input); // 'Some input string'
});

presolved('Some input string');
```

## `injecting` and `namedParameters`
All of these methods: `make`, `resolve` and `presolve` has two optional named parameters which change the way the
container performs the injection.

`injecting` is a `Map<Type, Object>` where we can attach temporary objects to use when a specific class is requested:

```dart
var myDependency = new Dependency();
container.make(MyClass, injecting: {Dependency: myDependency});
```

Above, the local instance of `Dependency` is injected in the `MyClass` constructor.

`namedParameters` is simply a way to bypass the signature analysis and insert arguments that will not be resolved. If a
method or class constructor has named parameters, we can simply insert values into them with `namedParameters`:

```dart
myFunction(MyClass myClass, {String value: 'default'}) {
  return value;
}

container.resolve(myFunction); // 'default'
container.resolve(myFunction, namedParameters: {'value': 'my value'}); // 'my value'
```

## The Service Registry
These methods inject the dependencies with a simple instantiation. Using a few other methods, we can change the
behaviour of the injections.

### Injecting interfaces
To inverse the flow of control, we can make a class depend of an interface (an abstract class) instead of a concrete
implementation. Using the `bind` method, we can tell the container which implementation to use when an interface is
requested:

```dart
abstract class Cloud {}

class S3Cloud implements Cloud {}
```
```dart
container.bind(Cloud, S3Cloud);
print(container.make(Cloud)); // Instance of 'S3Cloud'
```

This way, we have a unified place to decide what implementation to use throughout the app. If we change our cloud
storage provider to, say, Dropbox, we can just change the `bind` method, and we're done.

### Singletons
Sometimes, we want the same instance of a class to be used every time. Instead of throwing everything into static
methods, we can register a singleton on the container:

```dart
container.singleton(new DropboxCloud());
```

Now every time a `DropboxCloud` is requested, the same instance is injected. Even better, we can bind a singleton to
an interface:

```dart
container.singleton(new DropboxCloud(), as: Cloud);
```