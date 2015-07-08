# Installation
<p class='lead'>
The recommended way to install Bridge is through the automated installer.
It is available on [pub](//pub.dartlang.org/packages/new_bridge) and can be
globally activated:
</p>

```bash
$ pub global activate new_bridge
```

Then, you can create new applications just by running the following command.

```bash
$ new_bridge my_blog
```

---

## Manual install
Bridge is a modular ecosystem, and therefore it is perfectly possible to construct your own folder structure. To create
your app from scratch, these are the steps you have to take.

```bash
# Create the project directory
$ mkdir my_blog && cd my_blog

# Add Bridge as a dependency
$ cat > pubspec.yaml
```
```yaml
name: my_blog
dependencies:
  bridge: any
```
```bash
$ pub get
```

We need to create the binary file to be responsible for starting up the shell. In the app package, this is the file
<mark>bridge</mark>. You can call it whatever you want.

Inside that file we'll export both our own library, which we will be creating in a minute, and the Bridge command line
initializer.

```dart
export 'package:my_blog/my_blog.dart';
export 'package:bridge/cli_init.dart';
```

> **Note:** If you use the built in initializer, the <mark>config</mark> folder will be used as the root for
configuration files.

To override this, your startup file must look like this instead:

```dart
export 'package:my_blog/my_blog.dart';
import 'package:bridge/cli.dart' show bootstrap;

main(a) => bootstrap(a, configPath: 'my/config/path');
```

Whatever folder you choose, you must create a file called <mark>app.yaml</mark> inside it.

To hook into Bridge, you must create at least one [Service Provider](#/core/service-providers), and register it inside
<mark>app.yaml</mark>.

```yaml
service_providers:
  - my_blog.MyBlogServiceProvider
```

Now, let's create the <mark>lib/my_blog.dart</mark> file we referenced in the start file.

```dart
library my_blog;

import 'package:bridge/core.dart';

class MyBlogServiceProvider implements ServiceProvider {

}
```
