# Models `WIP`
<p class='lead'>
Bridge Models are similar to 
[Active Records](http://en.wikipedia.org/wiki/Active_record_pattern), but the connection
between the models and the database is handled by [Repositories](#/database/repositories).
</p>

---

```dart
class Task extends Model {
  @field String title;
  @field bool completed = false;
}
```

The `Model` class is a data structure, so it doesn't add state to your model. It
provides these properties, however:

```dart
abstract class Model {
  @field var id;
  @field DateTime createdAt;
  @field DateTime updatedAt;
}
```

If you need to inherit your model from a base class, `Model` can be used as a mixin.

```dart
class Task extends BaseTask with Model {
  @field String title;
  @field bool completed = false;
}
```

That means, given you already have a business data structure that looks like
this:

```dart
class Task extends BaseTask {
  String title;
  bool completed = false;
}
```

You can just add the mixin and the `@field` annotation on the properties you want to
persist, and your original structure will remain unchanged, meaning you don't have
to worry about Bridge when you're designing your app.
