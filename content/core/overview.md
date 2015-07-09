# Bridge Core Library <small>bridge.core</small>
<p class='lead'>
Bridge, at its core, really is nothing more than an empty shell. It is extended through what's called 
[Service Providers](#/core/service-providers). Think of them as sockets that is used to connect a library or service to
the rest of the application.
</p>

Look at the figure below. It illustrates the structure of the `bridge.core` library. The three circles surrounded by the
faded blue circle is all there is to it.

![Bridge Services](/images/services-figure.svg)

From the left, we see the operating system (currently only Unix based systems are supported). The black circle is your
environment variables, which are registered in the [Config](#/core/config).

We also see the entry point, `$ dart bridge`. The command will initialize the Bridge CLI. The CLI creates the
[Service Container](#/core/service-container) and injects itself into it. The [Config](#/core/config) is also
registered.

Then the [Service Container](#/core/service-container) will run all registered
[Service Providers](#/core/service-providers). They connect the service or library in question to the rest of the
application, using the [Service Container](#/core/service-container).

The [Service Providers](#/core/service-providers) can [register commands](#/cli/custom-commands) in the CLI; an easy way
to provide a UI for the service.