# Helpers <small>bridge.http</small>
<p class='lead'>
There are a few helpers available for easy navigation in the HTTP context. These are mainly meant to be used in
controllers and [templates](#/docs/view/templates).
</p>

## Redirection
A super simple wrapper around a redirect in `shelf`
```dart
redirect('/');
```

## Safe URL referencing
To always ensure that a URL is correctly formatted:
```dart
url(''); // '/'
url('page'); // '/page'
url('/dashboard/'); // '/dashboard'
```

## Referencing named routes
Use this helper for cleaner navigation by referencing named routes. Wildcards can be specified as an optional second
argument:
```dart
route('home'); // '/'
route('page', {'id': 1}); // '/page/:id' => '/page/1'
```

## Combine for clean redirects
```dart
redirect(route('home'));
```
