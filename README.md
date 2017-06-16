# swanny

A static site generator that's easy to understand.

## Generating a site

swanny transforms a directory of files into a directory of static files.

It takes input files (known as [routes](#routes)), runs the content through node modules corresponding to the file [extensions](#extensions), and optionally passes the result through [layouts](#layouts) to generate the final output.

For example:

```
GET http://example.com/some/page
```

...is mapped to:

```
routes/some/page.md
```

...which is rendered with:

```
extensions/md.js
```

..which delegates its layout to:

```
layouts/default.js
```

At development time swanny automatically applies changes to your web pages using
[livereload.js](https://github.com/livereload/livereload-js).

## Installing swanny

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

## Routes

A route is any file under your `/routes` directory. The extension of this
file should correspond to the name of a module under your `./extensions`
directory. The extension will be removed when the static file is generated.

## Extensions

An extension transforms the file at any path under `/routes` into either:

* Some content and a nominated layout name:

```js
module.exports = path => ({
  layout: 'admin',
  content: 'Welcome to the dashboard'
})
 ```

* or a response object with a content type and body:

```js
module.exports = path => ({
  contentType: 'text/css',
  body: '* { color: red }'
})
```

## Layouts

A layout takes the result of calling the extension on the file, and transforms
that into a response object:

```js
module.exports = content => {
  return {
    contentType: 'text/html',
    body: '<html><body>' + content + '</body></html>'
  }
}
```
