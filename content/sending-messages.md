# Sending Messages
<p class='lead'>
Now, let's look into how to send messages between the server and the client.
</p>

## Tether
Bridge uses WebSockets to set up a messaging service called *Tether*.

### Server side
If we go back to <mark>lib/api/api.dart</mark>, we
can see a method called `tether`, which receives a `Tether` object. Like this:

```dart
tether(Tether tether) {
}
```

Every connected browser session will be allocated a `Tether` instance, which will be sent through this method. We can
both send and receive messages using a key.

```dart
tether(Tether tether) {
  tether.send('message_to_client');
  
  tether.listen('message_from_client', (message) {
    //
  });
}
```

Whatever is returned within the closure (the second argument of the `listen` method), will be sent *back* to the client
through the tether. Likewise, the `send` method will return a `Future` that will complete with the value that the client
returns. So how does the code look in the client code?

### Client side
Let's check out <mark>web/main.dart</mark>. You'll see something like this:

```dart
import 'package:bridge/tether_client.dart';
import 'package:app/client.dart';

main() async {
  await globalTether();
}
```

That first line of the `main` function is important. It's where we shake hands with the server and agrees upon a Tether
connection. From that point, there is a connected `Tether` object available as the global variable `tether`. At any
point throughout the client code, the server can be queried for information, or told that something happened.

### Registering shared data structures
Since the messages sent through the WebSocket is serialized down to JSON, we can't send object instances directly
through. However we can allow for that by making the server and the client agree upon how classes are broken down and
reconstructed.

Check out <mark>lib/shared/shared_structures.dart</mark>. It might look something like this:
```dart
part of app.shared;

void registerSharedStructures(Tether tether) {
}
```

As long as both the server and the client import this file and sends their respective `Tether` instances through this 
global function, we can teach the tethers how to reconstruct data structures on arrival.

The first thing we need to do is implement the (de)serialization.

```dart
class MyClass implements Serializable {
  String property = 'value';
  
  MyClass.deserialize(Map serialized) {
    property = serialized['property'];
  }
  
  Map serialize => {
    'property': property
  };
}
```

Now we can make it transferable by registering it on the tether:

```dart
void registerSharedStructures(Tether tether) {
  tether.registerStructure('MyClass', MyClass, (serialized) => new MyClass.deserialize(serialized));
}
```

## Conversation
Check this out. Let's say we want to get the _user of a specific id_ from the server. Ignoring the logic behind the
user handling, and given that we have registered both a `User` class and a `UserNotFoundException` class on the tethers,
this is how we can set it up:

```dart
// Server side
tether.listen('user.current', (int id) async {
  if (!await userExists(id))
    throw new UserNotFoundException();
    
  return findUserById(id);
}
```
```dart
// Client side
try {
  User user = await tether.send('user.current', userId);
} on UserNotFoundException {
  print('User $userId was not found');
}
```

Isn't that neat?