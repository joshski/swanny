# Swanny

A static site generator that's easy to understand.

Swanny transforms a directory of content files into a static website, and
features a development-time server which automatically reloads your browser
using [livereload.js](https://github.com/livereload/livereload-js).

## Transforming Content

Your repository should contain 3 directories:

```
/content
/extensions
/layouts
```

Every file under your `/content` directory generates a single file in your
static site:

```
/content/hello.js    ...generates...    /public/hello
/content/about.md    ...generates...    /public/about
```

Each content file is sent to a node module under `/extensions` corresponding to
its file extension:

```
/content/hello.js    ...is sent to...    /extensions/js.js
/content/about.md    ...is sent to...    /extensions/md.js
```

Extensions can return either:

* an object describing the static website response:

```js
{
  contentType: 'text/plain',
  body: 'Hello world!'
}
```

* or an arbitrary content object to be rendered by a particular layout:

```js
{
  layout: 'message',
  content: { phrase: 'Hello world!' }
}
```

* or a promise to return either of the above

Finally, if the result returned by the extension has a property called `layout`
then its `content` is sent to a layout module to create the final result.

See the [example](./example) directory for a complete site.

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

Then register swanny as the start script in your `package.json` file:

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

Content files live in your project's `content` directory. The extension of any
file in this directory should correspond to the name of a node module in your
`extensions` directory. This extension will be removed when the static file is
generated.

## Extensions

An extension module transforms a file with that extension into an object,
which can be either:

* Some content and a nominated layout for post-processing:

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
