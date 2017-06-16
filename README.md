# swanny

A static site generator that's easy to understand.

# Generating a site

swanny transforms a directory of JavaScript modules into a directory of static
files, by invoking a function exported by each module and saving the result:

    Public URL                      Route                       Generates
    http://foo.com/           =>    /routes/index.html.js   =>  /public/index.html
    http://foo.com/some.js    =>    /routes/some.js.js      =>  /public/some.js
    http://foo.com/ok/then    =>    /routes/ok/then.js      =>  /public/ok/then

At development time swanny automatically reloads changes to your web pages using
[livereload.js](https://github.com/livereload/livereload-js).

## Installing it

In your project directory:

    npm init
    npm i swanny --save

Register swanny as the start script in your `/package.json` file:

```
    "scripts": {
      "start": "swanny"
    }
```

Now `npm start` to start the swanny generator. You can leave it running, it'll
transform your content and refresh the static site when it notices changes to
your routes.

## Defining routes

A route is any JavaScript files under your `/routes/` directory. Each module
should export any one of the following:

  * an object describing the response:

      ```js
      module.exports = {
        contentType: 'text/css',
        body: '* { color: green }'
      }
      ```

  * an primitive type like a string or a number (treated as `text/plain`):

      ```js
      module.exports = 42
      ```

  * a class with a render method returning a response object:

      ```js
      module.exports = class SomeCssFile {
        render () {
          return {
            statusCode: 200,
            contentType: 'text/css',
            body: '* { color: green }'
          }
        }
      }
      ```

  * a class with a render method returning a virtual DOM:

      ```js
      const h = require('hyperdom/html')

      module.exports = class SomeHtmlFile {
        render () {
          return h('html', h('body', 'hello!'))
        }
      }
      ```

  * a function that returns a _subclass_ with a render method:

      ```js
      module.exports = Layout => class SomeHtmlFile extends Layout {
        render () {
          return h('html', h('body', 'hello!'))
        }
      }
      ```
