# Blog

This project builds up a blog website with

* the front-end [`client`](./client) is a `React` app
* and the back-end is a set of `microservices` which are `Express.js` based `Node.js` apps providing APIs for creating and retrieving posts and comments. The backend includes three `microservices`

  * [`posts`](./posts) - providing APIs to create new posts
  * [`comments`](./comments) - providing APIs to create new comments
  * [`moderation`](./moderation) - providing APIs to moderate comments (approve or reject comments)
  * [`query`](./query) - providing APIs to retrieve all posts and their associated comments

  and an [`event-bus`](./event-bus) to receive events from each of the above `microservices` and forward these events to all of these `microservices`.

## Source Code

Switch the source code to the version described below to view its implementation.

| Git Tag | Git Diff | Implementation |
|---------|----------|----------------|
| [v13.0.0](https://github.com/TranXuanHoang/NodeJS/releases/tag/v13.0.0) | [diff](https://github.com/TranXuanHoang/NodeJS/compare/v12.0.0...v13.0.0) | Build a `posts and comments` app with a `microservices` architecture |
