# Custom Commands <small>bridge.cli</small>
<p class='lead'>
Even though Bridge is a web app framework, the primary entry point to the system is through the console. It is an
interactive shell that interacts with the `dart` process _while it's running_.
</p>

```bash
$ dart bridge
```
```bridge
= 
```

Use the `help` command to see all the available commands (or just tap <kbd>⇥</kbd>).

## Adding commands
The CLI is completely modular, and without any [Service Providers](#/docs/core/service-providers), the list of commands
would be useless. By injecting the `Program` class into a provider, we can add commands, like so:

```dart
class CustomCommandServiceProvider implements ServiceProvider {
  load(Program program) {
    program.addCommand(say_hello);
  }
  
  @Command('Say hello to someone')
  @Option(#name, 'The name to say hello to')
  say_hello(String name) {
    print('Hello, $name!');
  }
}
```
```bridge
= say_hello Emil
Hello, Emil!
```

Add a flag by adding a named argument:

```dart
@Command('Say hello to someone')
@Option(#name, 'The name to say hello to')
@Option(#shout, 'Whether to shout the greeting')
say_hello(String name, {bool shout: false}) {
  var message = 'Hello, $name!';
  print(shout ? message.toUpperCase() : message);
}
```
```bridge
= say_hello Rachel
Hello, Rachel!
= say_hello Ross --shout
HELLO, ROSS!
```

The flag can take an argument as well:

```dart
@Command('Say hello to someone')
@Option(#name, 'Optional name to say hello to')
@Option(#shout, 'Whether to shout the greeting')
say_hello({String name: 'buddy', bool shout: false}) {
  var message = 'Hello, $name!';
  print(shout ? message.toUpperCase() : message);
}
```
```bridge
= say_hello --shout
HELLO, BUDDY!
= say_hello --name='Pheobe'
Hello, Pheobe!
```

Using optional arguments is just as easy.

```dart
@Command('Say hello to someone')
@Option(#name, 'Optional name to say hello to')
say_hello([String name = 'buddy']) {
  print('Hello, $name!');
}
```
```bridge
= say_hello
Hello, buddy!
= say_hello Monica
Hello, Monica!
```

Type an argument as `List` to achieve a rest-like syntax

```dart
@Command('Say hello to someone')
@Option(#friends, 'The friends to say hello to')
say_hello(List<String> friends) {
  print('Hello to ${friends.join(', ')}!');
}
```
```bridge
= say_hello Ross Rachel Monica Chandler Phoebe Joey
Hello to Ross, Rachel, Monica, Chandler, Phoebe, Joey!
```

The type for an argument is used to both validate the input, and cast it:

```dart
@Command('Say hello to someone')
@Option(#times, 'The number of times to say hello')
say_hello({int times: 1}) {
  print('hello' * times);
}
```
```bridge
= say_hello --times=3
hellohellohello
```

## Pretty print
To prettify the console, the following methods on the `Program` class are available:

* `printInfo` – blue text
* `printWarning` – yellow text
* `printDanger` – red text
* `printAccomplishment` – green text
