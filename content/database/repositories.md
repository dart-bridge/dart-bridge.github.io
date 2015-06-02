# Repositories `WIP`
<p class='lead'>
Handles models in the database, removing framework code from business objects.
<p>

Repositories can be both extended and injected, so in a route, you could have:

```dart
router.get('/', (Repository<Task> repo) {
  return repo.all();
});
```
```json
[
  {
    "id": 1,
    "title": "Go to the store",
    "completed": true
  },
  {
    "id": 2,
    "title": "Work on latest open source project",
    "completed": false
  }
]
```

If you want to provide query scopes, or other functionality to your repository, create
a derivative, which you can then inject in the same way, for example in the router.

```dart
class TaskRepository extends Repository<Task> {
  Selector completed() {
    return this.where('completed', Is.equalTo, true);
  }
}
```

```dart
router.get('/', (TaskRepository repo) async {
  Task completedTask = await repo.completed().first();
  
  return completedTask.title;
});
```

```
Go to the store
```