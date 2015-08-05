# dart2js
<p class='lead'>
Before deploying your application, you must compile the client side Dart scripts into JavaScript using `dart2js`.
</p>

This is very simple:

```bridge
= build
```

That's it. This command will compile and minify every <mark>.dart</mark> file in the public directory (most likely
<mark>web/</mark>) into <mark>.dart.js</mark> files in the same location.

Your client side scripts should live in the <mark>lib/</mark> directory. The scripts in <mark>web/</mark> should only
contain the `main` function, along with some initialization code, importing you main front end code base within the
<mark>lib/</mark> directory.

> **Note:** As a default, <mark>.dart.js</mark> files will be ignored by Git. Either issue this command on your live
> server, deploy using another method than Git, or simply modify the <mark>.gitignore</mark> file in the root of the
> project.