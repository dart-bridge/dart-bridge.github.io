# Templating
<p class='lead'>
Now that we know how to return a template response. Let's look into how templating works in Bridge.
</p>

## Expressions
Using Dart expressions in the templates work just like string interpolation. Any script can easily be executed like so:

```bridgehtml
<h1>What is 1 + 1?</h1>
<p>Easy! It's ${1 + 1}</p>
```
```html
<h1>What is 1 + 1?</h1>
<p>Easy! It's 2</p>
```

Everything that has been imported or exported publically in your dart script can be used in template expressions.

```dart
// lib/app/my_class.dart
class MyClass {
  String property = 'value';
}
```
```bridgehtml
<p>${new MyClass().property}</p>
```
```html
<p>value</p>
```

> **Note:** Complex expressions are parsed on the server, so your client entities will not be accessible using this
method

Escape dollar signs with a back-slash:

```bridgehtml
<p>\$WAG</p>
```
```html
<p>$WAG</p>
```

## Passing local variables
Passing locals to the template is super easy:

```dart
return template('index', withData: {
  'key': 'value'
});
```
```bridgehtml
<p>$key</p>
```
```html
<p>value</p>
```

## Logic
Trivial logic can be performed with directives, like so:
```bridgehtml
<p>
  @if (true)
    This content will always be shown
  @else if (false)
    This content will never be shown
  @else
    Neither will this
  @end if
  
  @for (item in someList)
    $item
  @end for
</p>
```

## Includes and extensions
Bridge templates can be mixed and matched together. If you want to include a partial template right into another, use
the `include` directive:
```bridgehtml
// lib/templates/index.html
<header>
  @include ('partials.nav')
</header>
```
```bridgehtml
// lib/templates/partials/nav.html
<nav role='navigation'>
  // ...
</nav>
```
```html
<header>
  <nav role='navigation'>
  </nav>
</header>
```

On the other hand, if you want to surround the template with a master, you can use `extends` and `block`:
```bridgehtml
// lib/templates/app.html
<html>
  <head>
    <title>My website</title>
  </head>
  <body>
    <h1>Welcome to my website!</h1>
    <main>
      @block ('content')
    </main>
  </body>
</html>
```
```bridgehtml
// lib/templates/index.html
@extends ('app')

@block ('content')
  <h2>This is the home page</h2> 
@end block
```
```html
<html>
  <head>
    <title>My website</title>
  </head>
  <body>
    <h1>Welcome to my website!</h1>
    <main>
      <h2>This is the home page</h2>
    </main>
  </body>
</html>
```
Since the `@block` directive is used in multiple contexts – to allow for nested extends – `@block`/`@end block` is
indent sensitive. To create one-liner blocks, you have to use `@start block` instead:
```bridgehtml
@extends ('master')

@start block ('title') My title @end block
```
This behaviour doesn't make any difference in the output. It's only to allow for alternative organization in the
template markup.

## Comments
Besides supporting HTML comments, Bridge templates have normal double-slash syntax for comments, that disappear when
the template is parsed.
```bridgehtml
// Super important!
<p>Paragraph</p>
```
```html
<p>Paragraph</p>
```

## Pre Processors
If a template file has the extension <mark>.html</mark>, it will be parsed as a Bridge template. However, there is
support for a few other formats. All the following will have equal output:

```dart
return template('index', withData: {
  'key': 'value'
});
```

---

```bridgehtml
// lib/templates/index.html
<p>$key</p>
```
```md
# lib/templates/index.md
$key
```
```jade
// lib/templates/index.jade
p= key
```
```hbs
{{-- lib/templates/index.hbs --}}
<p>{{ key }}</p>
```

---

```html
<p>value</p>
```
