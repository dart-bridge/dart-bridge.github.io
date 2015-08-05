# Production mode
<p class='lead'>
When running your app on a live server, it should be in production mode. This mode will ensure that output is logged
instead of displayed in a console you don't have access too, as well as deliver JavaScript instead of Dart to the
client.
</p>

## Production environment
Bridge will look for an environment variable `APP_ENV`. This variable can have any value, but only actively
recognizes a few:
* `production` – This is the default value, if no `APP_ENV` variable exists.
* `development`
* `testing`
Any other value will set the environment to `custom`, readable manually through `Config.env`.

The easiest way to make sure that a `production` environment is set is simply to remove the default <mark>.env</mark>
file from the project on the production server. If you're deploying with Git, you're fine, since the <mark>.env</mark>
file should be ignored anyway.

## Boot command
Whatever method you use for deploying your application, somewhere you'll have to specify the shell command that
starts everything up.

As mentioned in the _Boot commands_ section [here](#/docs/cli), we can specify commands that will be instantly run when
the application has initialized.

Additionally, a special `--production` flag should be provided. This flag will tell the Bridge CLI to switch from
it's standard output device – the terminal – to a log file called <mark>cupid.log</mark> in the root of the project.

Here's what the startup command might look like:

```bash
$ dart bridge --production build, start
```

This command will ensure that we're logging output, compiling front end scripts, and starting the server when
it's done.

### Boot command proxy
Some services, like Docker, requires some special convention to be followed, for example that the startup script
for the server is a file called `bin/server.dart`. In these cases, it is advised to create a _proxy_ at that location.

It might look like this:

```dart
// bin/server.dart

import '../bridge' as bridge;

main() {
  bridge.main(['--production', 'build', ',', 'start']);
}
``` 

> **Note:** The comma argument is necessary. Without it Bridge would try to run the `build` command with an argument
> of `start`. Separate each boot command with a comma.