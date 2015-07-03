# Command Line
<p class='lead'>
Traditionally, web apps have a single entry point – HTTP. With Bridge, though, that is not the case. The application is
started though the command line, and can be interacted with while it's running.
</p>

## The shell
Starting up Bridge is super simple:
```bash
$ dart bridge
```

At this point, the entire application will be bootstrapped, through what's called Service Providers. When that is done,
you'll see the Bridge shell indicator – an equals sign:

```bridge
= 
```

Now we're ready to interact with the running application. To see the available commands, type `help` or simply press
tab. Most of the commands are actually dynamically added by the Service Providers, so if you're missing a command,
that's probably because you haven't registered the Service Provider responsible for the command.

For now, let's focus on seeing something in the browser. That's easy, just type `start` and press <kbd>↵</kbd>.

```bridge
= start
Server started on http://localhost:1337
= 
```

> **Note:** The CLI supports command completion, so it might suffice to type `sta` and tap <kbd>⇥</kbd>.

Go ahead and visit that URL in the browser, and you should see the Bridge logo.

## Reloading
To see changes made to the server side source code, as well as templates, the application must be reloaded. Exiting and
restarting the program with `dart bridge` works, of course. But you can also use the `reload` command. Start the server
back up by once again running `start` (You can use the arrow keys to traverse your command history).

```bridge
= reload
Server stopped
= start
Server started on http://localhost:1337
= 
```

## Exiting
Using <kbd>^C</kbd> to exit interrupts the app completely, making it impossible for the program to react to the fact
that it is being shut down. To gently exit the program, allowing the Service Providers to tear down their service, you
can either use the `exit` command, or the shortcut <kbd>^X</kbd>.
