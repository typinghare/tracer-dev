# Tracer

## Structure

### Organization, Servant and Service

~~~bash
<organization>@<servant>

# default
tracer@memo
~~~

## Service Command

The general structure of a service command looks like:

~~~bash
service [...arguments] [options [...arguments]];
~~~

Space characters (' ') separate a command into several parts. The first part of a command must be a `service`, which processed by the using servant. The following are `arguments` the service requires (some services require no argument). We can declare some `options` to alter the default behaviour of service. Some `options` also require specific arguments. The semicolon in the end of command is omissible generally.

The following are some command examples:

~~~bash
memo 'recommended game' 'The Witcher 3'
friend Michael interest 'Playing football'
~~~

### Parameter

There are several types of argument: `int`, `float`, `str`, `bool`, `list`, `object`. `list` and`object` are `struct` Types, while others are `scalar` Types.