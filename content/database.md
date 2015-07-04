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

The `Repository<Post>` can be injected through Bridge's service container. So for a simple project, a RESTful controller
could look something like this:

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