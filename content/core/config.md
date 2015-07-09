# Config <small>bridge.core</small>
<p class='lead'>
The <mark>config</mark> directory is a unified place for all the options associated with the framework. It contains
YAML files, and can also be sorted in subdirectories.
</p>

The only necessary config file, really, is <mark>config/app.yaml</mark>, which should contain a key called
`service_providers`, which should be a list of fully qualified names of the [Service Providers](#/core/service-providers)
to use in the app. For example, it should look something like this:

```yaml
service_providers:
  - bridge.http.HttpServiceProvider
  - bridge.view.ViewServiceProvider
```

## The `Config` class
To access these settings, simply inject the `Config` class. It can then be used to access keys using a dot notation
syntax. The segments of the path represents *subdirectories*, *filenames* and *keys*.

Let's say we have a file <mark>config/my/library/options.yaml</mark> containing:

```yaml
some_key:
  some_sub_key: Some value
```

We can access that _Some value_ with like so:

```dart
String getSomeSubKeyValue(Config config) {
  return config('my.library.options.some_key.some_sub_key');
}
```

We can also access any segment of the tree, so `my.library` would return:

```dart
{
  'options': {
    'some_key': {
      'some_sub_key': 'Some value'
    }
  }
}
```

## Default value
To have a fallback if the specified key does not exist in the <mark>config</mark> directory, simply provide a default
value as the second argument of the call:

```dart
config('some.key.that.does.not.exist', 'Default value');
```

## Environment variables
If you have sensitive variables, or some environment specific options, like database passwords. Or if you simply need to
have some functionality be different for the development machine and the production machine, Unix environment variables
is an easy way to provide special information.

```bash
$ export MY_VAR=value
$ dart bridge
```

Access this value via the `env` method on the `Config` class.

```dart
config.env('MY_VAR', 'default value'); // 'value'
```

### <mark>.env</mark>
An even easier way to mix in environment variables is with a <mark>.env</mark> file in your project root. The syntax is
super simple:

```
MY_VAR=value
```

This file should not be included in version control. Bridge comes with a file called <mark>.env.development</mark>,
which sets the `APP_ENV` variable to `development`. This does a few things. For example, script tags in your
templates will be injected as `application/dart` instead of as JavaScript.

If you install Bridge with the [installer](#/installation), <mark>.env.development</mark> will automatically be copied to
<mark>.env</mark>, so you're up and running instantly.

Without an `APP_ENV` variable, Bridge will default to production mode.