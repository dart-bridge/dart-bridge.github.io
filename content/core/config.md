# Config
<p class='lead'>
Options are most easily defined in one location. The Config component provides a
simple way to provide and manage those options.
</p>

The `config` directory can contain a nested tree structure of `.yaml` files. These
files, and their content, get imported into a single map, which can be accessed
by dot separated keys.

Consider the file `config/module/category.yaml` containing this YAML.

```yaml
list:
  -
    key: value
```

This provides an item called `module.category.list.0.key` with the value `value`.

### Usage
The `Config` contract contains this map, and provides methods to interact with it.

```dart
config('module.category.list.0.key'); // value
config['module']['category']['list'][0]['key']; // value

config('key.that.doesnt.exist', 'defaultValue'); // defaultValue
```

Also, Bridge supports the [.env](//www.google.com/search?q=dotenv) standard, which
can be accessed with the `env` method.

```dart
config.env('APP_ENV', 'defaultValue');
```