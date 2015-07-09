# Bridge HTTP Library <small>bridge.http</small>
<p class='lead'>
A full featured HTTP service layer is essential for a web app framework. Bridge provides a simple, yet scalable,
foundation for everything from a public JSON API to a large size web app. Powered by
[Shelf](//pub.dartlang.org/packages/shelf).
</p>

![Bridge Services](/images/http-figure.svg)

The request/response cycle is intuitive and familiar.

1. A request comes in.
2. The request passes through middleware.
3. The Router delegates the request to the correct route, resolving the handler function through the
[Service Container](#/core/service-container).
4. The return value of the handler gets passed through modulators, which transforms whatever object was returned to
either a `shelf.Response`, a primitive value, or a JSON parsable value.
5. The response is cast to a `shelf.Response` (if it isn't already one) and passed back through the middleware.
6. The final response is sent to the client.

Any exception thrown by the Router or the route handler can be handled by registering an Exception Handler, which is
also resolved through the [Container](#/core/service-container).