# Service Providers <small>bridge.core</small>
<p class='lead'>
To attach anything to the Bridge application, we need an entry point where we can connect our entities to the
[Service Container](#/core/service-container). That's where Service Providers come in.
</p>

What good is a [Service Container](#/core/service-container) if it isn't shared? And if we design all classes to conform
to the dependency injection pattern, where does it... start?

## Setting up and tearing down
Imagine a database service. Somewhere in the lifecycle of our app, we need to establish a connection to the database,
as well as disconnecting before the application exits. In a procedural style application, we would place this in the
*beginning* and the *end* of our script. But that splits your service and places logically related code in two vastly
different places.

Here's how we do it in a Service Provider:

```yaml
# config/app.yaml
service_providers:
  - app.MyDatabaseServiceProvider
```
```dart
part of app;

class MyDatabaseServiceProvider implements ServiceProvider {
  setUp(Container container, MyDatabaseClass db) async {
    container.singleton(db);
    await db.connect();
  }
  
  tearDown(MyDatabaseClass db) async {
    await db.disconnect();
  }
}
```

The `setUp` method will be executed as soon as the program is started with `dart bridge`. The `tearDown` method is
executed when `exit` (or <kbd>^X</kbd>) is run.

And since we are adding the `MyDatabaseClass` instance as a singleton, *everywhere* in your application, where a
`MyDatabaseClass` is requested, the same instance will be used. Instead of using a global object (which makes the code
hard to test), dependency injection is leveraged instead.

All the methods are resolved out of the [Service Container](#/core/service-container). So we can have all the
dependencies we want in the constructor of `MyDatabaseClass`, and we can even add new dependencies, without having to
change the Service Provider.

## Interaction
Sometimes, a component of the system provides extensibility by itself. For example, the `bridge.http` library accepts
registering middleware during initialization. For this interaction between services, two more methods can be declared
in the Service Providers.

The `load` method is where we inject entities from other services. And to run functionality *after* some other service
has interacted with our service, the `run` method is used. This order of interactions could look like this:

```dart
class PluginServiceProvider implements ServiceProvider {
  setUp(Container container, PluginManager pluginManager) {
    container.singleton(pluginManager);
  }
  
  run(PluginManager pluginManager) {
    pluginManager.initializeAllRegisteredPlugins();
  }
}
```
```dart
class MyPluginServiceProvider implements ServiceProvider {
  load(PluginManager pluginManager, MySpecialPlugin plugin) {
    pluginManager.registerPlugin(plugin);
  }
}
```

This way, we ensure that the Plugin Service doesn't depend on all the plugins. Instead, we make it so all the plugins
exclusively depend on only the Plugin Service. And so, the plugins are now independently deployable, and can live in its
own package.

## Lifecycle
So, to sum it up, the lifecycle of a Service Provider looks like this:

1. Run the `setUp` method, where the service is initialized and registered in the container.
2. Run the `load` method, where the service injects other services and interact with them.
3. Run the `run` method, where the service reacts to interactions from other services.
4. The app goes to the idle running state.
5. When the `exit` command is executed, run the `tearDown` method, where the service cleans up its loose ends.