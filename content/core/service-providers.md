# Service Providers
<p class='lead'>
Bridge *revolves* around Service Providers. Each on is loaded when the application
starts, and can use the [IoC Container](#/core/container) to inject the functionality
into the system.
</p>

Service Providers must follow a few criteria to be included in the startup process.
* It must implement the `ServiceProvider` interface. This interface is empty, but
provides the bootstrapper with a hook to decide if a class should be loaded or not.
* It must be `imported` or `exported` so that it is included in the runtime.
* It must be registered in `config/app.yaml` by its full path.

## A custom Service Provider
```dart
library my_library;

class MyServiceProvider implements ServiceProvider {

}
```

The path of this class is `my_library.MyServiceProvider`. So we register that in
`config/app.yaml`.

```yaml
service_providers:
  # You will most likely have core providers here
  - my_library.MyServiceProvider
```

### Lifecycle
Each method of the Service Providers are executed together, asynchronously,
throughout the list. To be able to use other modules within the provider, the
methods have specific responsibilities, which always should be followed.

#### 1. `setUp`
This method should *only* be used for interaction with the 
[IoC Container](#/core/container) for the *component's own classes*.

```dart
class ExampleServiceProvider implements ServiceProvider {
  setUp(Container container, MyClass myClass) {
    container.singleton(myClass);
  }
}
```

This way, we have the component prepared before other Service Providers to interact
with it.

#### 2. `load`
In this method, we *interact* with both our own and other services. Because the `setUp`
method has been run on all providers, we can rest assured that the container is ready
to inject whatever we ask for.

```dart
load(MyClass myClass, bridge_http.Server server) {
  server.addMiddleware(...);
}
```

#### 3. `run`
When other services have interacted with our service, we can react to that interaction
in the `run` method. Usually, this is accomplished by binding a singleton in `setUp`
and letting other services inject that singleton in `load`.

```dart
run(MySingleton singleton) {
  singleton.doSomething();
}
```

#### 4. `tearDown`
This method will be run when the `exit` command is run on the command line.

> **Note** that this will never be run if <kbd>^C</kbd> is used to
> exit the program.

```dart
tearDown(MyClass myClass) {
  myClass
    ..dumpSomeInfo()
    ..closeSomeConnection();
}
```