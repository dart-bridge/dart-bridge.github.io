# Templates
<p class='lead'>
In Bridge, the philosophy is that *templates* are to *views* what *classes* are to 
*objects*. When we write our templates, they are only our representation of what we
want an instance of a view to look like.
</p>

### Think of it this way:
> When we write classes, we want them to be **descriptive** of whatever **state** our
objects might end up in. The same goes for our templates. We don't want them to look 
like this:

```html
<!DOCTYPE html>
<html>
<head>
  <!-- A bunch of stuff that "just has to be there" -->
  <title>My blog</title>
</head>
<body>
  <div id='app'></div>
</body>
</html>
```

**Why?** Because this is not a semantic representation of what our view will look like.
Even though some of this stuff is what we **have** to send, this is not a representative
**blueprint** of our **states**.

Wouldn't it be nice if we could express our rich front end experiences in a way that is
both readable, semantic, and still doesn't violate any of the conventions of the web 
once the templates has been sent to the client.

## Bridge Templates `WIP`
```btl
<head extends='masters.meta'>

  <title>Homepage</title>
</head>

<body extends='masters.main'>
  <h1>Welcome to my blog!</h1>
  
  // Display a partial
  <import template='partials.breadcrumbs'/>
  
  // List all the comments
  <for each=$comment in=$comments>
    <div>
      <h5>${comment.author.firstName}</h5>
      <p>${comment.body}</p>
    </div>
  </for>
  
  <footer>
    // Escaped $ symbol
    I got \$wag
  </footer>
</body>
```

```dart
router.get('/', () {
  return template('index', withData: {
    'comments': [
      { 'body': 'This is awesome',
        'author': { 'firstName': 'Jane' } },
      { 'body': 'Sure is',
        'author': { 'firstName': 'John' } } ]
  });
});
```

```html
<DOCTYPE html>
<html>
<head>
    ...
    <title>Homepage</title>
</head>
<body>
  <div class='container'>
    <header>My Blog</header>
    <main>
      <h1>Welcome to my blog!</h1>
      
      <ul class='my-breadcrumbs'>
        <li><a href='/'>Home</a></li>
      </ul>
      
      <div>
        <h5>Jane</h5>
        <p>This is awesome</p>
      </div>
      <div>
        <h5>John</h5>
        <p>Sure is</p>
      </div>
      
      <footer>
        I got $wag
      </footer>
    </main>
</body>
</html>
```

> Bridge's templating syntax is **tightly** coupled with the front end in more ways
than one.

> By default, (as seen above) the document is parsed into semantic HTML. However
the template can be **converted** to for example [Handlebars](http://handlebarsjs.com)
so that it can be parsed by the front end script.

```html
<DOCTYPE html>
<html>
<head>
    ...
    <title>Homepage</title>
</head>
<body>
  <div class='container'>
    <header>My Blog</header>
    <main>
      <h1>Welcome to my blog!</h1>
      
      <ul class='my-breadcrumbs'>
        <li><a href='/'>Home</a></li>
      </ul>
      
      {{#comments}}
        <div>
          <h5>{{author.firstName}}</h5>
          <p>{{body}}</p>
        </div>
      {{/comments}}
      
      <footer>
        I got $wag
      </footer>
    </main>
</body>
</html>
```

> And what's even *cooler*, the [Tether](#/tether) will send the data through to the
client, so you can use `template('index', withData: {})` even if you're converting
the template.
