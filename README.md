# swanny

A static site generator that's easy to understand.

## Developing a site

swanny transforms a directory of files into a directory of static files.

It transforms [content](#content) by running each file through one of your [extensions](#extensions) (depending on the extension in the filename) then optionally passes the result through one of your [layouts](#layouts) to generate the final static output.

At development time swanny automatically applies changes to your web pages using
[livereload.js](https://github.com/livereload/livereload-js).

For example:

```
GET http://example.com/some/page
```

...corresponds to:

```
content/some/page.md
```

...which is rendered with:

```
extensions/md.js
```

..finally generating within a layout defined at:

```
layouts/default.js
```

## Running the swanny server

You could install swanny globally:

    npm i swanny -g

...and then run the server:

    swanny server

...or publish the static files:

    swanny publish

## Adding swanny to your project

Usually you should swanny it to your project:

    npm init
    npm i swanny --save

Then register swanny as the start script in your `/package.json` file:

```json
  "scripts": {
    "start": "swanny server",
    "publish": "swanny publish"
  }
```

Now `npm start` will start the swanny server. You can leave it running, it'll
transform your content and refresh the static site when it notices changes to
your contents.

When you are ready to deploy then `npm run publish` will create a `public`
directory with your static files

## Content

Content files live in your project's `/content` directory. The extension of any
file in this directory should correspond to the name of a node module in your
`./extensions` directory. This extension will be removed when the static file is
generated.

## Extensions

An extension transforms the file at any path under `/contents` into either:

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
