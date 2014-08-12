// Copyright 2013, Rod Vagg (the "Original Author")
// All rights reserved.
//
// MIT +no-false-attribs License
//
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation
// files (the "Software"), to deal in the Software without
// restriction, including without limitation the rights to use,
// copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following
// conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// Distributions of all or part of the Software intended to be used
// by the recipients as they would use the unmodified Software,
// containing modifications that substantially alter, remove, or
// disable functionality of the Software, outside of the documented
// configuration mechanisms provided by the Software, shall be
// modified such that the Original Author's bug reporting email
// addresses and urls are either replaced with the contact information
// of the parties responsible for the changes, or removed entirely.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
// OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
// OTHER DEALINGS IN THE SOFTWARE.
//
// Except where noted, this license applies to any and all software
// programs and associated documentation files created by the
// Original Author, when distributed with the Software.

const paramify = require('paramify')

function Router () {
  if (!(this instanceof Router))
    return new Router()

  this._routes = {}
}

Router.prototype.on = function (method, route, handler) {
  var _m = method.toLowerCase()
  if (!this._routes[_m])
    this._routes[_m] = []
  this._routes[_m].push({ route: route, handler: handler })
}

Router.prototype.dispatch = function (req, res, callback) {
  var method = req.method.toLowerCase()
    , url    = (req.url || '').replace(/\?.*$/, '')
    , match  = paramify(url)
    , routes = this._routes[method]
    , i

  if (routes) {
    for(i = 0; i < routes.length; i++) {
      if (match(routes[i].route))
        return routes[i].handler(req, res, match.params)
    }
  }

  callback(new Error('not found'))
}

module.exports = Router