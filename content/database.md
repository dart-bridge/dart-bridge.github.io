# Database
<p class='lead'>
Often, we'll want to store some things in a database. For simple use cases, Bridge has you covered out of the box. And
if that's not enough, you can use whatever persistence library you like.
</p>

## Models and Repositories
At a glance, this is how Bridge's built in database API works:

```dart
class Post extends Model {
  @field String title;
  @field String body;
  @field int authorId;
}

class PostRepository extends Repository<Post> {
  Future<List<Post>> getPostsFromAuthorId(int authorId) {
    return where('authorId', isEqualTo: authorId).get();
  }
}
```

Models are simply *Plain Old Dart Objects* extending (or mixing in, or implementing) the `Model` class.

They are saved to and retrieved from the database through a `Repository<Model>`, which can be inherited for implementing
extended functionality, like query scopes.

The `Repository<Post>` can be injected through Bridge's [Service Container](#/core/service-container). So for a simple
project, a RESTful controller could look something like this:

```dart
class PostsController {
  Repository<Post> _posts;
  
  PostsController(Repository<Post> this._posts);
  
  index() async {
    return template('pages.index', withData: {
      'pages': await _pages.all()
    });
  }
  
  create() => template('pages.create');
  
  store(Input input) async {
    var post = new Post()
        ..title = input['title']
        ..body = input['body']
        ..authorId = input['author_id'];
    
    await _posts.save(post);
    
    return redirect('pages');
  }
  
  // ...
  
}
```

## Sending models to the client
If we place our models in a shared library – for instance as a part of <mark>lib/shared/library.dart</mark> – we can
import it into our client side script. If we then make it serializable we can send it through the Tether.

```dart
// lib/shared/post.dart

class Post extends Model implements Serializable {
  @field String title;
  @field String body;
  
  factory Post.deserialize(Map serialized) {
    return new Post()
        ..title = serialized['title']
        ..body = serialized['body'];
  }
  
  Map serialize() => {
    'title': title,
    'body': body,
  };
}
```
```dart
// lib/api/api.dart

tether(Tether tether, Repository<Post> posts) {
  tether.listen('posts.all', (_) => posts.all());
}
```
```dart
// web/main.dart

main() async {
  await globalTether();
  
  List<Post> allPosts = await tether.send('posts.all');
}
```